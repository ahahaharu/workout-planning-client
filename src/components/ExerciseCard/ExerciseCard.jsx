import { Button } from "antd";
import React, { useState } from "react";
import ExerciseInfoModal from "../ExerciseInfoModal/ExerciseInfoModal";
// Импортируем функции для перевода из utils
import {
  getExerciseTypeName,
  getBodyPartName,
} from "../../utils/exerciseTranslations";

export default function ExerciseCard({ exercise, onDelete, onEdit }) {
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const openInfoModal = (exerciseToOpen) => {
    setSelectedExercise(exerciseToOpen);
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

  return (
    <div className="flex justify-between items-center gap-5 w-full p-4 border rounded-xl border-indigo-300">
      <div className="flex gap-5">
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={
              exercise.image || "https://via.placeholder.com/100?text=No+Image"
            }
            alt={exercise.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-xl">{exercise.name}</h1>
          <p className="text-gray-400">
            {getExerciseTypeName(exercise.category)}
            {exercise.bodyPart && exercise.bodyPart !== "general"
              ? ` · ${getBodyPartName(exercise.bodyPart)}`
              : ""}
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
              category: exercise.category,
              bodyPart: exercise.bodyPart,
              videoUrl: exercise.videoUrl,
              description: exercise.description,
            })
          }
        >
          Информация
        </Button>
      </div>

      {selectedExercise && (
        <ExerciseInfoModal
          isOpen={infoModalOpen}
          onClose={() => {
            setInfoModalOpen(false);
            setSelectedExercise(null);
          }}
          exercise={selectedExercise}
          onDelete={onDelete ? () => handleDelete() : null}
          onEdit={onEdit ? (id, data) => handleEdit(id, data) : null}
        />
      )}
    </div>
  );
}
