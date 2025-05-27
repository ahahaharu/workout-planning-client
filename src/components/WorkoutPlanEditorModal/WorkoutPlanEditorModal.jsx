import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Empty,
  Card,
  Divider,
  InputNumber,
  List,
  Spin,
  Tabs,
  Collapse,
  Popconfirm,
  message,
} from "antd";
import {
  Plus,
  Trash,
  ArrowUp,
  ArrowDown,
  Save,
  Search,
  Check,
  Edit,
} from "lucide-react";
import { useWorkoutPlanner } from "../../context/WorkoutPlannerContext";

const { TextArea } = Input;
const { Panel } = Collapse;

export default function WorkoutPlanEditorModal({
  isOpen,
  onClose,
  workoutPlan = null,
  onSave,
  isEditMode = false,
}) {
  const [form] = Form.useForm();
  const { exerciseService, workoutPlanService } = useWorkoutPlanner();

  const [planName, setPlanName] = useState(workoutPlan?.name || "");
  const [planDescription, setPlanDescription] = useState(
    workoutPlan?.description || ""
  );
  const [exercises, setExercises] = useState([]);

  const [allExercises, setAllExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (isOpen && exerciseService) {
      setLoading(true);
      try {
        const fetchedExercises = exerciseService.getAllExercises();

        let planExercises = [];
        if (workoutPlan && workoutPlan.exercises) {
          planExercises = [...workoutPlan.exercises].map((ex) => {
            return {
              ...ex,
              sets: ex.sets || [],
            };
          });
        }
        setExercises(planExercises);

        const exerciseIdsInPlan = planExercises.map((ex) => ex.id);
        const availableExercises = fetchedExercises.filter(
          (ex) => !exerciseIdsInPlan.includes(ex.id)
        );

        setAllExercises(availableExercises);
        setFilteredExercises(availableExercises);
      } catch (error) {
        console.error("Ошибка при загрузке упражнений:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [isOpen, exerciseService, workoutPlan]);

  useEffect(() => {
    if (isOpen && workoutPlan) {
      setPlanName(workoutPlan.name || "");
      setPlanDescription(workoutPlan.description || "");

      form.setFieldsValue({
        name: workoutPlan.name,
        description: workoutPlan.description || "",
      });
    } else if (isOpen && !workoutPlan) {
      setPlanName("");
      setPlanDescription("");
      setExercises([]);

      form.setFieldsValue({
        name: "",
        description: "",
      });
    }
  }, [isOpen, workoutPlan, form]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (!value) {
      setFilteredExercises(allExercises);
      return;
    }

    const filtered = allExercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredExercises(filtered);
  };

  const handleAddExercise = (exercise) => {
    const initialSets =
      exercise.type === "STRENGTH" || exercise.type === "Strength"
        ? [{ reps: 10, weight: 20 }]
        : [];

    const newExercises = [
      ...exercises,
      {
        ...exercise,
        sets: initialSets,
      },
    ];
    setExercises(newExercises);

    const updatedAvailable = allExercises.filter((ex) => ex.id !== exercise.id);
    setAllExercises(updatedAvailable);
    setFilteredExercises(
      updatedAvailable.filter((ex) =>
        ex.name.toLowerCase().includes(searchText.toLowerCase())
      )
    );

    if (exercise.type === "STRENGTH" || exercise.type === "Strength") {
      message.success(
        "Упражнение добавлено. Теперь вы можете настроить подходы.",
        1
      );
    }
  };

  const handleRemoveExercise = (exerciseId) => {
    const removedExercise = exercises.find((ex) => ex.id === exerciseId);
    const newExercises = exercises.filter((ex) => ex.id !== exerciseId);

    setExercises(newExercises);

    if (removedExercise) {
      const updatedAvailable = [...allExercises, removedExercise];
      setAllExercises(updatedAvailable);
      setFilteredExercises(
        updatedAvailable.filter((ex) =>
          ex.name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  };

  const handleMoveExercise = (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < exercises.length) {
      const newExercises = [...exercises];
      const [movedItem] = newExercises.splice(index, 1);
      newExercises.splice(newIndex, 0, movedItem);

      setExercises(newExercises);
    }
  };

  const handleAddSet = (exerciseId) => {
    const newExercises = exercises.map((ex) => {
      if (ex.id === exerciseId) {
        const lastSet =
          ex.sets && ex.sets.length > 0
            ? ex.sets[ex.sets.length - 1]
            : { reps: 10, weight: 20 };

        return {
          ...ex,
          sets: [...(ex.sets || []), { ...lastSet }],
        };
      }
      return ex;
    });

    setExercises(newExercises);
  };

  const handleRemoveSet = (exerciseId, setIndex) => {
    const newExercises = exercises.map((ex) => {
      if (ex.id === exerciseId) {
        const newSets = [...(ex.sets || [])];
        newSets.splice(setIndex, 1);
        return { ...ex, sets: newSets };
      }
      return ex;
    });

    setExercises(newExercises);
  };

  const handleUpdateSet = (exerciseId, setIndex, field, value) => {
    const newExercises = exercises.map((ex) => {
      if (ex.id === exerciseId) {
        const newSets = (ex.sets || []).map((set, idx) => {
          if (idx === setIndex) {
            return { ...set, [field]: value };
          }
          return set;
        });

        return { ...ex, sets: newSets };
      }
      return ex;
    });

    setExercises(newExercises);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const planData = {
          name: values.name,
          description: values.description,
          exercises: exercises,
        };

        if (onSave) {
          onSave(planData, workoutPlan?.id);
        }

        onClose();
      })
      .catch((err) => {
        console.error("Ошибка валидации формы:", err);
      });
  };

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
      forearms: "Предплечья",
      calves: "Икры",
      glutes: "Ягодицы",
      quads: "Четырехглавая",
      hamstrings: "Задняя поверхность бедра",
      lats: "Широчайшие",
      core: "Кор",
      fullbody: "Все тело",
      lowerbody: "Нижняя часть тела",
      upperbody: "Верхняя часть тела",
    };

    return bodyPartMap[bodyPart] || bodyPart;
  };

  const isStrengthExercise = (exercise) => {
    return exercise.type === "STRENGTH" || exercise.type === "Strength";
  };

  const items = [
    {
      key: "details",
      label: "Детали плана",
      children: (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: planName,
            description: planDescription,
          }}
        >
          <Form.Item
            name="name"
            label="Название плана тренировок"
            rules={[
              { required: true, message: "Пожалуйста, введите название плана" },
            ]}
          >
            <Input
              size="large"
              placeholder="Введите название плана"
              onChange={(e) => setPlanName(e.target.value)}
            />
          </Form.Item>

          <Form.Item name="description" label="Описание">
            <TextArea
              rows={4}
              placeholder="Введите описание плана тренировок"
              onChange={(e) => setPlanDescription(e.target.value)}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "exercises",
      label: "Упражнения",
      children: (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Упражнения в плане</h3>

            {exercises.length === 0 ? (
              <Empty description="В плане нет упражнений" className="my-4" />
            ) : (
              <div className="flex flex-col gap-4">
                {exercises.map((exercise, index) => (
                  <Card
                    key={exercise.id}
                    size="small"
                    className="shadow-sm"
                    title={
                      <div className="flex items-center gap-2">
                        {exercise.image && (
                          <img
                            src={exercise.image}
                            alt={exercise.name}
                            className="w-8 h-8 rounded-md object-cover"
                          />
                        )}
                        <span>{exercise.name}</span>
                        <span className="text-xs text-gray-500">
                          ({getExerciseTypeName(exercise.type)}
                          {exercise.bodyPart &&
                            ` · ${getBodyPartName(exercise.bodyPart)}`}
                          )
                        </span>
                      </div>
                    }
                    extra={
                      <div className="flex gap-1">
                        <Button
                          type="text"
                          icon={<ArrowUp size={16} />}
                          onClick={() => handleMoveExercise(index, "up")}
                          disabled={index === 0}
                        />
                        <Button
                          type="text"
                          icon={<ArrowDown size={16} />}
                          onClick={() => handleMoveExercise(index, "down")}
                          disabled={index === exercises.length - 1}
                        />
                        <Popconfirm
                          title="Удаление упражнения"
                          description="Вы уверены, что хотите удалить это упражнение из плана?"
                          onConfirm={() => handleRemoveExercise(exercise.id)}
                          okText="Да"
                          cancelText="Отмена"
                        >
                          <Button
                            type="text"
                            danger
                            icon={<Trash size={16} />}
                          />
                        </Popconfirm>
                      </div>
                    }
                  >
                    {isStrengthExercise(exercise) && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-medium">Подходы:</p>
                          <Button
                            type="primary"
                            size="small"
                            icon={<Plus size={14} />}
                            onClick={() => handleAddSet(exercise.id)}
                          >
                            Добавить подход
                          </Button>
                        </div>

                        {exercise.sets?.length === 0 || !exercise.sets ? (
                          <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-gray-500 text-sm mb-2">
                              Нет подходов
                            </p>
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => handleAddSet(exercise.id)}
                            >
                              Добавить первый подход
                            </Button>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-2">
                            <div className="grid grid-cols-12 mb-2 font-semibold text-sm">
                              <div className="col-span-2 text-center">№</div>
                              <div className="col-span-4 text-center">
                                Вес (кг)
                              </div>
                              <div className="col-span-3 text-center">
                                Повт.
                              </div>
                              <div className="col-span-3"></div>
                            </div>

                            {exercise.sets.map((set, setIndex) => (
                              <div
                                key={setIndex}
                                className="grid grid-cols-12 items-center py-1 border-b last:border-b-0"
                              >
                                <div className="col-span-2 text-center font-semibold">
                                  {setIndex + 1}
                                </div>
                                <div className="col-span-4 text-center">
                                  <InputNumber
                                    min={0}
                                    step={2.5}
                                    value={set.weight}
                                    onChange={(value) =>
                                      handleUpdateSet(
                                        exercise.id,
                                        setIndex,
                                        "weight",
                                        value
                                      )
                                    }
                                    className="w-full max-w-24"
                                    size="small"
                                  />
                                </div>
                                <div className="col-span-3 text-center">
                                  <InputNumber
                                    min={1}
                                    max={100}
                                    value={set.reps}
                                    onChange={(value) =>
                                      handleUpdateSet(
                                        exercise.id,
                                        setIndex,
                                        "reps",
                                        value
                                      )
                                    }
                                    className="w-full max-w-16"
                                    size="small"
                                  />
                                </div>
                                <div className="col-span-3 text-center">
                                  <Button
                                    type="text"
                                    danger
                                    size="small"
                                    icon={<Trash size={14} />}
                                    onClick={() =>
                                      handleRemoveSet(exercise.id, setIndex)
                                    }
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Divider>Добавить упражнения</Divider>

          <div className="mb-4">
            <Input
              placeholder="Поиск упражнения..."
              prefix={<Search size={16} className="text-gray-400" />}
              value={searchText}
              onChange={handleSearch}
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Spin />
            </div>
          ) : filteredExercises.length > 0 ? (
            <div className="overflow-auto max-h-80">
              <List
                dataSource={filteredExercises}
                renderItem={(exercise) => (
                  <List.Item
                    key={exercise.id}
                    className="hover:bg-gray-50 rounded"
                  >
                    <div className="flex items-center w-full">
                      <div className="w-12 h-12 mr-3 rounded overflow-hidden">
                        <img
                          src={
                            exercise.image ||
                            "https://via.placeholder.com/100?text=No+Image"
                          }
                          alt={exercise.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{exercise.name}</h3>
                        <p className="text-gray-500 text-sm">
                          {getExerciseTypeName(exercise.type)}
                          {exercise.bodyPart &&
                            ` · ${getBodyPartName(
                              exercise.bodyPart || exercise.targetMuscle
                            )}`}
                        </p>
                      </div>
                      <Button
                        type="primary"
                        size="small"
                        icon={<Plus size={16} />}
                        onClick={() => handleAddExercise(exercise)}
                      >
                        Добавить
                      </Button>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          ) : (
            <Empty description="Упражнения не найдены" />
          )}
        </>
      ),
    },
  ];

  return (
    <Modal
      title={
        isEditMode
          ? "Редактирование плана тренировок"
          : "Создание плана тренировок"
      }
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Отмена
        </Button>,
        <Button
          key="save"
          type="primary"
          icon={<Save size={16} />}
          onClick={handleSave}
        >
          {isEditMode ? "Сохранить изменения" : "Создать план"}
        </Button>,
      ]}
    >
      <Tabs
        items={items}
        defaultActiveKey="details"
        activeKey={activeTab}
        onChange={setActiveTab}
      />
    </Modal>
  );
}
