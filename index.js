const GameViewport = {
    WIDTH: 384 / 3,
    HEIGHT: 244 / 3,
    // xxx / 3 is for pixel style
};

window.onload = () => {
    const canvasEl = document.querySelector("canvas");
    const context = canvasEl.getContext("2d");

    canvasEl.width = GameViewport.WIDTH;
    canvasEl.height = GameViewport.HEIGHT;

    context.strokeStyle = "aliceblue";
    context.moveTo(0, 0);
    context.lineTo(GameViewport.WIDTH, GameViewport.HEIGHT);
    context.moveTo(0, GameViewport.HEIGHT);
    context.lineTo(GameViewport.WIDTH, 0);
    context.stroke();

    console.log(context);
};
