const container = document.querySelector(".container");

let canvas = document.querySelector("canvas");
container.appendChild(canvas);
let ctx = canvas.getContext("2d");

let pickedImage = null;

let filePicker = document.createElement("input");
filePicker.type = "file";
filePicker.accept = ".png,.jpg,.jpeg";

filePicker.addEventListener("change", async (ev) => {
  let file = filePicker.files.item(0);
  console.log(file.name.toLowerCase());
  if (!file || ![".png", ".jpg", ".jpeg"].some(i => file.name.toLowerCase().endsWith(i))) return alert("Please pick a valid image.");
  pickedImage = await readImageFile(file);
  draw();
});

document.querySelector(".select-image")
  .addEventListener("click", () => {
    filePicker.click();
  });

document.querySelector(".download-image")
  .addEventListener("click", async () => {
    let blob = await getCanvasBlob(canvas);
    saveAs(blob, `smallphone-${Date.now()}.png`);
  })

async function draw() {
  let mainImage = await loadImage("./image.png");
  canvas.width = mainImage.width;
  canvas.height = mainImage.height;

  ctx.fillStyle = "#000000";
  ctx.fillRect(251, 390, 306, 405);

  if (pickedImage) {
    ctx.drawImage(pickedImage, 251, 390, 306, 405);
  }

  ctx.drawImage(mainImage, 0, 0);
}

function getCanvasBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, type, quality);
    } catch (err) {
      reject(err);
    }
  })
}

/** @returns {Promise<HTMLImageElement>} */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => { resolve(img) };
    img.onerror = reject;
    img.src = src;
  });
}

/** @returns {Promise<HTMLImageElement>} */
function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = async (evt) => {
      let image = await loadImage(evt.target.result);
      resolve(image);
    }
    fileReader.onerror = reject;
    fileReader.readAsDataURL(file);
  })
}

draw();