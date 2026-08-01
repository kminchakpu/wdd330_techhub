const GITHUB_BASE_URL = "https://api.github.com/search/repositories";

/**
 * Fetch GitHub repositories using ONE search request.
 */
export async function fetchGitHubRepos() {
  try {
    const query =
      "(html OR css OR javascript OR sql) in:name,description";

    const url =
      `${GITHUB_BASE_URL}?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=12`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json"
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API: ${response.status}`);
    }

    const data = await response.json();

    return data.items.map(repo => {
      let category = "JavaScript";
      const lang = (repo.language || "").toLowerCase();

      if (lang.includes("html")) category = "HTML";
      else if (lang.includes("css")) category = "CSS";
      else if (
        lang.includes("sql") ||
        repo.name.toLowerCase().includes("sql")
      ) {
        category = "SQL";
      }

      return {
        id: repo.id,
        owner: repo.owner.login,
        avatar: repo.owner.avatar_url,
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        category,
        topic: category,
        url: repo.html_url
      };
    });

  } catch (error) {

    console.error("GitHub Error:", error);

    return [];

  }
}