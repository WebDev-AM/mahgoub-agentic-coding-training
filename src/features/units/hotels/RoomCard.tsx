import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import { Button } from "@mui/material";

import { RoomGroup } from "../../../types/HotelSchema";
import { getAmenities } from "../../../utils/amenitiesUtils";

import GalleryModal from "../../../ui/GalleryModal";
import MediaPreview from "../../../ui/MediaPreview";
import QuantityController from "../../../ui/QuantityController";
import { CiCircleCheck } from "react-icons/ci";
import dayjs from "dayjs";

// import { CiCircleCheck } from "react-icons/ci";

type RoomCardProps = {
  room: RoomGroup;
  selectedCount: number;
  onAddRoom: () => void;
  onIncreaseRoom: () => void;
  onDecreaseRoom: () => void;
  onRemoveRoom: () => void;
};

function RoomCard({
  room,
  selectedCount,
  onAddRoom,
  onIncreaseRoom,
  onDecreaseRoom,
  onRemoveRoom,
}: RoomCardProps) {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();

  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const [openGallery, setOpenGallery] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const localizedName =
    i18n.language === "en"
      ? room.localizedData.nameEn
      : room.localizedData.nameAr;

  const localizedDescription =
    i18n.language === "en"
      ? room.localizedData.descriptionEn
      : room.localizedData.descriptionAr;

  useEffect(() => {
    if (!room.media?.length || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % room.media.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [room.media.length, isHovered]);

  const handleOpenGallery = () => {
    setStartIndex(currentIndex);
    setOpenGallery(true);
  };

  if (!room.media?.length) return null;

  const amenities = getAmenities(room).filter((item) =>
    item.count !== undefined ? item.count > 0 : !!item.condition
  );

  const viewLabels = {
    SEA: t("Sea view"),
    STREET: t("Street view"),
    GARDEN: t("Garden view"),
    POOL: t("Pool view"),
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        <div className="flex flex-col lg:flex-row">
          {/* IMAGE */}
          <div
            className="relative h-56 w-full cursor-pointer overflow-hidden bg-gray-100 lg:h-auto lg:w-72 lg:min-w-[288px]"
            onClick={handleOpenGallery}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="absolute inset-0">
              <MediaPreview media={room.media[currentIndex]} />
            </div>

            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1">
              {room.media.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex flex-1 flex-col gap-3 p-5">
            {/* HEADER */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {localizedName}
                </h3>
                {room?.roomIds && (
                  <div className="rounded-md bg-blue-500 px-3 py-1 text-sm font-medium text-white">
                    {room?.roomIds?.length} {t("available")}
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-500">
                {room.specifications.beds} {t("Beds")} •{" "}
                {room.specifications.area} {t("m²")} • {viewLabels[room.view]}
              </p>

              {localizedDescription && (
                <p className="line-clamp-2 text-sm text-gray-500">
                  {localizedDescription}
                </p>
              )}
            </div>

            {/* AMENITIES */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-gray-600 lg:grid-cols-3">
              {amenities.map(({ icon: Icon, label, count }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="text-base text-gray-500" />
                  <span>{count ? count : ""}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* POLICIES */}
            <div className="flex flex-wrap justify-between gap-x-8 gap-y-2 border-t border-gray-100 pt-3 text-sm text-gray-500">
              <span>
                <strong>{t("Capacity")}:</strong> {room.maxGuests} {t("guests")}
              </span>

              {room.specifications.freeCancellationActive && (
                <>
                  <span className="rounded-lg bg-green-500/10 px-2 text-green-600">
                    <CiCircleCheck className="mr-1 inline text-green-600" />
                    {t("Free cancellation")}{" "}
                    {room.specifications.freeCancellationTo && (
                      <span className="font-normal">
                        {t("until")}{" "}
                        {dayjs(room.specifications.freeCancellationTo)
                          .locale(i18n.language)
                          .format("DD MMM YYYY")}
                      </span>
                    )}
                  </span>

                  <span className="rounded-lg bg-blue-500/10 px-2 text-blue-600">
                    {t("No prepayment needed")}
                  </span>
                </>
              )}
            </div>

            {/* FOOTER */}
            <div className="flex flex-col gap-4 border-t border-gray-100 pt-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-end gap-1">
                <span className="text-primary text-3xl font-bold">
                  {room.pricingDetails.dailyPrice}
                </span>

                <span className="text-primary font-medium">{t("KWD")}</span>

                <p className="font-light text-gray-500">{t("/night")}</p>
              </div>

              <div className="flex items-center justify-center">
                {selectedCount > 0 ? (
                  <QuantityController
                    value={selectedCount}
                    label={selectedCount > 1 ? t("Rooms") : t("Room")}
                    max={room.roomIds?.length}
                    onIncrease={onIncreaseRoom}
                    onDecrease={onDecreaseRoom}
                    onRemove={onRemoveRoom}
                    disabled={!checkIn || !checkOut}
                  />
                ) : (
                  <Button
                    variant="contained"
                    onClick={onAddRoom}
                    disabled={!checkIn || !checkOut}
                    className="brand-button !w-52"
                  >
                    {t("Select room")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <GalleryModal
        open={openGallery}
        media={room.media}
        startIndex={startIndex}
        onClose={() => setOpenGallery(false)}
      />
    </>
  );
}

export default RoomCard;
