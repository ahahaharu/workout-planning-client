import React, { createContext, useContext, useState, useEffect } from "react";
import { useWorkoutPlanner } from "./WorkoutPlannerContext";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userService, loading: plannerLoading } = useWorkoutPlanner();

  // Восстановление сессии пользователя при загрузке
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (userService) {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            
            try {
              const user = userService.getUserById(userData.id);
              
              userService.currentUser = user;
              
              setCurrentUser(userData);
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
  }, [userService]);

  const login = async (email, password) => {
    if (userService) {
      try {
        // Вызов метода loginUser из сервиса
        const user = userService.loginUser(email, password);
        
        // Создаем объект с необходимыми данными для хранения в localStorage
        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          currentWeight: user.currentWeight,
          height: user.height
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
          height: numericHeight
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
      } catch (error) {
        console.error("Ошибка при обновлении пользователя в сервисе:", error);
      }
    }
    
    // Обновляем currentUser в React состоянии
    setCurrentUser(userData);
    
    // Обновляем данные в localStorage
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateCurrentUser, // Новая функция
    loading: loading || plannerLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};