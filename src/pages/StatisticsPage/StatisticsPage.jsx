import React, { useState, useEffect } from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import {
  Button,
  Card,
  Spin,
  Empty,
  Form,
  Input,
  Modal,
  message,
  DatePicker,
  Tooltip,
  Divider,
} from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";
import { useWorkoutPlanner } from "../../context/WorkoutPlannerContext";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CalendarOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;

export default function StatisticsPage() {
  const [weightStats, setWeightStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);
  const [weightForm] = Form.useForm();
  const [dateRange, setDateRange] = useState([null, null]);

  const { workoutPlanner, statisticsService, userService } =
    useWorkoutPlanner();

  const { currentUser, updateCurrentUser } = useAuth();

  useEffect(() => {
    if (workoutPlanner && workoutPlanner.storageManager) {
      console.log("Выполняем синхронизацию данных...");
      workoutPlanner.storageManager.syncLocalStorageWithLibrary(workoutPlanner);
    }
    loadWeightData();
  }, [currentUser, statisticsService]);

  const loadWeightData = (startDate = null, endDate = null) => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log("Загрузка данных о весе пользователя:", currentUser.id);

      if (currentUser.weightHistory && currentUser.weightHistory.length > 0) {
        console.log("История веса пользователя:", currentUser.weightHistory);

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        let filteredHistory = currentUser.weightHistory;
        if (start || end) {
          filteredHistory = currentUser.weightHistory.filter((item) => {
            const itemDate = new Date(item.date);
            return (!start || itemDate >= start) && (!end || itemDate <= end);
          });
        }

        const weightHistory = filteredHistory
          .map((item) => ({
            date: new Date(item.date),
            weight: item.weight,
          }))
          .sort((a, b) => a.date - b.date);

        if (weightHistory.length === 0) {
          setWeightStats({
            dateWeights: [],
            userWeightProgress: 0,
          });
          setLoading(false);
          return;
        }

        const userWeightProgress =
          weightHistory.length > 1
            ? weightHistory[weightHistory.length - 1].weight -
              weightHistory[0].weight
            : 0;

        setWeightStats({
          dateWeights: weightHistory,
          userWeightProgress: userWeightProgress,
        });
      } else if (statisticsService) {
        try {
          const weightProgress = statisticsService.getUserWeightProgress(
            currentUser.id,
            startDate,
            endDate
          );
          console.log("Данные о весе из сервиса:", weightProgress);
          setWeightStats(weightProgress);
        } catch (error) {
          console.error("Ошибка при загрузке прогресса веса:", error);
          setWeightStats({
            dateWeights: [],
            userWeightProgress: 0,
          });
        }
      } else {
        console.warn("Нет данных о весе и сервис статистики недоступен");
        setWeightStats({
          dateWeights: [],
          userWeightProgress: 0,
        });
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных о весе:", error);
      message.error("Не удалось загрузить статистику веса");
      setWeightStats({
        dateWeights: [],
        userWeightProgress: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    if (!dates || dates.length !== 2) {
      setDateRange([null, null]);
      loadWeightData();
      return;
    }

    const [start, end] = dates;
    setDateRange([start, end]);

    const startDate = start ? start.toDate() : null;
    const endDate = end ? end.toDate() : null;

    loadWeightData(startDate, endDate);
  };

  const resetDateFilter = () => {
    setDateRange([null, null]);
    loadWeightData();
  };

  const showWeightModal = () => {
    weightForm.resetFields();
    weightForm.setFieldsValue({ weight: currentUser?.currentWeight });
    setIsWeightModalVisible(true);
  };

  const handleUpdateWeight = (values) => {
    try {
      if (userService) {
        const newWeight = Number(values.weight);
        userService.updateUserWeight(newWeight);

        const newWeightRecord = {
          date: new Date(),
          weight: newWeight,
        };

        const updatedUser = {
          ...currentUser,
          currentWeight: newWeight,
          weightHistory: [
            ...(currentUser.weightHistory || []),
            newWeightRecord,
          ],
        };

        updateCurrentUser(updatedUser);

        message.success("Вес успешно обновлен");

        const startDate = dateRange[0] ? dateRange[0].toDate() : null;
        const endDate = dateRange[1] ? dateRange[1].toDate() : null;
        setTimeout(() => loadWeightData(startDate, endDate), 300);
      } else {
        message.warning("Сервис пользователей недоступен");
      }
      setIsWeightModalVisible(false);
    } catch (error) {
      message.error("Ошибка при обновлении веса: " + error.message);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("ru-RU", options);
  };

  const dateFilter = (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CalendarOutlined className="mr-2" />
          <span className="mr-2">Период:</span>
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            allowClear={true}
            format="DD.MM.YYYY"
          />
        </div>
        <Tooltip title="Сбросить фильтр">
          <Button
            icon={<ReloadOutlined />}
            onClick={resetDateFilter}
            disabled={!dateRange[0] && !dateRange[1]}
          >
            Сбросить
          </Button>
        </Tooltip>
      </div>
    </div>
  );

  return (
    <PageLayout title="Статистика">
      <Divider>
        <p className="text-xl">Вес</p>
      </Divider>

      {dateFilter}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : !weightStats ||
        !weightStats.dateWeights ||
        weightStats.dateWeights.length === 0 ? (
        <Card>
          <Empty
            description={
              dateRange[0] || dateRange[1]
                ? "Нет данных о весе в выбранном диапазоне дат"
                : "Нет данных о весе"
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <div className="flex justify-center mt-4">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showWeightModal}
            >
              Добавить запись о весе
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold">
                  Текущий вес: {currentUser.currentWeight} кг
                </h1>
                {weightStats.dateWeights.length > 1 && (
                  <p className="text-gray-500 flex items-center mt-2">
                    {weightStats.userWeightProgress > 0 ? (
                      <ArrowUpOutlined style={{ color: "#cf1322" }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: "#3f8600" }} />
                    )}
                    <span className="ml-1">
                      {Math.abs(weightStats.userWeightProgress).toFixed(1)} кг с{" "}
                      {formatDate(weightStats.dateWeights[0].date)}
                    </span>
                    {dateRange[0] && dateRange[1] && " (в выбранном периоде)"}
                  </p>
                )}
              </div>
              <Button type="primary" size="large" onClick={showWeightModal}>
                Обновить вес
              </Button>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weightStats.dateWeights.map((item) => ({
                    date: formatDate(item.date),
                    weight: item.weight,
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                  <ChartTooltip formatter={(value) => [`${value} кг`, "Вес"]} />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#818cf8"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}

      <Modal
        title="Обновить текущий вес"
        open={isWeightModalVisible}
        onCancel={() => setIsWeightModalVisible(false)}
        footer={null}
        destroyOnClose={true}
      >
        <Form
          form={weightForm}
          layout="vertical"
          onFinish={handleUpdateWeight}
          initialValues={{ weight: currentUser?.currentWeight }}
        >
          <Form.Item
            name="weight"
            label="Новый вес (кг)"
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите ваш текущий вес",
              },
              {
                type: "number",
                min: 30,
                max: 300,
                transform: (value) => Number(value),
                message: "Вес должен быть между 30 и 300 кг",
              },
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
