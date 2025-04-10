import React from "react";
import { useTheme } from "../../context/ThemeContext";

export default function PageLayout({ title, children }) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`h-full w-full p-6 rounded-2xl shadow-md border ${
        isDarkMode
          ? "bg-[#211e26] border-indigo-800 text-gray-200"
          : "bg-white border-indigo-200 text-gray-800"
      }`}
    >
      <h1 className="text-2xl font-bold text-indigo-500 mb-4">{title}</h1>
      <div className={isDarkMode ? "text-gray-200" : "text-gray-800"}>
        {children}
      </div>
    </div>
  );
}
