"use client";

import { SpotifyModal } from "../SpotifyModal";

interface SpotifyPlaylistToolProps {
  onClose: () => void;
}

export function SpotifyPlaylistTool({ onClose }: SpotifyPlaylistToolProps) {
  return <SpotifyModal onClose={onClose} />;
}
