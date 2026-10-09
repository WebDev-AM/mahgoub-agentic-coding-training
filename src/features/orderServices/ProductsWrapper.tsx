import { t } from "i18next";
import { ProductCategoryMap } from "../../types/ServiceSchema";
import PageSpinner from "../../ui/PageSpinner";
import Paragraph from "../../ui/Paragraph";
import ProductCard from "./ProductCard";
import { useTranslation } from "react-i18next";

type ProductsWrapperProps = {
  isLoading: boolean;
  products: ProductCategoryMap;
};

function ProductsWrapper({ isLoading, products }: ProductsWrapperProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <PageSpinner />
      </div>
    );
  }

  const categoryEntries = Object.entries(products || {});
  const hasProducts = categoryEntries.some(([, list]) => list.length > 0);

  if (!hasProducts) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Paragraph className="text-black/70">
          {t("There is no services with these filters")}
        </Paragraph>
      </div>
    );
  }

  return (
    <div className="container-fix container flex flex-col gap-12 py-6">
      {categoryEntries.map(([categoryKey, productList]) => {
        const [en, ar] = categoryKey.split("$$");
        return (
          <section key={categoryKey} className="flex flex-col gap-6">
            {/* Category Title */}
            <h2 className="text-2xl font-bold text-black">
              {isArabic ? ar : en}
            </h2>

            {/* Products Grid */}
            <div className="flex flex-wrap justify-center gap-8">
              {productList.map((product) => (
                <ProductCard
                  key={product.productId}
                  categoryKey={categoryKey.split("$$")[0]}
                  product={product}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default ProductsWrapper;
