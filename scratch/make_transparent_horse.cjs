const fs = require('fs');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

console.log('Reading JPEG...');
const jpegData = fs.readFileSync('public/images/toy_rocking_horse.jpg');
const rawImage = jpeg.decode(jpegData, { useTArray: true });

const width = rawImage.width;
const height = rawImage.height;
console.log(`Image dimensions: ${width}x${height}`);

const png = new PNG({ width, height });

// Flood-fill algorithm to find only the exterior background white pixels
const visited = new Uint8Array(width * height);
const queue = new Int32Array(width * height);
let queueStart = 0;
let queueEnd = 0;

function push(x, y) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const idx = y * width + x;
  if (visited[idx]) return;
  const p = idx * 4;
  const r = rawImage.data[p];
  const g = rawImage.data[p + 1];
  const b = rawImage.data[p + 2];
  // Background white threshold
  if (r > 235 && g > 235 && b > 235) {
    visited[idx] = 1;
    queue[queueEnd++] = idx;
  }
}

// Push all four borders into queue
for (let x = 0; x < width; x++) {
  push(x, 0);
  push(x, height - 1);
}
for (let y = 0; y < height; y++) {
  push(0, y);
  push(width - 1, y);
}

console.log('Running flood fill...');
while (queueStart < queueEnd) {
  const idx = queue[queueStart++];
  const x = idx % width;
  const y = Math.floor(idx / width);

  push(x + 1, y);
  push(x - 1, y);
  push(x, y + 1);
  push(x, y - 1);
}

console.log('Applying transparency with anti-aliasing...');
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = y * width + x;
    const p = idx * 4;
    const r = rawImage.data[p];
    const g = rawImage.data[p + 1];
    const b = rawImage.data[p + 2];

    png.data[p] = r;
    png.data[p + 1] = g;
    png.data[p + 2] = b;

    if (visited[idx]) {
      const brightness = (r + g + b) / 3;
      if (brightness >= 248) {
        png.data[p + 3] = 0; // Completely transparent
      } else {
        // Smooth anti-aliased edge
        png.data[p + 3] = Math.max(0, Math.min(255, Math.round((248 - brightness) * 16)));
      }
    } else {
      png.data[p + 3] = 255; // Solid horse
    }
  }
}

const buffer = PNG.sync.write(png);
fs.writeFileSync('public/images/toy_rocking_horse.png', buffer);
console.log(`Saved transparent PNG: public/images/toy_rocking_horse.png (${(buffer.length / 1024).toFixed(1)} KB)`);
