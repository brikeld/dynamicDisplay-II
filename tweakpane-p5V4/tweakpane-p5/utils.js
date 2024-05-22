// utils.js

export function preloadImages(p5) {
    return {
      zLogo: p5.loadImage("/whiteZ.png"),
      bgImage: p5.loadImage("/Brutalism.png"),
    };
  }
  
  export function initializeLogos(count, width, height, p5) {
    const logos = [];
    for (let i = 0; i < count; i++) {
      logos.push({
        x: p5.random(width),
        y: p5.random(-height, 0),
        speed: p5.random([4, 8, 12]),
        scale: p5.random([4, 8, 23]) * 10,
      });
    }
    return logos;
  }
  
  export function moveLogos(logos, width, height, stopMovement, p5) {
    for (let logo of logos) {
      if (!stopMovement) {
        logo.y += logo.speed; // Move logo down
        if (logo.y > height) {
          logo.y = p5.random(-height, 0); // Reset logo position if it moves off screen
          logo.x = p5.random(width);
        }
      }
    }
  }
  
  export function drawLogos(p5, logos, zLogo, width, height, compIndex, allComposites) {
    p5.push(); // Save current drawing state
    p5.scale(3); // Scale drawing by a factor of 3
    p5.drawingContext.globalCompositeOperation = allComposites[compIndex]; // Set composite operation
  
    for (let logo of logos) {
      p5.push(); // Save current drawing state
      p5.image(zLogo, logo.x, logo.y, logo.scale, logo.scale); // Draw logo
      p5.pop(); // Restore previous drawing state
    }
  
    p5.drawingContext.globalCompositeOperation = "source-over"; // Reset composite operation to default
    p5.pop(); // Restore previous drawing state
  }
  