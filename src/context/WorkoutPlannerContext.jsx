import React, { createContext, useContext, useState, useEffect } from "react";
import { createWorkoutPlanner } from "workout-planning-lib";

const WorkoutPlannerContext = createContext();

export const useWorkoutPlanner = () => {
  return useContext(WorkoutPlannerContext);
};

export const WorkoutPlannerProvider = ({ children }) => {
  const [workoutPlanner, setWorkoutPlanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState({
    userService: null,
    exerciseService: null,
    workoutService: null,
    planService: null,
    storageManager: null
  });

  useEffect(() => {
    const initializeWorkoutPlanner = () => {
      try {
        const planner = createWorkoutPlanner();
        setWorkoutPlanner(planner);
        
        setServices({
          userService: planner.userService,
          exerciseService: planner.exerciseService,
          workoutService: planner.workoutService,
          workoutPlanService: planner.workoutPlanService,
          storageManager: planner.storageManager
        });
      } catch (error) {
        console.error("Ошибка при инициализации планировщика:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeWorkoutPlanner();
  }, []);

  const value = {
    workoutPlanner,
    ...services,
    loading
  };

  return (
    <WorkoutPlannerContext.Provider value={value}>
      {children}
    </WorkoutPlannerContext.Provider>
  );
};