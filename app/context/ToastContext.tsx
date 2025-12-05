"use client";

import { createContext, useContext, useState, useCallback } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "warning";
}

interface ToastContextProps {
  showToast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "error") => {
      const id = Date.now();

      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-3">
        {toasts.map((toast) => {
          const Icon =
            toast.type === "success"
              ? CheckCircleIcon
              : toast.type === "warning"
              ? ExclamationTriangleIcon
              : XCircleIcon;

          const colors =
            toast.type === "success"
              ? "bg-green-600 text-white"
              : toast.type === "warning"
              ? "bg-yellow-500 text-black"
              : "bg-red-600 text-white";

          return (
            <div
              key={toast.id}
              className={`
                flex items-center gap-3 min-w-[260px] max-w-sm
                px-4 py-3 rounded-lg shadow-lg
                animate-slide-in 
                ${colors}
              `}
            >
              <Icon className="h-6 w-6" />
              <p className="font-medium text-sm">{toast.message}</p>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
