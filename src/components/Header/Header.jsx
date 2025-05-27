import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { Search, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useSearch } from "../../context/SearchContext";
import { useLocation } from "react-router-dom";
import ExitButton from "../ExitButton/ExitButton";

export default function Header() {
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const { searchQuery, setSearchQuery } = useSearch();
  const location = useLocation();
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  useEffect(() => {
    const searchEnabledPages = ["/exercises", "/workoutPlans", "/workouts"];
    setIsSearchEnabled(
      searchEnabledPages.some((page) => location.pathname.includes(page))
    );
  }, [location]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <header
      className={`py-10 px-4 flex justify-between w-full items-center max-h-10 border rounded-2xl ${
        isDarkMode
          ? "bg-[#211e26] border-indigo-500"
          : "bg-white border-indigo-200"
      }`}
    >
      <div
        className={`flex justify-between px-4 py-3 rounded-xl border-2 ${
          isSearchEnabled ? "border-indigo-400" : "border-gray-300"
        } overflow-hidden w-full lg:w-auto`}
      >
        <input
          type="search"
          placeholder={
            isSearchEnabled ? "Поиск..." : "Поиск недоступен на этой странице"
          }
          disabled={!isSearchEnabled}
          value={searchQuery}
          onChange={handleSearch}
          className={`outline-none bg-transparent text-md mr-20 ${
            isDarkMode ? "text-white" : "text-gray-600"
          } ${!isSearchEnabled && "cursor-not-allowed text-gray-400"}`}
        />
        {searchQuery ? (
          <X
            className="cursor-pointer"
            color={isDarkMode ? "white" : "black"}
            onClick={clearSearch}
          />
        ) : (
          <Search color={isDarkMode ? "white" : "black"} />
        )}
      </div>
      <div className="hidden lg:flex items-center gap-4">
        {currentUser && <ExitButton />}
      </div>
    </header>
  );
}
