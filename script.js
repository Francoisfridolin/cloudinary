const photos = [
  {
    title: "Portrait 01",
    description: "Une photographie de la collection, hébergée et diffusée depuis Cloudinary.",
    url: "https://res.cloudinary.com/x9rjaxmu/image/upload/v1794416054/WhatsApp_Image_2026-11-11_at_10.35.37.jpg",
    alt: "Portrait de la collection Cloudinary, image 1",
    number: "01",
  },
  {
    title: "Portrait 02",
    description: "Une photographie de la collection, hébergée et diffusée depuis Cloudinary.",
    url: "https://res.cloudinary.com/x9rjaxmu/image/upload/v1794416054/WhatsApp_Image_2026-11-11_at_10.35.3.jpg",
    alt: "Portrait de la collection Cloudinary, image 2",
    number: "02",
  },
  {
    title: "Portrait 03",
    description: "Une photographie de la collection, hébergée et diffusée depuis Cloudinary.",
    url: "https://res.cloudinary.com/x9rjaxmu/image/upload/v1794416053/WhatsApp_Image_2026-11-11_at_10.35..jpg",
    alt: "Portrait de la collection Cloudinary, image 3",
    number: "03",
  },
  {
    title: "Portrait 04",
    description: "Une photographie de la collection, hébergée et diffusée depuis Cloudinary.",
    url: "https://res.cloudinary.com/x9rjaxmu/image/upload/v1794415984/WhatsApp_Image_2026-11-11_at_10.35.36.jpg",
    alt: "Portrait de la collection Cloudinary, image 4",
    number: "04",
  },
];

const gallery = document.querySelector("#gallery-grid");
const imageCount = document.querySelector("#image-count");
const dialog = document.querySelector("#image-dialog");
const dialogImage = document.querySelector("#dialog-image");
const dialogTitle = document.querySelector("#dialog-title");
const dialogDescription = document.querySelector("#dialog-description");
const imageUrl = document.querySelector("#image-url");
const fullImageLink = document.querySelector("#full-image-link");
const downloadLink = document.querySelector("#download-image");
const actionStatus = document.querySelector("#action-status");

function createPhotoCard(photo) {
  const card = document.createElement("article");
  card.className = "photo-card";

  const button = document.createElement("button");
  button.className = "photo-open";
  button.type = "button";
  button.setAttribute("aria-haspopup", "dialog");
  button.setAttribute("aria-label", `Afficher ${photo.title}`);

  const image = document.createElement("img");
  image.src = photo.url;
  image.alt = photo.alt;
  image.loading = "lazy";
  image.decoding = "async";

  const overlay = document.createElement("span");
  overlay.className = "photo-overlay";

  const title = document.createElement("span");
  title.className = "photo-title";
  title.textContent = photo.title;

  const arrow = document.createElement("span");
  arrow.className = "photo-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";

  overlay.append(title, arrow);
  button.append(image, overlay);

  const caption = document.createElement("div");
  caption.className = "photo-caption";

  const label = document.createElement("span");
  label.textContent = "PHOTO HÉBERGÉE SUR CLOUDINARY";

  const number = document.createElement("span");
  number.textContent = photo.number;
  number.setAttribute("aria-hidden", "true");

  caption.append(label, number);
  card.append(button, caption);
  button.addEventListener("click", () => openPhoto(photo));

  return card;
}

function openPhoto(photo) {
  dialogTitle.textContent = photo.title;
  dialogDescription.textContent = photo.description;
  dialogImage.src = photo.url;
  dialogImage.alt = photo.alt;
  imageUrl.value = photo.url;
  fullImageLink.href = photo.url;
  downloadLink.href = photo.url.replace("/upload/", "/upload/fl_attachment/");
  downloadLink.setAttribute("download", `regards-${photo.number}.jpg`);
  actionStatus.textContent = "";
  dialog.showModal();
}

async function copyImageUrl() {
  try {
    await navigator.clipboard.writeText(imageUrl.value);
    actionStatus.textContent = "Lien copié dans le presse-papiers.";
  } catch {
    imageUrl.focus();
    imageUrl.select();
    actionStatus.textContent = "Sélectionnez puis copiez le lien affiché ci-dessus.";
  }
}

async function sharePhoto() {
  const shareData = {
    title: dialogTitle.textContent,
    text: "Découvrir cette image hébergée sur Cloudinary",
    url: imageUrl.value,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (error) {
      if (error.name !== "AbortError") {
        actionStatus.textContent = "Le partage a échoué. Vous pouvez copier l’URL ci-dessus.";
      }
    }
    return;
  }

  await copyImageUrl();
}

photos.forEach((photo) => gallery.append(createPhotoCard(photo)));
imageCount.textContent = `${String(photos.length).padStart(2, "0")} images`;

document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
document.querySelector("#copy-url").addEventListener("click", copyImageUrl);
document.querySelector("#share-image").addEventListener("click", sharePhoto);

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});
