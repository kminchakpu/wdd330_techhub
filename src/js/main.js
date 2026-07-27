import { fetchYouTubeVideos } from './youtubeService.js';
import { fetchGitHubRepos } from './githubService.js';
import { createYouTubeCard, createGitHubCard } from './uiRenderer.js';
import { escapeHTML } from './utils.js';
import { initModal } from './modalModule.js';
import { initSaveHandlers, registerResources } from './storageModule.js';

/**
 * Fetches featured topics from JSON and renders them as cards
 */
export async function loadFeaturedTopics() {
  const container = document.getElementById('featuredContainer');
  if (!container) return;

  try {
    const response = await fetch('/data/featuredTopics.json');
    if (!response.ok) {
      throw new Error(`Failed to load topics: ${response.status}`);
    }

    const topics = await response.json();

    container.innerHTML = topics
      .map(
        (topic) => `
        <article class="topic-card" data-topic-id="${escapeHTML(topic.id)}">
          <img 
            src="${escapeHTML(topic.image)}" 
            alt="${escapeHTML(topic.title)}" 
            class="topic-card-img" 
            loading="lazy"
          />
          <div class="topic-card-body">
            <h3 class="topic-card-title">${escapeHTML(topic.title)}</h3>
            <p class="topic-card-desc">${escapeHTML(topic.description)}</p>
            <div class="topic-tags">
              ${topic.tags
                .map((tag) => `<span class="tech-tag">${escapeHTML(tag)}</span>`)
                .join('')}
            </div>
          </div>
          <div class="topic-card-footer">
            <a 
              href="${escapeHTML(topic.url)}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn-learn-more"
            >
              Learn More &rarr;
            </a>
          </div>
        </article>
      `
      )
      .join('');
  } catch (error) {
    console.error('Error rendering featured topics:', error);
    container.innerHTML = `<p class="error-msg">Failed to load featured topics.</p>`;
  }
}

/**
 * Loads API data concurrently and renders card grids
 */
async function loadInitialData() {
  const ytContainer = document.getElementById('youtubeContainer');
  const ghContainer = document.getElementById('githubContainer');

  // Fetch from APIs concurrently
  const [videos, repos] = await Promise.all([
    fetchYouTubeVideos('JavaScript DOM manipulation'),
    fetchGitHubRepos('vanilla-js', 'javascript')
  ]);

  // Register items into local memory for save tracking
  registerResources([...videos, ...repos]);

  if (ytContainer) {
    ytContainer.innerHTML = videos.map((v) => createYouTubeCard(v)).join('');
  }

  if (ghContainer) {
    ghContainer.innerHTML = repos.map((r) => createGitHubCard(r)).join('');
  }
}

/**
 * Main Application Initializer
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI interactive controllers
  const modalController = initModal();
  initSaveHandlers();

  // Load static & API content
  loadFeaturedTopics();
  loadInitialData();

  // Delegation listener for YouTube Watch buttons
  document.addEventListener('click', (e) => {
    const watchBtn = e.target.closest('.watch-btn');
    if (watchBtn) {
      const videoId = watchBtn.getAttribute('data-video-id');
      if (videoId) modalController.openModal(videoId);
    }
  });
});