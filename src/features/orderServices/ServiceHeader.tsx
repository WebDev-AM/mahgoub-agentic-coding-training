import { useState } from "react";
import { useTranslation } from "react-i18next";
import BackArrow from "../../ui/BackArrow";
import { useServiceType } from "./useServiceType";
import { FilterDispatchAction } from "../../types/FilterTypes";
import { Dispatch } from "react";
import { t } from "i18next";

type ServiceHeaderProps = {
  filtersDispatch: Dispatch<FilterDispatchAction>;
};

function ServiceHeader({ filtersDispatch }: ServiceHeaderProps) {
  const { serviceType } = useServiceType();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    filtersDispatch({
      type: "SET_SEARCH",
      payload: searchTerm.trim(),
    });
  };

  return (
    <div
      className="text-shadow relative h-130 bg-cover bg-no-repeat p-6"
      style={{
        backgroundImage: `url(${serviceType?.backgroundImage})`,
        backgroundPosition: "center",
      }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-black/20 to-transparent" />
      <div className="container-fix relative container flex h-full items-center">
        <div className="absolute start-6 top-6">
          <BackArrow
            className="text-3xl text-white"
            label={isArabic ? serviceType?.nameAr : serviceType?.nameEn}
            url="/services"
          />
        </div>

        <div className="flex flex-col gap-2 lg:w-[35%]">
          <h3 className="text-start text-5xl leading-snug font-semibold text-white drop-shadow-lg">
            {isArabic ? serviceType?.textureAr : serviceType?.textureEn}
          </h3>

          {/* Search bar */}
          <div className="flex h-13 w-full overflow-hidden rounded-full bg-white">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={t("Search services")}
              className="w-full border-none bg-white px-4 py-2 text-xl text-black placeholder-black/60 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="w-50 cursor-pointer rounded-full bg-blue-700 px-6 py-2 font-semibold text-white transition hover:bg-blue-800"
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceHeader;
