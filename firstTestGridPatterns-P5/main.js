let img1, img2;
let rects = [];
let rectSize = 150; 

function preload() {
  img1 = loadImage('patterns/test1.png');
  img2 = loadImage('patterns/test2.png');
  img3 = loadImage('patterns/test3.png');
  img4 = loadImage('patterns/test4.png');
  img5 = loadImage('patterns/test5.png');
    img6 = loadImage('patterns/test6.png');
    img7 = loadImage('patterns/test7.png');
    img8 = loadImage('patterns/test8.png');
    img9 = loadImage('patterns/test9.png');
    img10 = loadImage('patterns/test10.png');
    img11 = loadImage('patterns/test11.png');
    img12 = loadImage('patterns/test12.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  
}

function draw() {
    background(125,125,125);
  stroke(0);

  let translateX = width / 2 - (rectSize * 10) / 2;
  let translateY = height / 2 - (rectSize * 10) / 2;
  translate(translateX, translateY);

  rects = [];
  fill(0);
  stroke(125,125,125);
  //noStroke();
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      rects.push({ x: i * rectSize, y: j * rectSize, img: null });
      rect(i * rectSize, j * rectSize, rectSize, rectSize);
      
    }
  }
}

function mouseClicked() {
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
        if (rect.img === null) {
          if (mouseButton === LEFT) {
            rect.img = random([img1, img2, img3, img4, img5, img6, img7, img8]);
          } else if (mouseButton === RIGHT) {
            rect.img = random([img11, img12]);
          }
          image(rect.img, rect.x, rect.y, rectSize, rectSize);
        }
      }
    }
  }
