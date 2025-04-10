import React from "react";
import { Ban, MoveLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center">
        <Ban size={200} className="stroke-indigo-500" />
        <h1 className="text-indigo-500 text-5xl font-extrabold mt-8">
          Страницы не существует
        </h1>
        <p className="text-gray-500 text-lg mt-6">
          Вероятно, вы ввели неправильный адрес или страница была удалена.
        </p>
        <Link
          className="mt-10 text-gray-500 flex gap-4 font-bold underline underline-offset-10 hover:text-indigo-500 transition-colors"
          to={"/workouts"}
        >
          <MoveLeft />
          Вернуться на главную страницу
        </Link>
      </div>
    </div>
  );
}
