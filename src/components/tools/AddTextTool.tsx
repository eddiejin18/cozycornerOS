"use client";

interface AddTextToolProps {
  onClose: () => void;
}

export function AddTextTool({ onClose }: AddTextToolProps) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white border-2 border-blue-500 rounded-xl shadow-2xl z-[2001] min-w-[300px] max-w-[500px] animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="p-6 text-center">
          <h3 className="text-lg text-gray-800 mb-3 font-mono">📝 Add Text</h3>
          <p className="text-sm text-gray-600 mb-2">
            This tool will allow you to add text elements to the canvas.
          </p>
          <p className="text-sm text-gray-500 italic mb-4">
            Functionality coming soon!
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white text-xs font-mono rounded-md hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
