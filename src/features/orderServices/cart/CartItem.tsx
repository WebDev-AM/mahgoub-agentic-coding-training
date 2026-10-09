import { useTranslation } from "react-i18next";
import { UnifiedCartItem } from "../../../types/OrderSchema";
import { MdDeleteForever } from "react-icons/md";
import { t } from "i18next";
import { useUpdateCartItem } from "./useUpdateCartItem";
import { useDeleteCartItem } from "./useDeleteCartItem";
import QuantityController from "./QuantityController";

type CartItemProps = {
  cartItem: UnifiedCartItem;
};

function CartItem({ cartItem }: CartItemProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { updateCartItem, isUpdating } = useUpdateCartItem();
  const { deleteCartItem, isDeleting } = useDeleteCartItem();

  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
      {/* Store Header */}
      <div className="flex items-center gap-3">
        <img
          src={cartItem.product.service.logoImage}
          alt="Store"
          className="h-14 w-14 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">
            {isArabic
              ? cartItem.product.service.nameAr
              : cartItem.product.service.nameEn}
          </span>
          <span className="text-sm leading-tight text-gray-500">
            {cartItem.product.service.address}
          </span>
        </div>
      </div>

      {/* Item Row */}
      <div className="xs:flex-row xs:gap-20 flex flex-col justify-between gap-5">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <img
            src={cartItem.product.logoImage}
            alt="Food"
            className="h-26 w-26 rounded-lg object-cover"
          />

          <div>
            <p className="leading-tight font-medium text-gray-900">
              {isArabic ? cartItem.product.nameAr : cartItem.product.nameEn}
            </p>
            <p className="text-sm leading-tight text-gray-500">
              {isArabic
                ? cartItem.product.descriptionAr
                : cartItem.product.descriptionEn}
            </p>

            {/* Quantity Controller */}
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
          </div>
        </div>

        {/* Right Section */}
        <div className="xs:flex-col flex min-w-25 flex-row items-end justify-between">
          <button
            className="cursor-pointer text-3xl text-red-500 hover:text-red-600 disabled:text-gray-400"
            onClick={() => deleteCartItem(cartItem.itemId)}
            disabled={isDeleting}
          >
            <MdDeleteForever />
          </button>

          <span className="text-primary font-semibold">
            {cartItem.product.price * cartItem.quantity} {t("KWD")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
