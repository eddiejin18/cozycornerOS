"use client";

interface CanvasState {
  x: number;
  y: number;
  scale: number;
  minScale: number;
  maxScale: number;
  isDragging: boolean;
  dragStart: { x: number; y: number };
  lastPanPoint: { x: number; y: number };
  velocity: { x: number; y: number };
  lastTime: number;
  isAnimating: boolean;
  lastPinchDistance?: number;
  lastPinchCenter?: { x: number; y: number };
}

interface ZoomControlsProps {
  canvasState: CanvasState;
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>;
}

export function ZoomControls({
  canvasState,
  setCanvasState,
}: ZoomControlsProps) {
  const zoomIn = () => {
    const newScale = Math.min(canvasState.maxScale, canvasState.scale * 1.2);
    setCanvasState((prev) => ({ ...prev, scale: newScale }));
  };

  const zoomOut = () => {
    const newScale = Math.max(canvasState.minScale, canvasState.scale * 0.8);
    setCanvasState((prev) => ({ ...prev, scale: newScale }));
  };

  const resetZoom = () => {
    setCanvasState((prev) => ({
      ...prev,
      scale: 1,
      x: -9000,
      y: -9000,
    }));
  };

  return (
    <div
      className="zoom-controls"
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        padding: "12px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        zIndex: 1001,
      }}
    >
      <button
        onClick={zoomIn}
        style={{
          width: "40px",
          height: "40px",
          border: "none",
          borderRadius: "8px",
          background: "linear-gradient(to bottom, #68d391 0%, #48bb78 100%)",
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(to bottom, #9ae6b4 0%, #68d391 100%)";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(to bottom, #68d391 0%, #48bb78 100%)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
        }}
      >
        +
      </button>

      <div
        style={{
          fontFamily: "Press Start 2P, monospace",
          fontSize: "10px",
          color: "#4a5568",
          textAlign: "center",
          background: "#f0fff4",
          padding: "4px 8px",
          borderRadius: "4px",
          minWidth: "50px",
          border: "1px solid #c6f6d5",
        }}
      >
        {Math.round(canvasState.scale * 100)}%
      </div>

      <button
        onClick={zoomOut}
        style={{
          width: "40px",
          height: "40px",
          border: "none",
          borderRadius: "8px",
          background: "linear-gradient(to bottom, #68d391 0%, #48bb78 100%)",
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(to bottom, #9ae6b4 0%, #68d391 100%)";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(to bottom, #68d391 0%, #48bb78 100%)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
        }}
      >
        −
      </button>

      <button
        onClick={resetZoom}
        style={{
          width: "40px",
          height: "40px",
          border: "none",
          borderRadius: "8px",
          background: "linear-gradient(to bottom, #68d391 0%, #48bb78 100%)",
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(to bottom, #9ae6b4 0%, #68d391 100%)";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(to bottom, #68d391 0%, #48bb78 100%)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
        }}
      >
        ⌂
      </button>
    </div>
  );
}
