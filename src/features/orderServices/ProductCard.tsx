import { motion } from "framer-motion";
import { ProductGrouped } from "../../types/ServiceSchema";
import { useTranslation } from "react-i18next";
import { FaShoppingCart } from "react-icons/fa";
import { t } from "i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAddItemsToCart } from "./cart/useAddItemsToCart";
import { useCart } from "./cart/useCart";
import QuantityController from "./cart/QuantityController";
import { useUpdateCartItem } from "./cart/useUpdateCartItem";
import { useDeleteCartItem } from "./cart/useDeleteCartItem";

type ProductCardProps = {
  product: ProductGrouped | ProductGrouped;
  categoryKey: string;
};

function ProductCard({ product, categoryKey }: ProductCardProps) {
  const { i18n } = useTranslation();
  const { serviceTypeId, serviceId } = useParams();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const { cart } = useCart();
  const cartItem = cart ? cart[product.productId] : null;

  const { addItemsToCart, isAdding } = useAddItemsToCart();
  const { updateCartItem, isUpdating } = useUpdateCartItem();
  const { deleteCartItem, isDeleting } = useDeleteCartItem();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={() =>
        navigate(
          `/services/${serviceTypeId}/${serviceId}/products/${categoryKey}/${product.productId}`
        )
      }
      className="group flex w-75 min-w-75 cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
    >
      {/* Image Section */}
      <div className="relative h-75 overflow-hidden">
        <img
          src={product.logoImage}
          alt={isArabic ? product.nameAr : product.nameEn}
          className="h-full w-full object-contain transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-2 p-4">
        <div>
          <h3 className="text-base font-medium text-gray-800">
            {isArabic ? product.nameAr : product.nameEn}
          </h3>
          <p className="line-clamp-1 text-sm text-gray-500">
            {isArabic ? product.descriptionAr : product.descriptionEn}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-primary text-lg font-semibold">
            {`${product.price.toFixed(3)} ${t("KWD")}`}
          </p>
          {!cartItem ? (
            <button
              type="button"
              disabled={isAdding}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                addItemsToCart([{ productId: product.productId, quantity: 1 }]);
              }}
            >
              <FaShoppingCart className="h-5 w-5" />
            </button>
          ) : (
            <QuantityController
              value={cartItem.quantity}
              onIncrease={() =>
                updateCartItem({
                  itemId: cartItem.itemId,
                  quantity: cartItem.quantity + 1,
                })
              }
              onRemove={() => deleteCartItem(cartItem.itemId)}
              onDecrease={() =>
                updateCartItem({
                  itemId: cartItem.itemId,
                  quantity: cartItem.quantity - 1,
                })
              }
              disabled={isUpdating || isDeleting}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
