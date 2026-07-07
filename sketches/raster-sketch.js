let img;

let tilesSlider;
let radiusSlider;

let tilesOptions = [10, 20, 30, 50, 100];

function preload() {
  img = loadImage("../assets/images/ua862.jpeg");
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent("raster-container");

  img.resize(width, height);
  noStroke();

  // slider 1: controls tilesX
  tilesSlider = createSlider(0, tilesOptions.length - 1, 2, 1);
  tilesSlider.parent("controls-container");

  // slider 2: controls mouse ripple radius
  radiusSlider = createSlider(20, 180, 80, 1);
  radiusSlider.parent("controls-container");
}

function draw() {
  background(248, 241, 236);

  let tilesX = tilesOptions[tilesSlider.value()];
  let tileSize = width / tilesX;
  let tilesY = height / tileSize;

  let rippleRadius = radiusSlider.value();

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      let px = x * tileSize;
      let py = y * tileSize;

      let sampleX = floor(px);
      let sampleY = floor(py);

      let c = img.get(sampleX, sampleY);
      let b = brightness(c);

      let size = map(b, 0, 255, tileSize * 0.95, tileSize * 0.12);

      // distance from mouse to this tile
      let d = dist(mouseX, mouseY, px, py);

      let ripple = 0;

      if (d < rippleRadius) {
        // stronger ripple near mouse
        let strength = map(d, 0, rippleRadius, 1, 0);

        // wave motion
        ripple = sin(d * 0.15 - frameCount * 0.18) * strength * tileSize * 0.7;
      }

      let displayX = px;
      let displayY = py + ripple;

      fill(20);
      rectMode(CENTER);
      rect(displayX, displayY, size, size);
    }
  }

  drawLabels(tilesX, rippleRadius);
}

function drawLabels(tilesX, rippleRadius) {
  fill(255, 255, 255, 220);
  rectMode(CORNER);
  rect(20, height - 72, 220, 52, 6);

  fill(30);
  textSize(14);
  textFont("Georgia");
  text(`tilesX: ${tilesX}`, 32, height - 48);
  text(`mouse radius: ${rippleRadius}`, 32, height - 26);
}