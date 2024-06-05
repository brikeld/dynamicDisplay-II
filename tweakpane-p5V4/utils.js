export function preloadImages(p5) {
  return {
    zLogo: p5.loadImage("/whiteZ.png"),
    bgImage: p5.loadImage("/DanFlavin.jpg"),  //cubism hue-luminosity  //brutalism 
  };
}

export function initializeLogos(count, width, height, p5) {
  const logos = [];
  const numColumns = 15; // Increase the number of columns to 20
  const columnWidth = width / numColumns; // Width of each column

  for (let i = 0; i < count; i++) {
    const column = i % numColumns; // Determine the column for the logo
    logos.push({
      x: column * columnWidth + columnWidth / 2, // Center logo in the column
      y: p5.random(-height, 10),
      speed: p5.random([4, 8, 22]),
      scale: 15, // Set a fixed scale to avoid overlaps
      column: column // Store the column index
    });
  }
  return logos;
}

export function moveLogos(logos, width, height, stopMovement, p5) {
  for (let i = 0; i < logos.length; i++) {
    const logo = logos[i];
    if (!stopMovement) {
      logo.y += logo.speed; // Move logo down
      if (logo.y > height) {
        logo.y = p5.random(-height, 0); // Reset logo position if it moves off screen
      }
    }
  }
}

export function drawLogos(p5, logos, zLogo, width, height, baseCompIndex, allComposites) {
  p5.push(); // Save current drawing state
  p5.scale(4); // Scale drawing by a factor of 4

  const numColumns = Math.max(...logos.map(logo => logo.column)) + 1; // Calculate the number of columns

  for (let column = 0; column < numColumns; column++) {
    const compIndex = (baseCompIndex + column) % allComposites.length; // Adjust composite operation for the column
    p5.drawingContext.globalCompositeOperation = allComposites[compIndex]; // Set composite operation for the column

    for (let logo of logos) {
      if (logo.column === column) {
        p5.push(); // Save current drawing state
        p5.image(zLogo, logo.x, logo.y, logo.scale, logo.scale); // Draw logo
        p5.pop(); // Restore previous drawing state
      }
    }
  }

  p5.drawingContext.globalCompositeOperation = "source-over"; // Reset composite operation to default
  p5.pop(); // Restore previous drawing state
}

export function applyNoiseEffect(p5, intensity, blendMode) {
  p5.loadPixels();
  for (let x = 0; x < p5.width; x++) {
    for (let y = 0; y < p5.height; y++) {
      const index = (x + y * p5.width) * 4;
      const noiseValue = p5.random(-intensity, intensity);
      p5.pixels[index] = p5.pixels[index] + noiseValue;     // Red
      p5.pixels[index + 1] = p5.pixels[index + 1] + noiseValue; // Green
      p5.pixels[index + 2] = p5.pixels[index + 2] + noiseValue; // Blue
    }
  }
  p5.updatePixels();
  p5.drawingContext.globalCompositeOperation = blendMode; // Set blend mode for noise
}
