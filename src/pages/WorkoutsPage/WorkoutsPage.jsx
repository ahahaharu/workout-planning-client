import React, { useState } from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import { Button, Divider } from "antd";
import { Clock, Weight } from "lucide-react";
import WorkoutCard from "../../components/WorkoutCard/WorkoutCard";
import WorkoutAdditionModal from "../../components/WorkoutAdditionModal/WorkoutAdditionModal";

export default function WorkoutsPage() {
  const [WorkoutAdditionModalOpen, setWorkoutAdditionModalOpen] =
    useState(false);
  return (
    <PageLayout title="Тренировка">
      <Button
        type="primary"
        size="large"
        className="w-full"
        onClick={() => setWorkoutAdditionModalOpen(true)}
      >
        Начать новую тренировку
      </Button>
      <Divider>
        <p className="text-3xl">История тренировок</p>
      </Divider>
      <div>
        {/* <h1 className="text-3xl text-center">История тренировок</h1> */}
        <div className="flex flex-col gap-5 mt-5">
          <WorkoutCard
            workout={{ name: "Фуллбади день 1", totalWeight: 10000 }}
          />
          <WorkoutCard workout={{ name: "Тренировка 2", totalWeight: 11000 }} />
          <WorkoutCard workout={{ name: "Тренировка", totalWeight: 6150 }} />
        </div>
      </div>
      <WorkoutAdditionModal
        isOpen={WorkoutAdditionModalOpen}
        onClose={() => setWorkoutAdditionModalOpen(false)}
      />
    </PageLayout>
  );
}
