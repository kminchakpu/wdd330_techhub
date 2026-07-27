import { getSavedResources, toggleSaveResource, updateSavedCounter } from './storageModule.js';
import { createYouTubeCard, createGitHubCard } from './uiRenderer.js';
import { initModal } from './modalModule.js';

document.addEventListener('DOMContentLoaded', () => {
  const modalController = initModal();
  const savedContainer = document.getElementById('savedContainer');

  /**
   * Renders saved resources from Local Storage
   */
  function renderSavedList() {
    const savedResources = getSavedResources();

    if (!savedContainer) return;

    if (savedResources.length === 0) {
      savedContainer.innerHTML = `
        <div class="empty-state">
          <p>Your watchlist is currently empty!</p>
          <a href="/index.html" class="btn-sm btn-github">Explore Tutorials & Repos</a>
        </div>
      `;
      updateSavedCounter();
      return;
    }

    // Pass { isWatchlist: true } so cards explicitly display the "Delete" button
    savedContainer.innerHTML = savedResources
      .map((item) => {
        if (item.thumbnail) {
          return createYouTubeCard(item, { isWatchlist: true });
        } else {
          return createGitHubCard(item, { isWatchlist: true });
        }
      })
      .join('');

    updateSavedCounter();
  }

  // Event listener for deleting items or launching video modal
document.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.delete-btn'); // Look specifically for .delete-btn
  const watchBtn = e.target.closest('.watch-btn');

  if (deleteBtn) {
    const id = deleteBtn.getAttribute('data-id');
    const savedResources = getSavedResources();
    const itemToRemove = savedResources.find((res) => String(res.id) === String(id));

    if (itemToRemove) {
      toggleSaveResource(itemToRemove);
      renderSavedList(); // Instantly removes the card from the UI
    }
  }

  if (watchBtn) {
    const videoId = watchBtn.getAttribute('data-video-id');
    if (videoId) modalController.openModal(videoId);
  }
});

  renderSavedList();
});