import React from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import { Switch, Divider, Button } from "antd";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import ExitButton from "../../components/ExitButton/ExitButton";

export default function SettingsPage() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();

  return (
    <PageLayout title="Настройки">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Внешний вид</h2>

          <div className="flex items-center gap-4">
            <Sun
              size={20}
              className={isDarkMode ? "text-gray-400" : "text-amber-500"}
            />
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              className={isDarkMode ? "" : "bg-gray-300"}
            />
            <Moon
              size={20}
              className={isDarkMode ? "text-indigo-300" : "text-gray-400"}
            />
            <span className="ml-2">
              {isDarkMode ? "Темная тема" : "Светлая тема"}
            </span>
          </div>
        </div>
        <Divider />
        <div className="hidden lg:flex items-center gap-4 w-full">
          {currentUser && <ExitButton />}
        </div>
      </div>
    </PageLayout>
  );
}
