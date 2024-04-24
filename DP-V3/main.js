let img1, img2, img3, img4, img5;
let rects = [];
let rectSize = 150; 
let selectedImg = null;
let animationOn = false;


function preload() {
  img1 = loadImage('patternsNew/pat1.svg');
  img2 = loadImage('patternsNew/pat2.svg');
  img3 = loadImage('patternsNew/pat3.svg');
  img4 = loadImage('patternsNew/pat4.svg');
  img5 = loadImage('patternsNew/pat5.svg');
  img6 = loadImage('patternsNew/pat6.svg');

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {

      let locked = false;
      if (i === 0 || i === 9) { // All the first row and 10th row
        locked = true;
      } else if (i === 1 || i === 2 || i === 7 || i === 8) { // First square and last square of second row, third row, eight row and ninth row
        if (j === 0 || j === 9) {
          locked = true;
        }
      } else if (i === 3) { // First 6 squares of the fourth row, and 10th square
        if (j < 6 || j === 9|| j === 8) {
          locked = true;
        }
      } else if (i === 4) { // First 5 squares of the fifth row, and 10th square
        if (j < 5 || j === 9 || j === 8|| j === 7){
          locked = true;
        }
      } else if (i === 5) { // First 4 squares of the sixth row, and 10th square
        if (j < 4 || j === 9 || j === 8|| j === 7|| j === 6) {
          locked = true;
        }
      } else if (i === 6) { 
        if (j < 3 || j === 9 || j === 8|| j === 7|| j === 6|| j === 5) {
          locked = true;
        }
      }
  
    rects.push({
      x: j * rectSize,
      y: i * rectSize,
      img: null,
      state: 0,
      locked: locked,
      rotationSpeed: random(0.01, 0.03) // Add a random rotation speed
    });
  }
}
}

function draw() {
  background(125, 125, 125);
  stroke(0);

  let translateX = width / 2 - (rectSize * 10) / 2;
  let translateY = height / 2 - (rectSize * 10) / 2;
  translate(translateX, translateY);

  fill(0);

  let allFilled = true;
  for (let r of rects) {
    if (!r.locked && r.img === null) {
      allFilled = false;
      break;
    }
  }



  if (animationOn) {
    for (let r of rects) {
      if (!r.locked && r.img !== null) {
        r.state = (r.state + 1) % 8; // Cycle through 8 states
      }
    }
  }

  for (let r of rects) {
    rect(r.x, r.y, rectSize, rectSize);
    if (r.img !== null) {
      push();
      translate(r.x + rectSize / 2, r.y + rectSize / 2);
    if (r.state === 1) {
      scale(-1, 1); // Mirror horizontally
    } else if (r.state === 2) {
      scale(1, -1); // Mirror vertically
    } else if (r.state === 3) {
      rotate(PI / 2); // Rotate 90 degrees
    } else if (r.state === 4) {
      rotate(-PI / 2); // Rotate -90 degrees
    } else if (r.state === 5) {
      scale(-1, -1); // Mirror horizontally and vertically
    } else if (r.state === 6) {
      rotate(PI/2);
      scale(-1, 1); // Rotate 90 degrees and mirror horizontally 
    } else if (r.state === 7) {
      rotate(PI/2);
      scale(1, -1); // Rotate 90 degrees and mirror vertically
    }
    
    image(r.img, -rectSize / 2, -rectSize / 2, rectSize, rectSize);
    pop();
    
  }
}
}

function mouseClicked() {
  updateImage();
}

function keyPressed() {
  if (key === ' ') { // If the spacebar was pressed
    animationOn = !animationOn; // Toggle the animationOn variable
    if (animationOn) {
      loop(); // If animationOn is true, start the draw() loop
    } else {
      noLoop(); // If animationOn is false, stop the draw() loop
    }
  }
}

function mouseDragged() {
  updateImage();
}


function updateImage() {
  let translateX = width / 2 - (rectSize * 10) / 2;
  let translateY = height / 2 - (rectSize * 10) / 2;

  for (let r of rects) {
    if (mouseX > r.x + translateX && mouseX < r.x + translateX + rectSize && mouseY > r.y + translateY && mouseY < r.y + translateY + rectSize) {
      if (!r.locked && r.img === null && mouseButton === LEFT) {
        if (selectedImg === null) {
          selectedImg = random([img1, img2, img3, img4, img5,img6,]);
        }
        r.img = selectedImg;
        r.state = 0; // Add a state property to keep track of the transformation state
      } else if (!r.locked && r.img !== null && mouseButton === LEFT) {
        r.state = (r.state + 1) % 8; // Cycle through 8 states
      }
      redraw(); 
    }
  }
}