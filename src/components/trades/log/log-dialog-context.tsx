"use client";

import { createContext, useContext, ReactNode } from "react";

interface LogDialogContextType {
  closeDialog: () => void;
}

const LogDialogContext = createContext<LogDialogContextType | undefined>(
  undefined
);

export function LogDialogProvider({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <LogDialogContext.Provider value={{ closeDialog: onClose }}>
      {children}
    </LogDialogContext.Provider>
  );
}

export function useLogDialog() {
  const context = useContext(LogDialogContext);
  if (context === undefined) {
    throw new Error("useLogDialog must be used within a LogDialogProvider");
  }
  return context;
}
