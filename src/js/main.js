import { fetchYouTubeVideos } from "./api/youtubeService.js";
import { fetchGitHubRepos } from "./api/githubService.js";
import { createYouTubeCard, createGitHubCard} from "./render/uiRenderer.js";
import { escapeHTML } from "./utils/utils.js";
import { initModal } from "./modal/modalModule.js";
import { initSaveHandlers, registerResources} from "./storage/storageModule.js";
import { protectPage, getCurrentUser, logoutUser} from "./auth/auth.js";
import { initToast, showToast} from "./ui/toast.js";

/* ==========================================
   Global State
========================================== */

let featuredTopics = [];

let youtubeVideos = [];
let githubRepos = [];

let currentTechnology = "All";
let currentSearch = "";

const ITEMS_PER_LOAD = 4;

let visibleVideos = ITEMS_PER_LOAD;
let visibleRepos = ITEMS_PER_LOAD;

/* ==========================================
   Featured Topics
========================================== */

export async function loadFeaturedTopics() {

  try {

    const response = await fetch(
      "/data/featuredTopics.json"
    );

    if (!response.ok) {
      throw new Error(
        "Unable to load featured topics."
      );
    }

    featuredTopics = await response.json();

    renderFeaturedTopics(featuredTopics);

  }

  catch (error) {

    console.error(error);

    const container =
      document.getElementById(
        "featuredContainer"
      );

    if (container) {

      container.innerHTML = `
        <p class="error-msg">
          Unable to load featured topics.
        </p>
      `;

    }

  }

}

/* ==========================================
   Skeleton Loader
========================================== */

function createSkeletonCards(count = 4) {

  return Array.from(
    { length: count },
    () => `
      <article class="resource-card skeleton-card">

        <div class="skeleton skeleton-image"></div>

        <div class="card-content">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
          <div class="skeleton skeleton-button"></div>
        </div>

      </article>
    `
  ).join("");

}

/* ==========================================
   Initial API Load
========================================== */

async function loadInitialData() {

  try {

    document.getElementById(
      "youtubeContainer"
    ).innerHTML = createSkeletonCards();

    document.getElementById(
      "githubContainer"
    ).innerHTML = createSkeletonCards();

    const [videos, repos] =
      await Promise.all([
        fetchYouTubeVideos(),
        fetchGitHubRepos()
      ]);

    youtubeVideos = videos;
    githubRepos = repos;

    registerResources([
      ...youtubeVideos,
      ...githubRepos
    ]);

    renderAll();

  }

  catch (error) {

    console.error(error);

    showToast(
      "Unable to load resources.",
      "error"
    );

  }

}

/* ==========================================
   Featured Topics Renderer
========================================== */

function renderFeaturedTopics(topics) {

  const container =
    document.getElementById("featuredContainer");

  if (!container) return;

  container.innerHTML = topics
    .map(topic => `

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

    `)
    .join("");

}

/* ==========================================
   Filtering Helpers
========================================== */

function getFilteredVideos() {

  let videos = [...youtubeVideos];

  if (currentTechnology !== "All") {

    videos = videos.filter(video =>
      video.category === currentTechnology
    );

  }

  if (currentSearch.trim()) {

    const search =
      currentSearch.toLowerCase();

    videos = videos.filter(video =>

      video.title
        .toLowerCase()
        .includes(search)

      ||

      video.channelTitle
        .toLowerCase()
        .includes(search)

      ||

      (video.topic || "")
        .toLowerCase()
        .includes(search)

    );

  }

  return videos;

}

function getFilteredRepos() {

  let repos = [...githubRepos];

  if (currentTechnology !== "All") {

    repos = repos.filter(repo =>
      repo.category === currentTechnology
    );

  }

  if (currentSearch.trim()) {

    const search =
      currentSearch.toLowerCase();

    repos = repos.filter(repo =>

      repo.name
        .toLowerCase()
        .includes(search)

      ||

      repo.owner
        .toLowerCase()
        .includes(search)

      ||

      (repo.description || "")
        .toLowerCase()
        .includes(search)

      ||

      (repo.topic || "")
        .toLowerCase()
        .includes(search)

    );

  }

  return repos;

}

/* ==========================================
   Render YouTube
========================================== */

function renderYouTube(videos) {

  const container =
    document.getElementById("youtubeContainer");

  const loadMoreBtn =
    document.getElementById("youtubeLoadMore");

  if (!container) return;

  container.innerHTML = videos
    .slice(0, visibleVideos)
    .map(createYouTubeCard)
    .join("");

  if (!loadMoreBtn) return;

  if (videos.length <= ITEMS_PER_LOAD) {

    loadMoreBtn.style.display = "none";
    return;

  }

  loadMoreBtn.style.display = "inline-flex";

  loadMoreBtn.textContent =

    visibleVideos >= videos.length

      ? "Show Less"

      : "Load More Tutorials";

}

/* ==========================================
   Render GitHub
========================================== */

function renderGitHub(repos) {

  const container =
    document.getElementById("githubContainer");

  const loadMoreBtn =
    document.getElementById("githubLoadMore");

  if (!container) return;

  container.innerHTML = repos
    .slice(0, visibleRepos)
    .map(createGitHubCard)
    .join("");

  if (!loadMoreBtn) return;

  if (repos.length <= ITEMS_PER_LOAD) {

    loadMoreBtn.style.display = "none";
    return;

  }

  loadMoreBtn.style.display = "inline-flex";

  loadMoreBtn.textContent =

    visibleRepos >= repos.length

      ? "Show Less"

      : "Load More Repositories";

}

/* ==========================================
   Render Everything
========================================== */

function renderAll() {

  renderYouTube(
    getFilteredVideos()
  );

  renderGitHub(
    getFilteredRepos()
  );

}

/* ==========================================
   Filter Resources
========================================== */

function filterResources() {

  visibleVideos = ITEMS_PER_LOAD;
  visibleRepos = ITEMS_PER_LOAD;

  renderAll();

}

/* ==========================================
   Technology Filters
========================================== */

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

/* ==========================================
   Search
========================================== */

function initializeSearch() {

  const input =
    document.getElementById("searchInput");

  const button =
    document.getElementById("searchBtn");

  if (!input || !button) return;

  function search() {

    currentSearch =
      input.value.trim();

    filterResources();

  }

  button.addEventListener(
    "click",
    search
  );

  input.addEventListener(
    "input",
    search
  );

  input.addEventListener(
    "keyup",
    event => {

      if (event.key === "Enter") {

        search();

      }

    }
  );

}

/* ==========================================
   Load More Buttons
========================================== */

function initializeLoadMore() {

  const youtubeButton =
    document.getElementById(
      "youtubeLoadMore"
    );

  const githubButton =
    document.getElementById(
      "githubLoadMore"
    );

  if (youtubeButton) {

    youtubeButton.addEventListener(
      "click",
      () => {

        const total =
          getFilteredVideos().length;

        if (visibleVideos >= total) {

          visibleVideos =
            ITEMS_PER_LOAD;

        }

        else {

          visibleVideos +=
            ITEMS_PER_LOAD;

        }

        renderYouTube(
          getFilteredVideos()
        );

      }
    );

  }

  if (githubButton) {

    githubButton.addEventListener(
      "click",
      () => {

        const total =
          getFilteredRepos().length;

        if (visibleRepos >= total) {

          visibleRepos =
            ITEMS_PER_LOAD;

        }

        else {

          visibleRepos +=
            ITEMS_PER_LOAD;

        }

        renderGitHub(
          getFilteredRepos()
        );

      }
    );

  }

}

/* ==========================================
   Logout
========================================== */

function initializeLogout() {
  const authBtn = document.getElementById("logoutBtn");

  if (!authBtn) return;

  const user = getCurrentUser();

  // User is NOT logged in
  if (!user) {
    authBtn.textContent = "Login";

    authBtn.onclick = () => {
      window.location.href = "auth.html";
    };

    return;
  }

  // User IS logged in
  authBtn.textContent = "Logout";

  authBtn.onclick = () => {
    logoutUser();

    showToast("Logged out successfully.", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 700);
  };
}


/* ==========================================
   Main
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

  /* Initialize UI */

  initToast();

  const modalController =
    initModal();

  initSaveHandlers();
  initializeTechnologyFilters();
  initializeSearch();
  initializeLoadMore();
  initializeLogout();

  /* Welcome User */
  const user =
    getCurrentUser();
  const welcomeUser =
    document.getElementById("welcomeUser");
  if (welcomeUser && user) {
    welcomeUser.textContent =
      `👋 Welcome, ${user.name}`;

  }

  /* Featured Topics */
  await loadFeaturedTopics();
  /* Load API Resources */
  await loadInitialData();

  /* ======================================
     Watch YouTube Video
  ====================================== */

  document.addEventListener("click", event => {
    const watchBtn =
      event.target.closest(".watch-btn");
    if (!watchBtn) return;
    const user =
      getCurrentUser();

    if (!user) {

      showToast(
        "Please sign in to watch videos.",
        "warning"
      );

      setTimeout(() => {

        window.location.href =
          "/auth";

      }, 800);

      return;

    }

    modalController.openModal(
      watchBtn.dataset.videoId
    );

  });

  /* ======================================
     Open GitHub Repository
  ====================================== */

  document.addEventListener("click", event => {

    const repoBtn =
      event.target.closest(".btn-github");

    if (!repoBtn) return;

    event.preventDefault();

    const user =
      getCurrentUser();

    if (!user) {

      showToast(
        "Please sign in to access GitHub repositories.",
        "warning"
      );

      setTimeout(() => {

        window.location.href =
          "/auth";

      }, 800);

      return;

    }

    const url =
      repoBtn.dataset.url;

    if (url) {

      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

    }

  });

});