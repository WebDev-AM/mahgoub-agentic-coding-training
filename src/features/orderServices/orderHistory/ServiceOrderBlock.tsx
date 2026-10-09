import { t } from "i18next";
import { ServiceOrderDetails } from "../../../types/OrderSchema";
import { statusMap } from "../../../utils/statusUtils";
import { OrderItemRow } from "./OrderItemRow";
import { useTranslation } from "react-i18next";

interface Props {
  serviceOrder: ServiceOrderDetails;
  serviceOrderStatus: boolean;
}

export function ServiceOrderBlock({ serviceOrder, serviceOrderStatus }: Props) {
  const { service, items } = serviceOrder;
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const status = statusMap[serviceOrder.status];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <img
          src={service.logoImage}
          alt="Store"
          className="h-14 w-14 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">
            {isArabic ? service.nameAr : service.nameEn}
          </span>
          <span className="text-sm leading-tight text-gray-500">
            {service.address}
          </span>
        </div>
        {serviceOrderStatus && (
          <span
            className={`ms-4 rounded-full px-2 py-1 text-sm text-white`}
            style={{ backgroundColor: status?.color }}
          >
            {t(status?.value)}
          </span>
        )}
      </div>

      {/* Items */}
      <div className="flex flex-wrap justify-between gap-10">
        {items.map((item) => (
          <OrderItemRow key={item.itemId} item={item} />
        ))}
      </div>
    </div>
  );
}
