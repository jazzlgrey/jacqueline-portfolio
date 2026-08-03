// ============================================================
// ATLAS — main interactive painting interface
// ------------------------------------------------------------
// This is the Week 1 deliverable from the project proposal:
// a high-resolution, pannable/zoomable rendering of the painting
// "ua862," with clickable hotspots that will eventually open the
// project's three portals (Plane Wing, Campanile, Piano).
//
// Controls:
//   - Scroll / trackpad → normal page scroll (this sketch doesn't
//     intercept it — the painting is full height, so scrolling the
//     page is how you see the rest of it)
//   - Press "0"          → reset the view
//   (Drag-to-pan and scroll-wheel zoom are intentionally disabled —
//   the painting is the page background, sized to its own aspect
//   ratio, and shouldn't be draggable or scale away from that. See
//   minZoom/maxZoom below.)
//
// HOW TO EXTEND THIS FILE LATER
// ------------------------------------------------------------
// 1. Hotspots — add/edit entries in the `hotspots` array below.
//    Coordinates are normalized (0–1) against the painting's own
//    width/height, so they stay correctly placed at any zoom
//    level or screen size. Set `active: true` once a portal page
//    exists for that symbol, and point `href` at it.
//
// 2. Ripple / light / sound effects — `drawEffects()` runs once
//    per frame, right after the painting and hotspots are drawn.
//    It's currently empty; this is the hook point described in
//    the proposal for particles, glow, or audio-reactive visuals.
//
// 3. Portal navigation — `onHotspotClick(spot)` is where clicking
//    an active hotspot should actually open its portal, e.g.
//    `window.location.href = spot.href;` (left commented out
//    until those pages exist).
// ============================================================

let painting;
let baseScale = 1;

// Dim scrim over the painting — dark grey-blue at low opacity, so the
// nav/info card and hotspots read clearly on top of it. Alpha is
// 0–255 (p5's default color mode), not 0–1.
let dimColor = [20, 24, 38];
let dimAlpha = 50; // ~20% opacity — raise/lower to taste

// Zoom is locked to 1 and offset stays at 0 — the painting is
// static, centered, and fills its container at its own aspect
// ratio. These are kept (rather than ripped out) so
// paintingToScreen()/screenToPainting() below don't need rewriting.
let zoom = 1;
let minZoom = 1;
let maxZoom = 1;
let offsetX = 0;
let offsetY = 0;

// How far a hotspot's gentle drift wobble can carry it from its
// base (x, y), in pixels on each axis.
let hotspotDriftRadius = 5;

// Symbols in the painting that will become portals.
// `active: false` keeps a symbol visible but un-clickable —
// "mysterious rather than unfinished," per the proposal.
//
// NOTE ON `href`: these are resolved relative to the PAGE that loads
// this sketch (projects/atlas.html), not relative to this file. So a
// sibling page inside projects/ is just "atlas-fr/index.html".
let hotspots = [
  { label: "Plane Wing", x: 0.41, y: 0.89, active: false, href: "atlas-plane-wing.html" },
  { label: "Falaise",    x: 0.86, y: 0.79, active: true,  href: "atlas-fr/index.html" },
  { label: "Piano",      x: 0.53, y: 0.26, active: false, href: "atlas-piano.html" },
];

function preload() {
  painting = loadImage(
    "../assets/images/ua862.jpeg",
    () => console.log("Atlas painting loaded"),
    () => console.error("Atlas painting failed to load. Check path: ../assets/images/ua862.jpeg")
  );
}

function setup() {
  const container = document.getElementById("atlas-container");
  const canvas = createCanvas(container.clientWidth, container.clientHeight);
  canvas.parent("atlas-container");

  imageMode(CENTER);
  fitPaintingToCanvas();
}

function windowResized() {
  const container = document.getElementById("atlas-container");
  resizeCanvas(container.clientWidth, container.clientHeight);
  fitPaintingToCanvas();
}

// Sets zoom/pan so the painting starts filling the entire frame
// ("cover" fit, like CSS object-fit: cover) — immersive, edge to
// edge, cropped on whichever axis doesn't match the frame's own
// aspect ratio. Scroll to zoom further in, drag to pan, press "0"
// to snap back to this cover-fit view.
function fitPaintingToCanvas() {
  baseScale = max(width / painting.width, height / painting.height);
  zoom = 1;
  offsetX = 0;
  offsetY = 0;
}

function draw() {
  background(20);

  push();
  translate(width / 2 + offsetX, height / 2 + offsetY);
  scale(baseScale * zoom);
  image(painting, 0, 0);
  pop();

  drawDimOverlay();
  drawHotspots();
  drawEffects();
}

// Flat scrim over the whole canvas — drawn in plain screen space
// (outside the image's own push/pop transform above) so it always
// covers exactly what's visible, at a constant opacity, regardless
// of the painting's zoom or pan.
function drawDimOverlay() {
  noStroke();
  fill(dimColor[0], dimColor[1], dimColor[2], dimAlpha);
  rect(0, 0, width, height);
}

// Converts a hotspot's normalized painting coordinates into
// current on-screen canvas coordinates, accounting for the
// active pan + zoom.
function paintingToScreen(nx, ny) {
  let px = (nx - 0.5) * painting.width;
  let py = (ny - 0.5) * painting.height;
  return {
    x: width / 2 + offsetX + px * baseScale * zoom,
    y: height / 2 + offsetY + py * baseScale * zoom,
  };
}

// Slow, organic wobble for one hotspot, using Perlin noise. `i * 137`
// (an arbitrary offset) puts each hotspot in its own patch of the
// noise field so they drift independently instead of in lockstep;
// `frameCount * 0.005` is the speed — smaller is slower/lazier.
// noise() returns ~0–1, so subtracting 0.5 and doubling maps it to
// roughly -hotspotDriftRadius..+hotspotDriftRadius on each axis.
function hotspotDrift(i) {
  let t = frameCount * 0.005;
  let dx = (noise(i * 137, t) - 0.5) * 2 * hotspotDriftRadius;
  let dy = (noise(i * 137 + 999, t) - 0.5) * 2 * hotspotDriftRadius;
  return { dx, dy };
}

// A hotspot's current on-screen position, base position plus its
// drift wobble. Use this everywhere a hotspot gets drawn or hit-
// tested, so the visible dot and its clickable area always agree.
function getHotspotScreenPos(spot, i) {
  let pos = paintingToScreen(spot.x, spot.y);
  let drift = hotspotDrift(i);
  return { x: pos.x + drift.dx, y: pos.y + drift.dy };
}

// The inverse of paintingToScreen(): converts a click's on-screen
// position back into a normalized (0-1) painting coordinate. This is
// a debug helper — use it to find x/y values for new hotspots instead
// of estimating them by eye.
function screenToPainting(sx, sy) {
  let px = (sx - width / 2 - offsetX) / (baseScale * zoom);
  let py = (sy - height / 2 - offsetY) / (baseScale * zoom);
  return {
    x: px / painting.width + 0.5,
    y: py / painting.height + 0.5,
  };
}

function drawHotspots() {
  let hoveringAny = false;

  for (let i = 0; i < hotspots.length; i++) {
    let spot = hotspots[i];
    let pos = getHotspotScreenPos(spot, i);
    let hovered = isInsideCanvas() && dist(mouseX, mouseY, pos.x, pos.y) < 30;
    if (hovered) hoveringAny = true;

    // Appearance is driven ONLY by hover — `active` decides whether a
    // click opens the portal, but it never changes how a hotspot
    // looks. At rest every symbol reads the same dim white, so the
    // painting doesn't advertise which portals are built yet; the
    // lime-yellow is a response to the cursor, not a status badge.
    noStroke();
    if (hovered) {
      fill(224, 255, 23, 210); // lime yellow — lit by the cursor
    } else {
      fill(255, 255, 255, 90); // dim marker at rest
    }
    circle(pos.x, pos.y, hovered ? 38 : 30);
  }

  // Pointer cursor whenever hovering a node (active or not) invites the
  // "activating a portal" feel; default arrow otherwise, since the
  // painting itself is no longer draggable.
  cursor(hoveringAny ? HAND : ARROW);
}

// FUTURE HOOK: ripple / light / sound-reactive effects.
// Called once per frame, after the painting + hotspots are drawn.
function drawEffects() {
  // e.g. a ripple emitted from the last click, a slow-moving
  // light sweep, or particles driven by Tone.js audio analysis.
}

function isInsideCanvas() {
  return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

function mousePressed() {
  if (!isInsideCanvas()) return;

  // DEBUG: prints the exact normalized coordinate for wherever you
  // just clicked — open the browser console (right-click → Inspect
  // → Console) and click any detail in the painting to read it off.
  let coord = screenToPainting(mouseX, mouseY);
  console.log(`x: ${coord.x.toFixed(2)}, y: ${coord.y.toFixed(2)}`);

  for (let i = 0; i < hotspots.length; i++) {
    let spot = hotspots[i];
    if (!spot.active) continue;
    let pos = getHotspotScreenPos(spot, i);
    if (dist(mouseX, mouseY, pos.x, pos.y) < 30) {
      onHotspotClick(spot);
      return;
    }
  }

  // No drag-to-pan anymore — clicking off a hotspot does nothing, so
  // the mouse/trackpad is free to scroll the page instead.
}

// No mouseWheel() handler here on purpose: p5 leaves wheel events
// alone unless a sketch defines this function, so scrolling/trackpad
// gestures over the canvas fall straight through to normal page
// scroll.

function onHotspotClick(spot) {
  // Only `active: true` hotspots ever reach this function (mousePressed
  // skips the rest), so anything arriving here has a portal to open.
  if (spot.href) {
    window.location.href = spot.href;
    return;
  }
  console.log("Hotspot clicked:", spot.label, "— no href set");
}

function keyPressed() {
  if (key === "0") {
    fitPaintingToCanvas();
  }
}
