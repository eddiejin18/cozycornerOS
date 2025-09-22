"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { getAccessToken, searchTracks, SpotifyTrack } from "../lib/spotify";

interface RetroSpotifyPlayerProps {
  onClose: () => void;
}

export function RetroSpotifyPlayer({ onClose }: RetroSpotifyPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [albumArt, setAlbumArt] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    },
    [isDragging, dragOffset]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, handleMouseMove]);

  return (
    <>
      {/* Main Player Modal */}
      <div
        ref={modalRef}
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          width: "500px",
          height: "200px",
          background: "linear-gradient(145deg, #f8f6f0, #e8e4d8)",
          borderRadius: "20px",
          border: "3px solid #d4c5a0",
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.8)",
          zIndex: 2000,
          fontFamily: "'Orbitron', 'Courier New', monospace",
          color: "#5a4a3a",
          display: "flex",
          alignItems: "center",
          padding: "20px",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Title Bar */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "25px",
            background: "linear-gradient(90deg, #d4c5a0, #c4b590)",
            borderRadius: "17px 17px 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px",
            borderBottom: "2px solid #b8a680",
          }}
        >
          <div
            style={{ color: "#5a4a3a", fontSize: "12px", fontWeight: "bold" }}
          >
            🎵 Retro Music Player
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#ff6b6b",
              border: "none",
              borderRadius: "50%",
              width: "18px",
              height: "18px",
              color: "white",
              fontSize: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        {/* Content Area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            width: "100%",
            marginTop: "10px",
          }}
        >
          {/* Spinning Vinyl Record */}
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background:
                "linear-gradient(45deg, #2a2a2a 0%, #1a1a1a 50%, #2a2a2a 100%)",
              border: "4px solid #4a4a4a",
              boxShadow:
                "0 0 15px rgba(0,0,0,0.6), inset 0 0 10px rgba(0,0,0,0.4)",
              position: "relative",
              animation: isPlaying ? "spin 3s linear infinite" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.2s ease",
              flexShrink: 0,
            }}
            onClick={() => setShowSearch(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {/* Record grooves */}
            <div
              style={{
                position: "absolute",
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                border: "1px solid #555",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                border: "1px solid #666",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                border: "1px solid #666",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Center album art */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "3px solid #333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
                background: "linear-gradient(45deg, #4a4a4a, #666)",
              }}
            >
              {albumArt ? (
                <Image
                  src={albumArt}
                  alt="Album Cover"
                  width={80}
                  height={80}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    color: "#999",
                    fontSize: "12px",
                    textAlign: "center",
                    zIndex: 1,
                  }}
                >
                  Empty Song
                </div>
              )}
              {/* Center hole */}
              <div
                style={{
                  position: "absolute",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#1a1a1a",
                  border: "2px solid #333",
                  zIndex: 2,
                }}
              />
            </div>
          </div>

          {/* Song Info and Controls */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              minWidth: 0,
            }}
          >
            {/* Song Info */}
            <div style={{ textAlign: "left" }}>
              <h2
                style={{
                  fontSize: "16px",
                  margin: "0 0 5px 0",
                  color: "#5a4a3a",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                  fontFamily: "'Orbitron', 'Courier New', monospace",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentTrack ? currentTrack.name : "No song selected"}
              </h2>
              <p
                style={{
                  fontSize: "12px",
                  margin: "0",
                  color: "#8a7a6a",
                  fontFamily: "'Orbitron', 'Courier New', monospace",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentTrack
                  ? currentTrack.artists.map((a) => a.name).join(", ")
                  : "Click vinyl to search"}
              </p>
            </div>

            {/* Progress Bar */}
            <div style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                  fontSize: "10px",
                  color: "#8a7a6a",
                  fontFamily: "'Orbitron', 'Courier New', monospace",
                }}
              >
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                style={{
                  width: "100%",
                  height: "4px",
                  background:
                    "linear-gradient(to right, #d4a574 0%, #d4a574 50%, #e8e4d8 50%, #e8e4d8 100%)",
                  outline: "none",
                  borderRadius: "2px",
                  cursor: "pointer",
                  WebkitAppearance: "none",
                  appearance: "none",
                }}
              />
            </div>

            {/* Controls */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <button
                onClick={handlePlayPause}
                style={{
                  background: isPlaying ? "#ff6b6b" : "#d4a574",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  transition: "all 0.2s ease",
                }}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>

              <button
                onClick={() => setCurrentTime(0)}
                style={{
                  background: "#d4c5a0",
                  border: "2px solid #b8a680",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  color: "#5a4a3a",
                  cursor: "pointer",
                  fontSize: "10px",
                  fontFamily: "'Orbitron', 'Courier New', monospace",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>

      {/* Search Modal */}
      {showSearch && (
        <SearchModal
          onClose={() => setShowSearch(false)}
          onSelectTrack={(track) => {
            setCurrentTrack(track);
            // Fix album cover extraction - use the first available image
            const albumImage =
              track.album.images.find((img) => img.url)?.url || null;
            setAlbumArt(albumImage);
            setDuration(Math.floor(track.duration_ms / 1000));
            setCurrentTime(0);
            setIsPlaying(false);
            setShowSearch(false);
          }}
          accessToken={accessToken}
        />
      )}
    </>
  );
}

// Search Modal Component
function SearchModal({
  onClose,
  onSelectTrack,
  accessToken,
}: {
  onClose: () => void;
  onSelectTrack: (track: SpotifyTrack) => void;
  accessToken: string | null;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [position, setPosition] = useState({ x: 200, y: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    },
    [isDragging, dragOffset]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, handleMouseMove]);

  return (
    <div
      ref={modalRef}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        width: "350px",
        height: "400px",
        background: "linear-gradient(145deg, #f8f6f0, #e8e4d8)",
        borderRadius: "15px",
        border: "3px solid #d4c5a0",
        boxShadow:
          "0 15px 30px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.8)",
        zIndex: 2001,
        fontFamily: "'Orbitron', 'Courier New', monospace",
        color: "#5a4a3a",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Title Bar */}
      <div
        style={{
          width: "100%",
          height: "25px",
          background: "linear-gradient(90deg, #d4c5a0, #c4b590)",
          borderRadius: "10px 10px 0 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          marginBottom: "15px",
          borderBottom: "2px solid #b8a680",
        }}
      >
        <div style={{ color: "#5a4a3a", fontSize: "12px", fontWeight: "bold" }}>
          🔍 Search Music
        </div>
        <button
          onClick={onClose}
          style={{
            background: "#ff6b6b",
            border: "none",
            borderRadius: "50%",
            width: "18px",
            height: "18px",
            color: "white",
            fontSize: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for songs..."
          style={{
            width: "100%",
            padding: "10px",
            background: "#f8f6f0",
            border: "2px solid #d4c5a0",
            borderRadius: "8px",
            color: "#5a4a3a",
            fontSize: "12px",
            fontFamily: "'Orbitron', 'Courier New', monospace",
            outline: "none",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
          }}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={!accessToken || isSearching}
          style={{
            marginTop: "8px",
            width: "100%",
            padding: "8px",
            background: "#d4a574",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
            fontSize: "12px",
            fontFamily: "'Orbitron', 'Courier New', monospace",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {isSearching ? "Searching..." : "🔍 Search"}
        </button>
      </div>

      {/* Search Results */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {searchResults.map((track) => (
          <div
            key={track.id}
            onClick={() => onSelectTrack(track)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px",
              background: "#f8f6f0",
              margin: "5px 0",
              borderRadius: "6px",
              cursor: "pointer",
              border: "1px solid #d4c5a0",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e8e4d8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f8f6f0";
            }}
          >
            <Image
              src={
                track.album.images[2]?.url ||
                track.album.images[0]?.url ||
                "/placeholder.png"
              }
              alt={track.album.name}
              width={30}
              height={30}
              style={{ borderRadius: "4px", marginRight: "10px" }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: "#5a4a3a",
                  fontSize: "11px",
                  fontWeight: "bold",
                  fontFamily: "'Orbitron', 'Courier New', monospace",
                }}
              >
                {track.name}
              </div>
              <div
                style={{
                  color: "#8a7a6a",
                  fontSize: "10px",
                  fontFamily: "'Orbitron', 'Courier New', monospace",
                }}
              >
                {track.artists.map((a) => a.name).join(", ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
