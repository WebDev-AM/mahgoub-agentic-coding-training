import { useNavigate, useSearchParams } from "react-router-dom";
import { t } from "i18next";
import { LuWaves } from "react-icons/lu";
import { TbBed } from "react-icons/tb";
import { PiTelevisionSimple } from "react-icons/pi";
import { Chalet, Unit } from "../../types/ChaletSchema";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { BiCar } from "react-icons/bi";
import { Hotel } from "../../types/HotelSchema";
import { isHotelUnit } from "../../utils/unitsUtils";
import { GiGamepad } from "react-icons/gi";

type UnitCardProps = { unit: Unit };

function UnitCard({ unit }: UnitCardProps) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const handleCardClick = () => {
    navigate(
      isHotelUnit(unit)
        ? `/hotel/${unit.id}?${searchParams.toString()}`
        : `/chalet/${unit.id}?${searchParams.toString()}`
    );
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.01 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full cursor-pointer overflow-hidden rounded-xl text-center transition duration-500 hover:shadow md:w-85 lg:w-95"
      onClick={handleCardClick}
    >
      <div className="relative w-full">
        <div className="h-100 w-full md:h-125">
          <img
            src={`${unit.media[0]?.url}`}
            alt={unit.localizedData.nameEn}
            className="h-100 w-full object-cover transition-transform duration-600 ease-in-out hover:scale-105"
          />
        </div>
        <div className="flex w-full flex-col gap-4 rounded-b-xl bg-white p-3 text-start md:absolute md:bottom-0 md:left-0 md:rounded-xl">
          <div className="text-brand-text text-xl font-semibold">
            {i18n.language === "en"
              ? unit.localizedData.nameEn
              : unit.localizedData.nameAr}
          </div>
          <div className="text-gray-dark-text flex items-center gap-2">
            <span
              className="truncate md:max-w-[300px]"
              title={
                i18n.language === "en"
                  ? unit.localizedData.addressEn
                  : unit.localizedData.addressAr
              }
            >
              {i18n.language === "en"
                ? unit.localizedData.addressEn
                : unit.localizedData.addressAr}
            </span>

            <a
              href={`https://www.google.com/maps?q=${unit.latitude},${unit.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-sm font-medium text-blue-500 underline"
              onClick={(event) => event.stopPropagation()}
            >
              {t("Show On the Map")}
            </a>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs tracking-tighter">
            {isHotelUnit(unit)
              ? renderHotelAmenities(unit.facilities)
              : renderChaletAmenities(unit.amenities)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UnitCard;

type AmenityItemProps = {
  icon: React.ReactNode;
  count?: number;
  label: string;
};

function renderAmenityItem({ icon, count, label }: AmenityItemProps) {
  return (
    <span className="flex items-center gap-0.5">
      <span className="bg-light-gray flex h-6 w-6 shrink-0 items-center justify-center rounded text-sm">
        {icon}
      </span>
      {count !== undefined && <span>{count}</span>}
      <span>{label}</span>
    </span>
  );
}

// Render hotel-specific amenities
function renderHotelAmenities(facilities: Hotel["facilities"]) {
  return (
    <>
      {renderAmenityItem({
        icon: <BiCar />,
        count: facilities.parkings,
        label: t("Parking"),
      })}
      {renderAmenityItem({
        icon: <GiGamepad />,
        count: facilities.games,
        label: t("Games"),
      })}
      {renderAmenityItem({
        icon: <LuWaves />,
        count: facilities.commonPools,
        label: t("Pools"),
      })}
    </>
  );
}

// Render unit-specific amenities
function renderChaletAmenities(amenities: Chalet["amenities"]) {
  return (
    <>
      {renderAmenityItem({
        icon: <BiCar />,
        count: amenities.parkingSpots,
        label: t("Parking"),
      })}
      {renderAmenityItem({
        icon: <PiTelevisionSimple />,
        count: amenities.televisionCount,
        label: t("TV"),
      })}
      {renderAmenityItem({
        icon: <LuWaves />,
        count: amenities.poolCount,
        label: t("Pools"),
      })}
      {renderAmenityItem({
        icon: <TbBed />,
        count: amenities.bedCount,
        label: t("Beds"),
      })}
    </>
  );
}
