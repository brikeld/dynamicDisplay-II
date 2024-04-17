let imgNew1, imgNew2, imgNew3, imgNew4, img11, img12;
let rects = [];
let rectSize = 150; 

let imgWidth = rectSize; 
let imgHeight = rectSize; 

function preload() {
  img11 = loadImage('patterns/test11.png');
  img12 = loadImage('patterns/test12.png');
  imgNew1 = loadImage('patternsNew/new1.svg');
  imgNew2 = loadImage('patternsNew/new2.svg');
  imgNew3 = loadImage('patternsNew/new3.svg');
  imgNew4 = loadImage('patternsNew/new4.svg');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.oncontextmenu = (e) => e.preventDefault();
  noLoop();

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      rects.push({ x: i * rectSize, y: j * rectSize, img: null, mirrored: false });
    }
  }
}

function draw() {
  background(125,125,125);
  stroke(0);

  let translateX = width / 2 - (rectSize * 10) / 2;
  let translateY = height / 2 - (rectSize * 10) / 2;
  translate(translateX, translateY);

  for (let r of rects) {
    if (r.img !== null) {
      imageMode(CENTER);
      push();
      if (r.mirrored) {
        scale(-1, 1);
        image(r.img, -r.x - rectSize / 2, r.y + rectSize / 2, imgWidth, imgHeight);
      } else {
        image(r.img, r.x + rectSize / 2, r.y + rectSize / 2, imgWidth, imgHeight);
      }
      pop();
    } else {
      fill(0);
      stroke(0);
      rectMode(CORNER);
      rect(r.x, r.y, rectSize, rectSize);
    }
  }
}

function mousePressed() {
  updateImage();
}

function mouseDragged() {
  updateImage();
}

function updateImage() {
  let translateX = width / 2 - (rectSize * 10) / 2;
  let translateY = height / 2 - (rectSize * 10) / 2;

  for (let rect of rects) {
    if (mouseX > rect.x + translateX && mouseX < rect.x + translateX + rectSize && mouseY > rect.y + translateY && mouseY < rect.y + translateY + rectSize) {
      if (rect.img === null && mouseButton === LEFT) {
        rect.img = random([imgNew1, imgNew2, imgNew3, imgNew4]);
      } else if (mouseButton === RIGHT) {
        rect.mirrored = !rect.mirrored;
      }
    }
  }

  redraw();
}
