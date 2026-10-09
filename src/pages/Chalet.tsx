import { Navigate } from "react-router-dom";
import PageSpinner from "../ui/PageSpinner";
import { useChalet } from "../features/units/chalet/useChalet";
import ChaletHeader from "../features/units/chalet/ChaletHeader";
import UnitsImages from "../features/units/UnitImages";
import ChaletDescription from "../features/units/chalet/ChaletDescription";

import ChaletReservationPeriods from "../features/units/chalet/reservationsPeriods/ChaletReservationPeriods";
import ChaletMap from "../features/units/chalet/ChaletMap";
import MediaSwiper from "../ui/MediaSwiper";
import i18n from "../i18n";
import UnitSectionCard from "../features/units/UnitSectionCard";
import ChaletAmenities from "../features/units/chalet/ChaletAmenities";
import ChaletPolicies from "../features/units/chalet/ChaletPolicies";
import ResourceRatings from "../features/rating/ResourceRatings";

function Chalet() {
  const { isLoading, chalet } = useChalet();

  if (isLoading) return <PageSpinner />;
  if (!chalet) return <Navigate to="./" />;

  return (
    <div className="gap-inside-spacing-y pb-inside-spacing-y flex flex-col">
      <ChaletHeader />
      <MediaSwiper
        medias={chalet.media}
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
                ? chalet.localizedData.nameAr
                : chalet.localizedData.nameEn}
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
                  ? chalet.localizedData.addressAr
                  : chalet.localizedData.addressEn}
              </p>

              <p
                className="inline-block rounded-lg bg-white/20 px-2 py-1 font-light"
                style={{
                  textShadow: "0 2px 12px rgba(0,0,0,.5)",
                }}
              >
                <span className="text-yellow-300">
                  {Array.from({ length: 5 }, (_, index) =>
                    index < Math.round(chalet.rating.averageRating) ? "★" : "☆"
                  ).join("")}
                </span>{" "}
                {chalet.rating.averageRating.toFixed(1)} (
                {chalet.rating.totalRatings} reviews)
              </p>
            </div>
          </div>
        }
      />
      <div className="gap-inside-spacing-y container-fix 2xs:container flex w-full flex-col lg:flex-row lg:items-start">
        <div className="gap-inside-spacing-y flex flex-1 flex-col overflow-hidden">
          <ChaletDescription chalet={chalet} />
          <UnitSectionCard title="Photo Gallery">
            <UnitsImages unitImages={chalet.media} />
          </UnitSectionCard>
          <ChaletAmenities chalet={chalet} />
          <ResourceRatings resourceType="CHALET" resourceId={chalet.uuid} />
        </div>

        <div className="gap-inside-spacing-y flex w-full flex-col lg:w-[420px]">
          <ChaletPolicies timeDetails={chalet.timeDetails} />
          <ChaletMap lat={chalet.latitude} long={chalet.longitude} />
          <ChaletReservationPeriods chalet={chalet} />
        </div>
      </div>
    </div>
  );
}

export default Chalet;
