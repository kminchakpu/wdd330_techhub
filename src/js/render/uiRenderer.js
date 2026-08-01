import { escapeHTML } from "../utils/utils.js";
import { isResourceSaved } from "../storage/storageModule.js";

/* =========================================
   YouTube Card
========================================= */

export function createYouTubeCard(video, options = {}) {
  const isSaved = isResourceSaved(video.id);
  const isWatchlist = options.isWatchlist || false;

  const actionButton = isWatchlist
    ? `
      <button
        type="button"
        class="btn-sm delete-btn"
        data-id="${escapeHTML(video.id)}">
        🗑️ Delete
      </button>
    `
    : `
      <button
        type="button"
        class="btn-sm save-btn ${isSaved ? "saved" : ""}"
        data-id="${escapeHTML(video.id)}">
        ${isSaved ? "★ Saved" : "+ Save"}
      </button>
    `;

  return `
    <article
      class="resource-card youtube-card"
      data-id="${escapeHTML(video.id)}">

      <div class="thumbnail-container">
        <img
          src="${escapeHTML(video.thumbnail)}"
          alt="${escapeHTML(video.title)}"
          loading="lazy">
      </div>

      <div class="card-content">

        <h3 class="card-title">
          ${escapeHTML(video.title)}
        </h3>

        <p class="channel-title">
          ${escapeHTML(video.channelTitle)}
        </p>

        <div class="repo-meta">

          <span class="tech-badge">
            ${escapeHTML(video.category)}
          </span>

          <span class="tech-badge">
            ${escapeHTML(video.topic || "")}
          </span>

          ${
            video.level
              ? `
              <span class="tech-badge">
                ${escapeHTML(video.level)}
              </span>
            `
              : ""
          }

        </div>

        <div class="card-actions">

          ${actionButton}

          <button
            type="button"
            class="btn-sm watch-btn"
            data-video-id="${escapeHTML(video.id)}">

            Watch Video

          </button>

        </div>

      </div>

    </article>
  `;
}

/* =========================================
   GitHub Card
========================================= */

export function createGitHubCard(repo, options = {}) {
  const isSaved = isResourceSaved(repo.id);
  const isWatchlist = options.isWatchlist || false;

  const actionButton = isWatchlist
    ? `
      <button
        type="button"
        class="btn-sm delete-btn"
        data-id="${escapeHTML(repo.id)}">
        🗑️ Delete
      </button>
    `
    : `
      <button
        type="button"
        class="btn-sm save-btn ${isSaved ? "saved" : ""}"
        data-id="${escapeHTML(repo.id)}">
        ${isSaved ? "★ Saved" : "+ Save"}
      </button>
    `;

  return `
    <article
      class="resource-card github-card"
      data-id="${escapeHTML(repo.id)}">

      <div class="card-content">

        <div class="github-header">

          <img
            src="${escapeHTML(repo.avatar)}"
            alt="${escapeHTML(repo.owner)}"
            class="github-avatar"
            loading="lazy">

          <div>

            <h3 class="card-title">
              ${escapeHTML(repo.owner)}/${escapeHTML(repo.name)}
            </h3>

            <small class="repo-owner">
              ${escapeHTML(repo.owner)}
            </small>

          </div>

        </div>

        <p class="card-desc">
          ${escapeHTML(repo.description || "No description available.")}
        </p>

        <div class="repo-meta">

          <span class="tech-badge">
            ${escapeHTML(repo.category)}
          </span>

          <span class="tech-badge">
            ${escapeHTML(repo.topic || "")}
          </span>

          ${
            repo.language
              ? `
              <span class="tech-badge">
                ${escapeHTML(repo.language)}
              </span>
            `
              : ""
          }

        </div>

        <div class="repo-stats">

          <span>
            ⭐ ${Number(repo.stars).toLocaleString()}
          </span>

          <span>
            🍴 ${Number(repo.forks).toLocaleString()}
          </span>

        </div>

        <div class="card-actions">

          ${actionButton}

          <button
            type="button"
            class="btn-sm btn-github"
            data-url="${repo.url}">

            View Repository

          </button>

        </div>

      </div>

    </article>
  `;
}