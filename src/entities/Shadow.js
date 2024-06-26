import { STAGE_FLOOR } from "../constants/stage.js";

export class Shadow {
    constructor(fighter) {
        this.image = document.querySelector('img[alt="shadow"]');
        this.fighter = fighter;
        this.frame = [
            [0, 0, 62, 10],
            [31, 6],
        ];
    }

    update() {}

    draw(context) {
        const [[x, y, width, height], [originX, originY]] = this.frame;

        const scale = 1 - (STAGE_FLOOR - this.fighter.position.y) / 250; // for calculate shadow scale when character change y position

        context.globalAlpha = 0.5; // transparency
        context.drawImage(
            this.image,
            x,
            y,
            width,
            height,
            Math.floor(this.fighter.position.x - originX * scale),
            Math.floor(STAGE_FLOOR - originY * scale),
            Math.floor(width * scale),
            Math.floor(height * scale)
        );
        context.globalAlpha = 1; // fix other sprites being affect by the global alpha setting
    }
}
