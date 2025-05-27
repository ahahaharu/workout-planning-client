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

  // Восстановление сессии пользователя при загрузке
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (userService) {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const userData = JSON.parse(storedUser);

            try {
              // После получения пользователя выполняем синхронизацию
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

              // Получаем полную информацию о пользователе из сервиса
              const user = userService.getUserById(userData.id);

              // Устанавливаем текущего пользователя в сервисе (это ключевое изменение)
              userService.currentUser = user;

              // Проверка workoutService для отладки
              if (workoutService) {
                const userWorkouts = workoutService.getWorkoutsForUser(user.id);
                console.log(
                  `Найдено ${userWorkouts.length} тренировок пользователя ${user.id}`
                );
              }

              // Обновляем локальное состояние пользователя с полными данными
              const fullUserData = {
                ...userData,
                // Включаем полную историю веса
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
  }, [userService, workoutService, workoutPlanner]); // Добавляем workoutPlanner в зависимости

  const login = async (email, password) => {
    if (userService) {
      try {
        // Вызов метода loginUser из сервиса
        const user = userService.loginUser(email, password);

        // Создаем объект с ПОЛНЫМИ данными для хранения в localStorage
        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          currentWeight: user.currentWeight,
          height: user.height,
          // Включаем полную историю веса
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
      // Временная логика для разработки (когда сервис недоступен)
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

        // Создаем полный объект пользователя с историей веса
        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          currentWeight: numericWeight,
          height: numericHeight,
          // Добавляем историю веса
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
        // Получаем актуальные данные пользователя из сервиса
        const user = userService.getUserById(userData.id);
        userService.currentUser = user;

        // Обеспечиваем наличие полной истории веса
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

    // Обновляем в контексте
    setCurrentUser(userData);

    // Обновляем в localStorage
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
