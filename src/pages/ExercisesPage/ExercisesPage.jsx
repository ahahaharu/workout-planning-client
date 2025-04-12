import React, { useState } from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import image from "../../assets/image.png";
import { Button, Divider, Modal, Tabs } from "antd";
import { Edit, Trash } from "lucide-react";
import InfoModal from "../../components/InfoModal/InfoModal";
import ExerciseAdditionModal from "../../components/AddExerciseModal/ExerciseAdditionModal";

export default function ExercisesPage() {
  const exerciseCategories = [
    { id: "1", name: "Кардио", count: 10 },
    { id: "2", name: "Силовые", count: 15 },
    { id: "3", name: "Растяжка", count: 5 },
  ];

  const exerciseBodyParts = [
    { id: "1", name: "Спина", count: 10 },
    { id: "2", name: "Грудь", count: 15 },
    { id: "3", name: "Бицепс", count: 15 },
    { id: "4", name: "Трицепс", count: 5 },
    { id: "5", name: "Плечи", count: 5 },
    { id: "6", name: "Ноги", count: 5 },
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(true);
  const [ExerciseAdditionModalOpen, setExerciseAdditionModalOpen] =
    useState(false);

  const handleCategorySelect = (categories) => {
    setSelectedCategories(categories);
    console.log("Selected categories:", categories);
  };

  const handleBodyPartSelect = (bodyParts) => {
    setSelectedBodyParts(bodyParts);
    console.log("Selected body parts:", bodyParts);
  };

  const openInfoModal = (exercise) => {
    setSelectedExercise(exercise);
    setInfoModalOpen(true);
  };

  return (
    <PageLayout title="Упражнения">
      <div className="flex flex-row gap-4 mb-6">
        <CategoryFilter
          categories={exerciseCategories}
          title="Категория"
          onSelect={handleCategorySelect}
        />
        <CategoryFilter
          categories={exerciseBodyParts}
          title="Часть тела"
          onSelect={handleBodyPartSelect}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="flex justify-between w-full p-4 border rounded-xl border-indigo-300">
          <div className="flex gap-4">
            <div className="w-22 h-22 rounded overflow-hidden">
              <img
                src={image}
                alt="image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-xl">Жим лёжа</h1>
              <p className="text-gray-400">Силовые · Грудь</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              size="large"
              onClick={() =>
                openInfoModal({
                  name: "Жим лёжа",
                  image: image,
                  category: "Силовые",
                  bodyPart: "Грудь",
                  videoUrl: `https://www.youtube.com/embed/SCVCLChPQFY`,
                  description:
                    "Жим лёжа - это силовое упражнение, которое направлено на развитие грудных мышц, плеч и трицепсов. Оно выполняется в положении лёжа на скамье с использованием штанги или гантелей.",
                })
              }
            >
              Информация
            </Button>

            <Button size="large" type="primary">
              Добавить в программу
            </Button>
          </div>
        </div>
        <div className="flex justify-between w-full p-4 border rounded-xl border-indigo-300">
          <div className="flex gap-4">
            <div className="w-22 h-22 rounded overflow-hidden">
              <img
                src={image}
                alt="image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-xl">Жим лёжа</h1>
              <p className="text-gray-400">Силовые · Грудь</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button size="large">Информация</Button>
            <Button size="large" type="primary">
              Добавить в программу
            </Button>
          </div>
        </div>
        <div className="flex justify-between w-full p-4 border rounded-xl border-indigo-300">
          <div className="flex gap-4">
            <div className="w-22 h-22 rounded overflow-hidden">
              <img
                src={image}
                alt="image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-xl">Жим лёжа</h1>
              <p className="text-gray-400">Силовые · Грудь</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button size="large">Информация</Button>
            <Button size="large" type="primary">
              Добавить в программу
            </Button>
          </div>
        </div>
      </div>

      <Divider />
      <div className="w-full flex justify-center">
        <Button
          type="primary"
          size="large"
          onClick={() => setExerciseAdditionModalOpen(true)}
        >
          Добавить своё упражнение
        </Button>
      </div>

      <InfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        exercise={selectedExercise}
      />
      <ExerciseAdditionModal
        isOpen={ExerciseAdditionModalOpen}
        onClose={() => setExerciseAdditionModalOpen(false)}
      />
    </PageLayout>
  );
}
