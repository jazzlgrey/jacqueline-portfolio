let img;

let tilesSlider;

let tilesOptions = [60, 80, 100, 120, 150];

function preload() {
  img = loadImage(
    "../assets/images/dragon_porcelain.jpg",
    () => console.log("Image loaded successfully"),
    () => console.error("Image failed to load. Check path/name: ../assets/images/dragon_porcelain.jpg")
  );
}

function setup() {
  let canvas = createCanvas(450, 450);

  // Use this if your HTML has <div id="raster-container"></div>
  canvas.parent("sketch-container");

  img.resize(width, height);
  noStroke();

  tilesSlider = createSlider(0, tilesOptions.length - 1, 2, 1);
  tilesSlider.parent("controls-container");
}

function draw() {
  background(248, 241, 236);

  let tilesX = tilesOptions[tilesSlider.value()];
  let tileSize = width / tilesX;
  let tilesY = height / tileSize;

  rectMode(CENTER);

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      let px = x * tileSize + tileSize / 2;
      let py = y * tileSize + tileSize / 2;

      let sampleX = floor(px);
      let sampleY = floor(py);

      let c = img.get(sampleX, sampleY);
      let b = brightness(c);

      let size = map(b, 0, 255, tileSize * 0.95, tileSize * 0.12);

      fill(20);
      rect(px, py, size, size);
    }
  }

  drawLabels(tilesX);
}

function keyPressed() {
  if (key === "s" || key === "S") {
    saveCanvas("dragon_porcelain_raster", "png");
  }
}