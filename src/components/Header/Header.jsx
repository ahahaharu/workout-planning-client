import React from "react";
import { Input, Space } from "antd";
import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="py-10 px-4 flex justify-between w-full items-center max-h-10 border border-indigo-200 rounded-2xl ">
      <div className="flex justify-between px-4 py-3 rounded-xl border-2 border-indigo-400 overflow-hidden w-full lg:w-auto">
        <input
          type="email"
          placeholder="Search Something..."
          className="outline-none bg-transparent text-gray-600 text-md mr-20"
          on
        />
        <Search />
      </div>
      <div className="hidden lg:inline">
        <h1 className="text-xl font-medium text-indigo-400 mr-10">
          Тренировка
        </h1>
      </div>
    </header>
  );
}
