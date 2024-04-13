import { Game } from "./game.js";

// function populateMoveDropDown() {
//     const dropdown = document.getElementById("state-dropdown");

//     Object.entries(FighterState).forEach(([, value]) => {
//         const option = document.createElement("option");
//         option.setAttribute("value", value);
//         option.innerText = value;
//         dropdown.appendChild(option);
//     });
// }

window.addEventListener("load", () => {
    // populateMoveDropDown();

    new Game().start();
});
