import { BicepsFlexed, Dumbbell, NotebookTabs } from "lucide-react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import SidebarItem from "./components/Sidebar/SidebarItem/SidebarItem";
import Wrapper from "./components/Wrapper/Wrapper";

import ExercisesPage from "./pages/ExercisesPage/ExercisesPage";
import WorkoutsPage from "./pages/WorkoutsPage/WorkoutsPage";
import { Route, Routes } from "react-router-dom";
import WorkoutPlansPage from "./pages/WorkoutPlansPage/WorkoutPlansPage";
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
      </Sidebar>
      <main className="flex flex-col w-full gap-4">
        <Header />
        <AppRoutes />
      </main>
    </Wrapper>
  );
}

export default App;
