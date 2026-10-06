import React from 'react';
import { Dumbbell, Zap, Flame, HeartPulse, Sparkles } from 'lucide-react';
import { ProductCategory } from '../types/product';

interface CategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: ProductCategory | 'All') => void;
  categoryCounts: Record<string, number>;
}

export const Categories: React.FC<CategoriesProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const categoryList: {
    id: ProductCategory;
    name: string;
    description: string;
    icon: React.ElementType;
    color: string;
  }[] = [
    {
      id: 'Protein',
      name: 'Protein Powders',
      description: 'Isolate, Concentrates & Performance Blends',
      icon: Dumbbell,
      color: 'from-orange-500/20 to-amber-500/20 text-orange-600',
    },
    {
      id: 'Mass Gainer',
      name: 'Mass Gainers',
      description: 'High Calorie Anabolic Muscle Bulking Formulas',
      icon: Sparkles,
      color: 'from-amber-500/20 to-yellow-500/20 text-amber-600',
    },
    {
      id: 'Creatine',
      name: 'Creatine',
      description: 'Micronized Monohydrate & Pure HCl for Power',
      icon: Zap,
      color: 'from-sky-500/20 to-blue-500/20 text-blue-600',
    },
    {
      id: 'Pre Workout',
      name: 'Pre Workout',
      description: 'Intense Energy, Endurance & Vascular Pumps',
      icon: Flame,
      color: 'from-rose-500/20 to-red-500/20 text-rose-600',
    },
    {
      id: 'Vitamins & Supplements',
      name: 'Vitamins & Health',
      description: 'L-Arginine, Anabolic Capsules & Wellness',
      icon: HeartPulse,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-600',
    },
  ];

  const handleCategoryClick = (cat: ProductCategory) => {
    onSelectCategory(cat);
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Browse By Need
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1">
            Featured Categories
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-0">
          Click any category to filter genuine stock
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {categoryList.map((cat) => {
          const Icon = cat.icon;
          const count = categoryCounts[cat.id] || 0;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              className={`glass-card p-4 sm:p-5 text-left flex flex-col justify-between cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? 'ring-2 ring-orange-500 bg-white/75 shadow-lg shadow-orange-500/10' 
                  : 'hover:bg-white/60'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-inner`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-500 bg-white/60 px-2 py-0.5 rounded-full border border-white/80">
                  {count} items
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-orange-600">
                  {cat.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-semibold">
                <span className={isSelected ? 'text-orange-600' : 'text-slate-500'}>
                  {isSelected ? 'Currently Viewing' : 'Explore Stock'}
                </span>
                <span className="text-slate-400">→</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
