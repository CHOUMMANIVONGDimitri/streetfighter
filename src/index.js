import { Ryu } from './entities/characters/Ryu.js';
import { Ken } from './entities/characters/Ken.js';
import { Stage } from './entities/Stage.js';
import { FpsCounter } from './entities/FpsCounter.js';
import { STAGE_FLOOR } from './constants/stage.js';
import { FighterDirection } from './constants/fighter.js';

const CURRENT_FPS = 60;

window.onload = () => {
    const canvasEl = document.querySelector('canvas');
    const context = canvasEl.getContext('2d');

    context.imageSmoothingEnabled = false;

    const entities = [
        new Stage(),
        new Ryu(104, STAGE_FLOOR, FighterDirection.LEFT), // velocity set to 150 by default
        new Ken(280, STAGE_FLOOR, FighterDirection.RIGHT),
        new FpsCounter(),
    ];

    let frameTime = {
        previous: 0,
        secondsPassed: 0,
        max: 1000 / CURRENT_FPS, // lock frame at 60
    };

    function frame(time) {
        frameTime = {
            ...frameTime,
            secondsPassed: (time - frameTime.previous) / 1000,
            previous: time,
        };

        frameTime.previous = time;

        for (const entity of entities) {
            entity.update(frameTime, context);
        }

        for (const entity of entities) {
            entity.draw(context);
        }

        window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
};
