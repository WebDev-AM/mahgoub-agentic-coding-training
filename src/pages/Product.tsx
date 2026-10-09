import { useParams } from "react-router-dom";
import { useGroupedProducts } from "../features/orderServices/useGroupedProducts";
import BackArrow from "../ui/BackArrow";
import { ProductGrouped } from "../types/ServiceSchema";
import PageSpinner from "../ui/PageSpinner";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import ProductCard from "../features/orderServices/ProductCard";
import { motion } from "framer-motion";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useAddItemsToCart } from "../features/orderServices/cart/useAddItemsToCart";
import { useUpdateCartItem } from "../features/orderServices/cart/useUpdateCartItem";
import { useCart } from "../features/orderServices/cart/useCart";
import QuantityController from "../features/orderServices/cart/QuantityController";
import { useDeleteCartItem } from "../features/orderServices/cart/useDeleteCartItem";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.12, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function Product() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { categoryKey, productId } = useParams();
  const { products, isLoading } = useGroupedProducts();
  const { addItemsToCart, isAdding } = useAddItemsToCart();
  const { updateCartItem, isUpdating } = useUpdateCartItem();
  const { deleteCartItem, isDeleting } = useDeleteCartItem();

  const { cart } = useCart();
  const cartItem = cart ? cart[productId!] : null;

  const matchingKey = Object.keys(products ?? {}).find(
    (k) => k === categoryKey || k.startsWith(`${categoryKey}$$`)
  );

  const categoryProducts = matchingKey
    ? (products as Record<string, ProductGrouped[]>)[matchingKey]
    : undefined;

  const product = categoryProducts?.find(
    (p: ProductGrouped) => String(p.productId) === String(productId)
  );
  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <PageSpinner />
      </div>
    );
  }

  return (
    <div className="container-fix relative container flex flex-col gap-10">
      <BackArrow label={isArabic ? product?.nameAr : product?.nameEn} />

      <motion.div
        className="flex flex-col justify-between gap-10 overflow-hidden lg:h-120 lg:flex-row"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        layout
        key={productId + "div"}
      >
        <motion.img
          key={productId + "img"}
          src={product?.logoImage}
          alt={isArabic ? product?.nameAr : product?.nameEn}
          className="h-full w-full flex-1 rounded-lg object-contain"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          layout
        />
        <motion.div
          className="flex h-full flex-1 flex-col justify-center gap-4 px-4 py-2"
          variants={itemVariants}
          layout
          key={productId + "info"}
        >
          <motion.h2
            className="text-4xl font-bold"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            layout
          >
            {isArabic ? product?.nameAr : product?.nameEn}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.35 }}
          >
            {isArabic ? product?.descriptionAr : product?.descriptionEn}
          </motion.p>
          <motion.h3
            className="text-primary text-2xl font-bold"
            whileHover={{ scale: 1.04 }}
            layout
          >
            {`${product?.price.toFixed(3)} ${i18n.t("KWD")}`}
          </motion.h3>

          {!cartItem ? (
            <motion.button
              className="bg-primary hover:bg-primary-shade flex w-fit cursor-pointer items-center gap-2 rounded-xl p-3 text-lg font-semibold text-white transition hover:shadow-2xl disabled:cursor-not-allowed disabled:text-gray-500"
              onClick={() =>
                addItemsToCart([{ productId: productId || "", quantity: 1 }])
              }
              disabled={isAdding}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              layout
            >
              <MdOutlineShoppingCart className="inline-block" />
              {t("Add to cart")}
            </motion.button>
          ) : (
            <QuantityController
              value={cartItem.quantity}
              onRemove={() => deleteCartItem(cartItem.itemId)}
              onIncrease={() =>
                updateCartItem({
                  itemId: cartItem.itemId,
                  quantity: cartItem.quantity + 1,
                })
              }
              onDecrease={() =>
                updateCartItem({
                  itemId: cartItem.itemId,
                  quantity: cartItem.quantity - 1,
                })
              }
              disabled={isUpdating || isDeleting}
            />
          )}
        </motion.div>
      </motion.div>
      {categoryProducts?.length && categoryProducts.length > 1 && (
        <div>
          <p className="text-3xl font-medium">{t("Other Plates")}</p>
          {/* Other plates from the same category can be listed here */}
          <div className="flex gap-4 overflow-x-auto overflow-y-hidden py-4">
            {categoryProducts.map((p: ProductGrouped) =>
              p.productId === productId ? null : (
                <ProductCard
                  key={p.productId}
                  product={p}
                  categoryKey={matchingKey || ""}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Product;
