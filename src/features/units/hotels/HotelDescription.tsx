import { Hotel } from "../../../types/HotelSchema";
import { useTranslation } from "react-i18next";
import UnitSectionCard from "../UnitSectionCard";

type HotelDescriptionProps = { hotel: Hotel };
function HotelDescription({ hotel }: HotelDescriptionProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  return (
    <UnitSectionCard title={"About The Place"}>
      <p>
        {isArabic
          ? hotel.localizedData.descriptionAr
          : hotel.localizedData.descriptionEn}
      </p>
    </UnitSectionCard>
  );
}

export default HotelDescription;
