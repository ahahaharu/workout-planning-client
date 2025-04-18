import { Button, Divider, Modal, Tabs } from "antd";
import { Clock, Edit, Trash, Weight } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function WorkoutInfoModal({ isOpen, onClose, workout }) {
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
          <h1 className="text-3xl font-bold">{workout?.name}</h1>
          <div className="flex gap-2 text-gray-600 items-center">
            <Clock />
            <b className="text-lg">Последняя тренировка: 2 дня назад</b>
          </div>
          <div className="flex gap-2 text-gray-600 items-center">
            <Weight />
            <b className="text-lg">Общий вес: {workout?.totalWeight} кг</b>
          </div>

          <Divider>Упражнения</Divider>
          <div className="text-center my-5 text-gray-600 font-semibold">
            Упражнений нет
          </div>
          <Divider />
        </div>
      ),
    },
    {
      key: "2",
      label: "Настройки",
      children: (
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Настройки</h1>
          <div className="flex flex-col gap-4 mt-6">
            <Button type="primary" size="large">
              <Edit size={20} />
              Править тренировку
            </Button>
            <Button color="red" variant="outlined" size="large">
              <Trash size={20} />
              Удалить тренирвку из истории
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={<p>Информация об тренировке</p>}
      //   footer={
      //     <div className="flex gap-4 justify-end">
      //       <Button onClick={onClose}>Добавить заметку</Button>
      //       <Button type="primary" onClick={onClose}>
      //         Начать тренировку
      //       </Button>
      //     </div>
      //   }
      loading={loading}
      open={isOpen}
      onCancel={onClose}
    >
      <Tabs defaultActiveKey="1" items={items} />
    </Modal>
  );
}
