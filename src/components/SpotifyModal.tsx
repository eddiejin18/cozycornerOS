"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { getAccessToken, searchTracks, SpotifyTrack } from "../lib/spotify";

interface SpotifyModalProps {
  onClose: () => void;
}

export function SpotifyModal({ onClose }: SpotifyModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [albumArt, setAlbumArt] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize Spotify access token
  useEffect(() => {
    const initSpotify = async () => {
      try {
        const token = await getAccessToken();
        setAccessToken(token);
      } catch (error) {
        console.error("Failed to get Spotify access token:", error);
      }
    };
    initSpotify();
  }, []);

  // Timer for playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
  };

  // Search for tracks
  const handleSearch = async () => {
    if (!accessToken || !searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchTracks(searchQuery, accessToken);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Select a track
  const selectTrack = (track: SpotifyTrack) => {
    setCurrentTrack(track);
    setAlbumArt(track.album.images[0]?.url || null);
    setDuration(Math.floor(track.duration_ms / 1000));
    setCurrentTime(0);
    setIsPlaying(false);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-amber-300 rounded-2xl shadow-2xl z-[2001] w-[500px] h-[600px] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-b from-amber-400 to-orange-500 px-4 py-3 flex justify-between items-center border-b-2 border-amber-600 shadow-lg">
          <div className="text-amber-900 font-bold text-sm flex items-center gap-2">
            <span className="text-lg">🎵</span>
            <span>Cozy Corner Music</span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 border-2 border-red-600 rounded-full bg-red-200 text-red-700 text-xs flex items-center justify-center hover:bg-red-300 transition-colors shadow-sm"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-amber-50 to-orange-100 text-amber-900">
          {/* Spinning Record Section */}
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            {/* Spinning Vinyl Record */}
            <div className="relative mb-8">
              <div
                className={`w-48 h-48 rounded-full bg-gradient-to-br from-amber-800 to-orange-900 border-4 border-amber-600 shadow-2xl transition-transform duration-300 ${
                  isPlaying ? "animate-spin" : ""
                }`}
                style={{ animationDuration: "3s" }}
              >
                {/* Record grooves */}
                <div className="absolute inset-4 rounded-full border-2 border-amber-500"></div>
                <div className="absolute inset-8 rounded-full border border-amber-400"></div>
                <div className="absolute inset-12 rounded-full border border-amber-400"></div>
                <div className="absolute inset-16 rounded-full border border-amber-400"></div>
                <div className="absolute inset-20 rounded-full border border-amber-400"></div>

                {/* Spinning Disk in Center */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full border-2 border-amber-400 shadow-inner overflow-hidden">
                  {albumArt ? (
                    <Image
                      src={albumArt}
                      alt="Album Cover"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
                      <div className="text-amber-600 text-xs font-mono text-center">
                        <div className="text-2xl">🎵</div>
                        <div className="mt-1 text-xs">Album Art</div>
                      </div>
                    </div>
                  )}

                  {/* Center hole */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-amber-800 rounded-full border border-amber-600 z-10"></div>
                </div>
              </div>

              {/* Play/Pause indicator */}
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg border-2 border-amber-700">
                {isPlaying ? (
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-amber-100 rounded"></div>
                    <div className="w-1 h-4 bg-amber-100 rounded"></div>
                  </div>
                ) : (
                  <div className="w-0 h-0 border-l-[8px] border-l-amber-100 border-y-[6px] border-y-transparent ml-1"></div>
                )}
              </div>
            </div>

            {/* Search Section */}
            <div className="text-center w-full max-w-sm">
              <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center justify-center gap-2">
                <span className="text-2xl">🔍</span>
                <span>Search Music</span>
              </h3>

              {/* Search Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for songs..."
                  className="flex-1 px-4 py-3 bg-amber-100 text-amber-900 rounded-xl border-2 border-amber-300 focus:border-amber-500 focus:outline-none text-sm shadow-inner placeholder-amber-500"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  disabled={!accessToken || isSearching}
                  className="px-6 py-3 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:bg-amber-300 disabled:cursor-not-allowed text-amber-100 text-sm rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  {isSearching ? "🔍" : "Search"}
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {searchResults.map((track) => (
                    <div
                      key={track.id}
                      onClick={() => selectTrack(track)}
                      className="flex items-center p-3 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 rounded-xl cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg border border-amber-200"
                    >
                      <Image
                        src={
                          track.album.images[2]?.url ||
                          track.album.images[0]?.url ||
                          "/placeholder-album.png"
                        }
                        alt={track.album.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover mr-3 shadow-sm"
                      />
                      <div className="flex-1 text-left">
                        <div className="text-amber-900 text-sm font-medium truncate">
                          {track.name}
                        </div>
                        <div className="text-amber-600 text-xs truncate">
                          {track.artists.map((a) => a.name).join(", ")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Now Playing Section */}
          <div className="bg-gradient-to-r from-amber-200 to-orange-200 border-t-2 border-amber-400 p-4 shadow-lg">
            {/* Song Info */}
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-300 to-orange-400 rounded-xl mr-4 flex items-center justify-center overflow-hidden shadow-lg border-2 border-amber-500">
                {albumArt ? (
                  <Image
                    src={albumArt}
                    alt="Album Cover"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-amber-600 text-lg">🎵</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="text-amber-900 font-bold text-sm">
                  {currentTrack ? currentTrack.name : "No song selected"}
                </div>
                <div className="text-amber-700 text-xs">
                  {currentTrack
                    ? currentTrack.artists.map((a) => a.name).join(", ")
                    : "Add a song to start playing"}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-amber-700 mb-2 font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-amber-300 rounded-full appearance-none cursor-pointer slider shadow-inner"
                style={{
                  background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${(currentTime / duration) * 100}%, #fbbf24 ${(currentTime / duration) * 100}%, #fbbf24 100%)`,
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <button className="w-10 h-10 text-amber-700 hover:text-amber-900 transition-colors bg-amber-100 hover:bg-amber-200 rounded-full flex items-center justify-center shadow-md">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </button>

              <button
                onClick={handlePlayPause}
                className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-xl hover:shadow-2xl border-2 border-amber-700"
              >
                {isPlaying ? (
                  <div className="flex gap-1">
                    <div className="w-2 h-6 bg-amber-100 rounded"></div>
                    <div className="w-2 h-6 bg-amber-100 rounded"></div>
                  </div>
                ) : (
                  <div className="w-0 h-0 border-l-[10px] border-l-amber-100 border-y-[8px] border-y-transparent ml-1"></div>
                )}
              </button>

              <button className="w-10 h-10 text-amber-700 hover:text-amber-900 transition-colors bg-amber-100 hover:bg-amber-200 rounded-full flex items-center justify-center shadow-md">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
