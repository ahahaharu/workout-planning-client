import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Input,
  Form,
  Card,
  Tabs,
  Empty,
  Divider,
  Select,
  InputNumber,
  message,
  Popconfirm,
  List,
  Spin,
} from "antd";
import {
  Plus,
  Trash,
  Save,
  Check,
  AlertTriangle,
  Search,
  PlusCircle,
  Navigation,
  Clock,
  Flame,
  BarChart,
} from "lucide-react";
import { Tooltip } from "antd";
import { useWorkoutPlanner } from "../../context/WorkoutPlannerContext";
import ExerciseInfoModal from "../ExerciseInfoModal/ExerciseInfoModal";

export default function WorkoutSessionModal({
  isOpen,
  onClose,
  workoutData,
  onSaveWorkout,
}) {
  const [form] = Form.useForm();
  const [exercises, setExercises] = useState([]);
  const [workoutName, setWorkoutName] = useState("");
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [planModified, setPlanModified] = useState(false);
  const [showUpdatePlanModal, setShowUpdatePlanModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseDetailModalOpen, setExerciseDetailModalOpen] = useState(false);
  const [savedWorkout, setSavedWorkout] = useState(null);

  const { exerciseService, workoutPlanService } = useWorkoutPlanner();

  useEffect(() => {
    if (isOpen && workoutData) {
      setWorkoutName(workoutData.name || "");
      setPlanModified(false);
      setShowUpdatePlanModal(false);
      setSavedWorkout(null);

      if (workoutData.exercises && workoutData.exercises.length > 0) {
        const processedExercises = workoutData.exercises.map((exercise) => {
          let processedExercise = { ...exercise };

          // Обработка силовых упражнений
          if (exercise.type === "STRENGTH" || exercise.type === "Strength") {
            processedExercise.sets = exercise.sets || [];
            processedExercise.completedSets =
              exercise.sets && exercise.sets.length > 0
                ? JSON.parse(JSON.stringify(exercise.sets))
                : [];
            processedExercise.originalSets = JSON.parse(
              JSON.stringify(exercise.sets || [])
            );
          }

          // Обработка кардио упражнений
          else if (exercise.type === "CARDIO" || exercise.type === "Cardio") {
            processedExercise.sessions = exercise.sessions || [];
            processedExercise.completedSessions =
              exercise.sessions && exercise.sessions.length > 0
                ? JSON.parse(JSON.stringify(exercise.sessions))
                : [];
            processedExercise.originalSessions = JSON.parse(
              JSON.stringify(exercise.sessions || [])
            );
          }

          // Обработка упражнений на выносливость
          else if (
            exercise.type === "ENDURANCE" ||
            exercise.type === "Endurance"
          ) {
            processedExercise.sessions = exercise.sessions || [];
            processedExercise.completedSessions =
              exercise.sessions && exercise.sessions.length > 0
                ? JSON.parse(JSON.stringify(exercise.sessions))
                : [];
            processedExercise.originalSessions = JSON.parse(
              JSON.stringify(exercise.sessions || [])
            );
          }

          return processedExercise;
        });

        setExercises(processedExercises);

        // Расчёт всех метрик
        setTimeout(() => {
          calculateTotalWeight(processedExercises);
          calculateTotalDistance(processedExercises);
          calculateTotalDuration(processedExercises);
          calculateTotalCalories(processedExercises);
        }, 0);
      } else {
        setExercises([]);
        setTotalWeight(0);
        setTotalDistance(0);
        setTotalDuration(0);
        setTotalCalories(0);
      }

      setCompletedExercises([]);

      if (exerciseService) {
        try {
          const allExercises = exerciseService.getAllExercises();
          setFilteredExercises(allExercises);
        } catch (error) {
          console.error("Ошибка при загрузке упражнений:", error);
        }
      }
    }
  }, [isOpen, workoutData, exerciseService]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (exerciseService) {
      try {
        const allExercises = exerciseService.getAllExercises();

        if (!value) {
          setFilteredExercises(allExercises);
          return;
        }

        const filtered = allExercises.filter((ex) =>
          ex.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredExercises(filtered);
      } catch (error) {
        console.error("Ошибка при поиске упражнений:", error);
      }
    }
  };

  const handleAddExercise = (exercise) => {
    const isExerciseAdded = exercises.some((ex) => ex.id === exercise.id);

    if (isExerciseAdded) {
      message.warning("Это упражнение уже добавлено в тренировку");
      return;
    }

    let initialData = {};

    // Подготавливаем начальные данные в зависимости от типа упражнения
    if (exercise.type === "STRENGTH" || exercise.type === "Strength") {
      initialData = {
        sets: [],
        completedSets: [{ reps: 10, weight: 20 }],
        originalSets: [],
      };
    } else if (exercise.type === "CARDIO" || exercise.type === "Cardio") {
      initialData = {
        sessions: [],
        completedSessions: [{ duration: 30, distance: 5, caloriesBurned: 300 }],
        originalSessions: [],
      };
    } else if (exercise.type === "ENDURANCE" || exercise.type === "Endurance") {
      initialData = {
        sessions: [],
        completedSessions: [{ duration: 60, difficulty: 7 }],
        originalSessions: [],
      };
    }

    const newExercise = {
      ...exercise,
      ...initialData,
    };

    const updatedExercises = [...exercises, newExercise];
    setExercises(updatedExercises);
    setExerciseModalOpen(false);

    // Пересчитываем все метрики
    calculateTotalWeight(updatedExercises);
    calculateTotalDistance(updatedExercises);
    calculateTotalDuration(updatedExercises);
    calculateTotalCalories(updatedExercises);

    message.success(`Упражнение "${exercise.name}" добавлено в тренировку`);
  };

  const handleRemoveExercise = (exerciseIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(exerciseIndex, 1);
    setExercises(updatedExercises);

    calculateTotalWeight(updatedExercises);

    const exerciseId = exercises[exerciseIndex].id;
    if (completedExercises.includes(exerciseId)) {
      setCompletedExercises((prev) => prev.filter((id) => id !== exerciseId));
    }

    message.success("Упражнение удалено из тренировки");
  };

  const handleAddSet = (exerciseIndex) => {
    const updatedExercises = [...exercises];
    const exercise = updatedExercises[exerciseIndex];

    const lastSet =
      exercise.completedSets.length > 0
        ? { ...exercise.completedSets[exercise.completedSets.length - 1] }
        : { reps: 10, weight: 20 };

    exercise.completedSets.push(lastSet);
    setExercises(updatedExercises);

    calculateTotalWeight(updatedExercises);
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].completedSets.splice(setIndex, 1);
    setExercises(updatedExercises);

    calculateTotalWeight(updatedExercises);
  };

  const handleUpdateSet = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].completedSets[setIndex][field] = value;
    setExercises(updatedExercises);

    if (field === "weight" || field === "reps") {
      calculateTotalWeight(updatedExercises);
    }
  };

  const handleAddCardioSession = (exerciseIndex) => {
    const updatedExercises = [...exercises];
    const exercise = updatedExercises[exerciseIndex];

    const lastSession =
      exercise.completedSessions && exercise.completedSessions.length > 0
        ? {
            ...exercise.completedSessions[
              exercise.completedSessions.length - 1
            ],
          }
        : { duration: 30, distance: 5, caloriesBurned: 300 };

    if (!exercise.completedSessions) {
      exercise.completedSessions = [];
    }

    exercise.completedSessions.push(lastSession);
    setExercises(updatedExercises);

    calculateTotalDistance(updatedExercises);
    calculateTotalDuration(updatedExercises);
    calculateTotalCalories(updatedExercises);
  };

  const handleRemoveCardioSession = (exerciseIndex, sessionIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].completedSessions.splice(sessionIndex, 1);
    setExercises(updatedExercises);

    calculateTotalDistance(updatedExercises);
    calculateTotalDuration(updatedExercises);
    calculateTotalCalories(updatedExercises);
  };

  const handleUpdateCardioSession = (
    exerciseIndex,
    sessionIndex,
    field,
    value
  ) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].completedSessions[sessionIndex][field] =
      value;
    setExercises(updatedExercises);

    calculateTotalDistance(updatedExercises);
    calculateTotalDuration(updatedExercises);
    calculateTotalCalories(updatedExercises);
  };

  const handleAddEnduranceSession = (exerciseIndex) => {
    const updatedExercises = [...exercises];
    const exercise = updatedExercises[exerciseIndex];

    const lastSession =
      exercise.completedSessions && exercise.completedSessions.length > 0
        ? {
            ...exercise.completedSessions[
              exercise.completedSessions.length - 1
            ],
          }
        : { duration: 60, difficulty: 7 };

    if (!exercise.completedSessions) {
      exercise.completedSessions = [];
    }

    exercise.completedSessions.push(lastSession);
    setExercises(updatedExercises);

    calculateTotalDuration(updatedExercises);
  };

  const handleRemoveEnduranceSession = (exerciseIndex, sessionIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].completedSessions.splice(sessionIndex, 1);
    setExercises(updatedExercises);

    calculateTotalDuration(updatedExercises);
  };

  const handleUpdateEnduranceSession = (
    exerciseIndex,
    sessionIndex,
    field,
    value
  ) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].completedSessions[sessionIndex][field] =
      value;
    setExercises(updatedExercises);

    calculateTotalDuration(updatedExercises);
  };

  const checkPlanModifications = (currentExercises) => {
    if (!workoutData.planId) {
      return false;
    }

    let isModified = false;

    for (const exercise of currentExercises) {
      // Проверка для силовых упражнений
      if (
        (exercise.type === "STRENGTH" || exercise.type === "Strength") &&
        exercise.originalSets
      ) {
        if (exercise.completedSets.length !== exercise.originalSets.length) {
          isModified = true;
          break;
        }

        for (let i = 0; i < exercise.completedSets.length; i++) {
          const completed = exercise.completedSets[i];
          const original = exercise.originalSets[i];

          if (
            !original ||
            completed.reps !== original.reps ||
            completed.weight !== original.weight
          ) {
            isModified = true;
            break;
          }
        }
      }

      // Проверка для кардио и упражнений на выносливость
      else if (
        (exercise.type === "CARDIO" ||
          exercise.type === "Cardio" ||
          exercise.type === "ENDURANCE" ||
          exercise.type === "Endurance") &&
        exercise.originalSessions
      ) {
        if (
          exercise.completedSessions.length !== exercise.originalSessions.length
        ) {
          isModified = true;
          break;
        }

        for (let i = 0; i < exercise.completedSessions.length; i++) {
          const completed = exercise.completedSessions[i];
          const original = exercise.originalSessions[i];

          if (!original) {
            isModified = true;
            break;
          }

          // Для кардио
          if (
            (exercise.type === "CARDIO" || exercise.type === "Cardio") &&
            (completed.duration !== original.duration ||
              completed.distance !== original.distance ||
              completed.caloriesBurned !== original.caloriesBurned)
          ) {
            isModified = true;
            break;
          }

          // Для выносливости
          else if (
            (exercise.type === "ENDURANCE" || exercise.type === "Endurance") &&
            (completed.duration !== original.duration ||
              completed.difficulty !== original.difficulty)
          ) {
            isModified = true;
            break;
          }
        }
      }

      if (isModified) break;
    }

    return isModified;
  };

  const handleUpdatePlan = () => {
    if (!savedWorkout || !savedWorkout.planId || !workoutPlanService) {
      message.error("План тренировки недоступен для обновления");
      return;
    }

    try {
      const planId =
        typeof savedWorkout.planId === "object"
          ? savedWorkout.planId.id
          : savedWorkout.planId;

      const plan = workoutPlanService.getWorkoutPlanById(planId);

      if (!plan) {
        message.error("План тренировки не найден");
        return;
      }

      // Удаляем все упражнения из плана
      if (plan.exercises && plan.exercises.length > 0) {
        [...plan.exercises].forEach((exercise) => {
          workoutPlanService.removeExerciseFromWorkoutPlan(
            plan.id,
            exercise.id
          );
        });
      }

      // Добавляем упражнения обратно с обновленными данными
      savedWorkout.exercises.forEach((exercise) => {
        workoutPlanService.addExerciseToWorkoutPlan(plan.id, exercise.id);

        // Добавляем подходы для силовых упражнений
        if (
          (exercise.type === "STRENGTH" || exercise.type === "Strength") &&
          exercise.completedSets &&
          exercise.completedSets.length > 0
        ) {
          exercise.completedSets.forEach((set) => {
            try {
              const reps = Number(set.reps) || 0;
              const weight = Number(set.weight) || 0;

              if (reps > 0) {
                workoutPlanService.addSetToExerciseInWorkoutPlan(
                  plan.id,
                  exercise.id,
                  reps,
                  weight
                );
              }
            } catch (error) {
              console.error("Ошибка при добавлении подхода:", error);
            }
          });
        }

        // Добавляем сессии для кардио упражнений
        else if (
          (exercise.type === "CARDIO" || exercise.type === "Cardio") &&
          exercise.completedSessions &&
          exercise.completedSessions.length > 0
        ) {
          exercise.completedSessions.forEach((session) => {
            try {
              const duration = Number(session.duration) || 0;
              const distance = Number(session.distance) || 0;
              const caloriesBurned = Number(session.caloriesBurned) || 0;

              if (duration > 0 && distance > 0) {
                // Предполагаем, что есть метод для добавления кардио сессии в план
                workoutPlanService.addCardioSessionToExerciseInWorkoutPlan(
                  plan.id,
                  exercise.id,
                  duration,
                  distance,
                  caloriesBurned
                );
              }
            } catch (error) {
              console.error("Ошибка при добавлении кардио сессии:", error);
            }
          });
        }

        // Добавляем сессии для упражнений на выносливость
        else if (
          (exercise.type === "ENDURANCE" || exercise.type === "Endurance") &&
          exercise.completedSessions &&
          exercise.completedSessions.length > 0
        ) {
          exercise.completedSessions.forEach((session) => {
            try {
              const duration = Number(session.duration) || 0;
              const difficulty = Number(session.difficulty) || 0;

              if (duration > 0) {
                // Предполагаем, что есть метод для добавления сессии выносливости в план
                workoutPlanService.addEnduranceSessionToExerciseInWorkoutPlan(
                  plan.id,
                  exercise.id,
                  duration,
                  difficulty
                );
              }
            } catch (error) {
              console.error(
                "Ошибка при добавлении сессии выносливости:",
                error
              );
            }
          });
        }
      });

      if (typeof workoutPlanService._saveWorkoutPlans === "function") {
        workoutPlanService._saveWorkoutPlans();
      }

      message.success("План тренировки успешно обновлен");
      setShowUpdatePlanModal(false);
      onClose();
    } catch (error) {
      console.error("Ошибка при обновлении плана тренировки:", error);
      message.error("Не удалось обновить план тренировки: " + error.message);
    }
  };

  const calculateTotalWeight = (exerciseList) => {
    let weight = 0;

    exerciseList.forEach((exercise) => {
      if (exercise.type === "STRENGTH" || exercise.type === "Strength") {
        exercise.completedSets.forEach((set) => {
          weight += (Number(set.weight) || 0) * (Number(set.reps) || 0);
        });
      }
    });

    console.log("Рассчитан общий вес:", weight);
    setTotalWeight(weight);
  };

  const calculateTotalDistance = (exerciseList) => {
    let distance = 0;

    exerciseList.forEach((exercise) => {
      if (exercise.type === "CARDIO" || exercise.type === "Cardio") {
        if (exercise.completedSessions) {
          exercise.completedSessions.forEach((session) => {
            distance += Number(session.distance) || 0;
          });
        }
      }
    });

    setTotalDistance(distance);
  };

  const calculateTotalDuration = (exerciseList) => {
    let duration = 0;

    exerciseList.forEach((exercise) => {
      if (
        exercise.type === "CARDIO" ||
        exercise.type === "Cardio" ||
        exercise.type === "ENDURANCE" ||
        exercise.type === "Endurance"
      ) {
        if (exercise.completedSessions) {
          exercise.completedSessions.forEach((session) => {
            duration += Number(session.duration) || 0;
          });
        }
      }
    });

    setTotalDuration(duration);
  };

  const calculateTotalCalories = (exerciseList) => {
    let calories = 0;

    exerciseList.forEach((exercise) => {
      if (exercise.type === "CARDIO" || exercise.type === "Cardio") {
        if (exercise.completedSessions) {
          exercise.completedSessions.forEach((session) => {
            calories += Number(session.caloriesBurned) || 0;
          });
        }
      }
    });

    setTotalCalories(calories);
  };

  const handleCompleteExercise = (exerciseIndex) => {
    const updatedCompletedExercises = [...completedExercises];
    const exerciseId = exercises[exerciseIndex].id;

    if (!updatedCompletedExercises.includes(exerciseId)) {
      updatedCompletedExercises.push(exerciseId);
    } else {
      const index = updatedCompletedExercises.indexOf(exerciseId);
      updatedCompletedExercises.splice(index, 1);
    }

    setCompletedExercises(updatedCompletedExercises);
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

  const handleSaveWorkout = () => {
    if (exercises.length === 0) {
      message.warning("Добавьте хотя бы одно упражнение в тренировку");
      return;
    }

    const exercisesWithData = exercises.map((exercise) => {
      if (exercise.type === "STRENGTH" || exercise.type === "Strength") {
        return {
          ...exercise,
          sets: exercise.originalSets || [],
          completedSets: exercise.completedSets || [],
        };
      } else if (exercise.type === "CARDIO" || exercise.type === "Cardio") {
        return {
          ...exercise,
          sessions: exercise.originalSessions || [],
          completedSessions: exercise.completedSessions || [],
        };
      } else if (
        exercise.type === "ENDURANCE" ||
        exercise.type === "Endurance"
      ) {
        return {
          ...exercise,
          sessions: exercise.originalSessions || [],
          completedSessions: exercise.completedSessions || [],
        };
      }
      return exercise;
    });

    const workoutToSave = {
      name: workoutName || workoutData.name,
      date: workoutData.date || new Date(),
      planId: workoutData.planId,
      exercises: exercisesWithData,
      totalWeight,
      totalDistance,
      totalDuration,
      totalCalories,
    };

    const isPlanModified = checkPlanModifications(exercises);

    if (workoutData.planId && isPlanModified) {
      setSavedWorkout(workoutToSave);

      if (onSaveWorkout) {
        onSaveWorkout(workoutToSave);
      }

      setShowUpdatePlanModal(true);
    } else {
      if (onSaveWorkout) {
        onSaveWorkout(workoutToSave);
        onClose();
      }
    }
  };

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

  const renderExerciseCard = (exercise, index) => {
    const isCompleted = completedExercises.includes(exercise.id);
    const exerciseType = exercise.type.toUpperCase();

    return (
      <Card
        key={index}
        size="medium"
        className={`shadow-sm ${isCompleted ? "border-green-500" : ""}`}
        title={
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-1">
              {exercise.image && (
                <img
                  src={exercise.image}
                  alt={exercise.name}
                  className="w-8 h-8 rounded-md object-cover mr-2"
                />
              )}
              <span>{exercise.name}</span>
              <span className="text-xs text-gray-500">
                ({getExerciseTypeName(exercise.type)})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="link"
                size="small"
                onClick={() => handleViewExerciseDetails(exercise)}
              >
                Подробнее
              </Button>
              <Popconfirm
                title="Удаление упражнения"
                description="Вы уверены, что хотите удалить это упражнение из тренировки?"
                onConfirm={() => handleRemoveExercise(index)}
                okText="Да"
                cancelText="Отмена"
              >
                <Button danger size="small" icon={<Trash size={16} />} />
              </Popconfirm>
            </div>
          </div>
        }
      >
        {/* Силовые упражнения */}
        {exerciseType === "STRENGTH" && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">Подходы:</p>
              <Button
                type="primary"
                size="small"
                icon={<Plus size={14} />}
                onClick={() => handleAddSet(index)}
              >
                Добавить подход
              </Button>
            </div>

            {exercise.completedSets.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm mb-2">Нет подходов</p>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleAddSet(index)}
                >
                  Записать подход
                </Button>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="grid grid-cols-12 mb-2 font-semibold text-sm">
                  <div className="col-span-2 text-center">№</div>
                  <div className="col-span-4 text-center">Вес (кг)</div>
                  <div className="col-span-3 text-center">Повт.</div>
                  <div className="col-span-3"></div>
                </div>

                {exercise.completedSets.map((set, setIndex) => {
                  const originalSet =
                    exercise.originalSets && exercise.originalSets[setIndex];
                  const isModified =
                    originalSet &&
                    (set.reps !== originalSet.reps ||
                      set.weight !== originalSet.weight);

                  return (
                    <div
                      key={setIndex}
                      className={`grid grid-cols-12 items-center py-1 border-b last:border-b-0 
                      ${isModified ? "bg-amber-50" : ""}`}
                    >
                      <div className="col-span-2 text-center font-semibold">
                        {setIndex + 1}
                      </div>
                      <div className="col-span-4 text-center">
                        <InputNumber
                          min={0}
                          step={2.5}
                          value={set.weight}
                          onChange={(value) =>
                            handleUpdateSet(index, setIndex, "weight", value)
                          }
                          className="w-full max-w-24"
                          size="small"
                        />
                      </div>
                      <div className="col-span-3 text-center">
                        <InputNumber
                          min={1}
                          max={100}
                          value={set.reps}
                          onChange={(value) =>
                            handleUpdateSet(index, setIndex, "reps", value)
                          }
                          className="w-full max-w-16"
                          size="small"
                        />
                      </div>
                      <div className="col-span-3 text-center">
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<Trash size={14} />}
                          onClick={() => handleRemoveSet(index, setIndex)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Кардио упражнения */}
        {exerciseType === "CARDIO" && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">Сессии:</p>
              <Button
                type="primary"
                size="small"
                icon={<Plus size={14} />}
                onClick={() => handleAddCardioSession(index)}
              >
                Добавить сессию
              </Button>
            </div>

            {!exercise.completedSessions ||
            exercise.completedSessions.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm mb-2">
                  Нет записанных сессий
                </p>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleAddCardioSession(index)}
                >
                  Записать сессию
                </Button>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="grid grid-cols-16 mb-2 font-semibold text-sm">
                  <div className="col-span-2 text-center">№</div>
                  <div className="col-span-4 text-center">
                    <Tooltip title="Длительность в минутах">
                      <span className="flex items-center justify-center">
                        <Clock size={14} className="mr-1" /> Время
                      </span>
                    </Tooltip>
                  </div>
                  <div className="col-span-4 text-center">
                    <Tooltip title="Дистанция в километрах">
                      <span className="flex items-center justify-center">
                        <Navigation size={14} className="mr-1" /> Дист.
                      </span>
                    </Tooltip>
                  </div>
                  <div className="col-span-4 text-center">
                    <Tooltip title="Калории">
                      <span className="flex items-center justify-center">
                        <Flame size={14} className="mr-1" /> Ккал
                      </span>
                    </Tooltip>
                  </div>
                  <div className="col-span-2"></div>
                </div>

                {exercise.completedSessions.map((session, sessionIndex) => {
                  const originalSession =
                    exercise.originalSessions &&
                    exercise.originalSessions[sessionIndex];
                  const isModified =
                    originalSession &&
                    (session.duration !== originalSession.duration ||
                      session.distance !== originalSession.distance ||
                      session.caloriesBurned !==
                        originalSession.caloriesBurned);

                  return (
                    <div
                      key={sessionIndex}
                      className={`grid grid-cols-16 items-center py-1 border-b last:border-b-0 
                      ${isModified ? "bg-amber-50" : ""}`}
                    >
                      <div className="col-span-2 text-center font-semibold">
                        {sessionIndex + 1}
                      </div>
                      <div className="col-span-4 text-center">
                        <InputNumber
                          min={1}
                          step={5}
                          value={session.duration}
                          onChange={(value) =>
                            handleUpdateCardioSession(
                              index,
                              sessionIndex,
                              "duration",
                              value
                            )
                          }
                          className="w-full max-w-16"
                          size="small"
                        />
                      </div>
                      <div className="col-span-4 text-center">
                        <InputNumber
                          min={0.1}
                          step={0.5}
                          value={session.distance}
                          onChange={(value) =>
                            handleUpdateCardioSession(
                              index,
                              sessionIndex,
                              "distance",
                              value
                            )
                          }
                          className="w-full max-w-16"
                          size="small"
                        />
                      </div>
                      <div className="col-span-4 text-center">
                        <InputNumber
                          min={0}
                          step={50}
                          value={session.caloriesBurned}
                          onChange={(value) =>
                            handleUpdateCardioSession(
                              index,
                              sessionIndex,
                              "caloriesBurned",
                              value
                            )
                          }
                          className="w-full max-w-16"
                          size="small"
                        />
                      </div>
                      <div className="col-span-2 text-center">
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<Trash size={14} />}
                          onClick={() =>
                            handleRemoveCardioSession(index, sessionIndex)
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Упражнения на выносливость */}
        {exerciseType === "ENDURANCE" && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">Сессии:</p>
              <Button
                type="primary"
                size="small"
                icon={<Plus size={14} />}
                onClick={() => handleAddEnduranceSession(index)}
              >
                Добавить сессию
              </Button>
            </div>

            {!exercise.completedSessions ||
            exercise.completedSessions.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm mb-2">
                  Нет записанных сессий
                </p>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleAddEnduranceSession(index)}
                >
                  Записать сессию
                </Button>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="grid grid-cols-12 mb-2 font-semibold text-sm">
                  <div className="col-span-2 text-center">№</div>
                  <div className="col-span-5 text-center">
                    <Tooltip title="Длительность в минутах">
                      <span className="flex items-center justify-center">
                        <Clock size={14} className="mr-1" /> Время
                      </span>
                    </Tooltip>
                  </div>
                  <div className="col-span-3 text-center">
                    <Tooltip title="Сложность от 1 до 10">
                      <span className="flex items-center justify-center">
                        <BarChart size={14} className="mr-1" /> Сложн.
                      </span>
                    </Tooltip>
                  </div>
                  <div className="col-span-2"></div>
                </div>

                {exercise.completedSessions.map((session, sessionIndex) => {
                  const originalSession =
                    exercise.originalSessions &&
                    exercise.originalSessions[sessionIndex];
                  const isModified =
                    originalSession &&
                    (session.duration !== originalSession.duration ||
                      session.difficulty !== originalSession.difficulty);

                  return (
                    <div
                      key={sessionIndex}
                      className={`grid grid-cols-12 items-center py-1 border-b last:border-b-0 
                      ${isModified ? "bg-amber-50" : ""}`}
                    >
                      <div className="col-span-2 text-center font-semibold">
                        {sessionIndex + 1}
                      </div>
                      <div className="col-span-5 text-center">
                        <InputNumber
                          min={1}
                          step={5}
                          value={session.duration}
                          onChange={(value) =>
                            handleUpdateEnduranceSession(
                              index,
                              sessionIndex,
                              "duration",
                              value
                            )
                          }
                          className="w-full max-w-20"
                          size="small"
                        />
                      </div>
                      <div className="col-span-3 text-center">
                        <InputNumber
                          min={1}
                          max={10}
                          value={session.difficulty}
                          onChange={(value) =>
                            handleUpdateEnduranceSession(
                              index,
                              sessionIndex,
                              "difficulty",
                              value
                            )
                          }
                          className="w-full max-w-16"
                          size="small"
                        />
                      </div>
                      <div className="col-span-2 text-center">
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<Trash size={14} />}
                          onClick={() =>
                            handleRemoveEnduranceSession(index, sessionIndex)
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Card>
    );
  };

  const items = [
    {
      key: "workout",
      label: "Тренировка",
      children: (
        <div className="mb-4">
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Упражнения</h3>
              <div className="flex items-center gap-4">
                {totalWeight > 0 && (
                  <Tooltip title="Общий вес">
                    <span className="font-semibold flex items-center">
                      <span className="mr-1">🏋️</span> {totalWeight} кг
                    </span>
                  </Tooltip>
                )}
                {totalDistance > 0 && (
                  <Tooltip title="Общая дистанция">
                    <span className="font-semibold flex items-center">
                      <Navigation size={16} className="mr-1" /> {totalDistance}{" "}
                      км
                    </span>
                  </Tooltip>
                )}
                {totalDuration > 0 && (
                  <Tooltip title="Общее время">
                    <span className="font-semibold flex items-center">
                      <Clock size={16} className="mr-1" /> {totalDuration} мин
                    </span>
                  </Tooltip>
                )}
                {totalCalories > 0 && (
                  <Tooltip title="Сожжено калорий">
                    <span className="font-semibold flex items-center">
                      <Flame size={16} className="mr-1" /> {totalCalories} ккал
                    </span>
                  </Tooltip>
                )}
                <Button
                  type="primary"
                  icon={<PlusCircle size={16} />}
                  onClick={() => setExerciseModalOpen(true)}
                >
                  Добавить упражнение
                </Button>
              </div>
            </div>

            <Divider />

            {exercises.length === 0 ? (
              <Empty
                description="В этой тренировке нет упражнений"
                className="my-8"
              />
            ) : (
              <div className="flex flex-col gap-4 mb-4">
                {exercises.map((exercise, index) =>
                  renderExerciseCard(exercise, index)
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <Button
              type="primary"
              size="large"
              icon={<Save size={18} />}
              onClick={handleSaveWorkout}
            >
              Сохранить тренировку
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Modal
        title="Запись тренировки"
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={800}
      >
        <Tabs items={items} />
      </Modal>

      <Modal
        title="Добавить упражнение"
        open={exerciseModalOpen}
        onCancel={() => setExerciseModalOpen(false)}
        footer={null}
        width={600}
      >
        <div className="mb-4">
          <Input
            placeholder="Поиск упражнения..."
            prefix={<Search size={16} className="text-gray-400" />}
            value={searchText}
            onChange={handleSearch}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spin />
          </div>
        ) : filteredExercises.length > 0 ? (
          <List
            dataSource={filteredExercises}
            renderItem={(exercise) => (
              <List.Item
                key={exercise.id}
                className="hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => handleAddExercise(exercise)}
              >
                <div className="flex items-center w-full py-2">
                  <div className="w-8 h-8 mr-3 rounded overflow-hidden bg-gray-100">
                    <img
                      src={
                        exercise.image ||
                        "https://via.placeholder.com/100?text=No+Image"
                      }
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{exercise.name}</h3>
                    <p className="text-gray-500 text-sm">
                      {getExerciseTypeName(exercise.type)}
                    </p>
                  </div>
                  <Button type="primary" size="small">
                    Добавить
                  </Button>
                </div>
              </List.Item>
            )}
            className="max-h-96 overflow-auto"
          />
        ) : (
          <Empty description="Упражнения не найдены" />
        )}
      </Modal>

      <ExerciseInfoModal
        isOpen={exerciseDetailModalOpen}
        onClose={() => setExerciseDetailModalOpen(false)}
        exercise={selectedExercise}
      />

      <Modal
        title="Обновление плана тренировки"
        open={showUpdatePlanModal}
        onCancel={() => {
          setShowUpdatePlanModal(false);
          onClose();
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setShowUpdatePlanModal(false);
              onClose();
            }}
          >
            Не обновлять
          </Button>,
          <Button key="update" type="primary" onClick={handleUpdatePlan}>
            Обновить план
          </Button>,
        ]}
      >
        <div className="flex items-start gap-3 py-4">
          <AlertTriangle
            className="text-amber-500 flex-shrink-0 mt-1"
            size={24}
          />
          <div>
            <p className="font-medium text-amber-700 text-lg mb-2">
              Обнаружены изменения в плане тренировки
            </p>
            <p className="mb-2">
              В процессе тренировки подходы или повторения были изменены
              относительно исходного плана.
            </p>
            <p>
              Хотите обновить план тренировки с учетом этих изменений? Это
              позволит использовать текущие веса и повторения как шаблон для
              будущих тренировок.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
