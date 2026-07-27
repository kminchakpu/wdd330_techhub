const GITHUB_BASE_URL = 'https://api.github.com/search/repositories';

/**
 * Fetches GitHub repositories matching a query and optional language filter
 * @param {string} query - Topic or term (e.g., "react")
 * @param {string} language - Specific programming language filter
 * @param {number} perPage - Number of results
 * @returns {Promise<Array>} Array of repository objects
 */
export async function fetchGitHubRepos(query = 'javascript', language = 'all', perPage = 6) {
  try {
    let searchQuery = query;
    if (language && language !== 'all') {
      searchQuery += `+language:${language}`;
    }

    const url = `${GITHUB_BASE_URL}?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=${perPage}`;

    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Map raw API objects into clean application models
    return data.items.map((repo) => ({
      id: repo.id,
      name: repo.name,
      owner: repo.owner.login,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      url: repo.html_url
    }));
  } catch (error) {
    console.error('Failed to fetch GitHub repositories:', error);
    return [];
  }
}