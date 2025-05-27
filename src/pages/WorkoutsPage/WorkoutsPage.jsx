import React, { useState, useEffect } from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import { Button, Divider, Empty, message } from "antd";
import WorkoutCard from "../../components/WorkoutCard/WorkoutCard";
import WorkoutSelectorModal from "../../components/WorkoutSelectorModal/WorkoutSelectorModal";
import WorkoutSessionModal from "../../components/WorkoutSessionModal/WorkoutSessionModal";
import { useWorkoutPlanner } from "../../context/WorkoutPlannerContext";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";

export default function WorkoutsPage() {
  const [selectorModalOpen, setSelectorModalOpen] = useState(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayedWorkouts, setDisplayedWorkouts] = useState([]);

  const { workoutService, workoutPlanService, exerciseService } =
    useWorkoutPlanner();
  const { currentUser } = useAuth();
  const { searchQuery } = useSearch();

  useEffect(() => {
    loadWorkouts();
  }, [workoutService, currentUser]);

  useEffect(() => {
    if (!workouts || workouts.length === 0) {
      setDisplayedWorkouts([]);
      return;
    }

    if (!searchQuery.trim()) {
      setDisplayedWorkouts(workouts);
    } else {
      const filtered = workouts.filter(
        (workout) =>
          (workout.name &&
            workout.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (workout.description &&
            workout.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (workout.exercises &&
            workout.exercises.some(
              (exercise) =>
                exercise.name &&
                exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      );
      setDisplayedWorkouts(filtered);
    }
  }, [searchQuery, workouts]);

  const loadWorkouts = () => {
    if (workoutService && currentUser) {
      try {
        setLoading(true);
        const userWorkouts = workoutService.getWorkoutsForUser(currentUser.id);

        console.log("Загружены тренировки (сырые данные):", userWorkouts);

        const enrichedWorkouts = userWorkouts.map((workout) => {
          try {
            const enrichedExercises = (workout.exercises || []).map(
              (exercise) => {
                try {
                  const fullExercise = exerciseService.getExerciseById(
                    exercise.id
                  );
                  if (fullExercise) {
                    return {
                      ...exercise,
                      name: fullExercise.name,
                      type: fullExercise.type,
                      image: fullExercise.image,
                      description: fullExercise.description,
                      bodyPart:
                        exercise.bodyPart ||
                        fullExercise.bodyPart ||
                        fullExercise.targetMuscle ||
                        fullExercise.cardioType,
                    };
                  }
                  return exercise;
                } catch (error) {
                  console.error(
                    "Ошибка при получении данных упражнения:",
                    error
                  );
                  return exercise;
                }
              }
            );

            const formattedDate = formatDate(workout.date);

            const rawDate =
              workout.date instanceof Date
                ? workout.date
                : typeof workout.date === "string" && workout.date.includes("-")
                ? new Date(workout.date)
                : new Date();

            let workoutName = workout.name;
            let planData = null;

            if (workout.plan && workout.plan.id && workoutPlanService) {
              try {
                planData = workoutPlanService.getWorkoutPlanById(
                  workout.plan.id
                );
                if (planData) {
                  if (
                    !workoutName ||
                    workoutName === `Тренировка ${workout.id}`
                  ) {
                    workoutName = `Тренировка по плану «${planData.name}»`;
                  }
                }
              } catch (error) {
                console.error("Ошибка при получении плана тренировки:", error);
              }
            }

            if (!workoutName) {
              if (workout.plan && workout.plan.id) {
                workoutName = "Тренировка по плану";
              } else {
                workoutName = "Пустая тренировка";
              }
            }

            let totalWeight = 0;
            try {
              if (typeof workout.getTotalWeight === "function") {
                totalWeight = workout.getTotalWeight();
              } else if (workout.totalWeight) {
                totalWeight = workout.totalWeight;
              } else if (workoutService.getTotalWeightForWorkout) {
                totalWeight = workoutService.getTotalWeightForWorkout(
                  workout.id
                );
              } else {
                enrichedExercises.forEach((ex) => {
                  const sets = ex.sets || ex.completedSets || [];
                  sets.forEach((set) => {
                    totalWeight +=
                      (Number(set.weight) || 0) * (Number(set.reps) || 0);
                  });
                });
              }
            } catch (error) {
              console.error("Ошибка при расчете общего веса:", error);
            }

            return {
              id: workout.id,
              name: workoutName,
              date: formattedDate,
              rawDate: rawDate,
              exercises: enrichedExercises,
              totalWeight: totalWeight,
              duration: workout.duration || 0,
              planId: workout.plan ? workout.plan.id : null,
              description:
                workout.description || (planData ? planData.description : ""),
            };
          } catch (error) {
            console.error("Ошибка при обогащении тренировки:", error);
            return {
              id: workout.id,
              name: workout.name || `Тренировка ${workout.id}`,
              date: formatDate(workout.date) || "Дата не указана",
              exercises: workout.exercises || [],
              totalWeight: workout.totalWeight || 0,
              duration: workout.duration || 0,
            };
          }
        });

        console.log("Обогащенные тренировки:", enrichedWorkouts);
        setWorkouts(enrichedWorkouts);
      } catch (error) {
        console.error("Ошибка при загрузке тренировок:", error);
        message.error("Не удалось загрузить тренировки");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStartWorkoutSelector = () => {
    setSelectorModalOpen(true);
  };

  const handleStartEmptyWorkout = (workoutData) => {
    setCurrentWorkout({
      ...workoutData,
      name: "Пустая тренировка",
      exercises: [],
    });
    setSessionModalOpen(true);
  };

  const handleStartPlanWorkout = (workoutData) => {
    if (workoutData.planId && workoutPlanService) {
      try {
        const planId =
          typeof workoutData.planId === "object"
            ? workoutData.planId.id
            : workoutData.planId;

        const plan = workoutPlanService.getWorkoutPlanById(planId);

        if (plan) {
          console.log("Загружен план тренировки:", plan);

          setCurrentWorkout({
            ...workoutData,
            planId: plan.id,
            name: `Тренировка по плану «${plan.name}»`,
            exercises: plan.exercises || [],
          });
        } else {
          console.warn("План тренировки не найден:", planId);
          setCurrentWorkout({
            ...workoutData,
            name: "Тренировка по плану",
            exercises: [],
          });
        }
      } catch (error) {
        console.error("Ошибка при получении плана тренировки:", error);
        message.error(`Ошибка при загрузке плана: ${error.message}`);

        setCurrentWorkout({
          ...workoutData,
          name: "Тренировка",
          exercises: [],
        });
      }
    } else {
      setCurrentWorkout({
        ...workoutData,
        name: "Тренировка",
      });
    }

    setSessionModalOpen(true);
  };

  const handleSaveWorkout = (workoutData) => {
    if (workoutService && currentUser) {
      try {
        console.log("Сохраняем тренировку с данными:", workoutData);

        let workoutName = workoutData.name;

        if (!workoutName) {
          if (workoutData.planId) {
            try {
              const planId =
                typeof workoutData.planId === "object"
                  ? workoutData.planId.id
                  : workoutData.planId;

              const plan = workoutPlanService.getWorkoutPlanById(planId);
              workoutName = `Тренировка по плану «${plan.name}»`;
            } catch (error) {
              workoutName = "Тренировка по плану";
            }
          } else {
            workoutName = "Пустая тренировка";
          }
        }

        const planId =
          typeof workoutData.planId === "object"
            ? workoutData.planId.id
            : workoutData.planId;

        const isPlanWorkout = !!planId;

        const workout = workoutService.createWorkout(
          currentUser.id,
          workoutData.date instanceof Date ? workoutData.date : new Date(),
          planId || undefined
        );

        console.log("Создана новая тренировка:", workout);

        const exercisesWithData = [];

        if (isPlanWorkout) {
          for (const exercise of workoutData.exercises) {
            const sets = exercise.completedSets || exercise.sets || [];

            if (sets.length > 0) {
              exercisesWithData.push({
                ...exercise,
                sets: sets,
              });
            }
          }
        } else {
          for (const exercise of workoutData.exercises) {
            const sets = exercise.completedSets || exercise.sets || [];

            if (sets.length > 0) {
              workoutService.addExerciseToWorkout(workout.id, exercise.id);

              if (
                exercise.type === "STRENGTH" ||
                exercise.type === "Strength"
              ) {
                for (const set of sets) {
                  try {
                    workoutService.recordSetInWorkout(
                      workout.id,
                      exercise.id,
                      Number(set.reps) || 0,
                      Number(set.weight) || 0
                    );
                  } catch (error) {
                    console.error(
                      `Ошибка при добавлении подхода для ${exercise.name}:`,
                      error
                    );
                  }
                }
              }

              exercisesWithData.push({
                ...exercise,
                sets: sets,
              });
            }
          }
        }

        const displayWorkout = {
          id: workout.id,
          name: workoutName,
          date: formatDate(workout.date),
          rawDate: workout.date,
          exercises: exercisesWithData,
          totalWeight: workoutData.totalWeight || 0,
          planId: planId || null,
          description: workoutData.description || "",
          plan: planId ? { id: planId } : null,
        };

        console.log("Готовая тренировка для отображения:", displayWorkout);

        setWorkouts((prevWorkouts) => [displayWorkout, ...prevWorkouts]);

        message.success("Тренировка успешно сохранена");

        setTimeout(loadWorkouts, 500);
      } catch (error) {
        console.error("Ошибка при сохранении тренировки:", error);
        message.error(`Не удалось сохранить тренировку: ${error.message}`);
      }
    }
  };

  const handleDeleteWorkout = (workoutId) => {
    if (workoutService && workoutId !== undefined) {
      try {
        if (typeof workoutService.deleteWorkout === "function") {
          workoutService.deleteWorkout(workoutId);
        } else {
          const workoutIndex = workoutService.workouts.findIndex(
            (w) => w.id === workoutId
          );
          if (workoutIndex !== -1) {
            workoutService.workouts.splice(workoutIndex, 1);

            if (typeof workoutService._saveWorkouts === "function") {
              workoutService._saveWorkouts();
            }
          } else {
            throw new Error(`Тренировка с ID ${workoutId} не найдена`);
          }
        }

        setWorkouts((prevWorkouts) =>
          prevWorkouts.filter((w) => w.id !== workoutId)
        );

        message.success("Тренировка успешно удалена");
      } catch (error) {
        console.error("Ошибка при удалении тренировки:", error);
        message.error(`Не удалось удалить тренировку: ${error.message}`);
      }
    }
  };

  const handleEditWorkout = (workoutId, editedWorkoutData) => {
    if (workoutService && currentUser) {
      try {
        console.log("Обновляем тренировку:", workoutId, editedWorkoutData);

        const existingWorkout = workoutService.getWorkoutById(workoutId);

        if (!existingWorkout) {
          throw new Error("Тренировка не найдена");
        }

        if (existingWorkout.name && editedWorkoutData.name) {
          existingWorkout.name = editedWorkoutData.name;
        }

        if (editedWorkoutData.date) {
          existingWorkout.date = editedWorkoutData.date;
        }

        if (typeof workoutService.clearWorkoutExercises === "function") {
          workoutService.clearWorkoutExercises(workoutId);
        } else {
          const exercisesToRemove = [...existingWorkout.exercises];
          exercisesToRemove.forEach((exercise) => {
            workoutService.removeExerciseFromWorkout(workoutId, exercise.id);
          });

          existingWorkout.exercises = [];
        }

        for (const exercise of editedWorkoutData.exercises) {
          workoutService.addExerciseToWorkout(workoutId, exercise.id);

          const sets = exercise.completedSets || exercise.sets || [];

          if (
            sets.length > 0 &&
            (exercise.type === "STRENGTH" || exercise.type === "Strength")
          ) {
            for (const set of sets) {
              try {
                workoutService.recordSetInWorkout(
                  workoutId,
                  exercise.id,
                  Number(set.reps) || 0,
                  Number(set.weight) || 0
                );
              } catch (error) {
                console.error(
                  `Ошибка при добавлении подхода для ${exercise.name}:`,
                  error
                );
              }
            }
          }
        }

        if (typeof workoutService._saveWorkouts === "function") {
          workoutService._saveWorkouts();
        }

        setWorkouts((prevWorkouts) =>
          prevWorkouts.map((workout) =>
            workout.id === workoutId
              ? {
                  ...workout,
                  name: editedWorkoutData.name,
                  date: formatDate(editedWorkoutData.date),
                  rawDate: editedWorkoutData.date,
                  exercises: editedWorkoutData.exercises,
                  totalWeight: editedWorkoutData.totalWeight,
                  description: editedWorkoutData.description,
                }
              : workout
          )
        );

        message.success("Тренировка успешно обновлена");

        setTimeout(loadWorkouts, 500);
      } catch (error) {
        console.error("Ошибка при обновлении тренировки:", error);
        message.error(`Не удалось обновить тренировку: ${error.message}`);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return "Без даты";

    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("ru-RU", options);
  };

  const sortedWorkouts = [...displayedWorkouts].sort((a, b) => {
    const dateA = a.rawDate ? new Date(a.rawDate) : new Date(0);
    const dateB = b.rawDate ? new Date(b.rawDate) : new Date(0);
    return dateB - dateA;
  });

  return (
    <PageLayout title="Тренировки">
      <Button
        type="primary"
        size="large"
        className="w-full"
        onClick={handleStartWorkoutSelector}
      >
        Начать новую тренировку
      </Button>

      <Divider>
        <p className="text-xl">История тренировок</p>
      </Divider>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : sortedWorkouts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {sortedWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onDelete={handleDeleteWorkout}
              onEdit={handleEditWorkout}
            />
          ))}
        </div>
      ) : (
        <Empty
          description="У вас еще нет записанных тренировок"
          className="my-10"
        />
      )}

      <WorkoutSelectorModal
        isOpen={selectorModalOpen}
        onClose={() => setSelectorModalOpen(false)}
        onStartEmptyWorkout={handleStartEmptyWorkout}
        onStartPlanWorkout={handleStartPlanWorkout}
      />

      <WorkoutSessionModal
        isOpen={sessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
        workoutData={currentWorkout}
        onSaveWorkout={handleSaveWorkout}
      />
    </PageLayout>
  );
}
