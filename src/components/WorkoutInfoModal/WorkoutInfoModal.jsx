import { Button, Modal, Popconfirm, Empty, Card, Divider, Tabs } from "antd";
import { Edit, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function WorkoutPlanInfoModal({
  isOpen,
  onClose,
  workoutPlan,
  onDelete,
  onEdit,
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [isOpen]);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(workoutPlan.id);
      onClose();
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(workoutPlan);
      onClose();
    }
  };

  // Функция для отображения типа упражнения
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

  // Функция для отображения части тела на русском
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
    };

    return bodyPartMap[bodyPart] || bodyPart;
  };

  // Отображение подходов силового упражнения
  const renderExerciseSets = (exercise) => {
    if (!exercise.sets || exercise.sets.length === 0) {
      return <p className="text-gray-500 text-sm">Нет подходов</p>;
    }

    return (
      <div className="mt-2">
        <div className="bg-gray-50 rounded-lg p-2">
          {exercise.sets.map((set, setIndex) => (
            <div
              key={setIndex}
              className="grid grid-cols-12 items-center py-1 border-b last:border-b-0"
            >
              <div className="col-span-2 text-center font-semibold">
                {setIndex + 1}
              </div>
              <div className="col-span-5 text-center">{set.weight} кг</div>
              <div className="col-span-5 text-center">{set.reps} повт.</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
            <p>{workoutPlan?.description || "Описание отсутствует"}</p>
          </div>
          <Divider>Упражнения</Divider>

          {workoutPlan?.exercises && workoutPlan.exercises.length > 0 ? (
            <div className="flex flex-col gap-2 w-full">
              {workoutPlan.exercises.map((exercise, index) => (
                <Card
                  key={index}
                  className="w-full shadow-sm"
                  size="small"
                  bodyStyle={{ padding: "12px" }}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      {exercise.image && (
                        <img
                          src={exercise.image}
                          alt={exercise.name}
                          className="w-10 h-10 rounded-md object-cover mr-3"
                        />
                      )}
                      <div>
                        <span className="font-semibold">{exercise.name}</span>
                        {exercise.type && (
                          <span className="text-gray-500 ml-2">
                            ({getExerciseTypeName(exercise.type)})
                            {exercise.bodyPart &&
                              ` · ${getBodyPartName(exercise.bodyPart)}`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Отображаем информацию о подходах */}
                    {exercise.type === "STRENGTH" &&
                      renderExerciseSets(exercise)}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Empty description="В плане нет упражнений" />
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
            <Button
              type="primary"
              size="large"
              onClick={handleEdit}
              icon={<Edit size={20} />}
            >
              Редактировать программу
            </Button>

            {onDelete && (
              <Popconfirm
                title="Удаление программы"
                description="Вы уверены, что хотите удалить эту программу тренировок?"
                onConfirm={handleDelete}
                okText="Да"
                cancelText="Отмена"
              >
                <Button danger size="large" icon={<Trash size={20} />}>
                  Удалить программу
                </Button>
              </Popconfirm>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={<p>Информация о программе тренировок</p>}
      open={isOpen}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="close" onClick={onClose}>
          Закрыть
        </Button>,
        <Button key="workout" type="primary" onClick={onClose}>
          Начать тренировку
        </Button>,
      ]}
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
