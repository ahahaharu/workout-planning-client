import { Button, Divider, Modal, Tabs, Spin } from "antd";
import { Edit, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useWorkoutPlanner } from "../../context/WorkoutPlannerContext";

export default function WorkoutPlanInfoModal({
  isOpen,
  onClose,
  workoutPlan,
  onDelete,
  onEdit,
}) {
  const [loading, setLoading] = useState(true);
  const { workoutService } = useWorkoutPlanner();

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [isOpen]);

  const handleEditPlan = () => {
    if (onEdit && workoutPlan) {
      onEdit(workoutPlan);
      onClose();
    }
  };

  const handleDeletePlan = () => {
    if (onDelete && workoutPlan) {
      onDelete(workoutPlan.id);
      onClose();
    }
  };

  const items = [
    {
      key: "1",
      label: "Информация",
      children: (
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">{workoutPlan?.name}</h1>
          <div>
            <p>
              <b>Описание:</b>
            </p>
            <p>{workoutPlan?.description || "Описание отсутствует"}</p>
          </div>
          <Divider />
          {workoutPlan?.exercises && workoutPlan.exercises.length > 0 ? (
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">Упражнения в плане:</h2>
              {workoutPlan.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-md flex items-center gap-2"
                >
                  {exercise.image && (
                    <img
                      src={exercise.image}
                      alt={exercise.name}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{exercise.name}</p>
                    {exercise.sets && exercise.sets.length > 0 && (
                      <p className="text-sm text-gray-500">
                        {exercise.sets.length}{" "}
                        {exercise.sets.length === 1
                          ? "подход"
                          : exercise.sets.length < 5
                          ? "подхода"
                          : "подходов"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center my-5 text-gray-600 font-semibold">
              Упражнений нет
            </div>
          )}
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
            <Button type="primary" size="large" onClick={handleEditPlan}>
              <Edit size={20} className="mr-2" />
              Править программу
            </Button>
            <Button danger size="large" onClick={handleDeletePlan}>
              <Trash size={20} className="mr-2" />
              Удалить программу
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={<p>Информация о программе тренировок</p>}
      footer={null}
      open={isOpen}
      onCancel={onClose}
      width={700}
    >
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Spin size="large" />
        </div>
      ) : (
        <Tabs defaultActiveKey="1" items={items} />
      )}
    </Modal>
  );
}
