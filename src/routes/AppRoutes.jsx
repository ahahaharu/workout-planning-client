import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import WorkoutsPage from "../pages/WorkoutsPage/WorkoutsPage";
import ExercisesPage from "../pages/ExercisesPage/ExercisesPage";
import WorkoutPlansPage from "../pages/WorkoutPlansPage/WorkoutPlansPage";
import StatisticsPage from "../pages/StatisticsPage/StatisticsPage";
import PageLayout from "../components/PageLayout/PageLayout";
import ErrorPage from "../pages/ErrorPage/ErrorPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/workouts" />} />
      <Route path="/workouts" element={<WorkoutsPage />} />
      <Route path="/exercises" element={<ExercisesPage />} />
      <Route path="/workoutPlans" element={<WorkoutPlansPage />} />
      <Route path="/statistics" element={<StatisticsPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
