import { Ryu } from "./entities/characters/Ryu.js";
import { Ken } from "./entities/characters/Ken.js";
import { Stage } from "./entities/Stage.js";
import { FpsCounter } from "./entities/FpsCounter.js";
import { STAGE_FLOOR } from "./constants/stage.js";
import { FighterDirection } from "./constants/fighter.js";
import {
    pollGamePads,
    registerGamepadEvent,
    registerKeyboardEvent,
} from "./controlHandler.js";

const CURRENT_FPS = 60;

export class Game {
    constructor() {
        this.context = this.getContext();
        this.fighters = [
            new Ryu(104, STAGE_FLOOR, FighterDirection.RIGHT, 0), // velocity set to 150 by default
            new Ken(280, STAGE_FLOOR, FighterDirection.LEFT, 1),
        ];

        this.entities = [new Stage(), ...this.fighters, new FpsCounter()];

        this.frameTime = {
            previous: 0,
            secondsPassed: 0,
            max: 1000 / CURRENT_FPS, // lock frame at 60
        };
    }

    getContext() {
        const canvasEl = document.querySelector("canvas");
        const context = canvasEl.getContext("2d");

        context.imageSmoothingEnabled = false;
        return context;
    }

    frame(time) {
        this.frameTime = {
            ...this.frameTime,
            secondsPassed: (time - this.frameTime.previous) / 1000,
            previous: time,
        };

        this.frameTime.previous = time;

        pollGamePads();

        for (const entity of this.entities) {
            entity.update(this.frameTime, this.context);
        }

        for (const entity of this.entities) {
            entity.draw(this.context);
        }

        window.requestAnimationFrame(this.frame.bind(this));
    }

    /* debug movement option */

    // handleForSubmit(e) {
    //     e.preventDefault();

    //     const selectedCheckboxes = Array.from(
    //         e.target.querySelectorAll("input:checked")
    //     ).map((checkbox) => checkbox.value);

    //     const options = e.target.querySelector("select");

    //     this.fighters.forEach((f) => {
    //         if (selectedCheckboxes.includes(f.name)) {
    //             f.changeState(options.value);
    //         }
    //     });
    // }

    start() {
        // document.addEventListener("submit", this.handleForSubmit.bind(this));

        registerKeyboardEvent();
        registerGamepadEvent();
        window.requestAnimationFrame(this.frame.bind(this));
    }
}
