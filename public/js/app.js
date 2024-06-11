document.addEventListener("DOMContentLoaded", () => {
  const uploadButton = document.getElementById("uploadButton");

  if (uploadButton) {
    uploadButton.addEventListener("click", () => {
      const canvasElement = document.querySelector("canvas");
      const canvasImage = canvasElement.toDataURL();
      const blob = dataURLtoBlob(canvasImage);
      const file = new File([blob], "dibujo.png", { type: "image/png" });

      const formData = new FormData();
      formData.append("image", file);

      fetch("/upload", {
        method: "POST",
        body: formData,
      }).then((response) => {
        if (response.ok) {
          alert("Dibujo subido exitosamente!");
          window.location.href = "sky";
        } else {
          alert("Hubo un error al subir el dibujo.");
        }
      });
    });
  }

  const skyContainer = document.getElementById("sky");

  if (skyContainer) {
    updateSky();
    setInterval(updateSky, 3000);
  }
  const appearingImages = [];
  function updateSky() {
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
          }
        });
      });
  }
});

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
