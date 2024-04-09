import 'normalize.css'
import './style.css'
import paper from 'paper'

const canvas = document.querySelector('.mainCanvas');
paper.setup(canvas);


const nCols = 20;
const nRows = 5;
const radius = 30;

const group = new paper.Group();

for (let col = 0; col < nCols; col++) {

  for (let row = 0; row < nRows; row++) {

    const circle = new paper.Path.Circle({
      center: paper.view.center,
      radius,
      fillColor: 'blue'
    });

    const x = col * 2 * radius;
    const y = row * 2 * radius;

    circle.position = new paper.Point(x, y);

    group.addChild(circle);

  }


}

paper.view.onFrame = function (event) {
  // rotate the group by 1 degree
  // get group bounds
  const bounds = group.bounds;
  // center view on group
  paper.view.center = bounds.center;
};



// create circle


const tool = new paper.Tool();
tool.minDistance = 20;

// Define a mousedown and mousedrag handler
tool.onMouseDrag = (event) => {

  const item = getCircle(event.point);

  if (item)
    toggleCircle(item, true);
}

function getCircle(point) {
  const hitResult = paper.project.hitTest(point);
  if (!hitResult) return;
  if (!hitResult.item) return;
  return hitResult.item;
}

tool.onMouseDown = (event) => {

  const item = getCircle(event.point);
  if (item)
    toggleCircle(item);

}

function toggleCircle(circle, forceActive) {
  let active;

  if (forceActive !== undefined) {
    active = circle.data.active = forceActive;
  } else {
    active = circle.data.active = !circle.data.active;
  }

  circle.fillColor = active ? 'red' : 'blue';
}