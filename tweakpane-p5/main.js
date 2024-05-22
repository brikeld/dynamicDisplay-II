import "normalize.css";
import "./style.scss";

import "p5";
import { Pane } from "tweakpane";

const pane = new Pane();
pane.title = "My poster";

let allComposites = [
  "source-over",
  "source-in",
  "source-out",
  "source-atop",
  "destination-over",
  "destination-in",
  "destination-out",
  "destination-atop",
  "lighter",
  "copy",
  "xor",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
];
let compIndex = 10; // xor
const PARAMS = {
  xPosition: 0, // %
  bgColor: "#0000ff",
  dimensions: { x: 300, y: 500 },
  seed: 50,
  noiseSeed: 50
};

pane.addBinding(PARAMS, "xPosition", {
  min: 0,
  max: 100,
});

pane.addBinding(PARAMS, "noiseSeed", {
  min: 0,
  max: 100,
  step: 1,
  label: "z amount"
});


pane.addBinding(PARAMS, "seed", {
  min: 0,
  max: 100,
  step: 1,
  label: "position seed"
});

pane
  .addBinding(PARAMS, "dimensions", {
    picker: "inline",
    x: { min: 1, step: 1 },
    y: { min: 1, step: 1 },
  })
  .on("change", (event) => {
    const { x, y } = event.value;
    resizeCanvas(x, y);
  });

pane.addBinding(PARAMS, "bgColor");

pane
  .addButton({
    title: "Save image",
  })
  .on("click", () => {
    saveCanvas();
  });

let zLogo, bgImage;

window.preload = function () {
  zLogo = loadImage("/black-logo.png");
  bgImage = loadImage("/Brutalism.png");
};

window.setup = function () {
  const { x, y } = PARAMS.dimensions;
  const p5Canvas = createCanvas(x, y);
  p5Canvas.parent("app"); // attach canvas to #app
  pixelDensity(1); // disable retina display scaling
  imageMode(CORNER);
};

window.draw = function () {
  background("white");

  const x = (PARAMS.xPosition / 100) * width;

  image(
    bgImage,
    0,
    0,
    width,
    height,
    0,
    0,
    bgImage.width,
    bgImage.height,
    COVER
  );

  push();

  scale(3);

  let off = round((mouseY / height) * 5);

  off = 0;

  // image(bgImage, 0, 0, width, height)

  randomSeed(PARAMS.seed);
  noiseSeed(PARAMS.noiseSeed);

  // console.log(compIndex, allComposites[compIndex])
  drawingContext.globalCompositeOperation = allComposites[compIndex]
  for (let j = 0; j < 100; j++) {
    let rOff = round(random(-20, 20));

    for (let i = 0; i < 100; i++) {
      // let show = random([true, false]);
      let amt = noise(j, i);
      let show = amt > 0.5;

      let y = 10 * i + off * j + rOff
      let x = 10 * j + round(random(-1, 1))
      let sc = random([1, 2, 4]) * 10;
      push();
      if (show) image(zLogo, x, y, sc, sc);
      pop();
    }
  }
  drawingContext.globalCompositeOperation = "source-over";

  pop();

  // for(let i = 0; i < 10; i++) {
  //   image(zLogo, 5, 5 * i + off * 1, 4, 4)
  // }
  // for(let i = 0; i < 10; i++) {
  //   image(zLogo, 10, 5 * i + off * 2, 4, 4)
  // }
};

window.mousePressed = function () {
  compIndex = (compIndex + 1) % allComposites.length;
  console.log(compIndex, allComposites[compIndex]);
};
