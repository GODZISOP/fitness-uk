const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function analyzeImage() {
  const imgPath = 'd:\\Downloads\\uk fitness\\hero-app\\public\\dumbbell-frames\\ezgif-frame-161.png';
  const img = await loadImage(imgPath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  // Let's find the first row that has non-transparent pixels
  let firstSolidRow = -1;
  let textEndRow = -1;
  let dumbbellStartRow = -1;

  // Scan rows
  for (let y = 0; y < canvas.height; y++) {
    let hasSolid = false;
    let solidCount = 0;
    for (let x = 0; x < canvas.width; x++) {
      const alpha = data[(y * canvas.width + x) * 4 + 3];
      if (alpha > 50) {
        hasSolid = true;
        solidCount++;
      }
    }
    
    if (hasSolid && firstSolidRow === -1) {
      firstSolidRow = y;
      console.log(`First solid row (likely black line): ${y} (width: ${solidCount}px)`);
    }

    // A black line would span almost the entire width.
    if (solidCount > canvas.width * 0.8) {
      console.log(`Found thick solid line at row ${y}`);
    }

    // If we have a big gap of empty space after the text, we can find where the dumbbell starts
    if (firstSolidRow !== -1 && y > firstSolidRow + 200) {
       // Just find where a massive block of pixels starts (dumbbell)
       if (solidCount > canvas.width * 0.4 && dumbbellStartRow === -1) {
          dumbbellStartRow = y;
          console.log(`Dumbbell seems to start around row ${y}`);
       }
    }
  }

  console.log(`Image height: ${canvas.height}`);
}

analyzeImage().catch(console.error);
