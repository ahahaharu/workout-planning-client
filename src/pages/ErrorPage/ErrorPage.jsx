import React from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import { Ban } from "lucide-react";

export default function ErrorPage() {
  return (
    <PageLayout>
      <div className="h-full flex justify-center items-center gap-5 flex-col">
        <Ban size={200} className="stroke-indigo-500" />
        <h1 className="text-indigo-500 text-5xl font-extrabold">
          Страницы не существует
        </h1>
      </div>
    </PageLayout>
  );
}
