let container;

/**
 * Initialize toast container
 */
export function initToast() {
  container = document.getElementById("toastContainer");

  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
}

/**
 * Show toast notification
 */
export function showToast(
  message,
  type = "info",
  duration = 3000
) {
  if (!container) {
    initToast();
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const icons = {
    success: "✔",
    error: "✖",
    warning: "⚠",
    info: "ℹ"
  };

  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");

    toast.addEventListener(
      "transitionend",
      () => toast.remove(),
      { once: true }
    );
  }, duration);
}