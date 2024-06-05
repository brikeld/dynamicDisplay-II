import "normalize.css";
import "./style.scss";
import "p5";
import { Pane } from "tweakpane";
import * as htmlToImage from "html-to-image";
import {
  preloadImages,
  initializeLogos,
  moveLogos,
  drawLogos,
  applyNoiseEffect,
} from "./utils";

const pane = new Pane();
pane.title = "My poster";

const allComposites = [
  "lighter",
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
  "luminosity",
];

let compIndex = 3;
const PARAMS = {
  xPosition: 0, // X position as a percentage of the canvas width
  bgColor: "#6991a9", // Background color
  dimensions: { x: 300, y: 500 }, // Canvas dimensions
  seed: 50, // Random seed
  noiseSeed: 50, // Noise function seed
  stopMovement: false, // Flag to control the movement of logos
  noiseIntensity: 50, // Noise intensity for the noise effect
  noiseBlendMode: "overlay", // Blend mode for the noise effect
  title: "Olivero\nToscani", // Set title with line break
  subtitle: "Fotografie & Provokation", // Added subtitle parameter
  footerBgColor: "#6f60bc", // Added footer background color parameter
};

pane
  .addBinding(PARAMS, "dimensions", {
    label: "Canvas size",
    x: { min: 100 },
    y: { min: 100 },
  })
  .on("change", ({value}) => {
    resizeCanvas(value.x, value.y);
  });
pane.addBinding(PARAMS, "title");
pane.addBinding(PARAMS, "subtitle"); // Added binding for subtitle
pane.addBinding(PARAMS, "xPosition", { min: 0, max: 100 });
pane.addBinding(PARAMS, "noiseSeed", {
  min: 0,
  max: 100,
  step: 1,
  label: "z amount",
});
pane.addBinding(PARAMS, "seed", {
  min: 0,
  max: 100,
  step: 1,
  label: "position seed",
});
pane.addBinding(PARAMS, "noiseIntensity", {
  min: 0,
  max: 255,
  step: 1,
  label: "noise intensity",
});
pane.addBinding(PARAMS, "bgColor");
pane.addBinding(PARAMS, "footerBgColor"); // Added binding for footer background color
pane.addBinding(PARAMS, "noiseBlendMode", {
  options: {
    lighter: "lighter",
    multiply: "multiply",
    screen: "screen",
    overlay: "overlay",
    darken: "darken",
    lighten: "lighten",
    "color-dodge": "color-dodge",
    "color-burn": "color-burn",
    "hard-light": "hard-light",
    "soft-light": "soft-light",
    difference: "difference",
    exclusion: "exclusion",
    hue: "hue",
    saturation: "saturation",
    luminosity: "luminosity",
  },
});

pane.addButton({ title: "Save image" }).on("click", () => {
  const node = document.getElementById("poster");

  htmlToImage
    .toPng(node, {
      pixelRatio: 5,
    })
    .then(function (dataUrl) {
      const link = document.createElement("a");
      link.download = "poster.png";
      link.href = dataUrl;
      link.click();
    })
    .catch(
      function (error) {
        console.error("oops, something went wrong!", error);
      }
    );
});

pane.addButton({ title: "STOP" }).on("click", () => {
  PARAMS.stopMovement = !PARAMS.stopMovement;
});

let zLogo, bgImage;
let logos = []; // Array to store logos' positions and speeds

// Preload images before setup
window.preload = function () {
  const images = preloadImages(window);
  zLogo = images.zLogo;
  bgImage = images.bgImage;
};

window.setup = function () {
  const { x, y } = PARAMS.dimensions;
  const p5Canvas = createCanvas(x, y);
  p5Canvas.parent("poster");
  pixelDensity(1); // Disable retina display scaling
  imageMode(CORNER); // Set image drawing mode to CORNER

  // Initialize logos with random positions and speeds
  logos = initializeLogos(200, width, height, window);
};

window.draw = function () {
  background(PARAMS.bgColor); // Set background color

  const elTitle = document.querySelector(".title");
  elTitle.textContent = PARAMS.title;

  const elSubtitle = document.querySelector(".subtitle"); // Select subtitle element
  elSubtitle.textContent = PARAMS.subtitle; // Update subtitle text

  const elPosterFooter = document.querySelector(".posterFooter"); // Select poster footer element
  elPosterFooter.style.backgroundColor = PARAMS.footerBgColor; // Update footer background color

  const x = (PARAMS.xPosition / 100) * width; // Calculate x position as a percentage

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
    COVER // Draw background image covering the entire canvas
  );

  applyNoiseEffect(window, PARAMS.noiseIntensity, PARAMS.noiseBlendMode); // Apply noise effect with blend mode

  drawLogos(window, logos, zLogo, width, height, compIndex, allComposites);
  moveLogos(logos, width, height, PARAMS.stopMovement, window);
};

window.mousePressed = function () {
  compIndex = (compIndex + 1) % allComposites.length; // Cycle through composite operations on mouse press
  console.log(compIndex, allComposites[compIndex]); // Log current composite operation
};
