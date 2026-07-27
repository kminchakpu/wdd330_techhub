// Replace with your actual YouTube Data API Key
const YOUTUBE_API_KEY = 'AIzaSyAo7t-vAXuricFUNjrfsx7HPnUdxAq3FiI';
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

/**
 * Fetches YouTube videos based on a search query
 * @param {string} query - Keyword to search (e.g. "JavaScript tutorial")
 * @param {number} maxResults - Number of results to fetch
 * @returns {Promise<Array>} Array of video objects
 */
export async function fetchYouTubeVideos(query = 'web development', maxResults = 6) {
  try {
    const url = new URL(BASE_URL);
    url.searchParams.append('part', 'snippet');
    url.searchParams.append('q', query);
    url.searchParams.append('type', 'video');
    url.searchParams.append('maxResults', maxResults.toString());
    url.searchParams.append('key', YOUTUBE_API_KEY);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Map raw API objects into clean application models
    return data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt
    }));
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error);
    return [];
  }
}