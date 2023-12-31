import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import Char from "./Char";
import ASCIIImage from "./ASCIIImage.js";

const maxScrollSpeed = 100;
const scrollScale = 0.8;

const ASCIIGrid = ({ images, animations, className, yPosition }) => {
    let size = { width: 0, height: 0 };
    let hResolution;
    let vResolution;

    const [prevScrollY,setPrevScrollY] = useState(0)

    const cellWidth = 10;
    const cellHeight = 10;

    let [grid, setGrid] = useState(null);

    const setupASCIIGrid = (ctx) => {
        ctx.font = `${cellHeight}px Fira Code`;
        ctx.textAlign = "center";
    };

    const drawASCIIImages = () => {
        if (images) {
            for (let i = 0; i < images.length; i++) {
                images[i].drawOnGrid(grid, cellWidth, cellHeight);
            }
        }
    };

    const drawASCIIAnimation = (frameCount) => {

        for (let a = 0; a < animations.length; a++) {
            if (animations[a].loaded) {
                animations[a].images[
                    Math.floor(
                        ((animations[a].speed) * frameCount) %
                            animations[a].duration
                    )
                ].drawOnGrid(grid, cellWidth, cellHeight);
            }
        }
    };

    const drawASCIIGrid = (ctx, frameCount) => {
        size.width = ctx.canvas.width;
        size.height = ctx.canvas.height;

        // draw background
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (let i = 0; i < hResolution; i++) {
            for (let j = 0; j < vResolution; j++) {
                if (grid[i][j] != null) {
                    grid[i][j].drawChar(ctx, cellWidth, cellHeight);
                    if (grid[i][j].isDead()) grid[i][j] = null;
                }
            }
        }
        if (images) {
            drawASCIIImages();
        }

        if (animations) {
            drawASCIIAnimation(frameCount);
        }
    };

    const handleMouseMove = (e) => {
        const i = Math.round((e.clientX / size.width) * hResolution);
        const j = Math.round((e.clientY / size.height) * vResolution);

        if (i >= grid.size || j >= grid[0].size || grid[i][j] != null) return;
        grid[i][j] = new Char(
            i * cellWidth,
            j * cellHeight + window.scrollY - yPosition,
            200
        );
    };

    useEffect(() => {
        const generateGrid = () => {
            hResolution = Math.ceil(size.width / cellWidth);
            vResolution = Math.ceil(size.height / cellHeight);
            grid = [...Array(hResolution)].map(() =>
                Array(vResolution).fill(null)
            );
        };
        generateGrid();

        document.addEventListener("resize", generateGrid);
        document.addEventListener("mousemove", handleMouseMove);

        return () => {
            document.removeEventListener("resize", generateGrid);
            document.removeEventListener("mouseMove", handleMouseMove);
        };
    }, []);

    return (
        <Canvas
            setup={setupASCIIGrid}
            draw={drawASCIIGrid}
            className={className}
        />
    );
};

export default ASCIIGrid;
