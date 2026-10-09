// HomeUnits.tsx
import { useTranslation } from "react-i18next";
import HeadingText from "../../ui/HeadingText";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import SearchUnits from "../units/SearchUnits";
import { useUnits } from "../units/useUnits";
import UnitsWrapper from "../units/UnitsWrapper";

function HomeUnits() {
  const { isLoading, units } = useUnits({ size: 3 });

  const { i18n } = useTranslation();

  const navigate = useNavigate();

  return (
    <div className="container-fix relative container flex flex-col items-center gap-0 py-8">
      {/* Search Box */}
      <div className="z-10 -mt-20 w-full px-4 lg:w-auto lg:px-0">
        <SearchUnits />
      </div>

      <HeadingText className="lg:mt-inside-spacing-y mt-3">
        {t("Best Chalets in Khiran")}
      </HeadingText>

      <UnitsWrapper units={units} isLoading={isLoading} />

      <button
        onClick={() => navigate("/units")}
        className="border-secondary-dark mt-spacing-y cursor-pointer rounded-full border px-10 py-2 text-lg transition duration-400 hover:shadow-md"
      >
        {t("See All")} <span>{i18n.language === "ar" ? "←" : "→"}</span>
      </button>
    </div>
  );
}

export default HomeUnits;
