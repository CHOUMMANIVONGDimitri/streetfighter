import { Ryu } from "./entities/characters/Ryu.js";
import { Ken } from "./entities/characters/Ken.js";
import { Stage } from "./entities/Stage.js";
import { FpsCounter } from "./entities/FpsCounter.js";

const GameViewport = {
    WIDTH: 384,
    HEIGHT: 244,
};

window.onload = () => {
    const canvasEl = document.querySelector("canvas");
    const context = canvasEl.getContext("2d");

    canvasEl.width = GameViewport.WIDTH;
    canvasEl.height = GameViewport.HEIGHT;

    const entities = [
        new Stage(),
        new Ryu(80, 110, 2), // velocity set to 2 by default
        new Ken(80, 110, -2),
        new FpsCounter(),
    ];

    let previousTime = 0;
    let accumulator = 0;
    const maxFrameTime = 1000 / 60; // lock frame at 60

    function frame(time) {
        const deltaTime = time - previousTime;
        previousTime = time;
        accumulator += deltaTime;

        while (accumulator >= maxFrameTime) {
            for (const entity of entities) {
                entity.update(maxFrameTime / 1000, context);
            }

            accumulator -= maxFrameTime;
        }

        for (const entity of entities) {
            entity.draw(context);
        }

        window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
};
