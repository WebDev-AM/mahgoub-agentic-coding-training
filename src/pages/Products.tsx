import { useState } from "react";
import ProductsHeader from "../features/orderServices/ProductsHeader";
import ProductsWrapper from "../features/orderServices/ProductsWrapper";
import ProductsFilterBar from "../features/orderServices/ProductsFilterBar";
import { useGroupedProducts } from "../features/orderServices/useGroupedProducts";

function Products() {
  const { products, isLoading } = useGroupedProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = Object.keys(products);

  // Filter products by category and search term
  const filteredProducts = Object.entries(products).reduce(
    (acc, [category, items]) => {
      // Apply category filter
      if (selectedCategory && category !== selectedCategory) return acc;

      // Apply search filter
      const filtered = items.filter((p) => {
        const search = searchTerm.toLowerCase();
        return (
          p.nameEn.toLowerCase().includes(search) ||
          p.nameAr.toLowerCase().includes(search) ||
          p.descriptionEn.toLowerCase().includes(search) ||
          p.descriptionAr.toLowerCase().includes(search)
        );
      });

      if (filtered.length > 0)
        (acc as Record<string, typeof items>)[category] = filtered;
      return acc;
    },
    {} as typeof products
  );

  return (
    <div className="relative flex flex-col">
      <ProductsHeader onSearchChange={setSearchTerm} />
      <ProductsFilterBar
        categories={categories}
        onFilterChange={setSelectedCategory}
      />
      <ProductsWrapper isLoading={isLoading} products={filteredProducts} />
    </div>
  );
}

export default Products;
