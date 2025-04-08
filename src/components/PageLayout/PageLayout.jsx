import React from "react";

export default function PageLayout({ title, children }) {
  return (
    <div className="h-full p-6 bg-white border border-indigo-200 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold text-indigo-500 mb-4">{title}</h1>
      <div>{children}</div>
    </div>
  );
}
