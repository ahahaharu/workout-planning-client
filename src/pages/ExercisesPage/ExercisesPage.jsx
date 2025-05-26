import React, { useState, useEffect } from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import { Button, Divider, Empty, message } from "antd";
import ExerciseAdditionModal from "../../components/AddExerciseModal/ExerciseAdditionModal";
import ExerciseCard from "../../components/ExerciseCard/ExerciseCard";
import { useWorkoutPlanner } from "../../context/WorkoutPlannerContext";
import { ExerciseType } from "workout-planning-lib";

export default function ExercisesPage() {
  const { exerciseService } = useWorkoutPlanner();
  
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [exerciseAdditionModalOpen, setExerciseAdditionModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const exerciseCategories = [
    { id: ExerciseType.STRENGTH, name: "Силовые", count: 0 },
    { id: ExerciseType.CARDIO, name: "Кардио", count: 0 },
    { id: ExerciseType.ENDURANCE, name: "Выносливость", count: 0 },
  ];

  const exerciseBodyParts = [
    { id: "back", name: "Спина", count: 0 },
    { id: "chest", name: "Грудь", count: 0 },
    { id: "biceps", name: "Бицепс", count: 0 },
    { id: "triceps", name: "Трицепс", count: 0 },
    { id: "shoulders", name: "Плечи", count: 0 },
    { id: "legs", name: "Ноги", count: 0 },
  ];

  useEffect(() => {
    if (exerciseService) {
      try {
        const allExercises = exerciseService.getAllExercises();
        setExercises(allExercises);
        setFilteredExercises(allExercises);
        
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
        
        allExercises.forEach(exercise => {
          if (categoryCounts[exercise.type] !== undefined) {
            categoryCounts[exercise.type]++;
          }
          
          if (exercise.type === ExerciseType.STRENGTH && bodyPartCounts[exercise.bodyPart] !== undefined) {
            bodyPartCounts[exercise.bodyPart]++;
          }
        });
        
        exerciseCategories.forEach(category => {
          category.count = categoryCounts[category.id] || 0;
        });
        
        exerciseBodyParts.forEach(bodyPart => {
          bodyPart.count = bodyPartCounts[bodyPart.id] || 0;
        });
      } catch (error) {
        console.error("Ошибка при загрузке упражнений:", error);
        message.error("Не удалось загрузить упражнения");
      } finally {
        setLoading(false);
      }
    }
  }, [exerciseService]);

  const handleCategorySelect = (categories) => {
    setSelectedCategories(categories);
    applyFilters(categories, selectedBodyParts);
  };

  const handleBodyPartSelect = (bodyParts) => {
    setSelectedBodyParts(bodyParts);
    applyFilters(selectedCategories, bodyParts);
  };

  // Применение фильтров
  const applyFilters = (categories, bodyParts) => {
    if (categories.length === 0 && bodyParts.length === 0) {
      setFilteredExercises(exercises);
      return;
    }

    const filtered = exercises.filter(exercise => {
      const categoryMatch = categories.length === 0 || 
        categories.some(category => exercise.type === category.id);
      
      const bodyPartMatch = bodyParts.length === 0 || 
        (exercise.type === ExerciseType.STRENGTH && 
          bodyParts.some(part => exercise.bodyPart === part.id));
      
      return categoryMatch && bodyPartMatch;
    });
    
    setFilteredExercises(filtered);
  };

  const handleAddExercise = (newExercise) => {
    if (exerciseService) {
      try {
        let createdExercise;
        
        switch (newExercise.category) {
          case ExerciseType.STRENGTH:
            createdExercise = exerciseService.createStrengthExercise(
              newExercise.name,
              newExercise.image,
              newExercise.description,
              newExercise.videoId,
              newExercise.bodyPart
            );
            break;
            
          case ExerciseType.CARDIO:
            createdExercise = exerciseService.createCardioExercise(
              newExercise.name,
              newExercise.image,
              newExercise.description,
              newExercise.videoId,
              newExercise.cardioType || "general"
            );
            break;
            
          case ExerciseType.ENDURANCE:
            createdExercise = exerciseService.createEnduranceExercise(
              newExercise.name,
              newExercise.image,
              newExercise.description,
              newExercise.videoId,
              newExercise.targetMuscle || newExercise.bodyPart
            );
            break;
            
          default:
            throw new Error("Неизвестный тип упражнения");
        }
        
        const updatedExercises = [...exercises, createdExercise];
        setExercises(updatedExercises);
        
        applyFilters(selectedCategories, selectedBodyParts);
        
        message.success(`Упражнение "${newExercise.name}" добавлено`);
      } catch (error) {
        console.error("Ошибка при добавлении упражнения:", error);
        message.error("Не удалось добавить упражнение");
      }
    }
  };

  const handleDeleteExercise = (exerciseId) => {
    if (exerciseService) {
      try {
        exerciseService.removeExercise(exerciseId);
        
        const updatedExercises = exercises.filter(ex => ex.id !== exerciseId);
        setExercises(updatedExercises);
        setFilteredExercises(filteredExercises.filter(ex => ex.id !== exerciseId));
        
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
        originalExercise.mediaUrl = updatedExerciseData.videoId;
        
        if (originalExercise.type === "STRENGTH") {
          originalExercise.bodyPart = updatedExerciseData.bodyPart;
        } else if (originalExercise.type === "CARDIO") {
          originalExercise.cardioType = updatedExerciseData.cardioType;
        } else if (originalExercise.type === "ENDURANCE") {
          originalExercise.targetMuscle = updatedExerciseData.targetMuscle;
        }
        
        exerciseService._saveExercises();
        
        const updatedExercises = exercises.map(ex => 
          ex.id === exerciseId ? {...ex, 
            name: updatedExerciseData.name,
            description: updatedExerciseData.description,
            image: updatedExerciseData.image,
            videoUrl: updatedExerciseData.videoId,
            bodyPart: updatedExerciseData.bodyPart || ex.bodyPart,
            cardioType: updatedExerciseData.cardioType || ex.cardioType,
            targetMuscle: updatedExerciseData.targetMuscle || ex.targetMuscle
          } : ex
        );
        
        setExercises(updatedExercises);
        
        applyFilters(selectedCategories, selectedBodyParts);
        
        message.success(`Упражнение "${updatedExerciseData.name}" обновлено`);
      } catch (error) {
        console.error("Ошибка при обновлении упражнения:", error);
        message.error("Не удалось обновить упражнение");
      }
    }
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
          {filteredExercises.map(exercise => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={{
                id: exercise.id,
                name: exercise.name,
                image: exercise.image,
                category: exercise.type,
                bodyPart: exercise.bodyPart || exercise.targetMuscle || exercise.cardioType,
                videoUrl: exercise.mediaUrl,
                description: exercise.description,
              }} 
              onDelete={() => handleDeleteExercise(exercise.id)}
              onEdit={handleEditExercise}
            />
          ))}
        </div>
      ) : (
        <Empty 
          description="Нет упражнений, соответствующих выбранным фильтрам" 
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
    </PageLayout>
  );
}
