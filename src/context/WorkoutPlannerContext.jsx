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
    workoutPlanService: null,
    statisticsService: null,
    storageManager: null,
  });

  const forceSyncLibrary = () => {
    if (!workoutPlanner || !workoutPlanner.storageManager) {
      console.error("Планировщик не инициализирован");
      return { success: false, error: "Планировщик не инициализирован" };
    }

    try {
      const result =
        workoutPlanner.storageManager.syncLocalStorageWithLibrary(
          workoutPlanner
        );
      console.log("Результат принудительной синхронизации:", result);
      return result;
    } catch (error) {
      console.error("Ошибка при синхронизации:", error);
      return { success: false, error: error.message };
    }
  };

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
          statisticsService: planner.statisticsService,
          storageManager: planner.storageManager,
        });

        if (planner.storageManager.syncLocalStorageWithLibrary) {
          console.log("Выполняем начальную синхронизацию с localStorage...");
          const syncResult =
            planner.storageManager.syncLocalStorageWithLibrary(planner);
          console.log("Результат начальной синхронизации:", syncResult);
        } else {
          console.warn(
            "Метод syncLocalStorageWithLibrary не найден в storageManager"
          );
        }

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            const user = planner.userService.getUserById(userData.id);
            if (user) {
              planner.userService.currentUser = user;
              console.log(
                "Пользователь успешно синхронизирован с сервисами:",
                user
              );

              const userWorkouts = planner.workoutService.getWorkoutsForUser(
                user.id
              );
              console.log(
                `Найдено ${userWorkouts.length} тренировок пользователя в сервисе`
              );

              const storedExercises = planner.storageManager.getExercises();
              console.log(
                `Найдено ${storedExercises.length} упражнений в localStorage`
              );

              const exerciseIdSet = new Set(
                planner.exerciseService.getAllExercises().map((ex) => ex.id)
              );
              console.log(
                `В сервисе упражнений доступно ${exerciseIdSet.size} упражнений`
              );

              const exercisesInWorkouts = new Set();
              userWorkouts.forEach((workout) => {
                (workout.exercises || []).forEach((ex) => {
                  exercisesInWorkouts.add(ex.id);
                });
              });
              console.log(
                `В тренировках используется ${exercisesInWorkouts.size} уникальных упражнений`
              );

              exercisesInWorkouts.forEach((id) => {
                if (!exerciseIdSet.has(id)) {
                  console.warn(
                    `Упражнение с ID ${id} используется в тренировках, но отсутствует в сервисе упражнений`
                  );
                }
              });
            }
          } catch (error) {
            console.error(
              "Ошибка при синхронизации пользователя с сервисами:",
              error
            );
          }
        }
      } catch (error) {
        console.error("Ошибка при инициализации планировщика:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeWorkoutPlanner();
  }, []);

  useEffect(() => {
    if (workoutPlanner && services.userService) {
      const syncUserWithServices = () => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            const user = services.userService.getUserById(userData.id);
            if (user) {
              services.userService.currentUser = user;
            }
          } catch (error) {
            console.error(
              "Ошибка при обновлении пользователя в сервисах:",
              error
            );
          }
        }
      };

      const handleStorageChange = (e) => {
        if (e.key === "user") {
          syncUserWithServices();
        }
      };

      window.addEventListener("storage", handleStorageChange);
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, [workoutPlanner, services.userService]);

  const value = {
    workoutPlanner,
    ...services,
    loading,
    forceSyncLibrary,
  };

  return (
    <WorkoutPlannerContext.Provider value={value}>
      {children}
    </WorkoutPlannerContext.Provider>
  );
};
