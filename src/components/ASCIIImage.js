import Char from "./Char";
const ASCIIscale = [" ", ".", ",", "-", "~", "+", "*", "#", "%", "@"];
// const ASCIIscale = [" ", ".", ",", "-", "~", "!", "l", "i", ";", ":","o","&","8","#","@"];

const mapValue = (value, minIn, maxIn, minOut, maxOut) => {
    const output =
        minOut + ((maxOut - minOut) / (maxIn - minIn)) * (value - minIn);
    return Math.round(output);
};

class ASCIIImage {
    constructor(path, x, y) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        
        // create image and set path
        const image = new Image();
        image.src = path;

        image.onload = () => {
            this.width = image.width;
            this.height = image.height;

            this.x = x;
            this.y = y;

            // Draw image on canvas and get it's data
            ctx.canvas.width = this.width;
            ctx.canvas.height = this.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            this.imageData = ctx.getImageData(0, 0, image.width, image.height);

            // Create an array to store the translation of the image into brightness values
            this.brightnessValues = [...Array(this.width)].map(() =>
                Array(this.height).fill(0)
            );

            this.generateBrightnessMap();

            this.loaded = true;
        };
    }

    getASCII() {
        return this.result;
    }
    isLoaded() {
        return this.loaded;
    }
    getImageData() {
        return this.imageData;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    // Calculates the perceived brightness in an srgb image
    // Return values in a range from 0 to 250
    calculateBrightness(r, g, b) {
        return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    // Generate an array [result] with each pixel translated into a brightness value
    generateBrightnessMap() {
        for (let i = 0; i <= this.imageData.data.length / 4; i++) {
            const brightness = this.calculateBrightness(
                this.imageData.data[i * 4 + 0],
                this.imageData.data[i * 4 + 1],
                this.imageData.data[i * 4 + 2]
            );

            this.brightnessValues[i] = brightness;
        }
    }

    // Draw characters with different densities on a grid based on each one of the image's pixel brightness
    drawOnGrid(grid, cellWidth, cellHeight) {
        if (!this.loaded) return;

        for (let i = 0; i < this.brightnessValues.length; i++) {
            const x = Math.floor(this.x/cellWidth - this.width / 2 + (i % this.width));
            const y = Math.floor(this.y/cellHeight - this.height / 2 + i / this.width);

            if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {
                const charIndex = mapValue(
                    this.brightnessValues[i],
                    0,
                    250,
                    0,
                    ASCIIscale.length - 1
                );
                    console.log();
                const char = new Char(
                    x * cellWidth,
                    y * cellHeight,
                    -1,
                    ASCIIscale[charIndex],
                    "image"
                );

                if (this.brightnessValues[i] > 0) {
                    grid[x][y] = char;
                } else if (grid[x][y] != null) {
                    if (grid[x][y].getType() == "image") {
                        grid[x][y] = null;
                    }
                }
            }
        }
    }
}

export default ASCIIImage;
