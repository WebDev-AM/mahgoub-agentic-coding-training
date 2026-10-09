import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

type ProductsFilterBarProps = {
  categories: string[];
  onFilterChange: (selectedCategory: string | null) => void;
};

function ProductsFilterBar({
  categories,
  onFilterChange,
}: ProductsFilterBarProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategorySelect = (category: string | null) => {
    setActiveCategory(category);
    onFilterChange(category);
  };

  // const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
  //   onSearchChange(e.target.value);
  // };

  return (
    <div className="bg-black px-4 py-3">
      {/* Scrollable Wrapper */}
      <div className="no-scrollbar overflow-x-auto">
        {/* Inner Flex Container */}
        <div className="flex min-w-max items-center justify-center gap-4 px-2">
          {/* All Button */}
          <button
            onClick={() => handleCategorySelect(null)}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              activeCategory === null
                ? "bg-white text-black"
                : "bg-transparent text-white hover:bg-gray-500 hover:text-white"
            }`}
          >
            {t("All")}
          </button>

          {/* Category Buttons */}
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => handleCategorySelect(category)}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                activeCategory === category
                  ? "bg-white text-black"
                  : "bg-transparent text-white hover:bg-gray-400 hover:text-black"
              }`}
            >
              {category.split("$$")[isArabic ? 1 : 0]}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductsFilterBar;
