import React, { useState, useEffect } from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import { Button, Divider, Empty, message } from "antd";
import WorkoutPlanCard from "../../components/WorkoutPlanCard/WorkoutPlanCard";
import { useWorkoutPlanner } from "../../context/WorkoutPlannerContext";
import { useAuth } from "../../context/AuthContext";
import WorkoutPlanEditorModal from "../../components/WorkoutPlanEditorModal/WorkoutPlanEditorModal";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";

export default function WorkoutPlansPage() {
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);
  const { workoutPlanService, exerciseService } = useWorkoutPlanner();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { searchQuery } = useSearch();
  const [displayedWorkoutPlans, setDisplayedWorkoutPlans] = useState([]);

  useEffect(() => {
    loadWorkoutPlans();
  }, [workoutPlanService, currentUser]);

  useEffect(() => {
    console.log("Поисковый запрос изменился:", searchQuery);
    console.log("Текущие планы тренировок:", workoutPlans);

    if (!workoutPlans || workoutPlans.length === 0) {
      setDisplayedWorkoutPlans([]);
      return;
    }

    if (!searchQuery || searchQuery.trim() === "") {
      setDisplayedWorkoutPlans(workoutPlans);
      console.log("Отображение всех планов, поиск пустой");
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = workoutPlans.filter((plan) => {
        const nameMatch = plan.name && plan.name.toLowerCase().includes(query);
        const descMatch =
          plan.description && plan.description.toLowerCase().includes(query);

        const exercisesMatch =
          plan.exercises &&
          plan.exercises.some(
            (exercise) =>
              exercise.name && exercise.name.toLowerCase().includes(query)
          );

        return nameMatch || descMatch || exercisesMatch;
      });

      console.log(`Найдено ${filtered.length} планов по запросу "${query}"`);
      setDisplayedWorkoutPlans(filtered);
    }
  }, [searchQuery, workoutPlans]);

  const loadWorkoutPlans = () => {
    if (workoutPlanService && currentUser) {
      try {
        setLoading(true);
        const plans = workoutPlanService.getWorkoutPlansForUser(currentUser.id);
        setWorkoutPlans(plans);
        setDisplayedWorkoutPlans(plans);
        console.log("Загружено планов:", plans.length);
      } catch (error) {
        console.error("Ошибка при загрузке планов тренировок:", error);
        message.error("Не удалось загрузить планы тренировок");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOpenCreatePlanModal = () => {
    setEditingPlan(null);
    setEditorModalOpen(true);
  };

  const handleOpenEditPlanModal = (plan) => {
    setEditingPlan(plan);
    setEditorModalOpen(true);
  };

  const handleCloseEditorModal = () => {
    setEditorModalOpen(false);
    setEditingPlan(null);
  };

  const handleSaveWorkoutPlan = (planData, existingPlanId) => {
    if (workoutPlanService && currentUser) {
      try {
        if (existingPlanId) {
          const currentPlan =
            workoutPlanService.getWorkoutPlanById(existingPlanId);

          if (!currentPlan) {
            throw new Error("План не найден");
          }

          currentPlan.name = planData.name;
          currentPlan.description = planData.description;

          if (typeof workoutPlanService.savePlan === "function") {
            workoutPlanService.savePlan(currentPlan);
          } else if (
            typeof workoutPlanService._saveWorkoutPlans === "function"
          ) {
            workoutPlanService._saveWorkoutPlans();
          }

          if (currentPlan && currentPlan.exercises) {
            [...currentPlan.exercises].forEach((ex) => {
              workoutPlanService.removeExerciseFromWorkoutPlan(
                existingPlanId,
                ex.id
              );
            });
          }

          planData.exercises.forEach((exercise) => {
            workoutPlanService.addExerciseToWorkoutPlan(
              existingPlanId,
              exercise.id
            );

            if (
              (exercise.type === "STRENGTH" || exercise.type === "Strength") &&
              exercise.sets &&
              exercise.sets.length > 0
            ) {
              exercise.sets.forEach((set) => {
                try {
                  const reps = Number(set.reps);
                  const weight = Number(set.weight);

                  if (!isNaN(reps) && !isNaN(weight)) {
                    console.log(`Adding set: reps=${reps}, weight=${weight}`);
                    workoutPlanService.addSetToExerciseInWorkoutPlan(
                      existingPlanId,
                      exercise.id,
                      reps,
                      weight
                    );
                  } else {
                    console.error("Invalid set data:", set);
                  }
                } catch (error) {
                  console.error("Error adding set:", error);
                }
              });
            }
          });

          message.success(`План тренировки "${planData.name}" обновлен`);
        } else {
          const createdPlan = workoutPlanService.createWorkoutPlan(
            currentUser.id,
            planData.name,
            planData.description
          );

          planData.exercises.forEach((exercise) => {
            workoutPlanService.addExerciseToWorkoutPlan(
              createdPlan.id,
              exercise.id
            );

            if (
              (exercise.type === "STRENGTH" || exercise.type === "Strength") &&
              exercise.sets &&
              exercise.sets.length > 0
            ) {
              exercise.sets.forEach((set) => {
                try {
                  const reps = Number(set.reps);
                  const weight = Number(set.weight);

                  if (!isNaN(reps) && !isNaN(weight)) {
                    workoutPlanService.addSetToExerciseInWorkoutPlan(
                      createdPlan.id,
                      exercise.id,
                      reps,
                      weight
                    );
                  } else {
                    console.error("Invalid set data:", set);
                  }
                } catch (error) {
                  console.error("Error adding set:", error);
                }
              });
            }
          });

          message.success(`План тренировки "${planData.name}" создан`);
        }

        loadWorkoutPlans();
      } catch (error) {
        console.error("Ошибка при сохранении плана тренировки:", error);
        message.error("Не удалось сохранить план тренировки");
      }
    }
  };

  const handleDeleteWorkoutPlan = (planId) => {
    if (workoutPlanService) {
      try {
        workoutPlanService.deleteWorkoutPlan(planId);
        setWorkoutPlans(workoutPlans.filter((plan) => plan.id !== planId));
        message.success("План тренировки удален");
      } catch (error) {
        console.error("Ошибка при удалении плана тренировки:", error);
        message.error("Не удалось удалить план тренировки");
      }
    }
  };

  const handleStartEmptyWorkout = () => {
    navigate("/workouts");
  };

  return (
    <PageLayout title="Программы тренировок">
      <div className="w-full flex justify-center mb-5 gap-4">
        <Button
          size="large"
          className="w-1/2"
          onClick={handleStartEmptyWorkout}
        >
          Начать пустую тренировку
        </Button>
        <Button
          type="primary"
          size="large"
          className="w-1/2"
          onClick={handleOpenCreatePlanModal}
        >
          Добавить новую программу тренировок
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : displayedWorkoutPlans.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {displayedWorkoutPlans.map((plan) => (
            <WorkoutPlanCard
              key={plan.id}
              workoutPlan={{
                id: plan.id,
                name: plan.name,
                description: plan.description,
                exercises: plan.exercises || [],
              }}
              onDelete={() => handleDeleteWorkoutPlan(plan.id)}
              onEdit={() => handleOpenEditPlanModal(plan)}
            />
          ))}
        </div>
      ) : searchQuery && searchQuery.trim() !== "" ? (
        <Empty
          description={`Нет планов тренировок, соответствующих запросу "${searchQuery}"`}
          className="my-10"
        />
      ) : (
        <Empty
          description="У вас еще нет планов тренировок"
          className="my-10"
        />
      )}

      <WorkoutPlanEditorModal
        isOpen={editorModalOpen}
        onClose={handleCloseEditorModal}
        workoutPlan={editingPlan}
        onSave={handleSaveWorkoutPlan}
        isEditMode={!!editingPlan}
      />
    </PageLayout>
  );
}
