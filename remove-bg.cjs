const { Jimp } = require('jimp');

async function removeBackground() {
    try {
        const image = await Jimp.read('public/logo.jpg');
        
        // Define tolerance for "white"
        const tolerance = 20;
        
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            // Get RGB values
            var red = this.bitmap.data[idx + 0];
            var green = this.bitmap.data[idx + 1];
            var blue = this.bitmap.data[idx + 2];
            
            // Check if pixel is close to white/light-blue
            if (red > 230 && green > 230 && blue > 230) {
                // Set alpha to 0 (transparent)
                this.bitmap.data[idx + 3] = 0;
            }
        });
        
        await image.write('public/logo.png');
        console.log('Background removed and saved as logo.png');
    } catch (err) {
        console.error(err);
    }
}

removeBackground();
