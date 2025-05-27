import React, { useState, useEffect } from "react";
import {
  Card,
  Empty,
  Spin,
  Select,
  Statistic,
  Row,
  Col,
  Divider,
  Alert,
} from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  FireOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Dumbbell } from "lucide-react";
import DateRangeFilter from "../DateRangeFilter/DateRangeFilter";

const { Option } = Select;

export default function ExerciseStatistics({
  exercises,
  loading,
  exerciseStats,
  statsLoading,
  onExerciseSelect,
  formatDate,
  dateRange,
  onDateRangeChange,
  onDateRangeReset,
}) {
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);

  const handleExerciseSelect = (exerciseId) => {
    console.log("Выбрано упражнение с ID:", exerciseId);
    setSelectedExerciseId(exerciseId);
    if (onExerciseSelect) {
      onExerciseSelect(exerciseId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <Card>
        <Empty
          description="У вас пока нет упражнений в тренировках"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  // Секция выбора упражнения и фильтра дат
  const filtersSection = (
    <>
      <div className="mb-4">
        <div className="flex items-center">
          <Dumbbell size={18} className="mr-2 text-indigo-500" />
          <span className="mr-2">Выберите упражнение:</span>
          <Select
            placeholder="Выберите упражнение"
            style={{ width: 300 }}
            onChange={handleExerciseSelect}
            value={selectedExerciseId}
            optionFilterProp="children"
            showSearch
          >
            {exercises.map((exercise) => (
              <Option key={exercise.id} value={exercise.id}>
                {exercise.name}
                {exercise.bodyPart &&
                exercise.type !== "STRENGTH" &&
                exercise.type !== "Strength"
                  ? ` (${exercise.bodyPart})`
                  : ""}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {selectedExerciseId && (
        <DateRangeFilter
          value={dateRange}
          onChange={onDateRangeChange}
          onReset={onDateRangeReset}
        />
      )}
    </>
  );

  if (statsLoading) {
    return (
      <div>
        {filtersSection}
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (
    !selectedExerciseId ||
    !exerciseStats ||
    !exerciseStats.progress ||
    exerciseStats.progress.length === 0
  ) {
    return (
      <div>
        {filtersSection}
        <Card>
          <Empty
            description={
              selectedExerciseId
                ? "Нет данных для этого упражнения в выбранном периоде"
                : "Выберите упражнение для просмотра статистики"
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      </div>
    );
  }

  console.log("Данные для упражнения:", exerciseStats.progress[0]);

  console.log(
    "Данные прогресса упражнения:",
    JSON.stringify(exerciseStats.progress, null, 2)
  );
  console.log(
    "Метрики прогресса:",
    JSON.stringify(
      {
        weightProgress: exerciseStats.weightProgress,
        repsProgress: exerciseStats.repsProgress,
        durationProgress: exerciseStats.durationProgress,
        distanceProgress: exerciseStats.distanceProgress,
        intensityProgress: exerciseStats.intensityProgress,
      },
      null,
      2
    )
  );

  let exerciseType = "unknown";
  const firstProgress = exerciseStats.progress[0];

  if (firstProgress) {
    if (
      firstProgress.totalWeight !== undefined ||
      firstProgress.maxWeight !== undefined
    ) {
      exerciseType = "strength";
    } else if (firstProgress.totalDistance !== undefined) {
      exerciseType = "cardio";
    } else if (
      firstProgress.totalDuration !== undefined &&
      !firstProgress.totalDistance
    ) {
      exerciseType = "endurance";
    }
  }

  console.log("Определенный тип упражнения:", exerciseType);

  const chartData = exerciseStats.progress.map((entry) => {
    const baseData = {
      date: formatDate(entry.date),
      exerciseId: entry.exerciseId,
    };

    if (exerciseType === "strength") {
      return {
        ...baseData,
        вес: entry.totalWeight || 0,
        "макс. вес": entry.maxWeight || 0,
        "одноповторный максимум": entry.bestOneRepMax || 0,
      };
    } else if (exerciseType === "cardio") {
      return {
        ...baseData,
        дистанция: entry.totalDistance || 0,
        время: entry.totalDuration || 0,
        скорость: entry.averageSpeed || 0,
      };
    } else if (exerciseType === "endurance") {
      return {
        ...baseData,
        время: entry.totalDuration || 0,
        сложность: entry.difficulty || entry.totalIntensity || 0,
      };
    }

    return {
      ...baseData,
      вес: entry.totalWeight || 0,
      "макс. вес": entry.maxWeight || 0,
      "одноповторный максимум": entry.bestOneRepMax || 0,
    };
  });

  let progressMetrics = null;

  if (exerciseType === "strength") {
    progressMetrics = (
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="Прогресс в весе"
            value={Math.abs(exerciseStats.totalWeightProgress || 0).toFixed(1)}
            suffix="кг"
            valueStyle={{
              color:
                (exerciseStats.totalWeightProgress || 0) >= 0
                  ? "#3f8600"
                  : "#cf1322",
            }}
            prefix={
              (exerciseStats.totalWeightProgress || 0) >= 0 ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )
            }
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Прогресс в макс. весе"
            value={Math.abs(exerciseStats.maxWeightProgress || 0).toFixed(1)}
            suffix="кг"
            valueStyle={{
              color:
                (exerciseStats.maxWeightProgress || 0) >= 0
                  ? "#3f8600"
                  : "#cf1322",
            }}
            prefix={
              (exerciseStats.maxWeightProgress || 0) >= 0 ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )
            }
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Максимальный вес"
            value={exerciseStats.progress
              .reduce((max, p) => Math.max(max, p.maxWeight || 0), 0)
              .toFixed(1)}
            suffix="кг"
            prefix={<TrophyOutlined />}
          />
        </Col>
      </Row>
    );
  } else if (exerciseType === "cardio") {
    progressMetrics = (
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="Прогресс в дистанции"
            value={Math.abs(
              exerciseStats.distanceProgress ||
                exerciseStats.totalDistanceProgress ||
                0
            ).toFixed(1)}
            suffix="км"
            valueStyle={{
              color:
                (exerciseStats.distanceProgress ||
                  exerciseStats.totalDistanceProgress ||
                  0) >= 0
                  ? "#3f8600"
                  : "#cf1322",
            }}
            prefix={
              (exerciseStats.distanceProgress ||
                exerciseStats.totalDistanceProgress ||
                0) >= 0 ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )
            }
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Прогресс во времени"
            value={Math.abs(
              exerciseStats.durationProgress ||
                exerciseStats.totalDurationProgress ||
                0
            ).toFixed(1)}
            suffix="мин"
            valueStyle={{
              color:
                (exerciseStats.durationProgress ||
                  exerciseStats.totalDurationProgress ||
                  0) >= 0
                  ? "#3f8600"
                  : "#cf1322",
            }}
            prefix={
              (exerciseStats.durationProgress ||
                exerciseStats.totalDurationProgress ||
                0) >= 0 ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )
            }
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Макс. дистанция за раз"
            value={exerciseStats.progress
              .reduce(
                (max, p) => Math.max(max, p.distance || p.totalDistance || 0),
                0
              )
              .toFixed(1)}
            suffix="км"
            prefix={<FireOutlined />}
          />
        </Col>
      </Row>
    );
  } else if (exerciseType === "endurance") {
    progressMetrics = (
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="Прогресс во времени"
            value={Math.abs(
              exerciseStats.durationProgress ||
                exerciseStats.totalDurationProgress ||
                0
            ).toFixed(1)}
            suffix="мин"
            valueStyle={{
              color:
                (exerciseStats.durationProgress ||
                  exerciseStats.totalDurationProgress ||
                  0) >= 0
                  ? "#3f8600"
                  : "#cf1322",
            }}
            prefix={
              (exerciseStats.durationProgress ||
                exerciseStats.totalDurationProgress ||
                0) >= 0 ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )
            }
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Прогресс в сложности"
            value={Math.abs(
              exerciseStats.intensityProgress ||
                exerciseStats.totalIntensityProgress ||
                0
            ).toFixed(1)}
            valueStyle={{
              color:
                (exerciseStats.intensityProgress ||
                  exerciseStats.totalIntensityProgress ||
                  0) >= 0
                  ? "#3f8600"
                  : "#cf1322",
            }}
            prefix={
              (exerciseStats.intensityProgress ||
                exerciseStats.totalIntensityProgress ||
                0) >= 0 ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )
            }
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Макс. время за раз"
            value={exerciseStats.progress
              .reduce(
                (max, p) => Math.max(max, p.duration || p.totalDuration || 0),
                0
              )
              .toFixed(1)}
            suffix="мин"
            prefix={<TrophyOutlined />}
          />
        </Col>
      </Row>
    );
  } else {
    progressMetrics = (
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="Количество выполнений"
            value={exerciseStats.progress.length}
            prefix={<TrophyOutlined />}
          />
        </Col>
      </Row>
    );
  }

  let chart = null;

  if (exerciseType === "strength") {
    chart = (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="вес"
              fill="#8884d8"
              name="Общий вес (кг)"
            />
            <Bar
              yAxisId="left"
              dataKey="макс. вес"
              fill="#b884d8"
              name="Макс. вес (кг)"
            />
            <Bar
              yAxisId="right"
              dataKey="одноповторный максимум"
              fill="#82ca9d"
              name="1ПМ (кг)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  } else if (exerciseType === "cardio") {
    chart = (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="дистанция"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="Дистанция (км)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="время"
              stroke="#82ca9d"
              name="Время (мин)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  } else if (exerciseType === "endurance") {
    chart = (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="время"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="Время (мин)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="сложность"
              stroke="#82ca9d"
              name="Сложность (1-10)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  } else {
    chart = (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {chartData[0]?.вес !== undefined && (
              <Line
                type="monotone"
                dataKey="вес"
                stroke="#8884d8"
                name="Вес (кг)"
              />
            )}
            {chartData[0]?.дистанция !== undefined && (
              <Line
                type="monotone"
                dataKey="дистанция"
                stroke="#82ca9d"
                name="Дистанция (км)"
              />
            )}
            {chartData[0]?.время !== undefined && (
              <Line
                type="monotone"
                dataKey="время"
                stroke="#ffc658"
                name="Время (мин)"
              />
            )}
            {chartData[0]?.повторения !== undefined && (
              <Line
                type="monotone"
                dataKey="повторения"
                stroke="#ff8042"
                name="Повторения"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div>
      {filtersSection}

      <Card className="mb-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">
            {exercises.find(
              (e) => e.id === exerciseStats.progress[0]?.exerciseId
            )?.name || "Упражнение"}
          </h1>
          <p className="text-gray-500">
            Выполнено {exerciseStats.progress.length} раз в тренировках
          </p>
          <p className="text-gray-500">
            Тип упражнения:{" "}
            {exerciseType === "strength"
              ? "Силовое"
              : exerciseType === "cardio"
              ? "Кардио"
              : exerciseType === "endurance"
              ? "Выносливость"
              : "Не определен"}
          </p>
        </div>

        {exerciseStats.progress.length > 1 && (
          <div className="mt-4 mb-6">
            <Divider>Прогресс</Divider>
            {progressMetrics}
          </div>
        )}

        {exerciseStats.progress.length === 1 && (
          <Alert
            message="Недостаточно данных"
            description="Для отображения прогресса необходимо как минимум две тренировки с этим упражнением."
            type="info"
            showIcon
            className="mb-4"
          />
        )}

        {chart}
      </Card>
    </div>
  );
}
