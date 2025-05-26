import {
  Button,
  Modal,
  Popconfirm,
  Empty,
  Card,
  Divider,
  Tabs,
  Tag,
  message,
} from "antd";
import { Edit, Trash, Info, Calendar, Weight, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import ExerciseDetailModal from "../ExerciseDetailModal/ExerciseDetailModal";
import { useWorkoutPlanner } from "../../context/WorkoutPlannerContext";

export default function WorkoutInfoModal({
  isOpen,
  onClose,
  workout,
  onDelete,
}) {
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseDetailModalOpen, setExerciseDetailModalOpen] = useState(false);
  const [enhancedWorkout, setEnhancedWorkout] = useState(null);

  const { workoutService, exerciseService } = useWorkoutPlanner();

  // Загрузка и обработка данных тренировки
  useEffect(() => {
    if (isOpen && workout) {
      setLoading(true);

      try {
        // Создаем глубокую копию данных для безопасного обогащения
        const workoutCopy = JSON.parse(JSON.stringify(workout));

        // Обогащаем упражнения полными данными
        if (workoutCopy.exercises && exerciseService) {
          workoutCopy.exercises = workoutCopy.exercises.map((exercise) => {
            try {
              // Пытаемся получить полные данные упражнения
              const fullExercise = exerciseService.getExerciseById(exercise.id);

              if (fullExercise) {
                return {
                  ...exercise,
                  name: exercise.name || fullExercise.name,
                  type: exercise.type || fullExercise.type,
                  image: exercise.image || fullExercise.image,
                  description: exercise.description || fullExercise.description,
                  bodyPart:
                    exercise.bodyPart ||
                    fullExercise.bodyPart ||
                    fullExercise.targetMuscle ||
                    fullExercise.cardioType,
                  // Сохраняем подходы
                  sets: exercise.sets || [],
                  completedSets: exercise.completedSets || exercise.sets || [],
                };
              }
              return exercise;
            } catch (error) {
              console.error(
                `Ошибка при получении данных упражнения ${exercise.id}:`,
                error
              );
              return exercise;
            }
          });
        }

        // Обновляем состояние с обогащенными данными
        setEnhancedWorkout(workoutCopy);

        console.log("Обогащенные данные тренировки:", workoutCopy);
      } catch (error) {
        console.error("Ошибка при обработке данных тренировки:", error);
        message.error("Не удалось загрузить подробную информацию о тренировке");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    }
  }, [isOpen, workout, exerciseService]);

  // Функция для отображения типа упражнения
  const getExerciseTypeName = (type) => {
    const typeMap = {
      STRENGTH: "Силовое",
      Strength: "Силовое",
      CARDIO: "Кардио",
      Cardio: "Кардио",
      ENDURANCE: "Выносливость",
      Endurance: "Выносливость",
    };
    return typeMap[type] || type;
  };

  // Функция для отображения части тела на русском
  const getBodyPartName = (bodyPart) => {
    if (!bodyPart) return "";

    const bodyPartMap = {
      chest: "Грудь",
      back: "Спина",
      biceps: "Бицепс",
      triceps: "Трицепс",
      shoulders: "Плечи",
      legs: "Ноги",
      abs: "Пресс",
      arms: "Руки",
      general: "Общая",
      forearms: "Предплечья",
      calves: "Икры",
      glutes: "Ягодицы",
      quads: "Четырехглавая",
      hamstrings: "Задняя поверхность бедра",
    };

    return bodyPartMap[bodyPart] || bodyPart;
  };

  // Отображение подходов силового упражнения
  const renderExerciseSets = (exercise) => {
    // Проверяем наличие подходов в любом из полей
    const sets = exercise.completedSets || exercise.sets || [];

    if (!sets || sets.length === 0) {
      return <p className="text-gray-500 text-sm">Нет подходов</p>;
    }

    return (
      <div className="mt-2">
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="grid grid-cols-10 mb-2 font-semibold text-sm">
            <div className="col-span-2 text-center">№</div>
            <div className="col-span-4 text-center">Вес (кг)</div>
            <div className="col-span-4 text-center">Повторений</div>
          </div>
          {sets.map((set, setIndex) => (
            <div
              key={setIndex}
              className="grid grid-cols-10 items-center py-1 border-b last:border-b-0"
            >
              <div className="col-span-2 text-center font-semibold">
                {setIndex + 1}
              </div>
              <div className="col-span-4 text-center">{set.weight || 0}</div>
              <div className="col-span-4 text-center">{set.reps || 0}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Обработчик для открытия детальной информации об упражнении
  const handleViewExerciseDetails = (exercise) => {
    setSelectedExercise({
      id: exercise.id,
      name: exercise.name,
      image: exercise.image,
      type: exercise.type,
      category: exercise.type,
      bodyPart: exercise.bodyPart,
      targetMuscle: exercise.targetMuscle,
      cardioType: exercise.cardioType,
      videoUrl: exercise.mediaUrl,
      description: exercise.description,
    });
    setExerciseDetailModalOpen(true);
  };

  // Функция для форматирования времени
  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return "Не указано";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} ч ${minutes} мин`;
    } else {
      return `${minutes} мин`;
    }
  };

  // Обработчик удаления тренировки
  const handleDeleteWorkout = () => {
    if (onDelete && enhancedWorkout) {
      onDelete(enhancedWorkout.id);
      onClose();
    }
  };

  // Проверяем наличие данных для отображения
  if (!enhancedWorkout && !loading) {
    return (
      <Modal
        title="Информация о тренировке"
        open={isOpen}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>
            Закрыть
          </Button>,
        ]}
      >
        <p className="text-center text-red-500">
          Данные о тренировке недоступны
        </p>
      </Modal>
    );
  }

  const items = [
    {
      key: "1",
      label: "Информация",
      children: (
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">
            {enhancedWorkout?.name || "Тренировка без названия"}
          </h1>

          <div className="flex flex-wrap gap-4">
            <Tag color="blue" className="flex items-center">
              <div className="flex items-center gap-2 mt-1.5 mx-1">
                <Calendar size={14} />
                <p>{enhancedWorkout?.date || "Дата не указана"}</p>
              </div>
            </Tag>
            <Tag color="green">
              <div className="flex items-center gap-2 my-1.5 mx-1">
                <Weight size={14} />
                <p>
                  {enhancedWorkout?.totalWeight
                    ? `${enhancedWorkout.totalWeight}
                кг`
                    : "Вес не указан"}
                </p>
              </div>
            </Tag>
          </div>

          <div>
            <p>
              <b>Описание:</b>
            </p>
            <p>{enhancedWorkout?.description || "Описание отсутствует"}</p>
          </div>

          <Divider>Упражнения</Divider>

          {enhancedWorkout?.exercises &&
          enhancedWorkout.exercises.length > 0 ? (
            <div className="flex flex-col gap-2 w-full">
              {enhancedWorkout.exercises.map((exercise, index) => (
                <Card
                  key={index}
                  className="w-full shadow-sm"
                  size="small"
                  bodyStyle={{ padding: "12px" }}
                  actions={[
                    <Button
                      key="details"
                      type="link"
                      icon={<Info size={16} />}
                      onClick={() => handleViewExerciseDetails(exercise)}
                    >
                      Подробно
                    </Button>,
                  ]}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      {exercise.image && (
                        <img
                          src={exercise.image}
                          alt={exercise.name || "Упражнение"}
                          className="w-10 h-10 rounded-md object-cover mr-3"
                        />
                      )}
                      <div>
                        <span className="font-semibold">
                          {exercise.name || "Без названия"}
                        </span>
                        {exercise.type && (
                          <span className="text-gray-500 ml-2">
                            ({getExerciseTypeName(exercise.type)})
                            {exercise.bodyPart &&
                              ` · ${getBodyPartName(exercise.bodyPart)}`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Отображаем информацию о подходах */}
                    {(exercise.type === "STRENGTH" ||
                      exercise.type === "Strength") &&
                      renderExerciseSets(exercise)}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Empty description="В тренировке нет упражнений" />
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: "Настройки",
      children: (
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Настройки</h1>
          <div className="flex flex-col gap-4 mt-6">
            <Button type="primary" size="large" icon={<Edit size={20} />}>
              Редактировать тренировку
            </Button>

            {onDelete && (
              <Popconfirm
                title="Удаление тренировки"
                description="Вы уверены, что хотите удалить эту тренировку?"
                okText="Да"
                cancelText="Отмена"
                onConfirm={handleDeleteWorkout}
              >
                <Button danger size="large" icon={<Trash size={20} />}>
                  Удалить тренировку
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
        title={<p>Информация о тренировке</p>}
        open={isOpen}
        onCancel={onClose}
        width={700}
        footer={[
          <Button key="close" onClick={onClose}>
            Закрыть
          </Button>,
          <Button key="workout" type="primary" onClick={onClose}>
            Начать тренировку
          </Button>,
        ]}
      >
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <Tabs defaultActiveKey="1" items={items} />
        )}
      </Modal>

      {/* Модальное окно с деталями упражнения */}
      <ExerciseDetailModal
        isOpen={exerciseDetailModalOpen}
        onClose={() => setExerciseDetailModalOpen(false)}
        exercise={selectedExercise}
      />
    </>
  );
}
