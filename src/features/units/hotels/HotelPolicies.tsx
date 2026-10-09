import { t } from "i18next";
import { HotelTimeDetails } from "../../../types/HotelSchema";
import EmojiIcon from "../../../ui/EmojiIcon";
import UnitSectionCard from "../UnitSectionCard";
import dayjs from "dayjs";
import i18n from "../../../i18n";

function HotelPolicies({ timeDetails }: { timeDetails: HotelTimeDetails }) {
  return (
    <UnitSectionCard title={"Hotel Policies"}>
      <div className="flex items-center gap-4">
        <div className="flex flex-1 flex-col items-start rounded-2xl border border-sky-100 bg-slate-50 p-4">
          <EmojiIcon emoji={"🔑"} className="text-2xl" />

          <span className="text-gray-dark-text font-medium">
            {t("Check-in")}
          </span>
          <span className="font-semibold">
            {dayjs(timeDetails.entryTime, "hh:mm A")
              .locale(i18n.language)
              .format("hh:mm A")}
          </span>
          <span className="text-gray-dark-text text-xs">
            {t("Early Check-in on request")}
          </span>
        </div>
        <div className="flex flex-1 flex-col items-start rounded-2xl border border-sky-100 bg-slate-50 p-4">
          <EmojiIcon emoji={"🚪"} className="text-2xl" />

          <span className="text-gray-dark-text font-medium">
            {t("Check-out")}
          </span>
          <span className="font-semibold">
            {dayjs(timeDetails.exitTime, "hh:mm A")
              .locale(i18n.language)
              .format("hh:mm A")}
          </span>
          <span className="text-gray-dark-text text-xs">
            {t("Late Check-out on request")}
          </span>
        </div>
      </div>
    </UnitSectionCard>
  );
}

export default HotelPolicies;
