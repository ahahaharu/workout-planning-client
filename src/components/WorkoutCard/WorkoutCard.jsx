import { Button } from "antd";
import { Clock, Weight, CalendarDays, Navigation, Flame } from "lucide-react";
import React, { useState } from "react";
import WorkoutInfoModal from "../WorkoutInfoModal/WorkoutInfoModal";

export default function WorkoutCard({ workout, onDelete, onEdit }) {
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const {
    id,
    name,
    date,
    totalWeight,
    totalDistance,
    totalDuration,
    totalCalories,
    exercises = [],
  } = workout || {};

  console.log("WorkoutCard получил данные:", {
    id,
    name,
    date,
    totalWeight,
    totalDistance,
    totalDuration,
    totalCalories,
    exercises: exercises.length,
    rawWorkout: workout,
  });

  const handleOpenModal = () => {
    if (!workout) {
      console.error("Попытка открыть информацию с undefined данными");
      return;
    }
    setInfoModalOpen(true);
  };

  const handleDeleteWorkout = (id) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const formatTime = (minutes) => {
    if (!minutes || minutes === 0) return null;

    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);

    if (hours > 0) {
      return `${hours} ч ${mins > 0 ? mins + " мин" : ""}`;
    } else {
      return `${minutes} мин`;
    }
  };

  return (
    <div className="flex justify-between items-center gap-5 w-full p-4 border rounded-xl border-indigo-300">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">{name || "Безымянная тренировка"}</h1>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-indigo-500" />
            <p className="font-medium text-gray-600">{date || "Н/Д"}</p>
          </div>

          {totalWeight > 0 && (
            <div className="flex items-center gap-2">
              <Weight size={18} className="text-indigo-500" />
              <p className="font-medium text-gray-600">{totalWeight} кг</p>
            </div>
          )}

          {totalDistance > 0 && (
            <div className="flex items-center gap-2">
              <Navigation size={18} className="text-indigo-500" />
              <p className="font-medium text-gray-600">
                {totalDistance.toFixed(1)} км
              </p>
            </div>
          )}

          {totalDuration > 0 && (
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-indigo-500" />
              <p className="font-medium text-gray-600">
                {formatTime(totalDuration)}
              </p>
            </div>
          )}

          {totalCalories > 0 && (
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-indigo-500" />
              <p className="font-medium text-gray-600">{totalCalories} ккал</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-shrink-0">
        <Button type="primary" onClick={handleOpenModal} size="large">
          Подробнее
        </Button>
      </div>

      <WorkoutInfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        workout={workout}
        onDelete={handleDeleteWorkout}
        onEdit={onEdit}
      />
    </div>
  );
}
