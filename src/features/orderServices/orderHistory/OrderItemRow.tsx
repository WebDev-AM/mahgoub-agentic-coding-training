import { OrderItem } from "../../../types/OrderSchema";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

interface Props {
  item: OrderItem;
}

export function OrderItemRow({ item }: Props) {
  const { product, quantity, price } = item;
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div className="xs:min-w-130 flex w-full flex-1 flex-col justify-between gap-5 md:flex-row md:gap-20">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <img
          src={product.logoImage}
          alt="Food"
          className="h-26 w-26 rounded-lg object-cover"
        />

        <div>
          <p className="leading-tight font-medium text-gray-900">
            {isArabic ? product.nameAr : product.nameEn}
          </p>
          <p className="text-sm leading-tight text-gray-500">
            {isArabic ? product.descriptionAr : product.descriptionEn}
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex min-w-25 flex-row items-end justify-between md:flex-col">
        <span className="flex h-8 w-30 items-center justify-center rounded bg-gray-200">
          {quantity} {t("item")}
        </span>
        <span className="text-primary font-semibold">
          {price * quantity} {t("KWD")}
        </span>
      </div>
    </div>
  );
}
