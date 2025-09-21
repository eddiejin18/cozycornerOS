"use client";

export function DesktopIcons() {
  const icons = [
    { app: "notepad", icon: "📝", label: "Notepad", x: 100, y: 100 },
    { app: "calculator", icon: "🧮", label: "Calculator", x: 200, y: 100 },
    { app: "paint", icon: "🎨", label: "Paint", x: 300, y: 100 },
    { app: "snake", icon: "🐍", label: "Snake Game", x: 100, y: 200 },
    { app: "tetris", icon: "🧩", label: "Tetris", x: 200, y: 200 },
  ];

  return (
    <>
      {icons.map((iconData) => (
        <div
          key={iconData.app}
          className="desktop-icon"
          style={{
            position: "absolute",
            width: "80px",
            height: "100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            zIndex: 10,
            left: `${iconData.x}px`,
            top: `${iconData.y}px`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.filter =
              "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.filter = "none";
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "8px",
              filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.animation = "bounce 0.6s ease";
            }}
          >
            {iconData.icon}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "white",
              textAlign: "center",
              filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5))",
              background: "rgba(0, 0, 0, 0.3)",
              padding: "2px 4px",
              borderRadius: "4px",
              maxWidth: "80px",
              wordBreak: "break-word",
              lineHeight: "1.2",
            }}
          >
            {iconData.label}
          </div>
        </div>
      ))}
    </>
  );
}
