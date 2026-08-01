const STORAGE_KEY = 'teachhub_saved_resources';

// In-memory lookup map for displayed items
const activeResources = new Map();

/**
 * Registers API items into memory so they can be retrieved when clicked
 */
export function registerResources(items = []) {
  items.forEach((item) => {
    if (item && item.id) {
      activeResources.set(String(item.id), item);
    }
  });
}

/**
 * Retrieves all saved items from Local Storage
 * @returns {Array} Array of saved resource objects
 */
export function getSavedResources() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from Local Storage:', error);
    return [];
  }
}

/**
 * Checks if an item is already saved by its ID
 */
export function isResourceSaved(id) {
  const saved = getSavedResources();
  return saved.some((item) => String(item.id) === String(id));
}

/**
 * Toggles saving/removing a resource in Local Storage
 */
export function toggleSaveResource(resource) {
  let saved = getSavedResources();
  const index = saved.findIndex((item) => String(item.id) === String(resource.id));

  let isSavedNow = false;

  if (index >= 0) {
    saved.splice(index, 1);
    isSavedNow = false;
  } else {
    saved.push(resource);
    isSavedNow = true;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch (error) {
    console.error('Error writing to Local Storage:', error);
  }

  return isSavedNow;
}

/**
 * Updates the badge counter in the header
 */
export function updateSavedCounter() {
  const countSpan = document.getElementById('savedCount');
  if (countSpan) {
    const saved = getSavedResources();
    countSpan.textContent = saved.length;
  }
}

/**
 * Initializes Save button event delegation
 */
export function initSaveHandlers() {
  updateSavedCounter();

  document.addEventListener('click', (e) => {
    const saveBtn = e.target.closest('.save-btn');
    if (!saveBtn) return;

    const resourceId = saveBtn.getAttribute('data-id');
    const resourceData = activeResources.get(String(resourceId));

    if (resourceData) {
      const isSaved = toggleSaveResource(resourceData);

      if (isSaved) {
        saveBtn.textContent = '★ Saved';
        saveBtn.classList.add('saved');
      } else {
        saveBtn.textContent = '+ Save';
        saveBtn.classList.remove('saved');
      }

      updateSavedCounter();
    }
  });
}