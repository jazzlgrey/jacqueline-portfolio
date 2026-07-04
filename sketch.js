let petals = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");

  for (let i = 0; i < 45; i++) {
    petals.push(new Petal(random(width), random(height)));
  }
}

function draw() {
  clear();

  for (let petal of petals) {
    petal.update();
    petal.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Petal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(20, 70);
    this.speed = random(0.15, 0.7);
    this.drift = random(-0.4, 0.4);
    this.angle = random(TWO_PI);
    this.rotationSpeed = random(-0.005, 0.005);
    this.alpha = random(25, 80);
  }

  update() {
    this.y += this.speed;
    this.x += this.drift + sin(frameCount * 0.01 + this.angle) * 0.2;
    this.angle += this.rotationSpeed;

    let mouseInfluence = dist(mouseX, mouseY, this.x, this.y);

    if (mouseInfluence < 120) {
      this.x += (this.x - mouseX) * 0.005;
      this.y += (this.y - mouseY) * 0.005;
    }

    if (this.y > height + this.size) {
      this.y = -this.size;
      this.x = random(width);
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    noStroke();
    fill(120, 80, 95, this.alpha);

    beginShape();
    vertex(0, -this.size * 0.5);
    bezierVertex(
      this.size * 0.4, -this.size * 0.3,
      this.size * 0.5, this.size * 0.25,
      0, this.size * 0.5
    );
    bezierVertex(
      -this.size * 0.5, this.size * 0.25,
      -this.size * 0.4, -this.size * 0.3,
      0, -this.size * 0.5
    );
    endShape(CLOSE);

    pop();
  }
}
