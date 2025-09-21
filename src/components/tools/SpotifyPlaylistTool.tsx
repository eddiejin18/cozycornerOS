"use client";

import { useState, useRef, useEffect } from "react";

interface SpotifyPlaylistToolProps {
  onClose: () => void;
}

export function SpotifyPlaylistTool({ onClose }: SpotifyPlaylistToolProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [modalStart, setModalStart] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && modalRef.current) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        modalRef.current.style.left = `${modalStart.x + deltaX}px`;
        modalRef.current.style.top = `${modalStart.y + deltaY}px`;
        modalRef.current.style.transform = "none";
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, modalStart]);

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setModalStart({
        x: parseInt(modalRef.current.style.left) || 0,
        y: parseInt(modalRef.current.style.top) || 0,
      });
      modalRef.current.style.zIndex = "2001";
    }
  };

  const handleMaximize = () => {
    if (modalRef.current) {
      if (isMaximized) {
        // Restore
        modalRef.current.style.width = "";
        modalRef.current.style.height = "";
        modalRef.current.style.left = "";
        modalRef.current.style.top = "";
        modalRef.current.style.transform = "translate(-50%, -50%)";
        setIsMaximized(false);
      } else {
        // Maximize
        modalRef.current.style.width = "100vw";
        modalRef.current.style.height = "100vh";
        modalRef.current.style.left = "0";
        modalRef.current.style.top = "0";
        modalRef.current.style.transform = "none";
        setIsMaximized(true);
      }
    }
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
        className="relative bg-gradient-to-b from-gray-50 to-gray-100 border-2 border-green-500 rounded-xl shadow-2xl z-[2001] min-w-[400px] max-w-[600px] min-h-[300px] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Header */}
        <div
          className="bg-gradient-to-b from-green-500 to-green-400 px-4 py-3 flex justify-between items-center cursor-move border-b border-green-600"
          onMouseDown={handleHeaderMouseDown}
        >
          <div className="text-white font-bold text-sm drop-shadow-sm">
            🎵 Create Spotify Playlist
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => (modalRef.current!.style.display = "none")}
              className="w-5 h-5 border border-white/30 rounded bg-white/20 text-white text-xs flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              −
            </button>
            <button
              onClick={handleMaximize}
              className="w-5 h-5 border border-white/30 rounded bg-white/20 text-white text-xs flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              □
            </button>
            <button
              onClick={onClose}
              className="w-5 h-5 border border-white/30 rounded bg-white/20 text-white text-xs flex items-center justify-center hover:bg-red-500 hover:border-red-400 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col items-center text-center">
          <div className="mb-4">
            <img
              src="/spotifyLogo.png"
              alt="Spotify"
              className="w-16 h-16 rounded-lg shadow-lg"
            />
          </div>

          <h3 className="text-lg text-gray-800 mb-3 font-mono">
            Create Spotify Playlist
          </h3>

          <p className="text-sm text-gray-600 mb-2 leading-relaxed">
            This tool will allow you to create and manage Spotify playlists.
          </p>

          <p className="text-sm text-gray-500 italic mb-6">
            Functionality coming soon!
          </p>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gradient-to-b from-green-500 to-green-400 text-white text-xs font-mono rounded-md hover:from-green-400 hover:to-green-500 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
              Create Playlist
            </button>
            <button className="px-4 py-2 bg-white/80 text-gray-700 text-xs font-mono rounded-md border border-gray-200 hover:bg-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
              Browse Playlists
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
