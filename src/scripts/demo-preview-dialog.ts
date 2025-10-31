const dialog = document.getElementById("demo-preview-dialog");
const dialogContent = document.getElementById("demo-preview-content");
const closeBtn = document.getElementById("close-demo-dialog");
const dialogTitle = document.getElementById("demo-dialog-title");
const previewImage = document.getElementById("demo-preview-image") as HTMLImageElement;
const previewLink = document.getElementById("demo-preview-link") as HTMLAnchorElement;

export function openDemoDialog(title: string, demoUrl: string, imageUrl?: string) {
  if (dialog && dialogContent && dialogTitle && previewImage && previewLink && imageUrl) {
    dialogTitle.textContent = title;
    previewLink.href = demoUrl;
    previewImage.src = imageUrl;
    previewImage.alt = `${title} preview`;

    dialog.classList.remove("hidden");
    dialog.classList.add("flex");
    document.body.style.overflow = "hidden";
  }
}

function closeDialog() {
  if (dialog && dialogContent) {
    dialog.classList.add("hidden");
    dialog.classList.remove("flex");
    document.body.style.overflow = "";
  }
}

closeBtn?.addEventListener("click", closeDialog);

dialog?.addEventListener("click", (e) => {
  if (e.target === dialog) {
    closeDialog();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && dialog?.classList.contains("flex")) {
    closeDialog();
  }
});

(window as Window & { openDemoDialog?: typeof openDemoDialog }).openDemoDialog = openDemoDialog;
