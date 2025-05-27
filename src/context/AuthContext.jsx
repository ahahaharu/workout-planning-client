import React, { createContext, useContext, useState, useEffect } from "react";
import { useWorkoutPlanner } from "./WorkoutPlannerContext";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    userService,
    workoutService,
    workoutPlanner,
    loading: plannerLoading,
  } = useWorkoutPlanner();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (userService) {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const userData = JSON.parse(storedUser);

            try {
              if (
                workoutPlanner &&
                workoutPlanner.storageManager &&
                workoutPlanner.storageManager.syncLocalStorageWithLibrary
              ) {
                console.log(
                  "Синхронизируем данные при инициализации аутентификации..."
                );
                workoutPlanner.storageManager.syncLocalStorageWithLibrary(
                  workoutPlanner
                );
              }

              const user = userService.getUserById(userData.id);

              userService.currentUser = user;

              if (workoutService) {
                const userWorkouts = workoutService.getWorkoutsForUser(user.id);
                console.log(
                  `Найдено ${userWorkouts.length} тренировок пользователя ${user.id}`
                );
              }

              const fullUserData = {
                ...userData,
                weightHistory: user.weightHistory || [],
              };

              setCurrentUser(fullUserData);
            } catch (error) {
              console.error("Ошибка при восстановлении пользователя:", error);
              localStorage.removeItem("user");
            }
          }
        } else {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [userService, workoutService, workoutPlanner]);

  const login = async (email, password) => {
    if (userService) {
      try {
        const user = userService.loginUser(email, password);

        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          currentWeight: user.currentWeight,
          height: user.height,
          weightHistory: user.weightHistory || [],
        };

        localStorage.setItem("user", JSON.stringify(userData));
        setCurrentUser(userData);
        return user;
      } catch (error) {
        console.error("Ошибка входа:", error);
        throw error;
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email && password) {
        const user = {
          id: "user1",
          email,
          name: email.split("@")[0],
          token: "sample-jwt-token",
          weightHistory: [],
        };

        localStorage.setItem("user", JSON.stringify(user));
        setCurrentUser(user);
        return user;
      } else {
        throw new Error("Неверные учетные данные");
      }
    }
  };

  const register = async (email, password, name, currentWeight, height) => {
    if (userService) {
      try {
        if (!email || !password || !name || !currentWeight || !height) {
          throw new Error("Все поля обязательны для заполнения");
        }

        const numericWeight = Number(currentWeight);
        const numericHeight = Number(height);

        if (isNaN(numericWeight) || isNaN(numericHeight)) {
          throw new Error("Вес и рост должны быть числовыми значениями");
        }

        const user = userService.registerUser(
          name,
          password,
          email,
          numericWeight,
          numericHeight
        );

        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          currentWeight: numericWeight,
          height: numericHeight,
          weightHistory: user.weightHistory || [],
        };

        localStorage.setItem("user", JSON.stringify(userData));

        userService.currentUser = user;

        setCurrentUser(userData);
        return user;
      } catch (error) {
        console.error("Ошибка регистрации:", error);
        throw error;
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email && password && name) {
        const user = {
          id: "user" + Date.now(),
          email,
          name,
          currentWeight,
          height,
          weightHistory: [
            {
              date: new Date(),
              weight: Number(currentWeight),
            },
          ],
          token: "sample-jwt-token",
        };

        localStorage.setItem("user", JSON.stringify(user));
        setCurrentUser(user);
        return user;
      } else {
        throw new Error("Некорректные данные для регистрации");
      }
    }
  };

  const logout = () => {
    if (userService) {
      userService.currentUser = null;
    }

    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const updateCurrentUser = (userData) => {
    if (userService) {
      try {
        const user = userService.getUserById(userData.id);
        userService.currentUser = user;

        if (
          !userData.weightHistory ||
          (user.weightHistory &&
            userData.weightHistory.length < user.weightHistory.length)
        ) {
          userData.weightHistory = user.weightHistory;
        }
      } catch (error) {
        console.error("Ошибка при обновлении пользователя в сервисе:", error);
      }
    }

    setCurrentUser(userData);

    localStorage.setItem("user", JSON.stringify(userData));
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateCurrentUser,
    loading: loading || plannerLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
