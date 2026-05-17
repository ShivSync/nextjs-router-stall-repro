"use client";

import { createContext, useContext, useState } from "react";

type Toast = { id: number; text: string };
const ToastContext = createContext<{ toasts: Toast[]; push: (t: string) => void }>({
  toasts: [],
  push: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  function push(text: string) {
    setToasts((t) => [...t, { id: Date.now(), text }]);
  }
  return <ToastContext.Provider value={{ toasts, push }}>{children}</ToastContext.Provider>;
}

export function useToast() { return useContext(ToastContext); }
