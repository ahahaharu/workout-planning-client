import React from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import { Button, Divider } from "antd";

import WorkoutPlanCard from "../../components/WorkoutPlanCard/WorkoutPlanCard";

export default function WorkoutPlansPage() {
  return (
    <PageLayout title="Программы">
      <div className="w-full flex justify-center mb-5 gap-4">
        <Button size="large" className="w-1/2">
          Начать пустую тренировку
        </Button>
        <Button type="primary" size="large" className="w-1/2">
          Добавить новую программу тренировок
        </Button>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <WorkoutPlanCard
          workoutPlan={{
            name: "План тренировки 1",
            description: "Описание программы",
            exercises: [
              { name: "Приседания" },
              { name: "Жим лежа" },
              { name: "Тяга штанги" },
              { name: "Становая тяга" },
              { name: "Подтягивания" },
            ],
          }}
        />
        <WorkoutPlanCard
          workoutPlan={{
            name: "План тренировки 2",
            description: "Описание программы",
            exercises: [],
          }}
        />
      </div>
    </PageLayout>
  );
}
