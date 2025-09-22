"use client";

import { useState } from "react";
import Image from "next/image";
import { SpotifyPlaylistTool } from "./tools/SpotifyPlaylistTool";
import { AddTextTool } from "./tools/AddTextTool";
import { AddPictureTool } from "./tools/AddPictureTool";

export function Toolbox() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const handleToolClick = (toolType: string) => {
    setActiveTool(toolType);
  };

  return (
    <>
      {/* Toolbox */}
      <div
        className="toolbox"
        style={{
          position: "fixed",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "20px",
          zIndex: 1001,
          pointerEvents: "auto",
        }}
      >
        {/* Spotify Tool */}
        <div
          className="tool-item"
          onClick={() => handleToolClick("spotify")}
          style={{
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background: "linear-gradient(145deg, #f8f6f0, #e8e4d8)",
            border: "2px solid #d4c5a0",
            borderRadius: "15px",
            padding: "8px",
            boxShadow:
              "0 4px 8px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.8)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
            e.currentTarget.style.background =
              "linear-gradient(145deg, #e8e4d8, #d4c5a0)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.background =
              "linear-gradient(145deg, #f8f6f0, #e8e4d8)";
          }}
        >
          <Image
            src="/spotifyLogo.png"
            alt="Spotify"
            width={40}
            height={40}
            style={{
              borderRadius: "6px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
            }}
          />
        </div>

        {/* Add Text Tool */}
        <div className="tool-item" onClick={() => handleToolClick("text")}>
          <div
            className="tool-icon"
            style={{
              fontSize: "24px",
              marginBottom: "8px",
              transition: "transform 0.3s ease",
            }}
          >
            📝
          </div>
          <div
            className="tool-label"
            style={{
              fontSize: "8px",
              color: "#5a4a3a",
              fontWeight: "500",
              lineHeight: "1.2",
              textAlign: "center",
              maxWidth: "80px",
              wordBreak: "break-word",
            }}
          >
            Add Text
          </div>
        </div>

        {/* Add Picture Tool */}
        <div className="tool-item" onClick={() => handleToolClick("picture")}>
          <div
            className="tool-icon"
            style={{
              fontSize: "24px",
              marginBottom: "8px",
              transition: "transform 0.3s ease",
            }}
          >
            🖼️
          </div>
          <div
            className="tool-label"
            style={{
              fontSize: "8px",
              color: "#5a4a3a",
              fontWeight: "500",
              lineHeight: "1.2",
              textAlign: "center",
              maxWidth: "80px",
              wordBreak: "break-word",
            }}
          >
            Add Picture
          </div>
        </div>
      </div>

      {/* Tool Modals */}
      {activeTool === "spotify" && (
        <SpotifyPlaylistTool onClose={() => setActiveTool(null)} />
      )}
      {activeTool === "text" && (
        <AddTextTool onClose={() => setActiveTool(null)} />
      )}
      {activeTool === "picture" && (
        <AddPictureTool onClose={() => setActiveTool(null)} />
      )}
    </>
  );
}
