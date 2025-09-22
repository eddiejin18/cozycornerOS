"use client";

import { RetroSpotifyPlayer } from "../RetroSpotifyPlayer";

interface SpotifyPlaylistToolProps {
  onClose: () => void;
}

export function SpotifyPlaylistTool({ onClose }: SpotifyPlaylistToolProps) {
  return <RetroSpotifyPlayer onClose={onClose} />;
}
