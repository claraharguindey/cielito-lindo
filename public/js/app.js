document.addEventListener("DOMContentLoaded", () => {
  const uploadButton = document.getElementById("uploadButton");
  let audio = new Audio('./sky.mp3');
  audio.loop = true;
  audio.play();
  
  if (uploadButton) {
    uploadButton.addEventListener("click", () => {
      const canvasElement = document.querySelector("canvas");
      const canvasImage = canvasElement.toDataURL();
      const blob = dataURLtoBlob(canvasImage);
      const file = new File([blob], "astro.jpg", { type: "image/jpg" });

      const formData = new FormData();
      formData.append("image", file);

      fetch("/upload", {
        method: "POST",
        body: formData,
      }).then((response) => {
        if (response.ok) {
          window.location.href = "/sky";
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

});

const minSize = 100;
const maxSize = 300;

const updateSky = (skyContainer) => {
  fetch("/api/images")
    .then((response) => response.json())
    .then((images) => {
      skyContainer.innerHTML = "";

      const numColumns = Math.floor(window.innerWidth / maxSize) + 1;
      const numRows = Math.floor(window.innerHeight / maxSize) + 1;

      let positionsX = Array.from({ length: numColumns }, () => 0);
      let positionsY = Array.from({ length: numRows }, () => 0);

      images.forEach((image, index) => {
        const img = document.createElement("img");
        img.src = `/images/${image}`;

        const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;

        let column = 0;
        while (positionsX[column] !== Math.min(...positionsX)) {
          column++;
        }
        let row = 0;
        while (positionsY[row] !== Math.min(...positionsY)) {
          row++;
        }

        const leftPosition = column * maxSize;
        const topPosition = row * maxSize;
        positionsX[column] += size;
        positionsY[row] += size; 

        img.style.width = `${size}px`;
        img.style.height = `${size}px`;
        img.style.position = "absolute";
        img.style.left = `${leftPosition}px`;
        img.style.top = `${topPosition}px`;
        img.className = "animation";

        skyContainer.appendChild(img);
      });
    });
}


const dataURLtoBlob = (dataURL) => {
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

const toggleAccordion = () => {
  const accordionContent = document.getElementById("accordionContent");
  accordionContent.style.opacity === "1"
    ? (accordionContent.style.opacity = "0")
    : (accordionContent.style.opacity = "1");
}
