import { Button, Modal, Tabs, Divider } from "antd";
import React, { useEffect, useState } from "react";

export default function ExerciseDetailModal({ isOpen, onClose, exercise }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [isOpen]);

  // Получение перевода типа упражнения
  const getExerciseTypeName = (type) => {
    const typeMap = {
      STRENGTH: "Силовое",
      Strength: "Силовое",
      CARDIO: "Кардио",
      Cardio: "Кардио",
      ENDURANCE: "Выносливость",
      Endurance: "Выносливость",
    };
    return typeMap[type] || type;
  };

  // Получение перевода части тела
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

  // Проверяем наличие данных для отображения
  if (!exercise) {
    return (
      <Modal
        title="Информация об упражнении"
        open={isOpen}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>
            Закрыть
          </Button>,
        ]}
      >
        <p className="text-center text-red-500">
          Данные об упражнении недоступны
        </p>
      </Modal>
    );
  }

  const items = [
    {
      key: "1",
      label: "Информация",
      children: (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl overflow-hidden">
            <img
              src={
                exercise.image ||
                "https://via.placeholder.com/400?text=No+Image"
              }
              alt={exercise.name}
              className="w-full h-64 object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold">{exercise.name}</h1>
          <div className="text-gray-600">
            <p>
              <b>Категория:</b>{" "}
              {getExerciseTypeName(exercise.type || exercise.category)}
            </p>
            <p>
              <b>Часть тела: </b>
              {getBodyPartName(
                exercise.bodyPart ||
                  exercise.targetMuscle ||
                  exercise.cardioType
              )}
            </p>
          </div>
          <div className="mb-5">
            <p>
              <b>Описание:</b>
            </p>
            <p>{exercise.description || "Описание отсутствует"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Демонстрация",
      children: (
        <div className="flex flex-col gap-4 mb-4">
          <h1 className="text-2xl font-bold">Видео демонстрации упражнения</h1>
          {exercise.mediaUrl || exercise.videoUrl ? (
            <iframe
              src={exercise.mediaUrl || exercise.videoUrl}
              className="w-full aspect-video rounded-xl"
              title={`${exercise.name} демонстрация`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <p className="text-center my-10">Видео отсутствует</p>
          )}
        </div>
      ),
    },
    {
      key: "3",
      label: "История",
      children: (
        <div className="flex flex-col gap-4 mb-4">
          <h1 className="text-2xl font-bold">История выполнения упражнения</h1>
          <p className="text-center">История пуста</p>
          <Divider />
          <div className="text-center text-gray-500">
            Здесь будет отображаться история выполнения упражнения в разных
            тренировках для отслеживания прогресса.
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={<p>Информация об упражнении</p>}
      footer={
        <div className="flex gap-4 justify-end">
          <Button onClick={onClose}>Закрыть</Button>
          <Button type="primary" onClick={onClose}>
            Добавить в план тренировки
          </Button>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={700}
    >
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <Tabs defaultActiveKey="1" items={items} />
      )}
    </Modal>
  );
}
