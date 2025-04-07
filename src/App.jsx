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

function App() {
  return (
    <Wrapper>
      <Sidebar>
        <SidebarItem icon={<Dumbbell />} text={"Тренировка"} to="/workouts" />
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
  );
}

export default App;
