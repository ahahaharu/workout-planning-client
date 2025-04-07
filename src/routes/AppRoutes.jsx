import React from "react";
import { Routes, Route } from "react-router-dom";
import WorkoutsPage from "../pages/WorkoutsPage/WorkoutsPage";
import ExercisesPage from "../pages/ExercisesPage/ExercisesPage";
import WorkoutPlansPage from "../pages/WorkoutPlansPage/WorkoutPlansPage";
import StatisticsPage from "../pages/StatisticsPage/StatisticsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/workouts" element={<WorkoutsPage />} />
      <Route path="/exercises" element={<ExercisesPage />} />
      <Route path="/workoutPlans" element={<WorkoutPlansPage />} />
      <Route path="/statistics" element={<StatisticsPage />} />
    </Routes>
  );
}
