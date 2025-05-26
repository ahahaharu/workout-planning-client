import React, { useState } from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import { Button, Divider, Input, Form, message, Modal } from "antd";
import { useAuth } from "../../context/AuthContext";
import { useWorkoutPlanner } from "../../context/WorkoutPlannerContext";
import { useTheme } from "../../context/ThemeContext";

export default function ProfilePage() {
  const { currentUser, logout, updateCurrentUser } = useAuth();
  const { userService } = useWorkoutPlanner();
  const { isDarkMode } = useTheme();
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  const [weightForm] = Form.useForm();
  const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);

  if (!currentUser) {
    return (
      <PageLayout title="Профиль">
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Пожалуйста, войдите в систему</p>
        </div>
      </PageLayout>
    );
  }

  const handleEditProfile = () => {
    form.setFieldsValue({
      name: currentUser.name,
      email: currentUser.email,
      height: currentUser.height,
    });
    setIsEditMode(true);
  };

  const handleUpdateProfile = async (values) => {
    try {
      if (userService) {
        userService.updateUserProfile(
          values.name,
          userService.getCurrentUser().password,
          values.email,
          values.height
        );
        
        const updatedUser = {
          ...currentUser,
          name: values.name,
          email: values.email,
          height: values.height
        };
        
        updateCurrentUser(updatedUser);
        
        message.success("Профиль успешно обновлен");
      } else {
        message.warning("Сервис пользователей недоступен");
      }
      setIsEditMode(false);
    } catch (error) {
      message.error("Ошибка при обновлении профиля: " + error.message);
    }
  };

  const showWeightModal = () => {
    weightForm.resetFields();
    setIsWeightModalVisible(true);
  };

  const handleUpdateWeight = async (values) => {
    try {
      if (userService) {
        userService.updateUserWeight(Number(values.weight));
        
        const updatedUser = {
          ...currentUser,
          currentWeight: Number(values.weight)
        };
        
        // Вызываем метод из контекста вместо локального обновления
        updateCurrentUser(updatedUser);
        
        message.success("Вес успешно обновлен");
      } else {
        message.warning("Сервис пользователей недоступен");
      }
      setIsWeightModalVisible(false);
    } catch (error) {
      message.error("Ошибка при обновлении веса: " + error.message);
    }
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=0D8ABC&color=fff&size=128`;

  return (
    <PageLayout title="Профиль">
      <div className="flex flex-col w-full items-center mt-10 gap-5">
        {!isEditMode ? (
          <div className="w-full max-w-2xl">
            <div className="flex gap-4">
              <div className="flex-shrink-0 overflow-hidden">
                <img
                  src={avatarUrl}
                  className="w-32 h-32 object-cover rounded-xl"
                  alt="User profile"
                />
              </div>
              <div className="flex flex-col">
                <p className={`text-md ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Id: {currentUser.id}
                </p>
                <h1 className="text-4xl font-bold mb-2">{currentUser.name}</h1>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {currentUser.email}
                </p>
                <div className="mt-3">
                  <p className="text-lg">
                    Рост: {currentUser.height} см
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center">
              <h2 className="text-xl mr-4">
                Текущий вес: {currentUser.currentWeight} кг
              </h2>
              <Button 
                type="default" 
                onClick={showWeightModal} 
                size="small"
              >
                Обновить вес
              </Button>
            </div>
            
            <div className="mt-6 flex space-x-4">
              <Button 
                type="primary" 
                size="large" 
                onClick={handleEditProfile}
              >
                Редактировать профиль
              </Button>
              <Button 
                type="default" 
                size="large" 
                danger 
                onClick={logout}
              >
                Выйти
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Редактирование профиля</h2>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
              initialValues={{
                name: currentUser.name,
                email: currentUser.email,
                height: currentUser.height
              }}
            >
              <Form.Item
                name="name"
                label="Имя"
                rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
              >
                <Input size="large" />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Пожалуйста, введите email' },
                  { type: 'email', message: 'Пожалуйста, введите корректный email' }
                ]}
              >
                <Input size="large" />
              </Form.Item>
              
              <Form.Item
                name="height"
                label="Рост (см)"
                rules={[
                  { required: true, message: 'Пожалуйста, введите рост' },
                  { 
                    type: 'number', 
                    min: 100, 
                    max: 250, 
                    transform: (value) => Number(value),
                    message: 'Рост должен быть между 100 и 250 см' 
                  }
                ]}
              >
                <Input type="number" size="large" />
              </Form.Item>
              
              <Form.Item>
                <div className="flex space-x-4">
                  <Button type="primary" htmlType="submit" size="large">
                    Сохранить
                  </Button>
                  <Button 
                    type="default" 
                    size="large" 
                    onClick={() => setIsEditMode(false)}
                  >
                    Отмена
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        )}
      </div>
      
      <Divider />
      
      {}
      <Modal
        title="Обновить текущий вес"
        open={isWeightModalVisible}
        onCancel={() => setIsWeightModalVisible(false)}
        footer={null}
      >
        <Form
          form={weightForm}
          layout="vertical"
          onFinish={handleUpdateWeight}
        >
          <Form.Item
            name="weight"
            label="Новый вес (кг)"
            rules={[
              { required: true, message: 'Пожалуйста, введите ваш текущий вес' },
              { 
                type: 'number', 
                min: 30, 
                max: 300, 
                transform: (value) => Number(value),
                message: 'Вес должен быть между 30 и 300 кг' 
              }
            ]}
          >
            <Input type="number" />
          </Form.Item>
          
          <Form.Item>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setIsWeightModalVisible(false)}>
                Отмена
              </Button>
              <Button type="primary" htmlType="submit">
                Обновить
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </PageLayout>
  );
}