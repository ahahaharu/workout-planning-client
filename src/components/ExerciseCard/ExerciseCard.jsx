import { Button } from "antd";
import React, { useState } from "react";
import InfoModal from "../InfoModal/InfoModal";

export default function ExerciseCard({ exercise }) {
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(true);

  const openInfoModal = (exercise) => {
    setSelectedExercise(exercise);
    setInfoModalOpen(true);
  };

  return (
    <div className="flex justify-between w-full p-4 border rounded-xl border-indigo-300">
      <div className="flex gap-4">
        <div className="w-22 h-22 rounded overflow-hidden">
          <img
            src={exercise.image}
            alt="image"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-xl">{exercise.name}</h1>
          <p className="text-gray-400">
            {exercise.category} · {exercise.bodyPart}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          size="large"
          onClick={() =>
            openInfoModal({
              name: exercise.name,
              image: exercise.image,
              category: exercise.category,
              bodyPart: exercise.bodyPart,
              videoUrl: exercise.videoUrl,
              description: exercise.description,
            })
          }
        >
          Информация
        </Button>

        <Button size="large" type="primary">
          Добавить в программу
        </Button>
      </div>
      <InfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        exercise={selectedExercise}
      />
    </div>
  );
}
