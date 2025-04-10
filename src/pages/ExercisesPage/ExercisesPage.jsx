import React, { useState } from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";

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

  // Here you would filter your exercises based on the selected categories and body parts
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="w-full p-4 border">Упражнение 1</div>
      </div>
    </PageLayout>
  );
}
