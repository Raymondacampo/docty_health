"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AlertType = "success" | "error" | "info" | "warning";

interface Alert {
  message: string;
  type: AlertType;
}

interface AlertContextType {
  alert: Alert | null;
  showAlert: (message: string, type?: AlertType) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType>({
  alert: null,
  showAlert: () => {},
  hideAlert: () => {},
});

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<Alert | null>(null);

  const showAlert = (message: string, type: AlertType = "info") => {
    setAlert({ message, type });

    // Auto hide after 3 seconds
    setTimeout(() => setAlert(null), 3000);
  };

  const hideAlert = () => setAlert(null);

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
