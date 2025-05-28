import { Button, Modal, Tabs, Popconfirm, Empty, Card, Tag, Spin } from "antd";
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
import ExerciseAdditionModal from "../AddExerciseModal/ExerciseAdditionModal";
import { useWorkoutPlanner } from "../../context/WorkoutPlannerContext";
import { useAuth } from "../../context/AuthContext";

export default function ExerciseInfoModal({
  isOpen,
  onClose,
  exercise,
  onDelete,
  onEdit,
}) {
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const { workoutService } = useWorkoutPlanner();
  const { currentUser } = useAuth();

  const getTranslatedCategory = (categoryCode) => {
    const categoryMap = {
      STRENGTH: "Силовые",
      Strength: "Силовые",
      CARDIO: "Кардио",
      Cardio: "Кардио",
      ENDURANCE: "Выносливость",
      Endurance: "Выносливость",
    };

    return categoryMap[categoryCode] || categoryCode;
  };

  const getOriginalCategoryType = (translatedCategory) => {
    const categoryMap = {
      Силовые: "STRENGTH",
      Кардио: "CARDIO",
      Выносливость: "ENDURANCE",
    };

    return categoryMap[translatedCategory] || "STRENGTH";
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && exercise && workoutService && currentUser) {
      loadExerciseHistory();
    }
  }, [isOpen, exercise, workoutService, currentUser]);

  const formatDate = (date) => {
    if (!date) return "Дата не указана";

    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("ru-RU", options);
  };

  const calculateTotalWeight = (sets) => {
    if (!sets || !sets.length) return 0;

    return sets.reduce((total, set) => {
      return total + (Number(set.weight) || 0) * (Number(set.reps) || 0);
    }, 0);
  };

  const loadExerciseHistory = () => {
    if (!exercise || !workoutService || !currentUser) return;

    setHistoryLoading(true);

    try {
      const userWorkouts = workoutService.getWorkoutsForUser(currentUser.id);
      const filteredWorkouts = userWorkouts.filter(
        (w) => w.exercises && w.exercises.some((ex) => ex.id === exercise.id)
      );
      const sortedWorkouts = filteredWorkouts.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateB - dateA;
      });

      const historyData = sortedWorkouts
        .map((workout) => {
          const exerciseInstance = workout.exercises.find(
            (ex) => ex.id === exercise.id
          );
          if (!exerciseInstance) return null;

          const instanceType = (exerciseInstance.type || "").toUpperCase();
          let performanceData = [];
          let specificMetrics = {};

          if (instanceType === "STRENGTH") {
            performanceData = exerciseInstance.sets || [];
            specificMetrics.totalWeight = calculateTotalWeight(performanceData);
          } else if (instanceType === "CARDIO") {
            performanceData = exerciseInstance.sessions || [];
            specificMetrics.totalDuration = performanceData.reduce(
              (sum, s) => sum + (Number(s.duration) || 0),
              0
            );
            specificMetrics.totalDistance = performanceData.reduce(
              (sum, s) => sum + (Number(s.distance) || 0),
              0
            );
            specificMetrics.totalCalories = performanceData.reduce(
              (sum, s) => sum + (Number(s.caloriesBurned) || 0),
              0
            );
          } else if (instanceType === "ENDURANCE") {
            performanceData = exerciseInstance.sessions || [];
            specificMetrics.totalDuration = performanceData.reduce(
              (sum, s) => sum + (Number(s.duration) || 0),
              0
            );
          }

          return {
            workoutId: workout.id,
            workoutName: workout.name || `Тренировка ${workout.id}`,
            date: formatDate(workout.date),
            performanceData: performanceData,
            dataType: instanceType,
            metrics: specificMetrics,
          };
        })
        .filter((item) => item !== null);

      setWorkoutHistory(historyData);
    } catch (error) {
      console.error("Ошибка при загрузке истории упражнения:", error);
      setWorkoutHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const renderStrengthHistoryDetails = (data, metrics) => (
    <>
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium">Выполненные подходы:</span>
        {metrics.totalWeight > 0 && (
          <Tag color="green">
            <div className="flex items-center gap-1.5 py-0.5 px-2">
              <Weight size={14} />
              <span>{metrics.totalWeight} кг</span>
            </div>
          </Tag>
        )}
      </div>
      <div className="bg-gray-50 rounded-lg p-2">
        <div className="grid grid-cols-12 mb-1 font-semibold text-sm">
          <div className="col-span-2 text-center">№</div>
          <div className="col-span-5 text-center">Вес (кг)</div>
          <div className="col-span-5 text-center">Повторения</div>
        </div>
        {data.map((set, setIndex) => (
          <div
            key={setIndex}
            className="grid grid-cols-12 py-1 border-t border-gray-100 text-sm"
          >
            <div className="col-span-2 text-center font-medium">
              {setIndex + 1}
            </div>
            <div className="col-span-5 text-center">{set.weight || "-"}</div>
            <div className="col-span-5 text-center">{set.reps || "-"}</div>
          </div>
        ))}
      </div>
    </>
  );

  const renderCardioHistoryDetails = (data, metrics) => (
    <>
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium">Выполненные сессии:</span>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {metrics.totalDuration > 0 && (
            <Tag color="blue">
              <div className="flex items-center gap-1.5 py-0.5 px-2">
                <Clock size={12} /> <span>{metrics.totalDuration} мин</span>
              </div>
            </Tag>
          )}
          {metrics.totalDistance > 0 && (
            <Tag color="cyan">
              <div className="flex items-center gap-1.5 py-0.5 px-2">
                <Navigation size={12} />{" "}
                <span>{metrics.totalDistance.toFixed(1)} км</span>
              </div>
            </Tag>
          )}
          {metrics.totalCalories > 0 && (
            <Tag color="orange">
              <div className="flex items-center gap-1.5 py-0.5 px-2">
                <Flame size={12} /> <span>{metrics.totalCalories} ккал</span>
              </div>
            </Tag>
          )}
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-2">
        <div className="grid grid-cols-16 mb-1 font-semibold text-sm">
          <div className="col-span-2 text-center">№</div>
          <div className="col-span-4 text-center">Время (мин)</div>
          <div className="col-span-5 text-center">Дистанция (км)</div>
          <div className="col-span-5 text-center">Калории</div>
        </div>
        {data.map((session, sessionIndex) => (
          <div
            key={sessionIndex}
            className="grid grid-cols-16 py-1 border-t border-gray-100 text-sm"
          >
            <div className="col-span-2 text-center font-medium">
              {sessionIndex + 1}
            </div>
            <div className="col-span-4 text-center">
              {session.duration || "-"}
            </div>
            <div className="col-span-5 text-center">
              {session.distance || "-"}
            </div>
            <div className="col-span-5 text-center">
              {session.caloriesBurned || "-"}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderEnduranceHistoryDetails = (data, metrics) => (
    <>
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium">Выполненные сессии:</span>
        {metrics.totalDuration > 0 && (
          <Tag color="purple">
            <div className="flex items-center gap-1.5 py-0.5 px-2">
              <Clock size={12} /> <span>{metrics.totalDuration} сек</span>
            </div>
          </Tag>
        )}
      </div>
      <div className="bg-gray-50 rounded-lg p-2">
        <div className="grid grid-cols-12 mb-1 font-semibold text-sm">
          <div className="col-span-2 text-center">№</div>
          <div className="col-span-5 text-center">Время (сек)</div>
          <div className="col-span-5 text-center">Сложность</div>
        </div>
        {data.map((session, sessionIndex) => (
          <div
            key={sessionIndex}
            className="grid grid-cols-12 py-1 border-t border-gray-100 text-sm"
          >
            <div className="col-span-2 text-center font-medium">
              {sessionIndex + 1}
            </div>
            <div className="col-span-5 text-center">
              {session.duration || "-"}
            </div>
            <div className="col-span-5 text-center">
              {session.difficulty || "-"}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const handleDelete = () => {
    if (onDelete) {
      onDelete(exercise.id);
      onClose();
    }
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleEditComplete = (updatedExercise) => {
    setEditModalOpen(false);
    if (onEdit) {
      onEdit(exercise.id, updatedExercise);
      onClose();
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;

    try {
      let videoId = "";

      if (url.includes("youtube.com/watch")) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get("v");
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1];
        if (videoId.includes("?")) {
          videoId = videoId.split("?")[0];
        }
      } else if (url.includes("youtube.com/embed/")) {
        return url;
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      return url;
    } catch (error) {
      console.error("Ошибка при обработке URL видео:", error);
      return null;
    }
  };

  const items = [
    {
      key: "1",
      label: "Информация",
      children: (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl overflow-hidden">
            <img
              src={
                exercise?.image ||
                "https://via.placeholder.com/400?text=No+Image"
              }
              alt={exercise?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold">{exercise?.name}</h1>
          <div className="text-gray-600">
            <p>
              <b>Категория:</b>{" "}
              {exercise ? getTranslatedCategory(exercise.category) : ""}
            </p>
            <p>
              <b>Часть тела: </b>
              {exercise?.bodyPart}
            </p>
          </div>
          <div className="mb-5">
            <p>
              <b>Описание:</b>
            </p>
            <p>{exercise?.description || "Описание отсутствует"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Демонстрация",
      children: (
        <div className="flex flex-col gap-4 mb-4">
          <h1 className="text-2xl font-bold">Видео демострации упражнения</h1>
          {exercise?.videoUrl ? (
            <iframe
              src={getEmbedUrl(exercise.videoUrl)}
              className="w-full aspect-video rounded-xl"
              title={`${exercise?.name} демонстрация`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              frameBorder="0"
            ></iframe>
          ) : (
            <p className="text-center my-10">Видео отсутствует</p>
          )}
        </div>
      ),
    },
    {
      key: "history",
      label: "История",
      children: (
        <div>
          <h1 className="text-2xl font-bold">История выполнения упражнения</h1>

          {historyLoading ? (
            <div className="flex justify-center py-10">
              <Spin size="large" />
            </div>
          ) : workoutHistory.length > 0 ? (
            <div className="flex flex-col gap-3">
              {workoutHistory.map((item, index) => (
                <Card
                  key={`${item.workoutId}-${index}`}
                  size="medium"
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
                  <div className="flex flex-col gap-2">
                    {item.dataType === "STRENGTH" &&
                      item.performanceData.length > 0 &&
                      renderStrengthHistoryDetails(
                        item.performanceData,
                        item.metrics
                      )}
                    {item.dataType === "CARDIO" &&
                      item.performanceData.length > 0 &&
                      renderCardioHistoryDetails(
                        item.performanceData,
                        item.metrics
                      )}
                    {item.dataType === "ENDURANCE" &&
                      item.performanceData.length > 0 &&
                      renderEnduranceHistoryDetails(
                        item.performanceData,
                        item.metrics
                      )}
                    {(!item.performanceData ||
                      item.performanceData.length === 0) && (
                      <p className="text-gray-500 text-sm italic">
                        {item.dataType === "STRENGTH"
                          ? "Подходы не записаны"
                          : "Сессии не записаны"}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Empty
              description="Нет истории выполнения для этого упражнения"
              className="my-10"
            />
          )}
        </div>
      ),
    },
    {
      key: "4",
      label: "Настройки",
      children: (
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Настройки</h1>
          <div className="flex flex-col gap-4 mt-6">
            <Button type="primary" size="large" onClick={handleEdit}>
              <Edit size={20} />
              Править упражнение
            </Button>

            {onDelete && (
              <Popconfirm
                title="Удаление упражнения"
                description="Вы уверены, что хотите удалить это упражнение?"
                onConfirm={handleDelete}
                okText="Да"
                cancelText="Отмена"
              >
                <Button danger size="large">
                  <Trash size={20} />
                  Удалить упражнение
                </Button>
              </Popconfirm>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={<p>Информация об упражнении</p>}
        footer={null}
        open={isOpen}
        onCancel={onClose}
        width={600}
      >
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <Spin size="large" />
          </div>
        ) : (
          <Tabs defaultActiveKey="1" items={items} />
        )}
      </Modal>

      {exercise && editModalOpen && (
        <ExerciseAdditionModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onAddExercise={handleEditComplete}
          exerciseTypes={{
            STRENGTH: "STRENGTH",
            CARDIO: "CARDIO",
            ENDURANCE: "ENDURANCE",
          }}
          isEditMode={true}
          initialData={{
            id: exercise.id,
            name: exercise.name,
            category: getOriginalCategoryType(exercise.category),
            bodyPart: exercise.bodyPart,
            description: exercise.description,
            videoId: exercise.videoUrl,
            image: exercise.image,
          }}
        />
      )}
    </>
  );
}
