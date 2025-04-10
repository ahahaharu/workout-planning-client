import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("light"); // "light" or "dark"

  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");
    const savedColor = localStorage.getItem("themeColor");

    if (savedMode) setThemeMode(savedMode);
    if (savedColor) setPrimaryColor(savedColor);
  }, []);

  const toggleTheme = () => {
    const newMode = themeMode === "light" ? "dark" : "light";
    setThemeMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  const isDarkMode = themeMode === "dark";

  const value = {
    themeMode,
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
