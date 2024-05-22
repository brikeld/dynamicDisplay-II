import "normalize.css";
import "./style.scss";
import "p5";
import { Pane } from "tweakpane";
import { preloadImages, initializeLogos, moveLogos, drawLogos } from './utils';

// Initialize the Tweakpane with a title
const pane = new Pane();
pane.title = "My poster";

// List of composite operations for blending images
const allComposites = [
  "source-over", "source-in", "lighter", "xor", "multiply", "screen", "overlay",
  "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light",
  "difference", "exclusion", "hue", "saturation", "color", "luminosity",
];

let compIndex = 12; // Start with "soft-light" composite operation
const PARAMS = {
  xPosition: 0, // X position as a percentage of the canvas width
  bgColor: "#0000ff", // Background color
  dimensions: { x: 800, y: 1333.33 }, // Canvas dimensions
  seed: 50, // Random seed
  noiseSeed: 50, // Noise function seed
  stopMovement: false, // Flag to control the movement of logos
};

// Add Tweakpane bindings for various parameters
pane.addBinding(PARAMS, "xPosition", { min: 0, max: 100 });
pane.addBinding(PARAMS, "noiseSeed", { min: 0, max: 100, step: 1, label: "z amount" });
pane.addBinding(PARAMS, "seed", { min: 0, max: 100, step: 1, label: "position seed" });

pane.addBinding(PARAMS, "dimensions", {
  picker: "inline",
  x: { min: 1, step: 1 },
  y: { min: 1, step: 1 },
}).on("change", (event) => {
  const { x, y } = event.value;
  resizeCanvas(x, y); // Resize the canvas when dimensions change
});

pane.addBinding(PARAMS, "bgColor");

pane.addButton({ title: "Save image" }).on("click", () => {
  saveCanvas('poster', 'png'); // Save canvas image with filename 'poster.png'
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
  logos = initializeLogos(100, width, height, window);
};

window.draw = function () {
  background(PARAMS.bgColor); // Set background color

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

  drawLogos(window, logos, zLogo, width, height, compIndex, allComposites);
  moveLogos(logos, width, height, PARAMS.stopMovement, window);
};

window.mousePressed = function () {
  compIndex = (compIndex + 1) % allComposites.length; // Cycle through composite operations on mouse press
  console.log(compIndex, allComposites[compIndex]); // Log current composite operation
};
