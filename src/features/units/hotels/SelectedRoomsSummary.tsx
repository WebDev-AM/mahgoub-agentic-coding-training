import { Button } from "@mui/material";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useHotelCartContext } from "../../../contexts/HotelCartContext";

function SelectedRoomsSummary() {
  const { cartItem } = useHotelCartContext();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const selectedRooms = cartItem?.selectedRooms ?? [];
  const totalRooms =
    selectedRooms.reduce((acc: number, item) => acc + item.count, 0) || 0;

  const summaryText =
    selectedRooms
      .map(({ unitType, count }) => {
        const roomName =
          i18n.language === "ar"
            ? unitType.localizedData.nameAr
            : unitType.localizedData.nameEn;

        return `${count} ${roomName}`;
      })
      .join(" • ") || "";

  return (
    <div className="bg-primary-light fixed bottom-0 z-99 w-full p-5">
      <div className="container-fix container flex flex-col items-center justify-between gap-2 md:flex-row">
        {/* Left Content */}
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">
            {t("{{count}} rooms are selected", { count: totalRooms })}
          </span>

          {summaryText && (
            <span className="text-sm text-gray-500">{summaryText}</span>
          )}
        </div>

        {/* Right Button */}
        <Button
          variant="contained"
          className="brand-button normal-case!"
          disabled={!totalRooms}
          onClick={() => navigate("/booking/hotel/0")}
        >
          {t("Reserve Now")}
        </Button>
      </div>
    </div>
  );
}

export default SelectedRoomsSummary;
