const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const CACHE_KEY = "teachhub_youtube_cache";
const CACHE_DURATION = 1000 * 60 * 60; 

let pendingRequest = null;

/**
 * Fetch YouTube videos
 */
export async function fetchYouTubeVideos() {

  // API key check
  if (!API_KEY) {
    console.error("Missing YouTube API Key.");
    return [];
  }

  // -----------------------------
  // Check cache first
  // -----------------------------
  const cached = sessionStorage.getItem(CACHE_KEY);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);

      if (
        parsed.timestamp &&
        Date.now() - parsed.timestamp < CACHE_DURATION
      ) {
        console.log("Loaded YouTube videos from cache.");

        return parsed.videos;
      }

    } catch (error) {
      console.warn("Invalid YouTube cache.", error);
    }
  }

  // -----------------------------
  // Prevent duplicate requests
  // -----------------------------
  if (pendingRequest) {
    return pendingRequest;
  }

  pendingRequest = (async () => {

    try {

      const query =
        "HTML CSS JavaScript SQL tutorial";

      const url = new URL(BASE_URL);

      url.searchParams.set("part", "snippet");
      url.searchParams.set("maxResults", "12");
      url.searchParams.set("type", "video");
      url.searchParams.set("order", "relevance");
      url.searchParams.set("q", query);
      url.searchParams.set("key", API_KEY);

      // Request only required fields
      url.searchParams.set(
        "fields",
        "items(id/videoId,snippet(title,channelTitle,publishedAt,thumbnails(high(url),medium(url))))"
      );

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`YouTube API ${response.status}`);
      }

      const data = await response.json();

      const videos = data.items.map(video => {

        const title =
          video.snippet.title.toLowerCase();

        let category = "JavaScript";

        if (title.includes("html")) {
          category = "HTML";
        }

        else if (title.includes("css")) {
          category = "CSS";
        }

        else if (title.includes("sql")) {
          category = "SQL";
        }

        return {

          id: video.id.videoId,

          title: video.snippet.title,

          channelTitle:
            video.snippet.channelTitle,

          thumbnail:
            video.snippet.thumbnails.high?.url ||
            video.snippet.thumbnails.medium?.url,

          publishedAt:
            video.snippet.publishedAt,

          topic: category,

          category

        };

      });

      // -----------------------------
      // Save cache
      // -----------------------------
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          videos
        })
      );

      console.log("YouTube videos fetched from API.");

      return videos;

    } catch (error) {

      console.error("YouTube Error:", error);

      // -----------------------------
      // Fallback to cache
      // -----------------------------
      const cached = sessionStorage.getItem(CACHE_KEY);

      if (cached) {

        try {

          const parsed = JSON.parse(cached);

          console.log(
            "Using cached YouTube videos after API failure."
          );

          return parsed.videos;

        } catch {

          return [];

        }

      }

      return [];

    } finally {

      pendingRequest = null;

    }

  })();

  return pendingRequest;
}