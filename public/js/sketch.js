let canvas;

function setup() {
    canvas = createCanvas(400, 400);
    canvas.parent('canvasContainer');
    background("#24559f");
}

function draw() {
    if (mouseIsPressed) {
        stroke("#fff");
        strokeWeight(2);
        line(mouseX, mouseY, pmouseX, pmouseY);
    }
}
