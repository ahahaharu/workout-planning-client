import React from "react";
import { useTheme } from "../../context/ThemeContext";

export default function PageLayout({ title, children }) {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`h-full w-full p-6 border rounded-2xl shadow-md ${
        isDarkMode
          ? "bg-[#1a1a1e] border-indigo-500"
          : "bg-white  border-indigo-200"
      }`}
    >
      <h1
        className={`text-2xl font-bold  mb-4 ${
          isDarkMode ? "text-white" : "text-indigo-500"
        }`}
      >
        {title}
      </h1>
      <div>{children}</div>
    </div>
  );
}
