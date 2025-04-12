import React, { useState } from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import benchPressImage from "../../assets/benchPress.png";
import leverSeatedLegPressImage from "../../assets/leverSeatedLegPress.png";
import { Button, Divider } from "antd";
import ExerciseAdditionModal from "../../components/AddExerciseModal/ExerciseAdditionModal";
import ExerciseCard from "../../components/ExerciseCard/ExerciseCard";

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
        <ExerciseCard
          exercise={{
            name: "Жим лёжа",
            image: benchPressImage,
            category: "Силовые",
            bodyPart: "Грудь",
            videoUrl: `https://www.youtube.com/embed/SCVCLChPQFY`,
            description:
              "Жим лёжа - это силовое упражнение, которое направлено на развитие грудных мышц, плеч и трицепсов. Оно выполняется в положении лёжа на скамье с использованием штанги или гантелей.",
          }}
        />
        <ExerciseCard
          exercise={{
            name: "Рычажный жим ногами",
            image: leverSeatedLegPressImage,
            category: "Силовые",
            bodyPart: "Ноги",
            videoUrl: `https://www.youtube.com/embed/SCVCLChPQFY`,
            description:
              "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio saepe maxime repudiandae officia unde distinctio quidem nostrum reprehenderit voluptatem totam, provident fuga neque, beatae repellendus voluptate expedita suscipit aut! Molestias.",
          }}
        />
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

      <ExerciseAdditionModal
        isOpen={ExerciseAdditionModalOpen}
        onClose={() => setExerciseAdditionModalOpen(false)}
      />
    </PageLayout>
  );
}
