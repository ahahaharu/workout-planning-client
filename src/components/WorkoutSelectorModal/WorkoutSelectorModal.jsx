import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Tabs,
  List,
  Empty,
  Form,
  DatePicker,
  Spin,
  message,
} from "antd";
import { CalendarDays, FileText, Plus, Search } from "lucide-react";
import { useWorkoutPlanner } from "../../context/WorkoutPlannerContext";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";

export default function WorkoutSelectorModal({
  isOpen,
  onClose,
  onStartEmptyWorkout,
  onStartPlanWorkout,
}) {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [workoutForm] = Form.useForm();
  const { workoutPlanService } = useWorkoutPlanner();
  const { currentUser } = useAuth();

  // Эффект для загрузки планов тренировок
  useEffect(() => {
    if (isOpen && workoutPlanService && currentUser) {
      setLoading(true);
      try {
        const plans = workoutPlanService.getWorkoutPlansForUser(currentUser.id);
        setWorkoutPlans(plans);
        setFilteredPlans(plans);
      } catch (error) {
        console.error("Ошибка при загрузке планов тренировок:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [isOpen, workoutPlanService, currentUser]);

  // Новый эффект для сброса и инициализации формы при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      // Устанавливаем текущую дату при каждом открытии модального окна
      workoutForm.setFieldsValue({
        date: dayjs(),
      });
    }
  }, [isOpen, workoutForm]);

  // Обработка поиска планов
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (!value) {
      setFilteredPlans(workoutPlans);
      return;
    }

    const filtered = workoutPlans.filter((plan) =>
      plan.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPlans(filtered);
  };

  // Создание пустой тренировки
  const handleStartEmptyWorkout = () => {
    workoutForm.validateFields().then((values) => {
      onStartEmptyWorkout({
        // Название будет сгенерировано в WorkoutsPage
        date: values.date ? values.date.toDate() : new Date(),
        exercises: [],
      });

      workoutForm.resetFields();
      onClose();
    });
  };

  // Выбор плана для тренировки
  const handleSelectPlan = (plan) => {
    workoutForm.validateFields().then((values) => {
      // Проверяем наличие валидного ID плана
      if (!plan || typeof plan.id === "undefined") {
        message.error("Выбран некорректный план тренировки");
        return;
      }

      // Передаем числовой ID (не объект)
      const planId = !isNaN(Number(plan.id)) ? Number(plan.id) : plan.id;
      console.log("Выбран план с ID:", planId, "тип:", typeof planId);

      onStartPlanWorkout({
        // Название будет сгенерировано в WorkoutsPage
        date: values.date ? values.date.toDate() : new Date(),
        planId: planId, // Только ID плана
        exercises: plan.exercises || [],
      });

      workoutForm.resetFields();
      onClose();
    });
  };

  // Вкладки для выбора типа тренировки
  const items = [
    {
      key: "empty",
      label: "Пустая тренировка",
      children: (
        <div className="flex flex-col gap-4">
          <p className="text-gray-500">
            Создайте пустую тренировку без предустановленных упражнений. Вы
            сможете добавить упражнения в процессе тренировки.
          </p>

          <Form form={workoutForm} layout="vertical">
            <Form.Item
              label="Дата тренировки"
              name="date"
              initialValue={dayjs()}
            >
              <DatePicker
                className="w-full"
                format="DD.MM.YYYY"
                placeholder="Выберите дату"
              />
            </Form.Item>
          </Form>

          <Button
            type="primary"
            size="large"
            icon={<Plus size={18} />}
            onClick={handleStartEmptyWorkout}
          >
            Начать пустую тренировку
          </Button>
        </div>
      ),
    },
    {
      key: "plan",
      label: "По плану тренировки",
      children: (
        <div className="flex flex-col gap-4">
          <p className="text-gray-500">
            Выберите один из ваших планов тренировок для начала тренировки с
            предустановленными упражнениями.
          </p>

          <Form form={workoutForm} layout="vertical">
            <Form.Item
              label="Дата тренировки"
              name="date"
              initialValue={dayjs()}
            >
              <DatePicker
                className="w-full"
                format="DD.MM.YYYY"
                placeholder="Выберите дату"
              />
            </Form.Item>
          </Form>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Поиск плана тренировки..."
              className="w-full p-2 border rounded-md focus:outline-none focus:border-indigo-500"
              value={searchText}
              onChange={handleSearch}
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Spin />
            </div>
          ) : filteredPlans.length > 0 ? (
            <div className="max-h-80 overflow-auto">
              <List
                dataSource={filteredPlans}
                renderItem={(plan) => (
                  <List.Item
                    key={plan.id}
                    className="hover:bg-gray-50 rounded cursor-pointer transition-colors"
                    onClick={() => handleSelectPlan(plan)}
                  >
                    <div className="flex items-center w-full py-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">{plan.name}</h3>
                        <p className="text-gray-500 text-sm">
                          {plan.exercises
                            ? `${plan.exercises.length} упражнений`
                            : "Нет упражнений"}
                        </p>
                      </div>
                      <Button type="primary" size="small">
                        Выбрать
                      </Button>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          ) : (
            <Empty description="У вас нет планов тренировок" />
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal
      title="Выбор тренировки"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Tabs defaultActiveKey="empty" items={items} />
    </Modal>
  );
}
