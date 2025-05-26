import { Button } from "antd";
import React, { useState } from "react";
import ExerciseInfoModal from "../ExerciseInfoModal/ExerciseInfoModal";

export default function ExerciseCard({ exercise, onDelete, onEdit }) {
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const openInfoModal = (exercise) => {
    setSelectedExercise(exercise);
    setInfoModalOpen(true);
  };

  const openDetailModal = (exercise) => {
    setSelectedExercise(exercise);
    setDetailModalOpen(true);
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
      STRENGTH: "Силовые",
      CARDIO: "Кардио",
      ENDURANCE: "Выносливость",
    };
    return typeNames[type] || type;
  };

  const getBodyPartName = (bodyPart) => {
    if (!bodyPart) return "";

    const bodyPartMap = {
      chest: "Грудь",
      back: "Спина",
      biceps: "Бицепс",
      triceps: "Трицепс",
      shoulders: "Плечи",
      legs: "Ноги",
      abs: "Пресс",
      arms: "Руки",
      general: "Общая",
      forearms: "Предплечья",
      calves: "Икры",
      glutes: "Ягодицы",
      quads: "Четырехглавая",
      hamstrings: "Задняя поверхность бедра",
    };

    return bodyPartMap[bodyPart] || bodyPart;
  };

  return (
    <div className="flex justify-between gap-5 w-full p-4 border rounded-xl border-indigo-300">
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
            {getTypeName(exercise.category)} ·{" "}
            {getBodyPartName(exercise.bodyPart)}
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
