import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("light"); // "light" or "dark"

  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");

    if (savedMode) {
      setThemeMode(savedMode);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setThemeMode(prefersDark ? "dark" : "light");
    }

    document.documentElement.setAttribute("data-theme", themeMode);
  }, [themeMode]);

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
