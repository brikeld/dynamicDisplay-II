import "normalize.css";
import "./style.scss";
import "p5";
import { Pane } from "tweakpane";
import { preloadImages, initializeLogos, moveLogos, drawLogos, applyNoiseEffect } from './utils';

// Initialize the Tweakpane with a title
const pane = new Pane();
pane.title = "My poster";

// List of composite operations for blending images
const allComposites = [
  "lighter", "multiply", "screen", "overlay",
  "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light",
  "difference", "exclusion", "hue", "saturation", "luminosity",
];

let compIndex = 3;
const PARAMS = {
  xPosition: 0, // X position as a percentage of the canvas width
  bgColor: "#0000ff", // Background color
  dimensions: { x: 600, y: 1000 }, // Canvas dimensions
  seed: 50, // Random seed
  noiseSeed: 50, // Noise function seed
  stopMovement: false, // Flag to control the movement of logos
  noiseIntensity: 50, // Noise intensity for the noise effect
  noiseBlendMode: "overlay" // Blend mode for the noise effect
};

// Add Tweakpane bindings for various parameters
pane.addBinding(PARAMS, "xPosition", { min: 0, max: 100 });
pane.addBinding(PARAMS, "noiseSeed", { min: 0, max: 100, step: 1, label: "z amount" });
pane.addBinding(PARAMS, "seed", { min: 0, max: 100, step: 1, label: "position seed" });
pane.addBinding(PARAMS, "noiseIntensity", { min: 0, max: 255, step: 1, label: "noise intensity" });

pane.addBinding(PARAMS, "dimensions", {
  picker: "inline",
  x: { min: 1, step: 1 },
  y: { min: 1, step: 1 },
}).on("change", (event) => {
  const { x, y } = event.value;
  resizeCanvas(x, y); // Resize the canvas when dimensions change
});

pane.addBinding(PARAMS, "bgColor");

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
    luminosity: "luminosity"
  }
});

pane.addButton({ title: "Save image" }).on("click", () => {
  saveCanvas('poster', 'png');
});

pane.addButton({ title: "STOP" }).on("click", () => {
  PARAMS.stopMovement = !PARAMS.stopMovement; // Toggle movement
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
  p5Canvas.parent("app");
  pixelDensity(1); // Disable retina display scaling
  imageMode(CORNER); // Set image drawing mode to CORNER

  // Initialize logos with random positions and speeds
  logos = initializeLogos(300, width, height, window);
};

window.draw = function () {
  background(PARAMS.bgColor); // Set background color

  const x = (PARAMS.xPosition / 0) * width; // Calculate x position as a percentage

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
