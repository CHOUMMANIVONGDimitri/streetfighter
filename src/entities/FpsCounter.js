export class FpsCounter {
    constructor() {
        this.fps = 0;
    }

    update(frameTime) {
        this.fps = Math.trunc(1 / frameTime);
    }

    draw(context) {
        context.font = "bold 20px Arial";
        context.fillStyle = "black";
        context.textalign = "center";
        context.fillText(`FPS: ${this.fps}`, context.canvas.width / 2, 30);
    }
}
