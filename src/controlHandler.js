import { Control, controls } from "./constants/control.js";
import { FighterDirection } from "./constants/fighter.js";

const holdKeys = new Set();
const gamePads = new Map();

const mappedKeys = controls
    .map(({ keyboard }) => Object.values(keyboard))
    .flat();

const handleKeyDown = (e) => {
    if (!mappedKeys.includes(e.code)) return;
    e.preventDefault();
    holdKeys.add(e.code);
};

const handleKeyUp = (e) => {
    if (!mappedKeys.includes(e.code)) return;
    e.preventDefault();
    holdKeys.delete(e.code);
};

export const registerKeyboardEvent = () => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
};

const handleGamepadConnected = (e) => {
    const {
        gamepad: { index, buttons },
    } = e;

    gamePads.set(index, { buttons });
};

const handleGamepadDisconnected = (e) => {
    const {
        gamepad: { index },
    } = e;

    gamePads.delete(index);
};

export const registerGamepadEvent = () => {
    window.addEventListener("gamepadconnected", handleGamepadConnected);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);
};

export const pollGamePads = () => {
    for (const gamePad of navigator.getGamepads()) {
        if (!gamePad) continue;

        if (gamePads.has(gamePad.index)) {
            const { index, buttons } = gamePad;

            gamePads.set(index, { buttons });
        }
    }
};

export const isKeyDown = (code) => holdKeys.has(code);
export const isKeyUp = (code) => !holdKeys.has(code);

export const isButtonDown = (padId, button) =>
    gamePads.get(padId)?.buttons[button].pressed;
export const isButtonUp = (padId, button) =>
    !gamePads.get(padId)?.buttons[button].pressed;

export const isLeft = (id) =>
    isKeyDown(controls[id].keyboard[Control.LEFT]) ||
    isButtonDown(id, controls[id].gamepad[Control.LEFT]);
export const isRight = (id) =>
    isKeyDown(controls[id].keyboard[Control.RIGHT]) ||
    isButtonDown(id, controls[id].gamepad[Control.RIGHT]);
export const isUp = (id) =>
    isKeyDown(controls[id].keyboard[Control.UP]) ||
    isButtonDown(id, controls[id].gamepad[Control.UP]);
export const isDown = (id) =>
    isKeyDown(controls[id].keyboard[Control.DOWN]) ||
    isButtonDown(id, controls[id].gamepad[Control.DOWN]);

export const isForward = (id, direction) =>
    direction === FighterDirection.RIGHT ? isRight(id) : isLeft(id);
export const isBackward = (id, direction) =>
    direction === FighterDirection.LEFT ? isRight(id) : isLeft(id);
