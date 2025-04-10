import {
  BicepsFlexed,
  ChartNoAxesCombined,
  Dumbbell,
  NotebookTabs,
} from "lucide-react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import SidebarItem from "./components/Sidebar/SidebarItem/SidebarItem";
import Wrapper from "./components/Wrapper/Wrapper";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./context/AuthContext";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ConfigProvider } from "antd";

function App() {
  const { currentUser } = useAuth();
  const { loading } = useAuth();
  const location = useLocation();
  const [is404, setIs404] = useState(false);

  useEffect(() => {
    const definedRoutes = [
      "/auth",
      "/workouts",
      "/exercises",
      "/workoutPlans",
      "/statistics",
      "/",
    ];
    setIs404(!definedRoutes.some((route) => location.pathname === route));
  }, [location.pathname]);

  const isAuthPage = location.pathname === "/auth";

  // Theme configuration
  const theme = {
    token: {
      colorPrimary: "#6366f1", // indigo-500

      // Supporting colors
      colorInfo: "#6366f1", // indigo-500 for info components
      colorLink: "#6366f1", // indigo-500 for links
      colorSuccess: "#10b981", // emerald-500 (keeping a green for success states)
      colorWarning: "#f59e0b", // amber-500
      colorError: "#ef4444", // red-500

      borderRadius: 8,
      colorBorder: "#e0e7ff", // indigo-100

      // Background colors
      colorBgContainer: "#ffffff",
      colorBgElevated: "#f5f7ff", // lighter indigo tint

      // Control colors
      colorPrimaryBg: "#e0e7ff", // indigo-100
      colorPrimaryBgHover: "#c7d2fe", // indigo-200

      // Text colors
      colorText: "#4b5563", // gray-600
      colorTextSecondary: "#6b7280", // gray-500
    },
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
      // Add other component-specific overrides as needed
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
              icon={<Dumbbell />}
              text={"Тренировка"}
              to="/workouts"
            />
            <SidebarItem
              icon={<BicepsFlexed />}
              text={"Упражнения"}
              to="/exercises"
            />
            <SidebarItem
              icon={<NotebookTabs />}
              text={"Программы"}
              to="/workoutPlans"
            />
            <SidebarItem
              icon={<ChartNoAxesCombined />}
              text={"Cтатистика"}
              to="/statistics"
            />
          </Sidebar>
          <main className="flex flex-col w-full gap-4">
            <Header />
            <AppRoutes />
          </main>
        </Wrapper>
      )}
    </ConfigProvider>
  );
}

export default App;
