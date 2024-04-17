import "normalize.css";
import "./style.css";
import paper from "paper";

// Constants
const NCols = 27;
const NRows = 14;
const Radius = 50;

// Setup paper.js
const canvas = document.querySelector(".mainCanvas");
paper.setup(canvas);

// Create groups for each shape type
let circleGroup = new paper.Group();
let rectangleGroup = new paper.Group();
let triangleGroup = new paper.Group();

// Create grids for each shape type
createGrid(circleGroup, createCircle);
createGrid(rectangleGroup, createRectangle);
createGrid(triangleGroup, createTriangle);

// Initially, only show the circle grid
rectangleGroup.visible = false;
triangleGroup.visible = false;

// Shape creation functions
function createCircle(x, y) {
  return new paper.Path.Circle({
    center: new paper.Point(x, y),
    radius: Radius,
    fillColor: "blue",
  });
}

function createRectangle(x, y) {
  return new paper.Path.Rectangle({
    rectangle: new paper.Rectangle(
      new paper.Point(x, y),
      new paper.Size(Radius * 2, Radius * 2)
    ),
    fillColor: "blue",
  });
}

function createTriangle(x, y) {
  return new paper.Path.RegularPolygon({
    center: new paper.Point(x, y),
    sides: 6,
    radius: Radius,
    fillColor: "blue",
  });
}

// Grid creation function
function createGrid(group, createShape) {
  for (let col = 0; col < NCols; col++) {
    const x = col * 2 * Radius;
    for (let row = 0; row < NRows; row++) {
      const y = row * 2 * Radius;
      const shape = createShape(x, y);
      group.addChild(shape);
    }
  }
}

// Hit testing
let lastHitTestResult = null;
function getShapeAtPoint(point) {
  const hitResult = paper.project.hitTest(point);
  if (hitResult) {
    lastHitTestResult = hitResult;
  }
  return lastHitTestResult && lastHitTestResult.item;
}

// Tool setup
const tool = new paper.Tool();
tool.minDistance = 20;

tool.onMouseDrag = (event) => {
  const item = getShapeAtPoint(event.point);
  if (item) toggleShape(item, true);
};

tool.onMouseDown = (event) => {
  const item = getShapeAtPoint(event.point);
  if (item) toggleShape(item);
};

// Shape toggling
function toggleShape(shape, forceActive) {
  let active;
  if (forceActive !== undefined) {
    active = shape.data.active = forceActive;
  } else {
    active = shape.data.active = !shape.data.active;
  }
  shape.fillColor = active ? "red" : "blue";
}

// Key event handling
window.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    if (circleGroup.visible) {
      circleGroup.visible = false;
      rectangleGroup.visible = true;
    } else if (rectangleGroup.visible) {
      rectangleGroup.visible = false;
      triangleGroup.visible = true;
    } else {
      triangleGroup.visible = false;
      circleGroup.visible = true;
    }
  }
});