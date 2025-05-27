import React, { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "antd";
import { useWorkoutPlanner } from "../../context/WorkoutPlannerContext";
import WorkoutPlanInfoModal from "../WorkoutPlanInfoModal/WorkoutPlanInfoModal";

export default function WorkoutPlanCard({ workoutPlan, onDelete, onEdit }) {
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const { workoutPlanService } = useWorkoutPlanner();

  const formatExerciseList = () => {
    if (!workoutPlan.exercises || workoutPlan.exercises.length === 0) {
      return "Нет упражнений";
    }

    const displayedExercises = workoutPlan.exercises.slice(0, 3).map((ex) => {
      let suffix = "";

      if (ex.sets && ex.sets.length > 0) {
        suffix = ` (${ex.sets.length} ${
          ex.sets.length === 1
            ? "подход"
            : ex.sets.length < 5
            ? "подхода"
            : "подходов"
        })`;
      } else if (ex.sessions && ex.sessions.length > 0) {
        suffix = " (сессия)";
      }

      return ex.name + suffix;
    });

    const suffix = workoutPlan.exercises.length > 3 ? "..." : "";

    return `· ${displayedExercises.join(", ")}${suffix}`;
  };

  return (
    <div className="flex justify-between w-full p-4 border rounded-xl border-indigo-300">
      <div className="w-full">
        <h1 className="text-xl font-bold">{workoutPlan.name}</h1>

        <div className="mt-2 text-gray-600">{formatExerciseList()}</div>
        <div className="flex gap-2 mt-2 text-gray-600 font-semibold items-center">
          <Clock size={18} />
          <p>
            Всего упражнений:{" "}
            {workoutPlan.exercises ? workoutPlan.exercises.length : 0}
          </p>
        </div>

        <div className="flex gap-4 w-full mt-5">
          <Button className="w-full" onClick={() => setInfoModalOpen(true)}>
            Информация
          </Button>
          <Button
            type="primary"
            className="w-full"
            onClick={() => onEdit(workoutPlan)}
          >
            Редактировать
          </Button>
        </div>
      </div>

      <WorkoutPlanInfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        workoutPlan={workoutPlan}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </div>
  );
}
