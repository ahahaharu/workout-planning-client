import { Button, Divider, Modal, Tabs } from "antd";
import { Edit, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function WorkoutPlanInfoModal({ isOpen, onClose, workoutPlan }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [isOpen]);

  const items = [
    {
      key: "1",
      label: "Информация",
      children: (
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{workoutPlan?.name}</h1>
          <div>
            <p>
              <b>Описание:</b>
            </p>
            <p>{workoutPlan?.description}</p>
          </div>
          <Divider />
          <div className="text-center my-5 text-gray-600 font-semibold">
            Упражнений нет
          </div>
          <Divider />
        </div>
      ),
    },
    {
      key: "2",
      label: "История тренировок",
      children: (
        <div className="flex flex-col gap-4 mb-4">
          <h1 className="text-2xl font-bold">
            История тренировок с этой программой
          </h1>
          <p className="text-center">История пуста</p>
        </div>
      ),
    },
    {
      key: "3",
      label: "Настройки",
      children: (
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Настройки</h1>
          <div className="flex flex-col gap-4 mt-6">
            <Button type="primary" size="large">
              <Edit size={20} />
              Править программу
            </Button>
            <Button color="red" variant="outlined" size="large">
              <Trash size={20} />
              Удалить программу
            </Button>
          </div>
        </div>
      ),
    },
  ];
  return (
    <Modal
      title={<p>Информация об программе тренировок</p>}
      footer={
        <div className="flex gap-4 justify-end">
          <Button onClick={onClose}>Добавить заметку</Button>
          <Button type="primary" onClick={onClose}>
            Начать тренировку
          </Button>
        </div>
      }
      loading={loading}
      open={isOpen}
      onCancel={onClose}
    >
      <Tabs defaultActiveKey="1" items={items} />
    </Modal>
  );
}
