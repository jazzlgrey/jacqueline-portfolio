let img;

function preload() {
  img = loadImage("../assets/images/ua862.jpg");
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent("raster-container");

  img.resize(width, height);
  noStroke();
}

function draw() {
  background(248, 241, 236);

  let tileSize = map(mouseX, 0, width, 6, 28);
  tileSize = constrain(tileSize, 6, 28);

  for (let y = 0; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {
      let c = img.get(x, y);
      let b = brightness(c);

      let circleSize = map(b, 0, 255, tileSize * 1.2, 1);

      fill(c);
      ellipse(x, y, circleSize, circleSize);
    }
  }
}