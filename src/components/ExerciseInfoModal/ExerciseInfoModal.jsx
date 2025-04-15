import { Button, Modal, Tabs } from "antd";
import { Edit, Trash } from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";

export default function ExerciseInfoModal({ isOpen, onClose, exercise }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [isOpen]);

  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: "Информация",
      children: (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl overflow-hidden">
            <img
              src={exercise?.image}
              alt="image"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold">{exercise?.name}</h1>
          <div className="text-gray-600">
            <p>
              <b>Категория:</b> {exercise?.category}
            </p>
            <p>
              <b>Часть тела: </b>
              {exercise?.bodyPart}
            </p>
          </div>
          <div className="mb-5">
            <p>
              <b>Описание:</b>
            </p>
            <p>{exercise?.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Демонстрация",
      children: (
        <div className="flex flex-col gap-4 mb-4">
          <h1 className="text-2xl font-bold">Видео демострации упражнения</h1>
          <iframe
            src={exercise?.videoUrl}
            className="w-full aspect-video rounded-xl"
            title={`${exercise?.name} демонстрация`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
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
        </div>
      ),
    },
    {
      key: "4",
      label: "Настройки",
      children: (
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Настройки</h1>
          <div className="flex flex-col gap-4 mt-6">
            <Button type="primary" size="large">
              <Edit size={20} />
              Править упражнение
            </Button>
            <Button color="red" variant="outlined" size="large">
              <Trash size={20} />
              Удалить упражнение
            </Button>
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
          <Button onClick={onClose}>Добавить заметку</Button>
          <Button type="primary" onClick={onClose}>
            Добавить в программу тренировок
          </Button>
        </div>
      }
      loading={loading}
      open={isOpen}
      onCancel={onClose}
    >
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </Modal>
  );
}
