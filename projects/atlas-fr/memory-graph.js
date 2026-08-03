// ============================================================
// ATLAS-FR — cluster graph view
// ------------------------------------------------------------
// An Obsidian-style graph view with NO edges. Position carries all
// the meaning: every node drifts toward the centre of gravity of
// its first tag, and pushes away from its neighbours, so the tags
// separate themselves into visible colour-coded islands.
//
// It reads two globals from fr-memories.js, which must be loaded
// BEFORE this file:
//     window.FR_TAGS
//     window.FR_MEMORIES
//
// CONTROLS
//   hover node    → label + halo
//   click node    → lightbox (see PUBLIC API below)
//   drag node     → pull it out; release and it springs home
//   drag canvas   → pan
//   scroll        → zoom toward cursor
//   press 0       → reset camera
//   press space   → re-seed the layout (shuffles the islands)
//
// PUBLIC API — the page (index.html) talks to the sketch through
// window.MemoryGraph, and the sketch talks back through two hooks:
//
//   window.MemoryGraph.focusTag(tagId | null)
//       Dim every cluster except this one. Used by legend hover.
//   window.MemoryGraph.toggleTag(tagId)
//       Show/hide a cluster entirely. Used by legend click.
//   window.MemoryGraph.isTagVisible(tagId) → bool
//   window.MemoryGraph.reseed()
//   window.MemoryGraph.resetCamera()
//
//   window.onMemorySelect(memory)   ← YOU define this in index.html.
//       Called with the full memory object when a node is clicked.
//       That's the lightbox hook; the sketch does not touch the DOM.
//
// ARCHITECTURE (four small sections, in file order)
//   1. CONFIG        — every tunable number, nothing hidden below
//   2. STATE         — nodes, clusters, camera, interaction
//   3. BUILD         — turn data into nodes + cluster centres
//   4. PHYSICS/DRAW  — the per-frame loop
// ============================================================


// ============================================================
// 1. CONFIG — tune the whole look and feel from here
// ============================================================

const GRAPH = {
  // --- canvas ---
  bg: '#0B0B0D',              // graph background
  containerId: 'graph-stage', // the div the canvas is mounted into

  // --- cluster layout ---
  // Cluster centres are placed on a ring. Radius is a fraction of
  // the smaller canvas dimension, so it scales with the viewport.
  clusterRingRadius: 0.34,
  // Bigger clusters get pushed slightly further out so the small
  // ones don't get crowded off the canvas. 0 disables this.
  clusterSizeSpread: 0.02,

  // --- forces (all per-frame, applied to velocity) ---
  pullToCluster: 0.012,   // spring strength toward home cluster
  nodeRepulsion: 260,     // how hard nodes shove each other apart
  repulsionRange: 70,     // px within which repulsion applies
  damping: 0.86,          // velocity decay — lower = calmer
  jitter: 0.05,           // tiny random motion so it never fully dies

  // --- nodes ---
  nodeRadius: 9,          // base radius
  nodeRadiusHover: 14,
  labelFont: '"Atkinson Hyperlegible Mono", monospace',
  labelSize: 11,

  // --- opacity states ---
  alphaNormal: 235,
  alphaDimmed: 45,        // when another cluster is focused

  // --- cluster titles ---
  showClusterLabels: true,
  clusterLabelSize: 15,

  // --- camera ---
  zoomMin: 0.4,
  zoomMax: 3.0,
  zoomStep: 0.0012,

  // --- fallback colour for a tag missing from FR_TAGS ---
  fallbackColor: '#8A8A93'
};


// ============================================================
// 2. STATE
// ============================================================

let nodes = [];             // one per memory
let clusters = [];          // one per tag actually in use
let clustersById = {};      // tagId → cluster, for O(1) lookup

let hoveredNode = null;
let draggedNode = null;
let focusedTag = null;      // tagId currently spotlighted, or null
const hiddenTags = new Set(); // tagIds toggled off in the legend

// Camera. World coords → screen coords is:
//   screen = (world + camera.offset) * camera.zoom
const camera = { x: 0, y: 0, zoom: 1 };
let isPanning = false;
let panStart = { x: 0, y: 0, camX: 0, camY: 0 };
let pressStart = { x: 0, y: 0 }; // to tell a click apart from a drag

// Thumbnails, loaded lazily and tolerant of missing files.
const thumbs = {}; // memoryId → p5.Image


// ============================================================
// 3. BUILD
// ============================================================

// True only if fr-memories.js parsed and defined both globals. A
// single stray comma in that file stops the browser from running
// ANY of it, so the globals silently vanish — which used to show up
// as an empty black screen. Now the sketch stops cleanly and the
// page prints a visible banner instead.
let dataOK = false;

function setup() {
  const holder = document.getElementById(GRAPH.containerId);
  const c = createCanvas(holder.offsetWidth, holder.offsetHeight);
  c.parent(GRAPH.containerId);
  textFont(GRAPH.labelFont);

  dataOK = Array.isArray(window.FR_TAGS) && Array.isArray(window.FR_MEMORIES);
  if (!dataOK) {
    console.error(
      '[atlas-fr] fr-memories.js did not load. It almost always means a ' +
      'syntax error in that file — open the browser console and look for ' +
      'the red "SyntaxError" line, which names the line number.'
    );
    noLoop(); // stop draw() rather than throw once per frame
    return;
  }

  buildClusters();
  buildNodes();
  loadThumbs();
}

function windowResized() {
  if (!dataOK) return;
  const holder = document.getElementById(GRAPH.containerId);
  resizeCanvas(holder.offsetWidth, holder.offsetHeight);
  layoutClusters(); // re-place cluster centres for the new size
}

// --- tag helpers ----------------------------------------------
// Data written by hand always drifts, so read `tags` defensively:
// a bare string becomes a one-item array, and a missing/empty list
// gets parked in an 'untagged' cluster instead of crashing the
// sketch. Anything odd is reported once, in the console.
function tagsOf(memory) {
  const t = memory.tags;
  if (Array.isArray(t) && t.length) return t;
  if (typeof t === 'string' && t) {
    console.warn(
      '[atlas-fr]', memory.id, 'has tags as a string — wrap it in [ ]:', t
    );
    return [t];
  }
  console.warn('[atlas-fr]', memory.id, 'has no tags — filed under "untagged".');
  return ['untagged'];
}

// The first tag is the cluster a node physically sits in.
function homeTagOf(memory) {
  return tagsOf(memory)[0];
}

// An item may use `image` (one) or `images` (several). Both count
// as "has a picture", which is what the ring vs solid node styling
// is telling you. The node ring never reveals how many.
function firstImageOf(memory) {
  if (Array.isArray(memory.images) && memory.images.length) {
    return memory.images[0];
  }
  return memory.image || null;
}

// --- clusters -------------------------------------------------
// Only tags that are actually used by at least one memory become
// clusters, so an unused tag in FR_TAGS costs nothing. A tag used
// here but missing from FR_TAGS still gets a cluster — it just
// draws in the neutral fallback colour and won't appear in the
// legend, which is the visible symptom of a typo.
function buildClusters() {
  const known = window.FR_TAGS.map(t => t.id);
  const counts = {};

  window.FR_MEMORIES.forEach(m => {
    tagsOf(m).forEach(tag => {
      if (known.indexOf(tag) === -1 && tag !== 'untagged') {
        console.warn(
          '[atlas-fr]', m.id, 'uses tag "' + tag + '", which is not in FR_TAGS.'
        );
      }
    });
    const home = homeTagOf(m);
    counts[home] = (counts[home] || 0) + 1;
  });

  clusters = Object.keys(counts).map(tagId => {
    const meta = window.FR_TAGS.find(t => t.id === tagId);
    return {
      id: tagId,
      label: meta ? meta.label : tagId,
      color: meta ? meta.color : GRAPH.fallbackColor,
      blurb: meta ? meta.blurb : '',
      count: counts[tagId],
      x: 0,
      y: 0
    };
  });

  clustersById = {};
  clusters.forEach(c => (clustersById[c.id] = c));
  layoutClusters();
}

// Cluster centres sit evenly around a ring, in world coordinates
// centred on (0, 0). World origin maps to canvas centre at zoom 1.
function layoutClusters() {
  const base = min(width, height);
  const maxCount = Math.max(...clusters.map(c => c.count), 1);

  clusters.forEach((c, i) => {
    const angle = (TWO_PI * i) / clusters.length - HALF_PI;
    const r =
      base * GRAPH.clusterRingRadius +
      base * GRAPH.clusterSizeSpread * (c.count / maxCount);
    c.x = cos(angle) * r;
    c.y = sin(angle) * r;
  });
}

// --- nodes ----------------------------------------------------
function buildNodes() {
  nodes = window.FR_MEMORIES.map(m => {
    const home = clustersById[homeTagOf(m)];
    return {
      data: m,                 // the full memory object, untouched
      tags: tagsOf(m),         // normalised copy, safe to index into
      home: home,              // cluster it belongs to
      // start scattered near home so the sim has something to relax
      x: home.x + random(-40, 40),
      y: home.y + random(-40, 40),
      vx: 0,
      vy: 0,
      r: GRAPH.nodeRadius,     // animated toward hover size
      color: home.color
    };
  });
}

// Shuffle start positions — handy when a layout settles awkwardly.
function reseedLayout() {
  nodes.forEach(n => {
    n.x = n.home.x + random(-60, 60);
    n.y = n.home.y + random(-60, 60);
    n.vx = 0;
    n.vy = 0;
  });
}

// Thumbnails are optional. A missing file logs a warning and the
// node simply draws without an image — the graph never breaks.
function loadThumbs() {
  window.FR_MEMORIES.forEach(m => {
    const src = firstImageOf(m); // carousels preload their cover only
    if (!src) return;
    loadImage(
      src,
      img => (thumbs[m.id] = img),
      () => console.warn('[atlas-fr] image not found:', src)
    );
  });
}


// ============================================================
// 4. PHYSICS + DRAW
// ============================================================

function draw() {
  background(GRAPH.bg);
  if (!dataOK) return;

  stepPhysics();

  push();
  // Camera: canvas centre is world origin.
  translate(width / 2, height / 2);
  scale(camera.zoom);
  translate(camera.x, camera.y);

  if (GRAPH.showClusterLabels) drawClusterLabels();
  drawNodes();

  pop();

  drawHoverLabel(); // drawn in screen space so it never scales
}

// --- forces ---------------------------------------------------
function stepPhysics() {
  const visible = nodes.filter(n => !hiddenTags.has(n.home.id));

  // Pairwise repulsion. O(n²) — fine up to a few hundred nodes.
  // If the archive grows past ~500 items, swap this loop for a
  // spatial grid; nothing else needs to change.
  for (let i = 0; i < visible.length; i++) {
    for (let j = i + 1; j < visible.length; j++) {
      const a = visible[i];
      const b = visible[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      if (d > GRAPH.repulsionRange) continue;

      const force = GRAPH.nodeRepulsion / (d * d);
      dx /= d;
      dy /= d;
      a.vx -= dx * force;
      a.vy -= dy * force;
      b.vx += dx * force;
      b.vy += dy * force;
    }
  }

  // Spring toward home cluster + integrate.
  visible.forEach(n => {
    if (n === draggedNode) return; // dragged node follows the mouse

    n.vx += (n.home.x - n.x) * GRAPH.pullToCluster;
    n.vy += (n.home.y - n.y) * GRAPH.pullToCluster;

    n.vx += random(-GRAPH.jitter, GRAPH.jitter);
    n.vy += random(-GRAPH.jitter, GRAPH.jitter);

    n.vx *= GRAPH.damping;
    n.vy *= GRAPH.damping;

    n.x += n.vx;
    n.y += n.vy;
  });

  // Hover radius easing, done here so it's frame-rate independent
  // enough for this scale.
  nodes.forEach(n => {
    const target = n === hoveredNode ? GRAPH.nodeRadiusHover : GRAPH.nodeRadius;
    n.r += (target - n.r) * 0.2;
  });
}

// --- rendering ------------------------------------------------
function drawClusterLabels() {
  clusters.forEach(c => {
    if (hiddenTags.has(c.id)) return;
    const dim = focusedTag && focusedTag !== c.id;

    noStroke();
    fill(red(color(c.color)), green(color(c.color)), blue(color(c.color)), dim ? 40 : 120);
    textAlign(CENTER, CENTER);
    textSize(GRAPH.clusterLabelSize / camera.zoom);
    // Label sits above the cluster's centre of gravity.
    text(c.label.toUpperCase(), c.x, c.y - 78);
  });
}

function drawNodes() {
  nodes.forEach(n => {
    if (hiddenTags.has(n.home.id)) return;

    // A node stays bright if ANY of its tags is the focused one —
    // this is where secondary tags earn their keep.
    const lit = !focusedTag || n.tags.indexOf(focusedTag) !== -1;
    const alpha = lit ? GRAPH.alphaNormal : GRAPH.alphaDimmed;
    const col = color(n.color);
    col.setAlpha(alpha);

    // Halo on hover.
    if (n === hoveredNode) {
      const halo = color(n.color);
      halo.setAlpha(45);
      noStroke();
      fill(halo);
      circle(n.x, n.y, n.r * 4);
    }

    drawNodeShape(n, col, alpha);
  });
}

// Shape encodes MEDIUM (type); colour encodes TAG.
// Add a case here if you add a new `type` in fr-memories.js.
function drawNodeShape(n, col, alpha) {
  const r = n.r;
  const hasImage = !!firstImageOf(n.data);

  if (hasImage) {
    // Ring: something visual lives behind this node.
    noFill();
    stroke(col);
    strokeWeight(2.2);
  } else {
    noStroke();
    fill(col);
  }

  switch (n.data.type) {
    case 'sketch': // triangle
      triangle(n.x, n.y - r, n.x - r, n.y + r * 0.8, n.x + r, n.y + r * 0.8);
      break;

    case 'message': // square
      rectMode(CENTER);
      square(n.x, n.y, r * 1.7);
      break;

    case 'interview': // diamond
      quad(n.x, n.y - r, n.x + r, n.y, n.x, n.y + r, n.x - r, n.y);
      break;

    case 'photo': { // circle with an inner dot
      circle(n.x, n.y, r * 2);
      noStroke();
      const inner = color(n.color);
      inner.setAlpha(alpha);
      fill(inner);
      circle(n.x, n.y, r * 0.6);
      break;
    }

    case 'text':   // journal entries and musings share the circle
    case 'musing':
    default:       // an unrecognised type still draws — as a circle
      circle(n.x, n.y, r * 2);
      break;
  }
}

// Hover label in SCREEN space — constant size at any zoom.
function drawHoverLabel() {
  if (!hoveredNode) return;
  const s = worldToScreen(hoveredNode.x, hoveredNode.y);
  const label = hoveredNode.data.title;

  textSize(GRAPH.labelSize);
  textAlign(LEFT, CENTER);
  const padX = 8;
  const w = textWidth(label) + padX * 2;
  const boxY = s.y - hoveredNode.r * camera.zoom - 26;

  noStroke();
  fill(11, 11, 13, 230);
  rectMode(CORNER);
  rect(s.x - w / 2, boxY, w, 20, 3);

  fill(hoveredNode.color);
  text(label, s.x - w / 2 + padX, boxY + 10);
}


// ============================================================
// 5. INTERACTION
// ============================================================

function screenToWorld(sx, sy) {
  return {
    x: (sx - width / 2) / camera.zoom - camera.x,
    y: (sy - height / 2) / camera.zoom - camera.y
  };
}

function worldToScreen(wx, wy) {
  return {
    x: (wx + camera.x) * camera.zoom + width / 2,
    y: (wy + camera.y) * camera.zoom + height / 2
  };
}

// --- who owns the mouse? --------------------------------------
// p5 registers its mouse and wheel listeners on WINDOW, not on the
// canvas. The canvas covers the whole viewport, so every scroll and
// click anywhere on the page — including inside the lightbox that
// sits on top of it — reaches this sketch too. Since mouseWheel()
// returns false to stop the page scrolling behind the graph, an
// open lightbox would find its own scrolling cancelled.
//
// So: before reacting to any pointer input, check whether the event
// actually landed on an overlay. If it did, the sketch keeps its
// hands off and lets the browser do the normal thing.
const OVERLAY_SELECTOR =
  '#fr-lightbox, .fr-info-card, .fr-legend, .fr-error, .fr-overlay-header';

function eventIsOnOverlay(e) {
  const t = e && e.target;
  return !!(t && t.closest && t.closest(OVERLAY_SELECTOR));
}

// Fallback for handlers p5 doesn't hand an event to: if the
// lightbox is open at all, the graph is not what's being pointed at.
function lightboxIsOpen() {
  const el = document.getElementById('fr-lightbox');
  return !!el && !el.hidden;
}

// Topmost node under the cursor, or null.
function nodeUnderMouse() {
  const w = screenToWorld(mouseX, mouseY);
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    if (hiddenTags.has(n.home.id)) continue;
    if (dist(w.x, w.y, n.x, n.y) <= n.r + 4) return n;
  }
  return null;
}

function mouseMoved(e) {
  if (lightboxIsOpen() || eventIsOnOverlay(e)) {
    hoveredNode = null;
    return;
  }
  hoveredNode = nodeUnderMouse();
  cursor(hoveredNode ? HAND : ARROW);
}

function mousePressed(e) {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  if (lightboxIsOpen() || eventIsOnOverlay(e)) return;
  pressStart = { x: mouseX, y: mouseY };

  const hit = nodeUnderMouse();
  if (hit) {
    draggedNode = hit;
  } else {
    isPanning = true;
    panStart = { x: mouseX, y: mouseY, camX: camera.x, camY: camera.y };
  }
}

function mouseDragged() {
  if (draggedNode) {
    const w = screenToWorld(mouseX, mouseY);
    draggedNode.x = w.x;
    draggedNode.y = w.y;
    draggedNode.vx = 0;
    draggedNode.vy = 0;
  } else if (isPanning) {
    camera.x = panStart.camX + (mouseX - panStart.x) / camera.zoom;
    camera.y = panStart.camY + (mouseY - panStart.y) / camera.zoom;
  }
}

function mouseReleased() {
  // A press that barely moved is a click, not a drag → open it.
  const moved = dist(pressStart.x, pressStart.y, mouseX, mouseY);
  if (draggedNode && moved < 4) {
    if (typeof window.onMemorySelect === 'function') {
      window.onMemorySelect(draggedNode.data);
    }
  }
  draggedNode = null;
  isPanning = false;
}

// Zoom toward the cursor, so the point under the mouse stays put.
function mouseWheel(e) {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

  // THE IMPORTANT GUARD: returning nothing here lets the wheel event
  // through untouched, so the lightbox (and any other overlay) can
  // scroll normally. Without it, the `return false` at the bottom of
  // this function cancels the scroll everywhere on the page.
  if (lightboxIsOpen() || eventIsOnOverlay(e)) return;

  const before = screenToWorld(mouseX, mouseY);
  camera.zoom = constrain(
    camera.zoom * (1 - e.delta * GRAPH.zoomStep),
    GRAPH.zoomMin,
    GRAPH.zoomMax
  );
  const after = screenToWorld(mouseX, mouseY);
  camera.x += after.x - before.x;
  camera.y += after.y - before.y;
  return false; // stop the page scrolling under the graph
}

function keyPressed() {
  // Same reasoning as the mouse guards: while the lightbox is open,
  // space and 0 belong to the reader, not the graph.
  if (lightboxIsOpen()) return;
  if (key === '0') resetCamera();
  if (key === ' ') reseedLayout();
}

function resetCamera() {
  camera.x = 0;
  camera.y = 0;
  camera.zoom = 1;
}


// ============================================================
// 6. PUBLIC API — what index.html is allowed to call
// ============================================================

window.MemoryGraph = {
  focusTag(tagId) {
    focusedTag = tagId || null;
  },

  toggleTag(tagId) {
    if (hiddenTags.has(tagId)) hiddenTags.delete(tagId);
    else hiddenTags.add(tagId);
    return !hiddenTags.has(tagId);
  },

  isTagVisible(tagId) {
    return !hiddenTags.has(tagId);
  },

  reseed: () => reseedLayout(),
  resetCamera: () => resetCamera()
};
