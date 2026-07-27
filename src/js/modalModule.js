export function initModal() {
  const modal = document.getElementById('videoModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const playerContainer = document.getElementById('modalPlayerContainer');

  function openModal(videoId) {
    if (!modal || !playerContainer) return;

    // Embed YouTube iframe player
    playerContainer.innerHTML = `
      <iframe 
        src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1" 
        title="YouTube Video Player" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    `;

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    if (!modal || !playerContainer) return;

    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    playerContainer.innerHTML = ''; // Destroy iframe on close to stop playback
  }

  // Close triggers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  return { openModal, closeModal };
}