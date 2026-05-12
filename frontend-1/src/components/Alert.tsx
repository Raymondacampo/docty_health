"use client";

import { useAlert } from "../context/AlertContext";

export default function Alert() {
  const { alert, hideAlert } = useAlert();

  if (!alert) return null;

  const color =
    alert.type === "success"
      ? "bg-green-600"
      : alert.type === "error"
      ? "bg-red-600"
      : alert.type === "warning"
      ? "bg-yellow-600"
      : "bg-blue-600";

  return (
    <div
      className={`fixed z-200 top-4 right-4 text-white px-4 py-2 rounded shadow-lg transition-all duration-300 ${color}`}
      onClick={hideAlert}
    >
      {alert.message}
    </div>
  );
}
