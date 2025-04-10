import React from "react";
import { Button } from "antd";
import { Search, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="py-10 px-4 flex justify-between w-full items-center max-h-10 border border-indigo-200 rounded-2xl ">
      <div className="flex justify-between px-4 py-3 rounded-xl border-2 border-indigo-400 overflow-hidden w-full lg:w-auto">
        <input
          type="search"
          placeholder="Search Something..."
          className="outline-none bg-transparent text-gray-600 text-md mr-20"
        />
        <Search />
      </div>
      <div className="hidden lg:flex items-center gap-4">
        {currentUser && (
          <Button
            icon={<LogOut size={16} />}
            onClick={handleLogout}
            className="mr-5 border-indigo-200 text-indigo-600 hover:border-indigo-400 "
          >
            Выйти
          </Button>
        )}
      </div>
    </header>
  );
}
