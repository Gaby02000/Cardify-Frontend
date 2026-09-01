// src/components/Category/PopularCategories.tsx
import { Link } from "react-router-dom";
import { Gamepad2, Clapperboard, ShoppingBag, Cpu, Music, Gift } from "lucide-react";
import type { ComponentType } from "react";
import { useCategories } from "../../hooks/useCategories";
import "./PopularCategories.css";

const ICONS: Array<[RegExp, ComponentType<{ size?: number }>]> = [
  [/gam|juego|play|xbox|steam|nintendo/i, Gamepad2],
  [/film|serie|entreten|netflix|disney|cine|movie/i, Clapperboard],
  [/moda|fashion|ropa|shop|tienda/i, ShoppingBag],
  [/tech|tecno|electro|apple|google|micro/i, Cpu],
  [/music|spotify|audio/i, Music],
];

const iconFor = (name: string) =>
  ICONS.find(([re]) => re.test(name))?.[1] ?? Gift;

const PopularCategories = () => {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <div className="cats">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton cat--skeleton" />
        ))}
      </div>
    );
  }

  return (
    <div className="cats">
      {categories.slice(0, 8).map((cat) => {
        const Icon = iconFor(cat.name);
        return (
          <Link key={cat.id} to={`/categoria/${cat.id}`} className="cat">
            <span className="cat__icon">
              <Icon size={22} />
            </span>
            <span className="cat__name">{cat.name}</span>
            <span className="cat__desc">Ver denominaciones</span>
          </Link>
        );
      })}
    </div>
  );
};

export default PopularCategories;
