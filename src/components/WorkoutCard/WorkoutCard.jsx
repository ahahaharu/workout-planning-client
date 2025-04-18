import { Button } from "antd";
import { Clock, Weight } from "lucide-react";
import React, { useState } from "react";
import WorkoutInfoModal from "../WorkoutInfoModal/WorkoutInfoModal";

export default function WorkoutCard({ workout }) {
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  return (
    <div className="flex justify-between items-center gap-5 w-full p-4 border rounded-xl border-indigo-300">
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl">{workout.name}</h1>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <Clock />
            <p className="font-bold text-gray-600">2 дня назад</p>
          </div>
          <div className="flex items-center gap-2">
            <Weight />
            <p className="font-bold text-gray-600">{workout.totalWeight} кг</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Button size="large" onClick={() => setInfoModalOpen(true)}>
          Информация
        </Button>
        <Button type="primary" size="large">
          Редактировать
        </Button>
      </div>
      <WorkoutInfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        workout={workout}
      />
    </div>
  );
}
