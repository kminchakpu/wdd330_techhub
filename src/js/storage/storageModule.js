import { showToast } from "../ui/toast.js";

const STORAGE_KEY = "teachhub_saved_resources";

// In-memory lookup map for displayed items
const activeResources = new Map();

/* ======================================
   Register API Resources
====================================== */

export function registerResources(items = []) {
  items.forEach((item) => {
    if (item && item.id) {
      activeResources.set(String(item.id), item);
    }
  });
}

/* ======================================
   Local Storage
====================================== */

export function getSavedResources() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading Local Storage:", error);
    return [];
  }
}

export function isResourceSaved(id) {
  return getSavedResources().some(
    (item) => String(item.id) === String(id)
  );
}

/* ======================================
   Save / Remove Resource
====================================== */

export function toggleSaveResource(resource) {
  let saved = getSavedResources();

  const index = saved.findIndex(
    (item) => String(item.id) === String(resource.id)
  );

  let isSavedNow = false;

  if (index >= 0) {
    saved.splice(index, 1);
    isSavedNow = false;
  } else {
    saved.push(resource);
    isSavedNow = true;
  }

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(saved)
    );

    if (isSavedNow) {
      showToast(
        "✅ Resource added to your Watchlist",
        "success"
      );
    } else {
      showToast(
        "🗑️ Resource removed from your Watchlist",
        "info"
      );
    }
  } catch (error) {
    console.error("Error writing Local Storage:", error);

    showToast(
      "Unable to save your changes.",
      "error"
    );
  }

  return isSavedNow;
}

/* ======================================
   Counter
====================================== */

export function updateSavedCounter() {
  const countSpan =
    document.getElementById("savedCount");

  if (countSpan) {
    countSpan.textContent =
      getSavedResources().length;
  }
}

/* ======================================
   Save Button Events
====================================== */

export function initSaveHandlers() {
  updateSavedCounter();

  document.addEventListener("click", (event) => {

    const saveBtn =
      event.target.closest(".save-btn");

    if (!saveBtn) return;

    const resourceId =
      saveBtn.dataset.id;

    const resource =
      activeResources.get(String(resourceId));

    if (!resource) return;

    const isSaved =
      toggleSaveResource(resource);

    if (isSaved) {
      saveBtn.textContent = "★ Saved";
      saveBtn.classList.add("saved");
    } else {
      saveBtn.textContent = "+ Save";
      saveBtn.classList.remove("saved");
    }

    updateSavedCounter();
  });
}

export function clearSavedResources() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}