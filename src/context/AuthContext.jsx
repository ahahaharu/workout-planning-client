import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
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
      throw new Error("Invalid credentials");
    }
  };

  const register = async (email, password, name) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email && password && name) {
      const user = {
        id: "user" + Date.now(),
        email,
        name,
        token: "sample-jwt-token",
      };

      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
      return user;
    } else {
      throw new Error("Invalid registration data");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
