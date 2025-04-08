import React from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import { Ban, MoveLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <PageLayout>
      <div className="h-full flex justify-center items-center gap-5 flex-col">
        <Ban size={200} className="stroke-indigo-500" />
        <h1 className="text-indigo-500 text-5xl font-extrabold text-center">
          Страницы не существует
        </h1>
        <p className="text-gray-500 text-lg mt-4 text-center">
          Вероятно, вы ввели неправильный адрес или страница была удалена.
        </p>
        <Link
          className="text-gray-500 flex gap-4 font-bold underline underline-offset-10"
          to={"/"}
        >
          <MoveLeft />
          Вернуться на страницу тренировок
        </Link>
      </div>
    </PageLayout>
  );
}
