import React, { useState, useEffect } from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import { message, Divider } from "antd";
import { useWorkoutPlanner } from "../../context/WorkoutPlannerContext";
import { useAuth } from "../../context/AuthContext";

// Импортируем компоненты
import WeightStatistics from "../../components/WeightStatistics/WeightStatistics";
import WorkoutStatistics from "../../components/WorkoutStatistics/WorkoutStatistics";
import WeightUpdateModal from "../../components/WeightUpdateModal/WeightUpdateModal";
import ExerciseStatistics from "../../components/ExerciseStatistics/ExerciseStatistics";

export default function StatisticsPage() {
  const [weightStats, setWeightStats] = useState(null);
  const [workoutStats, setWorkoutStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workoutLoading, setWorkoutLoading] = useState(true);
  const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);

  // Состояния для статистики упражнений
  const [exercises, setExercises] = useState([]);
  const [exercisesLoading, setExercisesLoading] = useState(true);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [exerciseStats, setExerciseStats] = useState(null);
  const [exerciseStatsLoading, setExerciseStatsLoading] = useState(false);

  // Разделяем диапазоны дат для каждого раздела
  const [weightDateRange, setWeightDateRange] = useState([null, null]);
  const [workoutDateRange, setWorkoutDateRange] = useState([null, null]);
  const [exerciseDateRange, setExerciseDateRange] = useState([null, null]);

  const {
    workoutPlanner,
    statisticsService,
    userService,
    exerciseService,
    workoutService,
  } = useWorkoutPlanner();

  const { currentUser, updateCurrentUser } = useAuth();

  useEffect(() => {
    if (workoutPlanner && workoutPlanner.storageManager) {
      console.log("Выполняем синхронизацию данных...");
      workoutPlanner.storageManager.syncLocalStorageWithLibrary(workoutPlanner);
    }
    loadWeightData();
    loadWorkoutData();
    loadUserExercises();
  }, [currentUser, statisticsService, workoutService, exerciseService]);

  // Загрузка списка упражнений, которые пользователь использовал в тренировках
  const loadUserExercises = () => {
    if (!currentUser || !workoutService || !exerciseService) {
      setExercisesLoading(false);
      return;
    }

    setExercisesLoading(true);
    try {
      // Получаем все тренировки пользователя
      const userWorkouts = workoutService.getWorkoutsForUser(currentUser.id);

      // Собираем уникальные ID упражнений из всех тренировок
      const exerciseIds = new Set();
      userWorkouts.forEach((workout) => {
        if (workout.exercises && workout.exercises.length > 0) {
          workout.exercises.forEach((exercise) => {
            exerciseIds.add(exercise.id);
          });
        }
      });

      // Получаем полные данные упражнений из сервиса упражнений
      const userExercises = [];
      exerciseIds.forEach((id) => {
        try {
          const exercise = exerciseService.getExerciseById(id);
          if (exercise) {
            userExercises.push(exercise);
          }
        } catch (error) {
          console.error(`Ошибка при получении упражнения с ID ${id}:`, error);
        }
      });

      // Сортируем упражнения по имени
      userExercises.sort((a, b) => a.name.localeCompare(b.name));

      setExercises(userExercises);
      console.log(`Загружено ${userExercises.length} упражнений пользователя`);
    } catch (error) {
      console.error("Ошибка при загрузке упражнений пользователя:", error);
      message.error("Не удалось загрузить список упражнений");
    } finally {
      setExercisesLoading(false);
    }
  };

  // Обработчик выбора упражнения для просмотра статистики
  const handleExerciseSelect = (exerciseId) => {
    if (!exerciseId || !statisticsService || !currentUser) {
      setExerciseStats(null);
      setSelectedExerciseId(null);
      return;
    }

    // Получаем даты из диапазона, если они установлены
    const startDate = exerciseDateRange[0]
      ? exerciseDateRange[0].toDate()
      : null;
    const endDate = exerciseDateRange[1] ? exerciseDateRange[1].toDate() : null;

    loadExerciseStats(exerciseId, startDate, endDate);
  };

  const loadExerciseStats = (exerciseId, startDate = null, endDate = null) => {
    if (!exerciseId || !statisticsService || !currentUser) {
      setExerciseStats(null);
      return;
    }

    setExerciseStatsLoading(true);
    setSelectedExerciseId(exerciseId);

    try {
      const stats = statisticsService.getExerciseProgress(
        currentUser.id,
        exerciseId,
        startDate,
        endDate
      );

      console.log("Загружена статистика упражнения:", stats);
      setExerciseStats(stats);
    } catch (error) {
      console.error("Ошибка при загрузке статистики упражнения:", error);
      message.error("Не удалось загрузить статистику упражнения");
      setExerciseStats(null);
    } finally {
      setExerciseStatsLoading(false);
    }
  };

  const handleExerciseDateRangeChange = (dates) => {
    if (!dates || dates.length !== 2) {
      setExerciseDateRange([null, null]);
      if (selectedExerciseId) {
        loadExerciseStats(selectedExerciseId);
      }
      return;
    }

    const [start, end] = dates;
    setExerciseDateRange([start, end]);

    if (selectedExerciseId) {
      const startDate = start ? start.toDate() : null;
      const endDate = end ? end.toDate() : null;
      loadExerciseStats(selectedExerciseId, startDate, endDate);
    }
  };

  const resetExerciseDateFilter = () => {
    setExerciseDateRange([null, null]);
    if (selectedExerciseId) {
      loadExerciseStats(selectedExerciseId);
    }
  };

  // Вспомогательные функции
  const formatDate = (date) => {
    if (!date) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("ru-RU", options);
  };

  const formatDuration = (minutes) => {
    if (!minutes || minutes === 0) return "0 мин";
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours} ч ${mins > 0 ? mins + " мин" : ""}`;
    } else {
      return `${mins} мин`;
    }
  };

  // Функции загрузки данных
  const loadWorkoutData = (startDate = null, endDate = null) => {
    if (!currentUser || !statisticsService) {
      setWorkoutLoading(false);
      return;
    }

    setWorkoutLoading(true);
    try {
      const workoutProgress = statisticsService.getWorkoutProgress(
        currentUser.id,
        startDate,
        endDate
      );

      if (workoutProgress && workoutProgress.workoutsByDate) {
        const sortedWorkouts = [...workoutProgress.workoutsByDate].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setWorkoutStats({
          ...workoutProgress,
          workoutsByDate: sortedWorkouts,
        });
      } else {
        setWorkoutStats({
          totalWeightProgress: 0,
          totalDistanceProgress: 0,
          totalDurationProgress: 0,
          workoutsByDate: [],
        });
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных о тренировках:", error);
      message.error("Не удалось загрузить статистику тренировок");
      setWorkoutStats({
        totalWeightProgress: 0,
        totalDistanceProgress: 0,
        totalDurationProgress: 0,
        workoutsByDate: [],
      });
    } finally {
      setWorkoutLoading(false);
    }
  };

  const loadWeightData = (startDate = null, endDate = null) => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (currentUser.weightHistory && currentUser.weightHistory.length > 0) {
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
          setWeightStats(weightProgress);
        } catch (error) {
          console.error("Ошибка при загрузке прогресса веса:", error);
          setWeightStats({
            dateWeights: [],
            userWeightProgress: 0,
          });
        }
      } else {
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

  // Обработчики событий для веса
  const handleWeightDateRangeChange = (dates) => {
    if (!dates || dates.length !== 2) {
      setWeightDateRange([null, null]);
      loadWeightData();
      return;
    }

    const [start, end] = dates;
    setWeightDateRange([start, end]);

    const startDate = start ? start.toDate() : null;
    const endDate = end ? end.toDate() : null;

    loadWeightData(startDate, endDate);
  };

  const resetWeightDateFilter = () => {
    setWeightDateRange([null, null]);
    loadWeightData();
  };

  const showWeightModal = () => {
    setIsWeightModalVisible(true);
  };

  const handleWeightModalClose = () => {
    setIsWeightModalVisible(false);
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

        const startDate = weightDateRange[0]
          ? weightDateRange[0].toDate()
          : null;
        const endDate = weightDateRange[1] ? weightDateRange[1].toDate() : null;
        setTimeout(() => loadWeightData(startDate, endDate), 300);
      } else {
        message.warning("Сервис пользователей недоступен");
      }
      setIsWeightModalVisible(false);
    } catch (error) {
      message.error("Ошибка при обновлении веса: " + error.message);
    }
  };

  // Обработчики событий для тренировок
  const handleWorkoutDateRangeChange = (dates) => {
    if (!dates || dates.length !== 2) {
      setWorkoutDateRange([null, null]);
      loadWorkoutData();
      return;
    }

    const [start, end] = dates;
    setWorkoutDateRange([start, end]);

    const startDate = start ? start.toDate() : null;
    const endDate = end ? end.toDate() : null;

    loadWorkoutData(startDate, endDate);
  };

  const resetWorkoutDateFilter = () => {
    setWorkoutDateRange([null, null]);
    loadWorkoutData();
  };

  return (
    <PageLayout title="Статистика">
      <Divider>
        <p className="text-xl">Вес</p>
      </Divider>

      <WeightStatistics
        stats={weightStats}
        loading={loading}
        dateRange={weightDateRange}
        onDateRangeChange={handleWeightDateRangeChange}
        onDateRangeReset={resetWeightDateFilter}
        onAddWeight={showWeightModal}
        currentUser={currentUser}
        formatDate={formatDate}
      />

      <Divider>
        <p className="text-xl">Тренировки</p>
      </Divider>

      <WorkoutStatistics
        stats={workoutStats}
        loading={workoutLoading}
        dateRange={workoutDateRange}
        onDateRangeChange={handleWorkoutDateRangeChange}
        onDateRangeReset={resetWorkoutDateFilter}
        formatDate={formatDate}
        formatDuration={formatDuration}
      />

      <Divider>
        <p className="text-xl">Упражнения</p>
      </Divider>

      <ExerciseStatistics
        exercises={exercises}
        loading={exercisesLoading}
        exerciseStats={exerciseStats}
        statsLoading={exerciseStatsLoading}
        onExerciseSelect={handleExerciseSelect}
        formatDate={formatDate}
        dateRange={exerciseDateRange}
        onDateRangeChange={handleExerciseDateRangeChange}
        onDateRangeReset={resetExerciseDateFilter}
      />

      <WeightUpdateModal
        visible={isWeightModalVisible}
        onClose={handleWeightModalClose}
        onSubmit={handleUpdateWeight}
        initialValue={currentUser?.currentWeight}
      />
    </PageLayout>
  );
}
