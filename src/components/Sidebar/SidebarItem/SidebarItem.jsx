import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarContext } from "../Sidebar";

export default function SidebarItem({ icon, text, active, to }) {
  const { expanded } = useContext(SidebarContext);
  const location = useLocation();

  // Проверяем, активен ли текущий путь
  const isActive = location.pathname === to;
  return (
    <Link to={to} className="flex items-center w-full">
      <li
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors
        ${
          isActive
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
      </li>
    </Link>
  );
}
