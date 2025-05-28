import React, { useState, useEffect } from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import { Button, Divider, Empty, message } from "antd";
import ExerciseAdditionModal from "../../components/AddExerciseModal/ExerciseAdditionModal";
import ExerciseCard from "../../components/ExerciseCard/ExerciseCard";
import { useWorkoutPlanner } from "../../context/WorkoutPlannerContext";
import { ExerciseType } from "workout-planning-lib";
import ExerciseInfoModal from "../../components/ExerciseInfoModal/ExerciseInfoModal";
import { useSearch } from "../../context/SearchContext";

export default function ExercisesPage() {
  const { exerciseService } = useWorkoutPlanner();
  const { searchQuery } = useSearch();

  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);

  // Состояния для отображения фильтров со счетчиками
  const [exerciseCategories, setExerciseCategories] = useState([
    { id: ExerciseType.STRENGTH, name: "Силовые", count: 0 },
    { id: ExerciseType.CARDIO, name: "Кардио", count: 0 },
    { id: ExerciseType.ENDURANCE, name: "Выносливость", count: 0 },
  ]);
  const [exerciseBodyParts, setExerciseBodyParts] = useState([
    { id: "back", name: "Спина", count: 0 },
    { id: "chest", name: "Грудь", count: 0 },
    { id: "biceps", name: "Бицепс", count: 0 },
    { id: "triceps", name: "Трицепс", count: 0 },
    { id: "shoulders", name: "Плечи", count: 0 },
    { id: "legs", name: "Ноги", count: 0 },
  ]);

  // Состояния для хранения ВЫБРАННЫХ категорий и частей тела для фильтрации
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);

  const [exerciseAdditionModalOpen, setExerciseAdditionModalOpen] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const updateFilterCounts = (currentExercisesList) => {
    const categoryCounts = {
      [ExerciseType.STRENGTH]: 0,
      [ExerciseType.CARDIO]: 0,
      [ExerciseType.ENDURANCE]: 0,
    };
    const bodyPartCounts = {
      back: 0,
      chest: 0,
      biceps: 0,
      triceps: 0,
      shoulders: 0,
      legs: 0,
    };

    currentExercisesList.forEach((exercise) => {
      if (categoryCounts[exercise.type] !== undefined) {
        categoryCounts[exercise.type]++;
      }
      if (
        exercise.type === ExerciseType.STRENGTH &&
        bodyPartCounts[exercise.bodyPart] !== undefined
      ) {
        bodyPartCounts[exercise.bodyPart]++;
      }
    });

    setExerciseCategories((prev) =>
      prev.map((cat) => ({ ...cat, count: categoryCounts[cat.id] || 0 }))
    );
    setExerciseBodyParts((prev) =>
      prev.map((bp) => ({ ...bp, count: bodyPartCounts[bp.id] || 0 }))
    );
  };

  const loadExercises = () => {
    if (exerciseService) {
      try {
        setLoading(true);
        const allExercises = exerciseService.getAllExercises();
        setExercises(allExercises);
        updateFilterCounts(allExercises);
      } catch (error) {
        console.error("Ошибка при загрузке упражнений:", error);
        message.error("Не удалось загрузить упражнения");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadExercises();
  }, [exerciseService]);

  const calculateFilteredExercises = (
    sourceExercises,
    currentSearchQuery,
    currentCategories,
    currentBodyParts
  ) => {
    let localFiltered = [...sourceExercises];

    if (currentSearchQuery.trim()) {
      localFiltered = localFiltered.filter(
        (exercise) =>
          exercise.name
            .toLowerCase()
            .includes(currentSearchQuery.toLowerCase()) ||
          (exercise.description &&
            exercise.description
              .toLowerCase()
              .includes(currentSearchQuery.toLowerCase()))
      );
    }

    if (currentCategories.length > 0) {
      localFiltered = localFiltered.filter((exercise) =>
        currentCategories.some((category) => exercise.type === category.id)
      );
    }

    if (currentBodyParts.length > 0) {
      localFiltered = localFiltered.filter(
        (exercise) =>
          exercise.type === ExerciseType.STRENGTH &&
          currentBodyParts.some((part) => exercise.bodyPart === part.id)
      );
    }
    return localFiltered;
  };

  useEffect(() => {
    const newFiltered = calculateFilteredExercises(
      exercises,
      searchQuery,
      selectedCategories, // Теперь это объявленное состояние
      selectedBodyParts // Теперь это объявленное состояние
    );
    setFilteredExercises(newFiltered);
  }, [exercises, searchQuery, selectedCategories, selectedBodyParts]);

  const handleCategorySelect = (categories) => {
    setSelectedCategories(categories); // Используем правильный сеттер
  };

  const handleBodyPartSelect = (bodyParts) => {
    setSelectedBodyParts(bodyParts); // Используем правильный сеттер
  };

  const handleAddExercise = (newExerciseData) => {
    if (exerciseService) {
      try {
        let createdExercise;
        switch (newExerciseData.category) {
          case ExerciseType.STRENGTH:
            createdExercise = exerciseService.createStrengthExercise(
              newExerciseData.name,
              newExerciseData.image,
              newExerciseData.description,
              newExerciseData.videoId,
              newExerciseData.bodyPart
            );
            break;
          case ExerciseType.CARDIO:
            createdExercise = exerciseService.createCardioExercise(
              newExerciseData.name,
              newExerciseData.image,
              newExerciseData.description,
              newExerciseData.videoId,
              newExerciseData.cardioType || "general"
            );
            break;
          case ExerciseType.ENDURANCE:
            createdExercise = exerciseService.createEnduranceExercise(
              newExerciseData.name,
              newExerciseData.image,
              newExerciseData.description,
              newExerciseData.videoId,
              newExerciseData.targetMuscle || newExerciseData.bodyPart
            );
            break;
          default:
            message.error("Неизвестный тип упражнения");
            throw new Error("Неизвестный тип упражнения");
        }

        const updatedExercises = [...exercises, createdExercise];
        setExercises(updatedExercises);
        updateFilterCounts(updatedExercises); // Обновляем счетчики после обновления exercises

        message.success(`Упражнение "${createdExercise.name}" добавлено`);
      } catch (error) {
        console.error("Ошибка при добавлении упражнения:", error);
        message.error(`Не удалось добавить упражнение: ${error.message}`);
      }
    }
  };

  const handleDeleteExercise = (exerciseId) => {
    if (exerciseService) {
      try {
        exerciseService.removeExercise(exerciseId);
        const updatedExercises = exercises.filter((ex) => ex.id !== exerciseId);
        setExercises(updatedExercises);
        updateFilterCounts(updatedExercises); // Обновляем счетчики после обновления exercises

        message.success("Упражнение удалено");
      } catch (error) {
        console.error("Ошибка при удалении упражнения:", error);
        message.error("Не удалось удалить упражнение");
      }
    }
  };

  const handleEditExercise = (exerciseId, updatedExerciseData) => {
    if (exerciseService) {
      try {
        const originalExercise = exerciseService.getExerciseById(exerciseId);
        if (!originalExercise) {
          throw new Error("Упражнение не найдено");
        }

        originalExercise.name = updatedExerciseData.name;
        originalExercise.description = updatedExerciseData.description;
        originalExercise.image = updatedExerciseData.image;
        originalExercise.mediaUrl = updatedExerciseData.videoId; // Предполагаем, что videoId это mediaUrl

        if (originalExercise.type === ExerciseType.STRENGTH) {
          originalExercise.bodyPart = updatedExerciseData.bodyPart;
        } else if (originalExercise.type === ExerciseType.CARDIO) {
          originalExercise.cardioType = updatedExerciseData.cardioType;
        } else if (originalExercise.type === ExerciseType.ENDURANCE) {
          originalExercise.targetMuscle = updatedExerciseData.targetMuscle;
        }

        exerciseService._saveExercises(); // Сохраняем изменения в сервисе
        loadExercises(); // Перезагружаем все упражнения для отражения изменений и обновления счетчиков

        message.success(`Упражнение "${updatedExerciseData.name}" обновлено`);
      } catch (error) {
        console.error("Ошибка при обновлении упражнения:", error);
        message.error("Не удалось обновить упражнение");
      }
    }
  };

  const handleShowDetail = (exercise) => {
    // Убедимся, что selectedExercise имеет videoUrl для ExerciseInfoModal
    setSelectedExercise({
      ...exercise,
      videoUrl: exercise.mediaUrl || exercise.videoUrl,
    });
    setDetailModalOpen(true);
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={{
                id: exercise.id,
                name: exercise.name,
                image: exercise.image,
                category: exercise.type,
                bodyPart:
                  exercise.bodyPart ||
                  exercise.targetMuscle ||
                  exercise.cardioType,
                videoUrl: exercise.mediaUrl || exercise.videoUrl, // Передаем videoUrl
                description: exercise.description,
              }}
              onDelete={() => handleDeleteExercise(exercise.id)}
              onEdit={handleEditExercise} // Передаем полную функцию
              onShowDetail={() => handleShowDetail(exercise)}
            />
          ))}
        </div>
      ) : (
        <Empty
          description={
            searchQuery ||
            selectedCategories.length > 0 ||
            selectedBodyParts.length > 0
              ? "Нет упражнений, соответствующих выбранным фильтрам"
              : "У вас еще нет упражнений. Добавьте своё первое!"
          }
          className="my-10"
        />
      )}

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
        isOpen={exerciseAdditionModalOpen}
        onClose={() => setExerciseAdditionModalOpen(false)}
        onAddExercise={handleAddExercise}
        exerciseTypes={ExerciseType}
      />

      <ExerciseInfoModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        exercise={selectedExercise} // selectedExercise уже содержит videoUrl после handleShowDetail
        onDelete={handleDeleteExercise} // Передаем обработчик
        onEdit={handleEditExercise} // Передаем обработчик
      />
    </PageLayout>
  );
}
