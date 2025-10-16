"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type,
  duration = 5000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: "bg-green-50 border-green-500",
      text: "text-green-800",
      icon: "✓",
      iconBg: "bg-green-500",
    },
    error: {
      bg: "bg-red-50 border-red-500",
      text: "text-red-800",
      icon: "✕",
      iconBg: "bg-red-500",
    },
    warning: {
      bg: "bg-yellow-50 border-yellow-500",
      text: "text-yellow-800",
      icon: "⚠",
      iconBg: "bg-yellow-500",
    },
    info: {
      bg: "bg-blue-50 border-blue-500",
      text: "text-blue-800",
      icon: "ⓘ",
      iconBg: "bg-blue-500",
    },
  };

  const style = styles[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-start p-4 border-l-4 rounded-lg shadow-lg ${style.bg} animate-slide-in max-w-md`}
      role="alert"
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full ${style.iconBg} flex items-center justify-center text-white font-bold`}
      >
        {style.icon}
      </div>
      <div className={`ml-3 flex-1 ${style.text}`}>
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className={`ml-3 flex-shrink-0 inline-flex ${style.text} hover:opacity-70 focus:outline-none transition-opacity`}
        aria-label="Close"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
