import {
  BicepsFlexed,
  ChartNoAxesCombined,
  Dumbbell,
  NotebookTabs,
  Settings,
} from "lucide-react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import SidebarItem from "./components/Sidebar/SidebarItem/SidebarItem";
import Wrapper from "./components/Wrapper/Wrapper";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./context/AuthContext";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ConfigProvider, theme as antTheme } from "antd";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import { useTheme } from "./context/ThemeContext";

function App() {
  const { currentUser } = useAuth();
  const { loading } = useAuth();
  const { primaryColor, isDarkMode } = useTheme();
  const location = useLocation();
  const [is404, setIs404] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? "#121214" : "#f9fafb";
    const definedRoutes = [
      "/auth",
      "/workouts",
      "/exercises",
      "/workoutPlans",
      "/statistics",
      "/settings",
      "/",
    ];
    setIs404(!definedRoutes.some((route) => location.pathname === route));
  }, [location.pathname, isDarkMode]);

  const isAuthPage = location.pathname === "/auth";
  const isSettings = location.pathname === "/settings";

  // Theme configuration
  const theme = {
    token: {
      colorPrimary: "#6366f1", // indigo-500
      colorInfo: "#6366f1", // indigo-500 for info components
      colorLink: "#6366f1", // indigo-500 for links
      colorSuccess: "#10b981", // emerald-500 (keeping a green for success states)
      colorWarning: "#f59e0b", // amber-500
      colorError: "#ef4444", // red-500

      borderRadius: 8,

      colorBgContainer: isDarkMode ? "#211e26" : "#ffffff",
      colorBgElevated: isDarkMode ? "#211e26" : "#f5f7ff",
      colorBorder: "#e0e7ff",

      colorPrimaryBg: isDarkMode ? "#4b5563" : "#e0e7ff",
      colorPrimaryBgHover: isDarkMode ? "#6b7280" : "#c7d2fe",

      colorText: isDarkMode ? "#f3f4f6" : "#4b5563",
      colorTextSecondary: isDarkMode ? "#d1d5db" : "#6b7280",
    },
    algorithm: isDarkMode ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    components: {
      Button: {
        colorPrimary: "#6366f1", // indigo-500
        colorPrimaryHover: "#4f46e5", // indigo-600
        colorPrimaryActive: "#4338ca", // indigo-700
      },
      Input: {
        activeBorderColor: "#6366f1", // indigo-500
        hoverBorderColor: "#a5b4fc", // indigo-300
      },
      Select: {
        optionSelectedColor: "#6366f1", // indigo-500
      },
      Tabs: {
        inkBarColor: "#6366f1", // indigo-500
        itemSelectedColor: "#6366f1", // indigo-500
        itemHoverColor: "#818cf8", // indigo-400
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <ConfigProvider theme={theme}>
      {!currentUser || isAuthPage || is404 ? (
        <AppRoutes />
      ) : (
        <Wrapper>
          <Sidebar>
            <SidebarItem
              icon={<Dumbbell color={isDarkMode ? "white" : "#4a5565"} />}
              text={"Тренировка"}
              to="/workouts"
            />
            <SidebarItem
              icon={<BicepsFlexed color={isDarkMode ? "white" : "#4a5565"} />}
              text={"Упражнения"}
              to="/exercises"
            />
            <SidebarItem
              icon={<NotebookTabs color={isDarkMode ? "white" : "#4a5565"} />}
              text={"Программы"}
              to="/workoutPlans"
            />
            <SidebarItem
              icon={
                <ChartNoAxesCombined color={isDarkMode ? "white" : "#4a5565"} />
              }
              text={"Cтатистика"}
              to="/statistics"
            />
            <SidebarItem
              icon={<Settings color={isDarkMode ? "white" : "#4a5565"} />}
              text={"Настройки"}
              to="/settings"
            />
          </Sidebar>
          {isSettings ? (
            <SettingsPage />
          ) : (
            <main className="flex flex-col w-full gap-4">
              <Header />
              <AppRoutes />
            </main>
          )}
        </Wrapper>
      )}
    </ConfigProvider>
  );
}

export default App;
