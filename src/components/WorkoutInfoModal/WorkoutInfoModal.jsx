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
import {
  Edit,
  Trash,
  Info,
  Calendar,
  Weight,
  Clock,
  Navigation,
  Flame,
  BarChart,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useWorkoutPlanner } from "../../context/WorkoutPlannerContext";
import ExerciseInfoModal from "../ExerciseInfoModal/ExerciseInfoModal";
import WorkoutSessionModal from "../WorkoutSessionModal/WorkoutSessionModal";
import {
  getExerciseTypeName,
  getBodyPartName,
} from "../../utils/exerciseTranslations";

export default function WorkoutInfoModal({
  isOpen,
  onClose,
  workout,
  onDelete,
  onEdit,
}) {
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseDetailModalOpen, setExerciseDetailModalOpen] = useState(false);
  const [enhancedWorkout, setEnhancedWorkout] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { workoutService, exerciseService } = useWorkoutPlanner();

  useEffect(() => {
    if (isOpen && workout) {
      setLoading(true);

      try {
        const workoutCopy = JSON.parse(JSON.stringify(workout));

        if (workoutCopy.exercises && exerciseService) {
          workoutCopy.exercises = workoutCopy.exercises.map((exercise) => {
            try {
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
                  sets: exercise.sets || [],
                  completedSets: exercise.completedSets || exercise.sets || [],
                  sessions: exercise.sessions || [],
                  completedSessions:
                    exercise.completedSessions || exercise.sessions || [],
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

  const renderExerciseSets = (exercise) => {
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

  const renderCardioSessions = (exercise) => {
    const sessions = exercise.completedSessions || exercise.sessions || [];

    if (!sessions || sessions.length === 0) {
      return <p className="text-gray-500 text-sm">Нет записанных сессий</p>;
    }

    return (
      <div className="mt-2">
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="grid grid-cols-16 mb-2 font-semibold text-sm">
            <div className="col-span-2 text-center">№</div>
            <div className="col-span-4 text-center">
              <span className="flex items-center justify-center">
                <Clock size={14} className="mr-1" /> Время (мин)
              </span>
            </div>
            <div className="col-span-5 text-center">
              <span className="flex items-center justify-center">
                <Navigation size={14} className="mr-1" /> Дистанция (км)
              </span>
            </div>
            <div className="col-span-5 text-center">
              <span className="flex items-center justify-center">
                <Flame size={14} className="mr-1" /> Калории
              </span>
            </div>
          </div>
          {sessions.map((session, sessionIndex) => (
            <div
              key={sessionIndex}
              className="grid grid-cols-16 items-center py-1 border-b last:border-b-0"
            >
              <div className="col-span-2 text-center font-semibold">
                {sessionIndex + 1}
              </div>
              <div className="col-span-4 text-center">
                {session.duration || 0}
              </div>
              <div className="col-span-5 text-center">
                {session.distance || 0}
              </div>
              <div className="col-span-5 text-center">
                {session.caloriesBurned || 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEnduranceSessions = (exercise) => {
    const sessions = exercise.completedSessions || exercise.sessions || [];

    if (!sessions || sessions.length === 0) {
      return <p className="text-gray-500 text-sm">Нет записанных сессий</p>;
    }

    return (
      <div className="mt-2">
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="grid grid-cols-12 mb-2 font-semibold text-sm">
            <div className="col-span-2 text-center">№</div>
            <div className="col-span-5 text-center">
              <span className="flex items-center justify-center">
                <Clock size={14} className="mr-1" /> Время (мин)
              </span>
            </div>
            <div className="col-span-5 text-center">
              <span className="flex items-center justify-center">
                <BarChart size={14} className="mr-1" /> Сложность (1-10)
              </span>
            </div>
          </div>
          {sessions.map((session, sessionIndex) => (
            <div
              key={sessionIndex}
              className="grid grid-cols-12 items-center py-1 border-b last:border-b-0"
            >
              <div className="col-span-2 text-center font-semibold">
                {sessionIndex + 1}
              </div>
              <div className="col-span-5 text-center">
                {session.duration || 0}
              </div>
              <div className="col-span-5 text-center">
                {session.difficulty || 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExerciseData = (exercise) => {
    const exerciseType = (exercise.type || "").toUpperCase();

    if (exerciseType === "STRENGTH") {
      return renderExerciseSets(exercise);
    } else if (exerciseType === "CARDIO") {
      return renderCardioSessions(exercise);
    } else if (exerciseType === "ENDURANCE") {
      return renderEnduranceSessions(exercise);
    }

    return null;
  };

  const calculateWorkoutMetrics = (workout) => {
    if (!workout || !workout.exercises) return {};

    let totalWeight = 0;
    let totalDistance = 0;
    let totalDuration = 0;
    let totalCalories = 0;

    workout.exercises.forEach((exercise) => {
      const exerciseType = (exercise.type || "").toUpperCase();

      if (exerciseType === "STRENGTH") {
        const sets = exercise.completedSets || exercise.sets || [];
        sets.forEach((set) => {
          totalWeight += (Number(set.weight) || 0) * (Number(set.reps) || 0);
        });
      } else if (exerciseType === "CARDIO") {
        const sessions = exercise.completedSessions || exercise.sessions || [];
        sessions.forEach((session) => {
          totalDistance += Number(session.distance) || 0;
          totalDuration += Number(session.duration) || 0;
          totalCalories += Number(session.caloriesBurned) || 0;
        });
      } else if (exerciseType === "ENDURANCE") {
        const sessions = exercise.completedSessions || exercise.sessions || [];
        sessions.forEach((session) => {
          totalDuration += Number(session.duration) || 0;
        });
      }
    });

    return {
      totalWeight,
      totalDistance,
      totalDuration,
      totalCalories,
    };
  };

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

  const formatTime = (minutes) => {
    if (!minutes || minutes === 0) return "Не указано";

    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);

    if (hours > 0) {
      return `${hours} ч ${mins > 0 ? mins + " мин" : ""}`;
    } else {
      return `${minutes} мин`;
    }
  };

  const handleDeleteWorkout = () => {
    if (onDelete && enhancedWorkout) {
      onDelete(enhancedWorkout.id);
      onClose();
    }
  };

  const handleEditWorkout = () => {
    if (!enhancedWorkout) return;

    const workoutForEdit = {
      id: enhancedWorkout.id,
      name: enhancedWorkout.name,
      date: enhancedWorkout.rawDate || new Date(),
      exercises: enhancedWorkout.exercises.map((exercise) => ({
        ...exercise,
        sets: exercise.sets || [],
        completedSets: exercise.completedSets || exercise.sets || [],
        originalSets: exercise.sets || [],
        sessions: exercise.sessions || [],
        completedSessions:
          exercise.completedSessions || exercise.sessions || [],
        originalSessions: exercise.sessions || [],
      })),
      planId: enhancedWorkout.planId,
      totalWeight: enhancedWorkout.totalWeight || 0,
      description: enhancedWorkout.description || "",
    };

    setEditModalOpen(true);
  };

  const handleSaveEditedWorkout = (editedWorkoutData) => {
    if (onEdit && enhancedWorkout) {
      onEdit(enhancedWorkout.id, editedWorkoutData);

      setEditModalOpen(false);

      setEnhancedWorkout({
        ...enhancedWorkout,
        ...editedWorkoutData,
        exercises: editedWorkoutData.exercises,
      });

      message.success("Тренировка успешно обновлена");
    }
  };

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

  const metrics = enhancedWorkout
    ? calculateWorkoutMetrics(enhancedWorkout)
    : {};

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

            {metrics.totalWeight > 0 && (
              <Tag color="green">
                <div className="flex items-center gap-2 my-1.5 mx-1">
                  <Weight size={14} />
                  <p>{metrics.totalWeight} кг</p>
                </div>
              </Tag>
            )}

            {metrics.totalDistance > 0 && (
              <Tag color="cyan">
                <div className="flex items-center gap-2 my-1.5 mx-1">
                  <Navigation size={14} />
                  <p>{metrics.totalDistance.toFixed(1)} км</p>
                </div>
              </Tag>
            )}

            {metrics.totalDuration > 0 && (
              <Tag color="purple">
                <div className="flex items-center gap-2 my-1.5 mx-1">
                  <Clock size={14} />
                  <p>{formatTime(metrics.totalDuration)}</p>
                </div>
              </Tag>
            )}

            {metrics.totalCalories > 0 && (
              <Tag color="orange">
                <div className="flex items-center gap-2 my-1.5 mx-1">
                  <Flame size={14} />
                  <p>{metrics.totalCalories} ккал</p>
                </div>
              </Tag>
            )}
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

                    {renderExerciseData(exercise)}
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
            <Button
              type="primary"
              size="large"
              icon={<Edit size={20} />}
              onClick={handleEditWorkout}
            >
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
        footer={null}
      >
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <Tabs defaultActiveKey="1" items={items} />
        )}
      </Modal>

      <ExerciseInfoModal
        isOpen={exerciseDetailModalOpen}
        onClose={() => setExerciseDetailModalOpen(false)}
        exercise={selectedExercise}
      />

      {enhancedWorkout && (
        <WorkoutSessionModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          workoutData={enhancedWorkout}
          onSaveWorkout={handleSaveEditedWorkout}
        />
      )}
    </>
  );
}
