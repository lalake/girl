import React from 'react';
import { CategoryType, CATEGORIES } from '../utils/api';

interface CategorySelectorProps {
  currentCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ currentCategory, onCategoryChange }) => {
  const categories = Object.entries(CATEGORIES) as [CategoryType, string][];

  return (
    <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-70 py-2 px-4 flex overflow-x-auto">
      {categories.map(([key, value]) => (
        <button
          key={key}
          onClick={() => onCategoryChange(key)}
          className={`px-3 py-1 mx-1 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${currentCategory === key ? 'bg-white text-black font-bold' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
        >
          {value}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;