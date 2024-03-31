export const Control = {
    LEFT: "left",
    RIGHT: "right",
    UP: "up",
    DOWN: "down",
};

export const controls = [
    {
        keyboard: {
            [Control.LEFT]: "ArrowLeft",
            [Control.RIGHT]: "ArrowRight",
            [Control.UP]: "ArrowUp",
            [Control.DOWN]: "ArrowDown",
        },
        gamepad: {
            [Control.LEFT]: 14,
            [Control.RIGHT]: 15,
            [Control.UP]: 12,
            [Control.DOWN]: 13,
        },
    },
    {
        keyboard: {
            [Control.LEFT]: "KeyA",
            [Control.RIGHT]: "KeyD",
            [Control.UP]: "KeyW",
            [Control.DOWN]: "KeyS",
        },
        gamepad: {
            [Control.LEFT]: 14,
            [Control.RIGHT]: 15,
            [Control.UP]: 12,
            [Control.DOWN]: 13,
        },
    },
];
