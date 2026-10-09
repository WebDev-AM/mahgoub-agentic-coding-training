import { ServiceOrderDetails } from "../../types/OrderSchema";
import { FaMapPin } from "react-icons/fa";
import { t } from "i18next";
import { statusMap } from "../../utils/statusUtils";
import { useTranslation } from "react-i18next";

export default function ServiceOrderMessage({
  serviceOrder,
}: {
  serviceOrder: ServiceOrderDetails;
}) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const status = statusMap[serviceOrder.status];

  return (
    <div className="border-border border-b pb-4 last:border-b-0">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-muted flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
            {serviceOrder.service?.logoImage ? (
              <img
                src={serviceOrder.service.logoImage}
                alt={serviceOrder.service.nameEn}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground text-sm font-semibold">
                {isArabic
                  ? serviceOrder.service?.nameAr?.charAt(0)
                  : serviceOrder.service?.nameEn?.charAt(0) || "S"}
              </span>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold">
              {isArabic
                ? serviceOrder.service?.nameAr
                : serviceOrder.service?.nameEn || "Service"}
            </p>
            {serviceOrder.deliveryAddress && (
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <FaMapPin className="h-3 w-3" />
                <span className="max-w-[150px] truncate">
                  {serviceOrder.deliveryAddress}
                </span>
              </div>
            )}
          </div>
        </div>

        <span
          className={`rounded-full px-2 py-1 text-sm text-white`}
          style={{ backgroundColor: status?.color }}
        >
          {t(status?.value)}
        </span>
      </div>

      <div className="space-y-3">
        {serviceOrder.items.map((item) => (
          <div className="flex items-center gap-3" key={item.itemId}>
            <img
              src={item.product.logoImage}
              alt="Food"
              className="h-14 w-14 rounded-lg object-cover"
            />

            <div className="flex-1">
              <p className="text-[12px] leading-tight font-medium text-gray-900">
                {isArabic ? item.product.nameAr : item.product.nameEn}
              </p>
              <p className="text-[10px] leading-tight text-gray-500">
                {isArabic
                  ? item.product.descriptionAr
                  : item.product.descriptionEn}
              </p>
            </div>
            <div className="text-end">
              <span className="flex h-6 w-20 items-center justify-center rounded bg-gray-200 text-xs font-medium">
                {item.quantity} {t("item")}
              </span>
              <span className="text-primary text-sm font-medium">
                {item.price * item.quantity} {t("KWD")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
