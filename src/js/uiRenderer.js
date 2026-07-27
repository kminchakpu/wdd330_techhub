import { escapeHTML } from './utils.js';
import { isResourceSaved } from './storageModule.js';

/**
 * Creates HTML string for a YouTube video card
 * @param {Object} video - Video data object
 * @param {Object} options - Rendering options { isWatchlist: boolean }
 * @returns {string} HTML string
 */
export function createYouTubeCard(video, options = {}) {
  const isSaved = isResourceSaved(video.id);
  const isWatchlist = options.isWatchlist || false;

  const actionButtonHtml = isWatchlist
    ? `<button type="button" class="btn-sm delete-btn" data-id="${escapeHTML(video.id)}">🗑️ Delete</button>`
    : `<button type="button" class="btn-sm save-btn ${isSaved ? 'saved' : ''}" data-id="${escapeHTML(video.id)}">${isSaved ? '★ Saved' : '+ Save'}</button>`;

  return `
    <article class="resource-card youtube-card" data-id="${escapeHTML(video.id)}">
      <div class="thumbnail-container">
        <img src="${escapeHTML(video.thumbnail)}" alt="${escapeHTML(video.title)}" loading="lazy" />
      </div>
      <div class="card-content">
        <h3 class="card-title">${escapeHTML(video.title)}</h3>
        <p class="channel-title">Channel: ${escapeHTML(video.channelTitle || '')}</p>
        <div class="card-actions">
          ${actionButtonHtml}
          <button type="button" class="btn-sm watch-btn" data-video-id="${escapeHTML(video.id)}">Watch Video</button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Creates HTML string for a GitHub repository card
 * @param {Object} repo - Repo data object
 * @param {Object} options - Rendering options { isWatchlist: boolean }
 * @returns {string} HTML string
 */
export function createGitHubCard(repo, options = {}) {
  const isSaved = isResourceSaved(repo.id);
  const isWatchlist = options.isWatchlist || false;

  const actionButtonHtml = isWatchlist
    ? `<button type="button" class="btn-sm save-btn delete-btn" data-id="${escapeHTML(repo.id)}">🗑️ Delete</button>`
    : `<button type="button" class="btn-sm save-btn ${isSaved ? 'saved' : ''}" data-id="${escapeHTML(repo.id)}">${isSaved ? '★ Saved' : '+ Save'}</button>`;

  return `
    <article class="resource-card github-card" data-id="${escapeHTML(repo.id)}">
      <div class="card-content">
        <h3 class="card-title">${escapeHTML(repo.owner ? `${repo.owner}/${repo.name}` : repo.name)}</h3>
        <p class="card-desc">${escapeHTML(repo.description || 'No description provided.')}</p>
        <div class="repo-meta">
          <span>★ ${repo.stars || 0}</span>
          ${repo.language ? `<span class="tech-badge">${escapeHTML(repo.language)}</span>` : ''}
        </div>
        <div class="card-actions">
          ${actionButtonHtml}
          <a href="${escapeHTML(repo.url)}" target="_blank" rel="noopener noreferrer" class="btn-sm btn-github">View Code on GitHub</a>
        </div>
      </div>
    </article>
  `;
}