import { Button, Modal, Tabs, Popconfirm } from "antd";
import { Edit, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import ExerciseAdditionModal from "../AddExerciseModal/ExerciseAdditionModal";

export default function ExerciseInfoModal({ isOpen, onClose, exercise, onDelete, onEdit }) {
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const getTranslatedCategory = (categoryCode) => {
    const categoryMap = {
      "STRENGTH": "Силовые",
      "Strength": "Силовые", 
      "CARDIO": "Кардио",
      "Cardio": "Кардио",
      "ENDURANCE": "Выносливость",
      "Endurance": "Выносливость"
    };
    
    return categoryMap[categoryCode] || categoryCode;
  };

  const getOriginalCategoryType = (translatedCategory) => {
    const categoryMap = {
      "Силовые": "STRENGTH",
      "Кардио": "CARDIO",
      "Выносливость": "ENDURANCE"
    };
    
    return categoryMap[translatedCategory] || "STRENGTH";
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [isOpen]);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(exercise.id);
      onClose();
    }
  };
  
  const handleEdit = () => {
    setEditModalOpen(true);
  };
  
  const handleEditComplete = (updatedExercise) => {
    setEditModalOpen(false);
    if (onEdit) {
      onEdit(exercise.id, updatedExercise);
      onClose(); 
    }
  };

  const items = [
    {
      key: "1",
      label: "Информация",
      children: (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl overflow-hidden">
            <img
              src={exercise?.image || "https://via.placeholder.com/400?text=No+Image"}
              alt={exercise?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold">{exercise?.name}</h1>
          <div className="text-gray-600">
            <p>
              <b>Категория:</b> {exercise ? getTranslatedCategory(exercise.category) : ""}
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
            <p>{exercise?.description || "Описание отсутствует"}</p>
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
          {exercise?.videoUrl ? (
            <iframe
              src={exercise.videoUrl}
              className="w-full aspect-video rounded-xl"
              title={`${exercise?.name} демонстрация`}
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
            <Button type="primary" size="large" onClick={handleEdit}>
              <Edit size={20} />
              Править упражнение
            </Button>
            
            {onDelete && (
              <Popconfirm
                title="Удаление упражнения"
                description="Вы уверены, что хотите удалить это упражнение?"
                onConfirm={handleDelete}
                okText="Да"
                cancelText="Отмена"
              >
                <Button danger size="large">
                  <Trash size={20} />
                  Удалить упражнение
                </Button>
              </Popconfirm>
            )}
          </div>
        </div>
      ),
    },
  ];
  
  return (
    <>
      <Modal
        title={<p>Информация об упражнении</p>}
        footer={
          <div className="flex gap-4 justify-center">
            <Button type="primary" onClick={onClose}>
              Добавить в программу тренировок
            </Button>
          </div>
        }
        open={isOpen}
        onCancel={onClose}
      >
        <Tabs defaultActiveKey="1" items={items} />
      </Modal>
      
      {exercise && (
        <ExerciseAdditionModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onAddExercise={handleEditComplete}
          exerciseTypes={{
            STRENGTH: "STRENGTH",
            CARDIO: "CARDIO",
            ENDURANCE: "ENDURANCE"
          }}
          isEditMode={true}
          initialData={{
            id: exercise.id,
            name: exercise.name,
            category: getOriginalCategoryType(exercise.category),
            bodyPart: exercise.bodyPart,
            description: exercise.description,
            videoId: exercise.videoUrl,
            image: exercise.image
          }}
        />
      )}
    </>
  );
}
