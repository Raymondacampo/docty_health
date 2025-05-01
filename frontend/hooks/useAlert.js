import { useState, useRef, useEffect } from "react";

const useAlert = () => {
  const [alert, setAlert] = useState({ msg: "", status: null });
  const timeoutRef = useRef(null);

  const showAlert = (message, status, duration = 3000) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set the new alert
    setAlert({ msg: message, status });

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      setAlert({ msg: "", status: null });
      timeoutRef.current = null;
    }, duration);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { alert, showAlert };
};

export default useAlert;