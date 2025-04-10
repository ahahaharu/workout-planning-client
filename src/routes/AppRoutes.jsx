import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import WorkoutsPage from "../pages/WorkoutsPage/WorkoutsPage";
import ExercisesPage from "../pages/ExercisesPage/ExercisesPage";
import WorkoutPlansPage from "../pages/WorkoutPlansPage/WorkoutPlansPage";
import StatisticsPage from "../pages/StatisticsPage/StatisticsPage";
import AuthPage from "../pages/AuthPage/AuthPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import SettingsPage from "../pages/SettingsPage/SettingsPage";

export default function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Redirect root to either workouts (if authenticated) or auth */}
      <Route
        path="/"
        element={
          currentUser ? (
            <Navigate to="/workouts" replace />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />

      <Route path="/auth" element={<AuthPage />} />

      <Route
        path="/workouts"
        element={
          <ProtectedRoute>
            <WorkoutsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercises"
        element={
          <ProtectedRoute>
            <ExercisesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workoutPlans"
        element={
          <ProtectedRoute>
            <WorkoutPlansPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/statistics"
        element={
          <ProtectedRoute>
            <StatisticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Error page is accessible to everyone */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
