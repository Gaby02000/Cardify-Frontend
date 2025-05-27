import React from "react";
import type{ Category } from "./types";

interface Props {
  categories: Category[];
  selected: string;
  onSelect: (category: string) => void;
}

const CategorySelector: React.FC<Props> = ({ categories, selected, onSelect }) => (
  <select value={selected} onChange={(e) => onSelect(e.target.value)}>
    <option value="">Todas las categorías</option>
    {categories.map((cat) => (
      <option key={cat.id} value={cat.name}>
        {cat.name}
      </option>
    ))}
  </select>
);

export default CategorySelector;
