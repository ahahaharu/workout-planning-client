import React from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import { Button, Divider } from "antd";

export default function StatisticsPage() {
  return (
    <PageLayout title={"Статистика"}>
      <Divider>
        <p className="text-xl">Вес</p>
      </Divider>
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Текущий вес: 70 кг</h1>
          <Button type="primary" size="large">
            Обновить вес
          </Button>
        </div>
        <div className="p-4 rounded-2xl border border-indigo-300 shadow-md mt-5"></div>
      </div>
    </PageLayout>
  );
}
