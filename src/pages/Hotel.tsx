// File: Hotel.tsx
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useHotel } from "../features/units/hotels/useHotel";
import PageSpinner from "../ui/PageSpinner";
import HotelDescription from "../features/units/hotels/HotelDescription";
import HotelMap from "../features/units/hotels/HotelMap";
import { Button } from "@mui/material";
import { t } from "i18next";
import UnitsImages from "../features/units/UnitImages";
import MediaSwiper from "../ui/MediaSwiper";
import UnitSectionCard from "../features/units/UnitSectionCard";
import HotelAmenities from "../features/units/hotels/HotelAmenities";
import HotelPolicies from "../features/units/hotels/HotelPolicies";
import i18n from "../i18n";
import ResourceRatings from "../features/rating/ResourceRatings";

export default function Hotel() {
  const { isLoading, hotel } = useHotel();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  if (isLoading) return <PageSpinner />;
  if (!hotel) return <Navigate to="./" />;

  return (
    <div className="gap-inside-spacing-y pb-inside-spacing-y flex flex-col">
      <MediaSwiper
        medias={hotel.media}
        autoplay={false}
        overlayContent={
          <div className="container-fix container text-white">
            <h1
              className="text-4xl font-bold md:text-5xl"
              style={{
                textShadow: "0 2px 12px rgba(0,0,0,.5)",
              }}
            >
              {i18n.language === "ar"
                ? hotel.localizedData.nameAr
                : hotel.localizedData.nameEn}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p
                className="inline-block rounded-lg bg-white/20 px-2 py-1 font-light"
                style={{
                  textShadow: "0 2px 12px rgba(0,0,0,.5)",
                }}
              >
                📍{" "}
                {i18n.language === "ar"
                  ? hotel.localizedData.addressAr
                  : hotel.localizedData.addressEn}
              </p>

              <p
                className="inline-block rounded-lg bg-white/20 px-2 py-1 font-light"
                style={{
                  textShadow: "0 2px 12px rgba(0,0,0,.5)",
                }}
              >
                <span className="text-yellow-300">
                  {Array.from({ length: 5 }, (_, index) =>
                    index < Math.round(hotel.rating.averageRating) ? "★" : "☆"
                  ).join("")}
                </span>{" "}
                {hotel.rating.averageRating.toFixed(1)} (
                {hotel.rating.totalRatings} reviews)
              </p>
            </div>
          </div>
        }
      />
      <div className="gap-inside-spacing-y container-fix 2xs:container flex w-full flex-col lg:flex-row lg:items-start">
        <div className="gap-inside-spacing-y flex flex-1 flex-col">
          <HotelDescription hotel={hotel} />
          <UnitSectionCard title="Photo Gallery">
            <UnitsImages unitImages={hotel.media} />
          </UnitSectionCard>
          <HotelAmenities hotel={hotel} />
          <ResourceRatings resourceType="HOTEL" resourceId={hotel.uuid} />
        </div>

        <div className="gap-inside-spacing-y flex w-full flex-col lg:w-[420px]">
          <HotelPolicies timeDetails={hotel.timeDetails} />
          <HotelMap lat={hotel.latitude} long={hotel.longitude} />
        </div>
      </div>

      <Button
        variant="contained"
        className="brand-button mx-auto! w-60 sm:w-85"
        sx={{ textTransform: "none" }}
        onClick={() =>
          navigate(`/hotel/${hotel.uuid}/rooms?${searchParams.toString()}`)
        }
      >
        {t("Book your room")}
      </Button>
    </div>
  );
}
