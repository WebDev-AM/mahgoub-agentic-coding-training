import { FaMapPin, FaClock } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import "dayjs/locale/en";
import { Chalet } from "../../types/ChaletSchema";

interface ReservationChaletMessageProps {
  chalet: Chalet;
}

export default function ReservationChaletMessage({
  chalet,
}: ReservationChaletMessageProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const name = isArabic
    ? chalet.localizedData.nameAr
    : chalet.localizedData.nameEn;
  const address = isArabic
    ? chalet.localizedData.addressAr
    : chalet.localizedData.addressEn;
  const locale = isArabic ? "ar" : "en";

  const formatTime = (value?: string) => {
    if (!value) return "";
    return dayjs(value, "hh:mm A").locale(locale).format("hh:mm A");
  };

  // Use first image from media as logo
  const logoImage = chalet.media?.find((m) => m.type === "image")?.url;

  return (
    <div className="border-border border-b pb-4 last:border-b-0">
      <div className="flex gap-3">
        <div className="bg-muted flex h-18 flex-1 items-center justify-center overflow-hidden rounded">
          {logoImage ? (
            <img
              src={logoImage}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-muted-foreground text-sm font-semibold">
              {name?.charAt(0) || "C"}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-semibold">{name}</p>
          {address && (
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <FaMapPin className="h-3 w-3" />
              <span className="max-w-[150px] truncate">{address}</span>
            </div>
          )}
          {/* Entry/Exit times */}
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <FaClock className="h-3 w-3" />
              <span>
                {t("Entry")}: {formatTime(chalet.timeDetails.entryTime)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FaClock className="h-3 w-3" />
              <span>
                {t("Exit")}: {formatTime(chalet.timeDetails.exitTime)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
