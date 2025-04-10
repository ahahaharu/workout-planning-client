import React from "react";
import { Button } from "antd";
import { Search, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import ExitButton from "../ExitButton/ExitButton";

export default function Header() {
  const { currentUser, logout } = useAuth();
  const { isDarkMode } = useTheme();

  const handleLogout = () => {
    logout();
  };

  return (
    <header
      className={`py-10 px-4 flex justify-between w-full items-center max-h-10 border  rounded-2xl ${
        isDarkMode
          ? "bg-[#211e26] border-indigo-500"
          : "bg-white border-indigo-200"
      }`}
    >
      <div className="flex justify-between px-4 py-3 rounded-xl border-2 border-indigo-400 overflow-hidden w-full lg:w-auto">
        <input
          type="search"
          placeholder="Поиск..."
          className={`outline-none bg-transparent  text-md mr-20 ${
            isDarkMode ? "text-white" : "text-gray-600"
          }`}
        />
        <Search color={isDarkMode ? "white" : "black"} />
      </div>
      <div className="hidden lg:flex items-center gap-4">
        {currentUser && <ExitButton />}
      </div>
    </header>
  );
}
