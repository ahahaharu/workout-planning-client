import React, { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "antd";
import WorkoutPlanInfoModal from "../WorkoutPlanInfoModal/WorkoutPlanInfoModal";

export default function WorkoutPlanCard({ workoutPlan }) {
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const formatExerciseList = () => {
    if (!workoutPlan.exercises || workoutPlan.exercises.length === 0) {
      return "Нет упражнений";
    }

    const displayedExercises = workoutPlan.exercises
      .slice(0, 5)
      .map((ex) => ex.name);

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
          <p>Последня тренировка: 2 дня назад</p>
        </div>

        <div className="flex gap-4 w-full mt-5">
          <Button className="w-full" onClick={() => setInfoModalOpen(true)}>
            Информация
          </Button>
          <Button type="primary" className="w-full">
            Начать тренировку
          </Button>
        </div>
      </div>
      <WorkoutPlanInfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        workoutPlan={workoutPlan}
      />
    </div>
  );
}
