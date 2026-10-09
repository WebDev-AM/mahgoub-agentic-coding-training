import { Link } from "react-router-dom";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { CgChevronLeft, CgChevronRight } from "react-icons/cg";
import { Unit } from "../../types/ChaletSchema";

function UnitName({ unit }: { unit: Unit }) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  return (
    <div className="items-start justify-center space-y-5 lg:grid lg:grid-cols-[1fr_auto_1fr]">
      <div className="flex items-center justify-self-start">
        <Link to="/home" className="text-brand-blue underline">
          {t("Home")}
        </Link>
        <span className="mx-2">
          {isArabic ? <CgChevronLeft /> : <CgChevronRight />}
        </span>

        <span>
          {isArabic ? unit.localizedData.nameAr : unit.localizedData.nameEn}
        </span>
      </div>
      <div className="justify-self-center text-center">
        <h1 className="h2 text-brand-text">
          {isArabic ? unit.localizedData.nameAr : unit.localizedData.nameEn}
        </h1>
        <p className="text-primary">
          {isArabic
            ? unit.localizedData.addressAr
            : unit.localizedData.addressEn}
        </p>
      </div>
    </div>
  );
}

export default UnitName;
