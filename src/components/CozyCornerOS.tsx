"use client";

import { useEffect, useRef, useState } from "react";
import { Toolbox } from "./Toolbox";
import { Taskbar } from "./Taskbar";
import { ZoomControls } from "./ZoomControls";
import { DesktopIcons } from "./DesktopIcons";
import { WelcomeMessage } from "./WelcomeMessage";

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

export function CozyCornerOS() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    x: -9000,
    y: -9000,
    scale: 1,
    minScale: 0.1,
    maxScale: 5,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    lastPanPoint: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    lastTime: 0,
    isAnimating: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target === canvas) {
        setCanvasState((prev) => ({
          ...prev,
          isDragging: true,
          dragStart: { x: e.clientX, y: e.clientY },
          lastPanPoint: { x: e.clientX, y: e.clientY },
          velocity: { x: 0, y: 0 },
        }));
        canvas.style.cursor = "grabbing";
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setCanvasState((prev) => {
        if (!prev.isDragging) return prev;

        const deltaX = e.clientX - prev.dragStart.x;
        const deltaY = e.clientY - prev.dragStart.y;

        const newX = prev.x + deltaX;
        const newY = prev.y + deltaY;

        // Calculate velocity for momentum
        const now = Date.now();
        const timeDelta = now - prev.lastTime;
        let newVelocity = { x: 0, y: 0 };

        if (timeDelta > 0) {
          newVelocity = {
            x: (e.clientX - prev.lastPanPoint.x) / timeDelta,
            y: (e.clientY - prev.lastPanPoint.y) / timeDelta,
          };
        }

        return {
          ...prev,
          x: newX,
          y: newY,
          dragStart: { x: e.clientX, y: e.clientY },
          lastPanPoint: { x: e.clientX, y: e.clientY },
          lastTime: now,
          velocity: newVelocity,
        };
      });
    };

    const handleMouseUp = () => {
      setCanvasState((prev) => ({ ...prev, isDragging: false }));
      canvas.style.cursor = "grab";
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY > 0 ? 0.95 : 1.05;

      setCanvasState((prev) => {
        const newScale = Math.max(
          prev.minScale,
          Math.min(prev.maxScale, prev.scale * zoomFactor)
        );

        if (newScale !== prev.scale) {
          const scaleChange = newScale / prev.scale;
          return {
            ...prev,
            x: mouseX - (mouseX - prev.x) * scaleChange,
            y: mouseY - (mouseY - prev.y) * scaleChange,
            scale: newScale,
          };
        }
        return prev;
      });
    };

    // Touch support
    const handleTouchStart = (e: TouchEvent) => {
      if (e.target === canvas) {
        e.preventDefault();
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          setCanvasState((prev) => ({
            ...prev,
            isDragging: true,
            dragStart: { x: touch.clientX, y: touch.clientY },
            lastPanPoint: { x: touch.clientX, y: touch.clientY },
            velocity: { x: 0, y: 0 },
          }));
        } else if (e.touches.length === 2) {
          // Pinch zoom
          setCanvasState((prev) => ({ ...prev, isDragging: false }));
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      setCanvasState((prev) => {
        if (prev.isDragging && e.touches.length === 1) {
          e.preventDefault();
          const touch = e.touches[0];
          const deltaX = touch.clientX - prev.dragStart.x;
          const deltaY = touch.clientY - prev.dragStart.y;

          return {
            ...prev,
            x: prev.x + deltaX,
            y: prev.y + deltaY,
            dragStart: { x: touch.clientX, y: touch.clientY },
          };
        }
        return prev;
      });
    };

    const handleTouchEnd = () => {
      setCanvasState((prev) => ({ ...prev, isDragging: false }));
    };

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    // Add event listeners
    canvas.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("contextmenu", handleContextMenu);

    // Animation loop for momentum
    const animate = () => {
      setCanvasState((prev) => {
        if (
          !prev.isDragging &&
          (Math.abs(prev.velocity.x) > 0.1 || Math.abs(prev.velocity.y) > 0.1)
        ) {
          const newX = prev.x + prev.velocity.x * 16;
          const newY = prev.y + prev.velocity.y * 16;

          return {
            ...prev,
            x: newX,
            y: newY,
            velocity: {
              x: prev.velocity.x * 0.95,
              y: prev.velocity.y * 0.95,
            },
          };
        }
        return prev;
      });
      requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const updateCanvasTransform = () => {
    if (canvasRef.current) {
      const transform = `translate(${canvasState.x}px, ${canvasState.y}px) scale(${canvasState.scale})`;
      canvasRef.current.style.transform = transform;
    }
  };

  useEffect(() => {
    updateCanvasTransform();
  }, [canvasState.x, canvasState.y, canvasState.scale]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "white",
        overflow: "hidden",
        backgroundImage: "radial-gradient(circle, #ccc 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* Infinite Canvas */}
      <div
        ref={canvasRef}
        style={{
          position: "absolute",
          width: "20000px",
          height: "20000px",
          top: "-9000px",
          left: "-9000px",
          background: "white",
          cursor: "grab",
          willChange: "transform",
          transformOrigin: "top left",
          transform: `translate(${canvasState.x}px, ${canvasState.y}px) scale(${canvasState.scale})`,
        }}
      >
        <DesktopIcons />
        <WelcomeMessage />
      </div>

      {/* HUD Elements */}
      <Taskbar />
      <Toolbox />
      <ZoomControls canvasState={canvasState} setCanvasState={setCanvasState} />
    </div>
  );
}
