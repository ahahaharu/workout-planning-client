import { Button, Divider, Modal, Tabs, Spin, Card, Tag, Empty } from "antd";
import {
  Edit,
  Trash,
  Calendar,
  Weight,
  BarChart2,
  Clock,
  Navigation,
  Flame,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useWorkoutPlanner } from "../../context/WorkoutPlannerContext";

export default function WorkoutPlanInfoModal({
  isOpen,
  onClose,
  workoutPlan,
  onDelete,
  onEdit,
}) {
  const [loading, setLoading] = useState(true);
  const [planHistory, setPlanHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { workoutService } = useWorkoutPlanner();

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && workoutPlan && workoutService) {
      loadPlanHistory();
    }
  }, [isOpen, workoutPlan, workoutService]);

  const formatTime = (minutes) => {
    if (!minutes || minutes === 0) return "0 мин";
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    let result = "";
    if (h > 0) {
      result += `${h} ч `;
    }
    if (m > 0 || h === 0) {
      result += `${m} мин`;
    }
    return result.trim() || "0 мин";
  };

  const loadPlanHistory = () => {
    if (!workoutPlan || !workoutService) return;

    setHistoryLoading(true);

    try {
      const allWorkouts = workoutService.getAllWorkouts();

      const relevantWorkouts = allWorkouts.filter(
        (workout) => workout.plan && workout.plan.id === workoutPlan.id
      );

      const sortedWorkouts = relevantWorkouts.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateB - dateA;
      });

      const historyData = sortedWorkouts.map((workout) => {
        let totalWeight = 0;
        let totalDistance = 0;
        let totalDuration = 0;
        let totalCalories = 0;
        const exercisesCount = (workout.exercises || []).length;

        (workout.exercises || []).forEach((exercise) => {
          const exerciseType = (exercise.type || "").toUpperCase();
          const sets = exercise.completedSets || exercise.sets || [];
          const sessions =
            exercise.completedSessions || exercise.sessions || [];

          if (exerciseType === "STRENGTH") {
            sets.forEach((set) => {
              totalWeight +=
                (Number(set.weight) || 0) * (Number(set.reps) || 0);
            });
          } else if (exerciseType === "CARDIO") {
            sessions.forEach((session) => {
              totalDistance += Number(session.distance) || 0;
              totalDuration += Number(session.duration) || 0;
              totalCalories += Number(session.caloriesBurned) || 0;
            });
          } else if (exerciseType === "ENDURANCE") {
            sessions.forEach((session) => {
              totalDuration += Number(session.duration) || 0;
            });
          }
        });

        return {
          workoutId: workout.id,
          workoutName: workout.name || `Тренировка ${workout.id}`,
          date: formatDate(workout.date),
          totalWeight,
          totalDistance,
          totalDuration,
          totalCalories,
          exercisesCount,
        };
      });

      setPlanHistory(historyData);
    } catch (error) {
      console.error("Ошибка при загрузке истории плана тренировки:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Дата не указана";

    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("ru-RU", options);
  };

  const handleEditPlan = () => {
    if (onEdit && workoutPlan) {
      onEdit(workoutPlan);
      onClose();
    }
  };

  const handleDeletePlan = () => {
    if (onDelete && workoutPlan) {
      onDelete(workoutPlan.id);
      onClose();
    }
  };

  const items = [
    {
      key: "1",
      label: "Информация",
      children: (
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{workoutPlan?.name}</h1>
          <div>
            <p>
              <b>Описание:</b>
            </p>
            <p>{workoutPlan?.description || "Описание отсутствует"}</p>
          </div>
          <Divider />
          {workoutPlan?.exercises && workoutPlan.exercises.length > 0 ? (
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">Упражнения в плане:</h2>
              {workoutPlan.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-md flex items-center gap-2"
                >
                  {exercise.image && (
                    <img
                      src={exercise.image}
                      alt={exercise.name}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{exercise.name}</p>
                    {exercise.sets && exercise.sets.length > 0 && (
                      <p className="text-sm text-gray-500">
                        {exercise.sets.length}{" "}
                        {exercise.sets.length === 1
                          ? "подход"
                          : exercise.sets.length < 5
                          ? "подхода"
                          : "подходов"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center my-5 text-gray-600 font-semibold">
              Упражнений нет
            </div>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: "История тренировок",
      children: (
        <div className="flex flex-col gap-4 mb-4">
          <h1 className="text-2xl font-bold">
            История тренировок с этой программой
          </h1>

          {historyLoading ? (
            <div className="flex justify-center py-10">
              <Spin size="large" />
            </div>
          ) : planHistory.length > 0 ? (
            <div className="flex flex-col gap-3">
              {planHistory.map((item, index) => (
                <Card
                  key={`${item.workoutId}-${index}`}
                  size="large"
                  className="shadow-sm"
                  title={
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{item.workoutName}</span>
                      <Tag color="blue">
                        <div className="flex items-center gap-1.5 py-0.5 px-2">
                          <Calendar size={14} />
                          <span>{item.date}</span>
                        </div>
                      </Tag>
                    </div>
                  }
                >
                  <div className="flex flex-wrap gap-2">
                    {item.exercisesCount > 0 && (
                      <Tag>
                        <div className="flex items-center gap-1.5 py-0.5 px-2">
                          <BarChart2 size={14} />
                          <span>{item.exercisesCount} упр.</span>
                        </div>
                      </Tag>
                    )}
                    {item.totalWeight > 0 && (
                      <Tag color="green">
                        <div className="flex items-center gap-1.5 py-0.5 px-2">
                          <Weight size={14} />
                          <span>{item.totalWeight} кг</span>
                        </div>
                      </Tag>
                    )}
                    {item.totalDistance > 0 && (
                      <Tag color="cyan">
                        <div className="flex items-center gap-1.5 py-0.5 px-2">
                          <Navigation size={14} />
                          <span>{item.totalDistance.toFixed(1)} км</span>
                        </div>
                      </Tag>
                    )}
                    {item.totalDuration > 0 && (
                      <Tag color="purple">
                        <div className="flex items-center gap-1.5 py-0.5 px-2">
                          <Clock size={14} />
                          <span>{formatTime(item.totalDuration)}</span>
                        </div>
                      </Tag>
                    )}
                    {item.totalCalories > 0 && (
                      <Tag color="orange">
                        <div className="flex items-center gap-1.5 py-0.5 px-2">
                          <Flame size={14} />
                          <span>{item.totalCalories} ккал</span>
                        </div>
                      </Tag>
                    )}
                  </div>
                </Card>
              ))}

              {planHistory.length > 5 && (
                <div className="flex items-center justify-center my-2">
                  <Tag color="geekblue">
                    <div className="flex items-center gap-1.5 py-0.5 px-2">
                      <BarChart2 size={14} />
                      <span>Всего тренировок: {planHistory.length}</span>
                    </div>
                  </Tag>
                </div>
              )}
            </div>
          ) : (
            <Empty
              description="Этот план еще не использовался в тренировках"
              className="my-4"
            />
          )}
        </div>
      ),
    },
    {
      key: "3",
      label: "Настройки",
      children: (
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Настройки</h1>
          <div className="flex flex-col gap-4 mt-6">
            <Button type="primary" size="large" onClick={handleEditPlan}>
              <Edit size={20} className="mr-2" />
              Править программу
            </Button>
            <Button danger size="large" onClick={handleDeletePlan}>
              <Trash size={20} className="mr-2" />
              Удалить программу
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={<p>Информация о программе тренировок</p>}
      footer={null}
      open={isOpen}
      onCancel={onClose}
      width={700}
    >
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Spin size="large" />
        </div>
      ) : (
        <Tabs defaultActiveKey="1" items={items} />
      )}
    </Modal>
  );
}
