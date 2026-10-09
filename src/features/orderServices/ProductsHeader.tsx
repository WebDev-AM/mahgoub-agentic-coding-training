import { useTranslation } from "react-i18next";
import BackArrow from "../../ui/BackArrow";
import { useService } from "./useService";
import ProductsSearchBar from "./ProductsSearchBar";
import { t } from "i18next";
import { FaClock } from "react-icons/fa";

function ProductsHeader({
  onSearchChange,
}: {
  onSearchChange: (searchTerm: string) => void;
}) {
  const { service } = useService();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <>
      <div
        className="relative h-65 bg-cover bg-no-repeat lg:h-130"
        style={{
          backgroundImage: `url(${service?.backgroundImage})`,
          backgroundPosition: "center",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

        <div className="container-fix relative container flex h-full items-center">
          <div className="absolute start-10 top-6">
            <BackArrow className="text-3xl text-white" />
          </div>

          <div className="flex flex-col gap-2 lg:w-[30%]">
            <h3 className="text-start text-2xl leading-snug font-semibold text-white drop-shadow-lg lg:text-5xl">
              {isArabic ? service?.nameAr : service?.nameEn}
            </h3>
          </div>

          <div className="container-fix absolute start-0 -bottom-5 container h-10">
            <p className="flex h-full w-fit items-center justify-center gap-4 rounded-2xl bg-black px-5 text-white">
              <FaClock />
              {t("Open from")} {service?.openTime} {t("to")}{" "}
              {service?.closeTime}
            </p>
          </div>
        </div>
      </div>
      <ProductsSearchBar
        onSearchChange={onSearchChange}
        backgroundText={isArabic ? service?.textureAr : service?.textureEn}
      />
    </>
  );
}

export default ProductsHeader;
