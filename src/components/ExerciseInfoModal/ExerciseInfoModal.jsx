import { Button, Modal, Tabs, Popconfirm, Empty, Card, Tag, Spin } from "antd";
import { Edit, Trash, Calendar, Weight, BarChart2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import ExerciseAdditionModal from "../AddExerciseModal/ExerciseAdditionModal";
import { useWorkoutPlanner } from "../../context/WorkoutPlannerContext";
import { useAuth } from "../../context/AuthContext"; // Добавляем импорт Auth контекста

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
  const { currentUser } = useAuth(); // Получаем текущего пользователя

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

  const loadExerciseHistory = () => {
    if (!exercise || !workoutService || !currentUser) return;

    setHistoryLoading(true);

    try {
      // Получаем тренировки пользователя
      const userWorkouts = workoutService.getWorkoutsForUser(currentUser.id);

      // Дополнительная проверка на ownerId
      const filteredWorkouts = userWorkouts.filter(
        (workout) => workout.ownerId === currentUser.id
      );

      const relevantWorkouts = filteredWorkouts.filter(
        (workout) =>
          workout.exercises &&
          workout.exercises.some((ex) => ex.id === exercise.id)
      );

      const sortedWorkouts = relevantWorkouts.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateB - dateA;
      });

      const historyData = sortedWorkouts.map((workout) => {
        const exerciseInstance = workout.exercises.find(
          (ex) => ex.id === exercise.id
        );

        return {
          workoutId: workout.id,
          workoutName: workout.name || `Тренировка ${workout.id}`,
          date: formatDate(workout.date),
          sets: exerciseInstance.sets || exerciseInstance.completedSets || [],
          totalWeight: calculateTotalWeight(
            exerciseInstance.sets || exerciseInstance.completedSets || []
          ),
        };
      });

      setWorkoutHistory(historyData);
    } catch (error) {
      console.error("Ошибка при загрузке истории упражнения:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

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

  // Функция для преобразования URL видео YouTube в формат для встраивания
  const getEmbedUrl = (url) => {
    if (!url) return null;

    try {
      // Для ссылок вида https://www.youtube.com/watch?v=ID
      let videoId = "";

      if (url.includes("youtube.com/watch")) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get("v");
      }
      // Для ссылок вида https://youtu.be/ID
      else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1];
        if (videoId.includes("?")) {
          videoId = videoId.split("?")[0];
        }
      }
      // Если это уже ссылка для встраивания
      else if (url.includes("youtube.com/embed/")) {
        return url; // Уже в правильном формате
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // Если формат не распознан, возвращаем исходную ссылку
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
      key: "3",
      label: "История",
      children: (
        <div className="flex flex-col gap-4 mb-4">
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
                      <Tag color="blue" className="flex items-center">
                        <div className="flex items-center gap-2 my-1.5 mx-1">
                          <Calendar size={14} />
                          <p>{item.date}</p>
                        </div>
                      </Tag>
                    </div>
                  }
                >
                  <div className="flex flex-col gap-2">
                    {item.sets.length > 0 ? (
                      <>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">
                            Выполненные подходы:
                          </span>
                          <Tag color="green">
                            <div className="flex items-center gap-2 my-1.5 mx-1">
                              <Weight size={14} />
                              <p>{item.totalWeight} кг</p>
                            </div>
                          </Tag>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="grid grid-cols-12 mb-1 font-semibold text-sm">
                            <div className="col-span-2 text-center">№</div>
                            <div className="col-span-5 text-center">
                              Вес (кг)
                            </div>
                            <div className="col-span-5 text-center">
                              Повторения
                            </div>
                          </div>

                          {item.sets.map((set, setIndex) => (
                            <div
                              key={setIndex}
                              className="grid grid-cols-12 py-1 border-t border-gray-100 text-sm"
                            >
                              <div className="col-span-2 text-center font-medium">
                                {setIndex + 1}
                              </div>
                              <div className="col-span-5 text-center">
                                {set.weight || "-"}
                              </div>
                              <div className="col-span-5 text-center">
                                {set.reps || "-"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        Подходы не записаны
                      </p>
                    )}
                  </div>
                </Card>
              ))}

              {workoutHistory.length > 5 && (
                <div className="flex items-center justify-center my-2">
                  <Tag color="blue" className="flex items-center gap-1">
                    <BarChart2 size={14} />
                    Всего тренировок: {workoutHistory.length}
                  </Tag>
                </div>
              )}
            </div>
          ) : (
            <Empty
              description="Это упражнение еще не использовалось в тренировках"
              className="my-4"
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
      >
        <Tabs defaultActiveKey="1" items={items} />
      </Modal>

      {exercise && (
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
