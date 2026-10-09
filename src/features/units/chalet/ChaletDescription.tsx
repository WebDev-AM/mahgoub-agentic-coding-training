import { Chalet } from "../../../types/ChaletSchema";
import { useTranslation } from "react-i18next";
import UnitSectionCard from "../UnitSectionCard";

type ChaletDescriptionProps = { chalet: Chalet };
function ChaletDescription({ chalet }: ChaletDescriptionProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  return (
    <UnitSectionCard title={"About The Place"}>
      <p>
        {isArabic
          ? chalet.localizedData.descriptionAr
          : chalet.localizedData.descriptionEn}
      </p>
    </UnitSectionCard>
  );
}

export default ChaletDescription;
