import { Button } from "antd";
import React, { useState } from "react";
import ExerciseInfoModal from "../ExerciseInfoModal/ExerciseInfoModal";

export default function ExerciseCard({ exercise, onDelete, onEdit }) {
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const openInfoModal = (exercise) => {
    setSelectedExercise(exercise);
    setInfoModalOpen(true);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(exercise.id);
    }
  };
  
  const handleEdit = (id, updatedExercise) => {
    if (onEdit) {
      onEdit(id, updatedExercise);
    }
  };

  const getTypeName = (type) => {
    const typeNames = {
      "STRENGTH": "Силовые",
      "CARDIO": "Кардио",
      "ENDURANCE": "Выносливость"
    };
    return typeNames[type] || type;
  };

  // Преобразование bodyPart в понятное название
  const getBodyPartName = (bodyPart) => {
    const bodyPartNames = {
      "chest": "Грудь",
      "back": "Спина",
      "biceps": "Бицепс",
      "triceps": "Трицепс",
      "shoulders": "Плечи",
      "legs": "Ноги",
      "abs": "Пресс",
      "arms": "Руки",
      "general": "Общая"
    };
    return bodyPartNames[bodyPart] || bodyPart;
  };

  return (
    <div className="flex justify-between w-full p-4 border rounded-xl border-indigo-300">
      <div className="flex gap-4">
        <div className="w-22 h-22 rounded overflow-hidden">
          <img
            src={exercise.image || "https://via.placeholder.com/100?text=No+Image"}
            alt={exercise.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-xl">{exercise.name}</h1>
          <p className="text-gray-400">
            {getTypeName(exercise.category)} · {getBodyPartName(exercise.bodyPart)}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          size="large"
          onClick={() =>
            openInfoModal({
              id: exercise.id,
              name: exercise.name,
              image: exercise.image,
              category: getTypeName(exercise.category),
              bodyPart: getBodyPartName(exercise.bodyPart),
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
      <ExerciseInfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        exercise={selectedExercise}
        onDelete={onDelete ? handleDelete : null}
        onEdit={onEdit ? handleEdit : null}
      />
    </div>
  );
}
