let osc; // Oscilador
let env; // Envolvente
const appearingImages = [];

document.addEventListener("DOMContentLoaded", () => {
  const uploadButton = document.getElementById("uploadButton");

  if (uploadButton) {
    uploadButton.addEventListener("click", () => {
      const canvasElement = document.querySelector("canvas");
      const canvasImage = canvasElement.toDataURL();
      const blob = dataURLtoBlob(canvasImage);
      const file = new File([blob], "astro.png", { type: "image/png" });

      const formData = new FormData();
      formData.append("image", file);

      fetch("/upload", {
        method: "POST",
        body: formData,
      }).then((response) => {
        if (response.ok) {
          window.location.href = "sky";
        } else {
          alert("Hubo un error al crear el astro.");
        }
      });
    });
  }

  const skyContainer = document.getElementById("sky");

  if (skyContainer) {
    updateSky(skyContainer);
    setInterval(() => updateSky(skyContainer), 3000);
  }

  setupSound();
});

function updateSky(skyContainer) {
  fetch("/api/images")
    .then((response) => response.json())
    .then((images) => {
      skyContainer.innerHTML = "";
      images.forEach((image) => {
        const img = document.createElement("img");
        img.src = `/images/${image}`;
        skyContainer.appendChild(img);
        if (appearingImages.indexOf(image) === -1) {
          img.className = "animation";
          appearingImages.push(image);
          playFluteSound(Math.floor(Math.random() * 128)); // Reproduce un sonido de flauta
        }
      });
    });
}

function setupSound() {
  osc = new p5.Oscillator('sine'); // Oscilador de tipo seno para un sonido suave
  osc.start();
  osc.amp(0); // Inicialmente, el oscilador no emite sonido

  env = new p5.Envelope();
  env.setADSR(0.1, 0.2, 0.8, 0.5); // Configuración de la envolvente para sonido sostenido
  env.setRange(0.5, 0); // Rango de amplitud de la envolvente
}

function playFluteSound(midiNote) {
  let freq = midiToFreq(midiNote); // Convierte la nota MIDI a frecuencia
  osc.freq(freq); // Establece la frecuencia del oscilador

  // Dispara la envolvente para el oscilador
  env.play(osc, 0, 1); // La envolvente se dispara inmediatamente y sostiene la nota
}

function midiToFreq(midiNote) {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

function dataURLtoBlob(dataURL) {
  const parts = dataURL.split(",");
  const byteString = atob(parts[1]);
  const mimeString = parts[0].split(":")[1].split(";")[0];

  const arrayBuffer = new ArrayBuffer(byteString.length);
  const intArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([intArray], { type: mimeString });
}

function toggleAccordion() {
  const accordionContent = document.getElementById("accordionContent");
  accordionContent.style.opacity === "1"
    ? (accordionContent.style.opacity = "0")
    : (accordionContent.style.opacity = "1");
}