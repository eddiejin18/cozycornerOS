// Spotify API integration

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; width: number; height: number }>;
  };
  duration_ms: number;
  preview_url: string | null;
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

// Get access token using Client Credentials flow
export async function getAccessToken(): Promise<string> {
  const response = await fetch("/api/spotify/token", {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to get access token");
  }

  const data = await response.json();
  return data.access_token;
}

// Search for tracks
export async function searchTracks(
  query: string,
  accessToken: string
): Promise<SpotifyTrack[]> {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to search tracks");
  }

  const data: SpotifySearchResponse = await response.json();
  return data.tracks.items;
}
