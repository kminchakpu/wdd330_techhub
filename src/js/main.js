import { fetchYouTubeVideos } from "./youtubeService.js";
import { fetchGitHubRepos } from "./githubService.js";
import { createYouTubeCard, createGitHubCard } from "./uiRenderer.js";
import { escapeHTML } from "./utils.js";
import { initModal } from "./modalModule.js";
import {
  initSaveHandlers,
  registerResources
} from "./storageModule.js";

let featuredTopics = [];
let youtubeVideos = [];
let githubRepos = [];

let currentTechnology = "All";
let currentSearch = "";

/* Featured Topics */

export async function loadFeaturedTopics() {
  try {
    const response = await fetch("/data/featuredTopics.json");

    if (!response.ok) {
      throw new Error("Unable to load featured topics.");
    }

    featuredTopics = await response.json();

    // Featured Topics remain static
    renderFeaturedTopics(featuredTopics);

  } catch (error) {
    console.error(error);

    const container = document.getElementById("featuredContainer");

    if (container) {
      container.innerHTML =
        `<p class="error-msg">Unable to load featured topics.</p>`;
    }
  }
}

/* Initial API Loading */

async function loadInitialData() {

  try {

    const [videos, repos] = await Promise.all([
      fetchYouTubeVideos(),
      fetchGitHubRepos()
    ]);

    youtubeVideos = videos;
    githubRepos = repos;

    registerResources([
      ...youtubeVideos,
      ...githubRepos
    ]);

    renderYouTube(youtubeVideos);
    renderGitHub(githubRepos);

  } catch (error) {

    console.error(error);

  }

}

/* Featured Topics Renderer */

function renderFeaturedTopics(topics) {

  const container =
    document.getElementById("featuredContainer");

  if (!container) return;

  container.innerHTML = topics.map(topic => `

    <article class="topic-card">

      <img
        src="${escapeHTML(topic.image)}"
        alt="${escapeHTML(topic.title)}"
        class="topic-card-img"
        loading="lazy">

      <div class="topic-card-body">

        <h3 class="topic-card-title">
          ${escapeHTML(topic.title)}
        </h3>

        <p class="topic-card-desc">
          ${escapeHTML(topic.description)}
        </p>

        <div class="repo-meta">

          ${topic.tags.map(tag => `
            <span class="tech-badge">
              ${escapeHTML(tag)}
            </span>
          `).join("")}

        </div>

      </div>

    </article>

  `).join("");

}

/* Render YouTube */

function renderYouTube(videos) {

  const container =
    document.getElementById("youtubeContainer");

  if (!container) return;

  container.innerHTML =
    videos.map(createYouTubeCard).join("");

}

/* Render GitHub */

function renderGitHub(repositories) {

  const container =
    document.getElementById("githubContainer");

  if (!container) return;

  container.innerHTML =
    repositories.map(createGitHubCard).join("");

}

/* Filter API Resources ONLY */

function filterResources() {

  let filteredVideos = [...youtubeVideos];
  let filteredRepos = [...githubRepos];

  /* Technology Filter */

  if (currentTechnology !== "All") {

    filteredVideos = filteredVideos.filter(video =>
      video.category === currentTechnology
    );

    filteredRepos = filteredRepos.filter(repo =>
      repo.category === currentTechnology
    );

  }

  /* Search Filter */

  if (currentSearch.trim()) {

    const search = currentSearch.toLowerCase();

    filteredVideos = filteredVideos.filter(video =>
      video.title.toLowerCase().includes(search) ||
      video.channelTitle.toLowerCase().includes(search) ||
      (video.topic || "").toLowerCase().includes(search)
    );

    filteredRepos = filteredRepos.filter(repo =>
      repo.name.toLowerCase().includes(search) ||
      repo.owner.toLowerCase().includes(search) ||
      (repo.topic || "").toLowerCase().includes(search) ||
      (repo.description || "").toLowerCase().includes(search)
    );

  }

  renderYouTube(filteredVideos);
  renderGitHub(filteredRepos);

}

/* Technology Buttons */

function initializeTechnologyFilters() {

  const buttons =
    document.querySelectorAll(".tech-filter-btn");

  buttons.forEach(button => {

    button.addEventListener("click", () => {

      currentTechnology =
        button.dataset.tech;

      buttons.forEach(btn =>
        btn.classList.remove("active")
      );

      button.classList.add("active");

      filterResources();

    });

  });

}

/* Search */

function initializeSearch() {

  const input =
    document.getElementById("searchInput");

  const button =
    document.getElementById("searchBtn");

  if (!input || !button) return;

  const search = () => {

    currentSearch =
      input.value.trim();

    filterResources();

  };

  button.addEventListener("click", search);

  input.addEventListener("keyup", (event) => {

    if (event.key === "Enter") {

      search();

    }

  });

  input.addEventListener("input", search);

}

/* Main Application */

document.addEventListener("DOMContentLoaded", async () => {

  const modalController = initModal();

  initSaveHandlers();

  initializeTechnologyFilters();

  initializeSearch();

  // Load static section
  await loadFeaturedTopics();

  // Load API resources
  await loadInitialData();

  document.addEventListener("click", (event) => {

    const watchButton =
      event.target.closest(".watch-btn");

    if (!watchButton) return;

    const videoId =
      watchButton.dataset.videoId;

    if (!videoId) return;

    modalController.openModal(videoId);

  });

});