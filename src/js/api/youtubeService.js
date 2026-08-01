// Replace with your YouTube Data API Key
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

/**
 * Fetches YouTube videos using ONE API request.
 */
export async function fetchYouTubeVideos() {

  try {

    const query =
      "HTML CSS JavaScript SQL Web Development";

    const url = new URL(BASE_URL);

    url.searchParams.set("part", "snippet");
    url.searchParams.set("maxResults", "12");
    url.searchParams.set("type", "video");
    url.searchParams.set("q", query);
    url.searchParams.set("key", YOUTUBE_API_KEY);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`YouTube API ${response.status}`);
    }

    const data = await response.json();

    return data.items.map(video => {

      const title =
        video.snippet.title.toLowerCase();

      let category = "JavaScript";

      if (title.includes("html"))
        category = "HTML";

      else if (title.includes("css"))
        category = "CSS";

      else if (title.includes("sql"))
        category = "SQL";

      return {

        id: video.id.videoId,

        title: video.snippet.title,

        channelTitle: video.snippet.channelTitle,

        thumbnail:
          video.snippet.thumbnails.high?.url ||
          video.snippet.thumbnails.medium?.url,

        publishedAt:
          video.snippet.publishedAt,

        topic: category,

        category

      };

    });

  }

  catch (error) {

    console.error("YouTube Error:", error);

    return [];

  }

}