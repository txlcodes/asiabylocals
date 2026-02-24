const fs = require('fs');

async function processImage() {
  try {
    const Jimp = (await import('jimp')).default;
    const image = await Jimp.read('public/logo.png');
    // The image is 1536x1024. We want a square.
    // The logo is probably centered. We'll crop a 1024x1024 square from the center.
    // X offset = (1536 - 1024) / 2 = 256
    image.crop(256, 0, 1024, 1024);
    // Resize down to standard large favicon size
    image.resize(512, 512);
    await image.writeAsync('public/favicon.png');
    console.log('Favicon cropped and saved successfully');
  } catch (err) {
    console.error('Error processing image with Jimp:', err);
    // Fallback: Just let the user know, or we can use another tool if Jimp isn't installed
  }
}

processImage();
