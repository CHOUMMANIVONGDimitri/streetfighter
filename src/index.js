import { Ryu } from "./entities/characters/Ryu.js";
import { Ken } from "./entities/characters/Ken.js";
import { Stage } from "./entities/Stage.js";
import { FpsCounter } from "./entities/FpsCounter.js";
import { STAGE_FLOOR } from "./constants/stage.js";
import { FighterDirection, FighterState } from "./constants/fighter.js";

const CURRENT_FPS = 60;

function populateMoveDropDown() {
    const dropdown = document.getElementById("state-dropdown");

    Object.entries(FighterState).forEach(([, value]) => {
        const option = document.createElement("option");
        option.setAttribute("value", value);
        option.innerText = value;
        dropdown.appendChild(option);
    });
}

function handleForSubmit(e, fighters) {
    e.preventDefault();

    const selectedCheckboxes = Array.from(
        e.target.querySelectorAll("input:checked")
    ).map((checkbox) => checkbox.value);

    const options = e.target.querySelector("select");

    fighters.forEach((f) => {
        if (selectedCheckboxes.includes(f.name)) {
            f.changeState(options.value);
        }
    });
}

window.addEventListener("load", () => {
    populateMoveDropDown();
    const canvasEl = document.querySelector("canvas");
    const context = canvasEl.getContext("2d");

    context.imageSmoothingEnabled = false;

    const fighters = [
        new Ryu(104, STAGE_FLOOR, FighterDirection.RIGHT), // velocity set to 150 by default
        new Ken(280, STAGE_FLOOR, FighterDirection.LEFT),
    ];

    const entities = [new Stage(), ...fighters, new FpsCounter()];

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

    document.addEventListener("submit", (e) => {
        handleForSubmit(e, fighters);
    });

    window.requestAnimationFrame(frame);
});
