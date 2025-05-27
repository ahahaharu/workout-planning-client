import React, { useState } from "react";
import { Dropdown, Button, Badge, Checkbox } from "antd";
import { ChevronDown } from "lucide-react";

export default function CategoryFilter({ categories, title, onSelect }) {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategorySelect = (category) => {
    let newSelected;

    if (!category) {
      newSelected = [];
    } else {
      const isSelected = selectedCategories.some(
        (item) => item.id === category.id
      );

      if (isSelected) {
        newSelected = selectedCategories.filter(
          (item) => item.id !== category.id
        );
      } else {
        newSelected = [...selectedCategories, category];
      }
    }

    setSelectedCategories(newSelected);
    if (onSelect) {
      onSelect(newSelected);
    }
  };

  const items =
    categories?.map((category) => ({
      key: category.id,
      label: (
        <div
          className="flex justify-between items-center py-1 px-2 hover:bg-indigo-50 rounded"
          onClick={(e) => {
            e.stopPropagation();
            handleCategorySelect(category);
          }}
        >
          <div className="flex items-center gap-4">
            <Checkbox
              checked={selectedCategories.some(
                (item) => item.id === category.id
              )}
              onChange={() => {}}
              className="mr-2"
            />
            <span>{category.name}</span>
          </div>
          <Badge
            count={category.count}
            className="ml-2"
            color="#818cf8"
            size="small"
          />
        </div>
      ),
    })) || [];

  items.unshift({
    key: "all",
    label: (
      <div
        className="flex justify-between items-center py-1 px-2 hover:bg-indigo-50 rounded"
        onClick={(e) => {
          e.stopPropagation();
          handleCategorySelect(null);
        }}
      >
        <span>Очистить фильтр</span>
      </div>
    ),
  });

  const getDisplayText = () => {
    if (selectedCategories.length === 0) {
      return "Все";
    } else if (selectedCategories.length === 1) {
      return selectedCategories[0].name;
    } else {
      return `Выбрано: ${selectedCategories.length}`;
    }
  };

  return (
    <div className="w-1/2">
      <Dropdown menu={{ items }} trigger={["click"]} placement="bottomLeft">
        <Button
          className={`w-full flex items-center justify-between ${
            selectedCategories.length > 0
              ? "border-indigo-400 text-indigo-600"
              : "border-gray-200"
          }`}
        >
          <span className="truncate">
            {title}: {getDisplayText()}
          </span>
          <ChevronDown size={16} />
        </Button>
      </Dropdown>
    </div>
  );
}
