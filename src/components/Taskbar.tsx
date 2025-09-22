"use client";

export function Taskbar() {
  return (
    <div
      className="taskbar"
      style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        right: "0",
        height: "60px",
        background: "linear-gradient(to top, #4a5568 0%, #718096 100%)",
        borderTop: "2px solid #d4c5a0",
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
        zIndex: 1000,
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div
        className="start-button"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
          background: "linear-gradient(to bottom, #d4a574 0%, #c4a574 100%)",
          border: "2px solid #b8a680",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          marginRight: "10px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(to bottom, #e8e4d8 0%, #d4a574 100%)";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(to bottom, #d4a574 0%, #c4a574 100%)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <span
          style={{
            fontSize: "16px",
            marginRight: "8px",
            animation: "pulse 2s infinite",
          }}
        >
          🌸
        </span>
        <span
          style={{
            color: "white",
            fontSize: "12px",
            fontFamily: "Orbitron, monospace",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
          }}
        >
          Start
        </span>
      </div>

      <div
        style={{
          flex: "1",
          display: "flex",
          gap: "6px",
          margin: "0 10px",
        }}
      >
        {/* Open windows will appear here */}
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          🕐
        </div>
        <div
          style={{
            fontSize: "14px",
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          🔊
        </div>
      </div>
    </div>
  );
}
