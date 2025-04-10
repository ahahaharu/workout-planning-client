import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { User, Lock, Mail, LogIn, UserPlus } from "lucide-react";
import { Button, Input, message, Tabs } from "antd";
import { useTheme } from "../../context/ThemeContext";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const { isDarkMode } = useTheme();

  const { login, register, currentUser } = useAuth();
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to="/workouts" />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      message.success("Вход выполнен успешно!");
      navigate("/workouts");
    } catch (error) {
      message.error("Ошибка входа: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(email, password, name);
      message.success("Регистрация выполнена успешно!");
      navigate("/workouts");
    } catch (error) {
      message.error("Ошибка регистрации: " + error.message);
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
          onChange={setActiveTab}
          centered
          items={[
            {
              key: "login",
              label: "Вход",
              children: (
                <form onSubmit={handleLogin} className="space-y-4">
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
