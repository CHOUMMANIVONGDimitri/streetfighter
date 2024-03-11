import { Character } from "./Character.js";

export class Ken extends Character {
    constructor(x, y, velocity) {
        super("ken", x, y, velocity);

        this.image = document.querySelector('img[alt="ken"]');
    }
}
