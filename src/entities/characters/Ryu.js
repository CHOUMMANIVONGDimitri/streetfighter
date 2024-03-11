import { Character } from "./Character.js";

export class Ryu extends Character {
    constructor(x, y, velocity) {
        super("ryu", x, y, velocity);

        this.image = document.querySelector('img[alt="ryu"]');
    }
}
