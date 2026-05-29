import React, { useEffect } from "react";

interface ToastProps {
  mensagem: string;
  tipo: "success" | "error";
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ mensagem, tipo, onClose }) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-xl shadow-2xl border transition-all duration-300 backdrop-blur-md animate-fade-in ${
        tipo === "success"
          ? "bg-green-500/10 text-green-400 border-green-500/20 dark:bg-green-950/30"
          : "bg-red-500/10 text-red-400 border-red-500/20 dark:bg-red-950/30"
      }`}
    >
      <span className="text-sm font-medium mr-2">
        {tipo === "success" ? "✓" : "✕"}
      </span>
      <p className="text-sm font-semibold">{mensagem}</p>

      <button 
        onClick={onClose} 
        className="ml-4 text-xs opacity-50 hover:opacity-100 transition-opacity focus:outline-none"
      >
        ✕
      </button>
    </div>
  );
};
