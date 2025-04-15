import React from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import { Button, Divider, Input } from "antd";

export default function ProfilePage() {
  return (
    <PageLayout title="Профиль">
      <div className="flex flex-col w-full items-center mt-10 gap-5">
        <div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 rounded-md overflow-hidden">
              <img
                src="https://ui-avatars.com/api/?background=0D8ABC&color=fff&size=128"
                className="w-full h-full object-cover"
                alt="User profile"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-gray-400 text-md">Id: 1</p>
              <h1 className="text-6xl font-bold mb-4">John Doe</h1>
              <p className="text-gray-600">johndoe@gmail.com</p>
            </div>
          </div>
          <h1 className="mt-5 text-xl">Текущий вес: 70 кг</h1>
        </div>
        <Button type="primary" size="large">
          Редактировать профиль
        </Button>
      </div>
      <Divider />
    </PageLayout>
  );
}
