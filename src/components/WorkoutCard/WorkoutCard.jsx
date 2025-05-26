import { Button } from "antd";
import { Clock, Weight, CalendarDays } from "lucide-react";
import React, { useState } from "react";
import WorkoutInfoModal from "../WorkoutInfoModal/WorkoutInfoModal";

export default function WorkoutCard({ workout, onDelete, onEdit }) {
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  // Проверяем и форматируем данные
  const {
    id,
    name,
    date,
    totalWeight,
    duration,
    exercises = [],
  } = workout || {};

  // Отладочный вывод
  console.log("WorkoutCard получил данные:", {
    id,
    name,
    date,
    totalWeight,
    exercises: exercises.length,
    rawWorkout: workout,
  });

  // Форматирование времени
  const formatTime = (seconds) => {
    if (!seconds) return "Н/Д";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} ч ${minutes} мин`;
    } else {
      return `${minutes} мин`;
    }
  };

  // Проверка наличия данных перед открытием модального окна
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

  return (
    <div className="flex justify-between items-center gap-5 w-full p-4 border rounded-xl border-indigo-300">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">{name || "Безымянная тренировка"}</h1>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-indigo-500" />
            <p className="font-medium text-gray-600">{date || "Н/Д"}</p>
          </div>

          <div className="flex items-center gap-2">
            <Weight size={18} className="text-indigo-500" />
            <p className="font-medium text-gray-600">
              {totalWeight ? `${totalWeight} кг` : "Н/Д"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0">
        <Button type="primary" onClick={handleOpenModal}>
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
