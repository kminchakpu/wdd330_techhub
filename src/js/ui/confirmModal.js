let modal;
let titleElement;
let messageElement;
let confirmButton;
let cancelButton;

let resolver = null;

export function initConfirmModal() {

  modal = document.getElementById("confirmModal");
  titleElement = document.getElementById("confirmTitle");
  messageElement = document.getElementById("confirmMessage");
  confirmButton = document.getElementById("confirmYes");
  cancelButton = document.getElementById("confirmNo");

  if (!modal) return;

  confirmButton.addEventListener("click", () => {
    close(true);
  });

  cancelButton.addEventListener("click", () => {
    close(false);
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      close(false);
    }
  });

  document.addEventListener("keydown", event => {
  if (modal.classList.contains("hidden")) return;
  if (event.key === "Escape") {
    close(false);
  }

  if (event.key === "Enter") {
    close(true);
  }

});
}

function close(result) {
  modal.classList.add("hidden");
  setTimeout(() => {
    if (resolver) {
      resolver(result);
      resolver = null;
    }
  }, 250);
}

export function showConfirm({
  title = "Confirm",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel"

} = {}) {

  return new Promise((resolve) => {
    resolver = resolve;
    titleElement.textContent = title;
    messageElement.textContent = message;
    confirmButton.textContent = confirmText;

    // Show or hide Cancel button
    if (cancelText === "") {
      cancelButton.style.display = "none";
    } else {

      cancelButton.style.display = "inline-flex";
      cancelButton.textContent = cancelText;
    }

    modal.classList.remove("hidden");
    confirmButton.focus();

  });

}