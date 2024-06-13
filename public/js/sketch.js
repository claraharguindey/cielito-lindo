let canvas;
let sColor = "#fff";
let sWeight = 1;
const removerButton = document.getElementById("removerButton");
const toggleColor = () => {
  if (sColor === "#fff") {
    sColor = "#000";
    sWeight = 20;
    removerButton.style.textDecoration = "line-through";
  } else {
    sColor = "#fff";
    sWeight = 1;
    removerButton.style.textDecoration = "none";
  }
};

function setup() {
  canvas = createCanvas(300, 300);
  canvas.parent("canvasContainer");
  background("#000");
}

function draw() {
  if (mouseIsPressed) {
    stroke(sColor);
    strokeWeight(sWeight);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}
