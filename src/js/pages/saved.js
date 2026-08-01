import {
  getCurrentUser,
  protectPage,
  logoutUser
} from "../auth/auth.js";

import {
  getSavedResources,
  toggleSaveResource,
  updateSavedCounter,
  clearSavedResources
} from "../storage/storageModule.js";

import {
  createYouTubeCard,
  createGitHubCard
} from "../render/uiRenderer.js";

import { initModal } from "../modal/modalModule.js";

import {
  initConfirmModal,
  showConfirm
} from "../ui/confirmModal.js";

import {
  initToast,
  showToast
} from "../ui/toast.js";

document.addEventListener("DOMContentLoaded", () => {

  protectPage();

  const modalController = initModal();

  initConfirmModal();
  initToast();

  const savedContainer = document.getElementById("savedContainer");
  const savedSummary = document.getElementById("savedSummary");
  const welcomeUser = document.getElementById("welcomeUser");
  const logoutBtn = document.getElementById("logoutBtn");
  const clearBtn = document.getElementById("clearWatchlistBtn");

  /* ============================
      Logged In User
  ============================ */

  const user = getCurrentUser();

  if (user && welcomeUser) {
    welcomeUser.textContent = `👋 Welcome, ${user.name}`;
  }

  /* ============================
      Logout
  ============================ */

  if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

      const confirmed = await showConfirm({
        title: "Logout",
        message: "Are you sure you want to sign out?",
        confirmText: "Logout"
      });

      if (!confirmed) return;

      logoutUser();

      showToast(
        "Signed out successfully.",
        "success"
      );

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 900);

    });

  }

  /* ============================
      Render Watchlist
  ============================ */

  function renderSavedList() {

    const savedResources = getSavedResources();

    updateSavedCounter();

    if (savedSummary) {

      savedSummary.textContent =
        `${savedResources.length} resource${savedResources.length === 1 ? "" : "s"} saved`;

    }

    if (!savedContainer) return;

    if (savedResources.length === 0) {

      savedContainer.innerHTML = `
        <div class="empty-state">

          <h3>Your Watchlist is Empty</h3>

          <p>
            Save tutorials and repositories from the Home page.
          </p>

          <a
            href="/index.html"
            class="btn-github">

            Explore Resources

          </a>

        </div>
      `;

      return;

    }

    savedContainer.innerHTML = savedResources
      .map(resource => {

        if (resource.thumbnail) {

          return createYouTubeCard(resource, {
            isWatchlist: true
          });

        }

        return createGitHubCard(resource, {
          isWatchlist: true
        });

      })
      .join("");

  }

  /* ============================
      Card Buttons
  ============================ */

  document.addEventListener("click", async (event) => {

    const deleteBtn = event.target.closest(".delete-btn");

    if (deleteBtn) {

      const confirmed = await showConfirm({
        title: "Remove Resource",
        message: "This resource will be removed from your Watchlist.",
        confirmText: "Remove"
      });

      if (!confirmed) return;

      const id = deleteBtn.dataset.id;

      const item = getSavedResources().find(
        resource => String(resource.id) === String(id)
      );

      if (item) {

        toggleSaveResource(item);

        renderSavedList();

      }

      return;

    }

    const watchBtn = event.target.closest(".watch-btn");

    if (watchBtn) {

      modalController.openModal(
        watchBtn.dataset.videoId
      );

      return;

    }

    const repoBtn = event.target.closest(".btn-github");

    if (repoBtn && repoBtn.dataset.url) {

      window.open(
        repoBtn.dataset.url,
        "_blank",
        "noopener,noreferrer"
      );

    }

  });

  /* ============================
      Clear Watchlist
  ============================ */

  if (clearBtn) {

    clearBtn.addEventListener("click", async () => {

      const saved = getSavedResources();

      if (saved.length === 0) {

        await showConfirm({
          title: "Watchlist Empty",
          message: "There are no saved resources to remove.",
          confirmText: "OK",
          cancelText: ""
        });

        return;

      }

      const confirmed = await showConfirm({
        title: "Clear Watchlist",
        message:
          "This will permanently remove every saved tutorial and repository from your Watchlist.",
        confirmText: "Clear"
      });

      if (!confirmed) return;

      clearSavedResources();

      showToast(
        "🗑️ Watchlist cleared successfully.",
        "success"
      );

      renderSavedList();

    });

  }

  /* ============================
      Initial Render
  ============================ */

  renderSavedList();

});