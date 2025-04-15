import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarContext } from "../../../context/SidebarContext";
import { useTheme } from "../../../context/ThemeContext";

export default function SidebarItem({ icon, text, active, to }) {
  const { expanded } = useContext(SidebarContext);
  const { isDarkMode } = useTheme();
  const location = useLocation();

  const isActive = location.pathname === to;
  return (
    <Link to={to} className="flex items-center w-full">
      <li
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors
        ${
          isActive
            ? `bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800 ${
                isDarkMode
                  ? "bg-gradient-to-tr from-indigo-500 to-indigo-400 text-white "
                  : ""
              }`
            : `${
                isDarkMode
                  ? "hover:bg-gray-700 text-white"
                  : "hover:bg-indigo-50 text-gray-600"
              }`
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
