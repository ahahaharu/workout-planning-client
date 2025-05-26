import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { User, Lock, Mail, LogIn, UserPlus, Scale, Ruler, AlertCircle } from "lucide-react";
import { Button, Input, message, Tabs, Alert } from "antd";
import { useTheme } from "../../context/ThemeContext";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [height, setHeight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const { isDarkMode } = useTheme();

  const { login, register, currentUser } = useAuth();
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to="/workouts" />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      await login(email, password);
      message.success("Вход выполнен успешно!");
      navigate("/workouts");
    } catch (error) {
      if (error.message.includes("не существует")) {
        setLoginError("Пользователя с таким email не существует");
      } else if (error.message.includes("Неверный пароль")) {
        setLoginError("Неверный пароль. Пожалуйста, проверьте правильность ввода");
      } else {
        setLoginError("Ошибка входа: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setRegisterError("");

    if (!email || !password || !name || !currentWeight || !height) {
      setRegisterError("Пожалуйста, заполните все поля");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setRegisterError("Пожалуйста, введите корректный email");
      setIsLoading(false);
      return;
    }

    if (isNaN(Number(currentWeight)) || Number(currentWeight) <= 0) {
      setRegisterError("Вес должен быть положительным числом");
      setIsLoading(false);
      return;
    }

    if (isNaN(Number(height)) || Number(height) <= 0) {
      setRegisterError("Рост должен быть положительным числом");
      setIsLoading(false);
      return;
    }

    try {
      await register(email, password, name, Number(currentWeight), Number(height));
      message.success("Регистрация выполнена успешно!");
      navigate("/workouts");
    } catch (error) {
      if (error.message.includes("уже существует")) {
        setRegisterError("Пользователь с таким email уже существует");
      } else {
        setRegisterError("Ошибка регистрации: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        isDarkMode ? "bg-[#121214]" : "bg-indigo-50"
      } `}
    >
      <div
        className={` p-8 rounded-2xl shadow-lg w-full max-w-md ${
          isDarkMode ? "bg-[#211e26]" : "bg-white"
        }`}
      >
        <div className="flex justify-center mb-8">
          <div className="p-4 rounded-full bg-indigo-100">
            <User size={40} className="text-indigo-600" />
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            setLoginError("");
            setRegisterError("");
          }}
          centered
          items={[
            {
              key: "login",
              label: "Вход",
              children: (
                <form onSubmit={handleLogin} className="space-y-4">
                  {loginError && (
                    <Alert
                      message={loginError}
                      type="error"
                      showIcon
                      icon={<AlertCircle size={16} />}
                    />
                  )}
                  <div>
                    <label
                      className={`block text-sm font-medium  mb-1 ${
                        isDarkMode ? "text-white" : "text-gray-700"
                      }`}
                    >
                      Email
                    </label>
                    <Input
                      prefix={<Mail size={18} className="text-gray-400 mr-2" />}
                      type="email"
                      placeholder="Ваш email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      size="large"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium text-gray-700 mb-1 ${
                        isDarkMode ? "text-white" : "text-gray-700"
                      }`}
                    >
                      Пароль
                    </label>
                    <Input.Password
                      prefix={<Lock size={18} className="text-gray-400 mr-2" />}
                      placeholder="Ваш пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      size="large"
                    />
                  </div>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    icon={<LogIn size={18} />}
                    size="large"
                    block
                  >
                    Войти
                  </Button>
                </form>
              ),
            },
            {
              key: "register",
              label: "Регистрация",
              children: (
                <form onSubmit={handleRegister} className="space-y-4">
                  {registerError && (
                    <Alert
                      message={registerError}
                      type="error"
                      showIcon
                      icon={<AlertCircle size={16} />}
                    />
                  )}
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-white" : "text-gray-700"
                      }`}
                    >
                      Имя
                    </label>
                    <Input
                      prefix={<User size={18} className="text-gray-400 mr-2" />}
                      placeholder="Ваше имя"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      size="large"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-white" : "text-gray-700"
                      }`}
                    >
                      Email
                    </label>
                    <Input
                      prefix={<Mail size={18} className="text-gray-400 mr-2" />}
                      type="email"
                      placeholder="Ваш email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      size="large"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-white" : "text-gray-700"
                      }`}
                    >
                      Пароль
                    </label>
                    <Input.Password
                      prefix={<Lock size={18} className="text-gray-400 mr-2" />}
                      placeholder="Ваш пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      size="large"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-white" : "text-gray-700"
                      }`}
                    >
                      Вес (кг)
                    </label>
                    <Input
                      prefix={<Scale size={18} className="text-gray-400 mr-2" />}
                      type="number"
                      placeholder="Ваш текущий вес"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                      required
                      size="large"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-white" : "text-gray-700"
                      }`}
                    >
                      Рост (см)
                    </label>
                    <Input
                      prefix={<Ruler size={18} className="text-gray-400 mr-2" />}
                      type="number"
                      placeholder="Ваш рост"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      required
                      size="large"
                    />
                  </div>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    icon={<UserPlus size={18} />}
                    size="large"
                    block
                  >
                    Зарегистрироваться
                  </Button>
                </form>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}