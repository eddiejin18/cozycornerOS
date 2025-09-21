"use client";

export function WelcomeMessage() {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <div
        style={{
          fontSize: "16px",
          color: "white",
          filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5))",
          marginBottom: "20px",
          fontFamily: "Press Start 2P, monospace",
        }}
      >
        🌸 Welcome to CozyCorner OS 🌸
      </div>
      <div
        style={{
          fontSize: "12px",
          opacity: "0.8",
          color: "white",
          filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5))",
          marginBottom: "4px",
          fontFamily: "Press Start 2P, monospace",
        }}
      >
        Double-click icons to open apps
      </div>
      <div
        style={{
          fontSize: "12px",
          opacity: "0.8",
          color: "white",
          filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5))",
          fontFamily: "Press Start 2P, monospace",
        }}
      >
        Drag to explore the infinite canvas
      </div>
    </div>
  );
}
