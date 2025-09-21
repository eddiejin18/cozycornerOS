"use client";

import { useState } from "react";
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
          background: "rgba(255, 255, 255, 0.95)",
          padding: "20px 30px",
          borderRadius: "25px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          zIndex: 1001,
          pointerEvents: "auto",
        }}
      >
        {/* Spotify Tool */}
        <div
          className="spotify-tool"
          style={{
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background: "none",
            border: "none",
            padding: "0",
            minWidth: "auto",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-10px) translateX(-4px) rotate(-10deg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0) translateX(0) rotate(0deg)";
          }}
          onClick={() => handleToolClick("spotify")}
        >
          <img
            src="/spotifyLogo.png"
            alt="Spotify"
            className="spotify-logo-tool"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
            }}
          />
        </div>

        {/* Add Text Tool */}
        <div
          className="tool-item"
          style={{
            width: "50px",
            height: "50px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: "15px 20px",
            borderRadius: "15px",
            background: "rgba(255, 255, 255, 0.8)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            minWidth: "80px",
            textAlign: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-10px)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 1)";
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.15)";
            e.currentTarget.style.borderColor = "rgba(104, 211, 145, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.1)";
          }}
          onClick={() => handleToolClick("text")}
        >
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
              color: "#4a5568",
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
        <div
          className="tool-item"
          style={{
            width: "50px",
            height: "50px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: "15px 20px",
            borderRadius: "15px",
            background: "rgba(255, 255, 255, 0.8)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            minWidth: "80px",
            textAlign: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-10px)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 1)";
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.15)";
            e.currentTarget.style.borderColor = "rgba(104, 211, 145, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.1)";
          }}
          onClick={() => handleToolClick("picture")}
        >
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
              color: "#4a5568",
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
