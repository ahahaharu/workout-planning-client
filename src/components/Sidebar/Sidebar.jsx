import React, { Children, createContext, useEffect, useState } from "react";
import { ChevronFirst, ChevronLast, MoreVertical, Target } from "lucide-react";
import Logo from "../../assets/logo.svg?react";

const SidebarContext = createContext();
export { SidebarContext };

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside className="h-full">
      <nav className="h-full flex flex-col bg-white border border-indigo-200 shadow-sm rounded-2xl">
        <div className="p-4 pb-2 flex justify-between items-center">
          <Logo
            width={130}
            height={50}
            className={`stroke-indigo-500 fill-indigo-500 ${
              expanded ? "" : "w-0"
            }`}
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t border-indigo-200 flex p-3">
          <img
            src="https://ui-avatars.com/api/?background=0D8ABC&color=fff"
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-gray-600">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}
