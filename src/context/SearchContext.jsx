import React, { createContext, useContext, useState } from "react";
import { useLocation } from "react-router-dom";

const SearchContext = createContext();

export const useSearch = () => {
  return useContext(SearchContext);
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  React.useEffect(() => {
    setSearchQuery("");
  }, [location.pathname]);

  const value = {
    searchQuery,
    setSearchQuery,
    clearSearch: () => setSearchQuery(""),
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
