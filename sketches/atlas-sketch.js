// ============================================================
// ATLAS — main interactive painting interface
// ------------------------------------------------------------
// This is the Week 1 deliverable from the project proposal:
// a high-resolution, pannable/zoomable rendering of the painting
// "ua862," with clickable hotspots that will eventually open the
// project's three portals (Plane Wing, Campanile, Piano).
//
// Controls:
//   - Click + drag  → pan
//   - Scroll wheel   → zoom in/out
//   - Press "0"      → reset to the fitted view
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

// Pan + zoom state
let zoom = 1;
let minZoom = 1;
let maxZoom = 6;
let offsetX = 0;
let offsetY = 0;

let isDragging = false;
let dragStartX, dragStartY;
let dragOffsetStartX, dragOffsetStartY;

// Symbols in the painting that will become portals.
// `active: false` keeps a symbol visible but un-clickable —
// "mysterious rather than unfinished," per the proposal.
let hotspots = [
  { label: "Plane Wing", x: 0.30, y: 0.62, active: false, href: "atlas-plane-wing.html" },
  { label: "Campanile",  x: 0.55, y: 0.35, active: false, href: "atlas-campanile.html" },
  { label: "Piano",      x: 0.54, y: 0.26, active: false, href: "atlas-piano.html" },
];

function preload() {
  painting = loadImage(
    "../assets/images/ua862_atlas_bg.png",
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

// Sets zoom/pan so the painting starts fully visible ("fit to
// frame"), regardless of the container's actual pixel size.
function fitPaintingToCanvas() {
  baseScale = min(width / painting.width, height / painting.height);
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

  drawHotspots();
  drawEffects();
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
  for (let spot of hotspots) {
    let pos = paintingToScreen(spot.x, spot.y);

    noStroke();
    if (spot.active) {
      fill(224, 255, 23, 220); // lime yellow — live portal
    } else {
      fill(255, 255, 255, 90); // dim marker — visible but inactive
    }
    circle(pos.x, pos.y, 14);
  }
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

  for (let spot of hotspots) {
    if (!spot.active) continue;
    let pos = paintingToScreen(spot.x, spot.y);
    if (dist(mouseX, mouseY, pos.x, pos.y) < 14) {
      onHotspotClick(spot);
      return;
    }
  }

  isDragging = true;
  dragStartX = mouseX;
  dragStartY = mouseY;
  dragOffsetStartX = offsetX;
  dragOffsetStartY = offsetY;
}

function mouseDragged() {
  if (!isDragging) return;
  offsetX = dragOffsetStartX + (mouseX - dragStartX);
  offsetY = dragOffsetStartY + (mouseY - dragStartY);
}

function mouseReleased() {
  isDragging = false;
}

function mouseWheel(event) {
  if (!isInsideCanvas()) return true; // let the page scroll normally
  zoom = constrain(zoom - event.delta * 0.001, minZoom, maxZoom);
  return false; // prevent the page itself from scrolling
}

function onHotspotClick(spot) {
  // FUTURE HOOK: once a portal page exists for this symbol,
  // uncomment the line below.
  // window.location.href = spot.href;
  console.log("Hotspot clicked:", spot.label, "— portal not built yet");
}

function keyPressed() {
  if (key === "0") {
    fitPaintingToCanvas();
  }
}
