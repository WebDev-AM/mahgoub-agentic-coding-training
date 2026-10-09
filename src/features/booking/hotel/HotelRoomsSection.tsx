import { useTranslation } from "react-i18next";
import { RoomGroup } from "../../../types/HotelSchema";
import { useState } from "react";
import MediaPreview from "../../../ui/MediaPreview";
import GalleryModal from "../../../ui/GalleryModal";
import { Media } from "../../../types/ChaletSchema";
import BookingSectionCard from "../BookingSectionCard";
import { getAmenities } from "../../../utils/amenitiesUtils";
import { HotelReservationUnit } from "../../../types/reservation/HotelResevationSchema";

function HotelRoomsSection({ rooms }: { rooms: HotelReservationUnit[] }) {
  const { t } = useTranslation();

  return (
    <BookingSectionCard title={t("Room details")} className="p-5">
      <div className="flex flex-col gap-5">
        {rooms.map(({ unitType, count }) => (
          <HotelRoomDetailsCard
            key={unitType.id}
            room={unitType}
            count={count}
          />
        ))}
      </div>
    </BookingSectionCard>
  );
}

function HotelRoomDetailsCard({
  room,
  count,
}: {
  room: RoomGroup;
  count: number;
}) {
  const { i18n, t } = useTranslation();
  const [openGallery, setOpenGallery] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const specs = room.specifications;
  const mediaItems = room.media ?? [];
  const previewItems = mediaItems.slice(0, 2);
  const remainingCount = Math.max(mediaItems.length - 2, 0);
  const galleryMedia = mediaItems as unknown as Media[];

  const getRoomName = (target: RoomGroup) =>
    i18n.language === "en"
      ? target.localizedData.nameEn
      : target.localizedData.nameAr;

  const getRoomDescription = (target: RoomGroup) =>
    i18n.language === "en"
      ? target.localizedData.descriptionEn
      : target.localizedData.descriptionAr;

  const amenities = getAmenities(room).filter(
    ({ count, condition }) =>
      (count !== undefined && count > 0) || condition === true
  );

  const openAtIndex = (index: number) => {
    setStartIndex(index);
    setOpenGallery(true);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-4">
      <div
        className={`grid gap-2 ${remainingCount > 0 ? "grid-cols-3" : "grid-cols-2"}`}
      >
        {previewItems.map((media, index) => (
          <button
            key={media.id ?? `${media.url}-${index}`}
            type="button"
            className="h-24 w-full overflow-hidden rounded-xl"
            onClick={() => openAtIndex(index)}
          >
            <MediaPreview media={media as unknown as Media} />
          </button>
        ))}

        {remainingCount > 0 && (
          <button
            type="button"
            onClick={() => openAtIndex(2)}
            className="flex h-24 items-center justify-center rounded-xl bg-gray-200 text-sm font-semibold text-gray-600"
          >
            +{remainingCount} {t("photos")}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h4 className="text-brand-text font-semibold">{getRoomName(room)}</h4>

          {count > 1 && (
            <span className="text-sm font-medium text-gray-500">
              x{count} {t("rooms")}
            </span>
          )}
        </div>

        <p className="text-sub-text text-xs">
          {specs.area} m² · {getRoomDescription(room)}
        </p>

        <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-600">
          {amenities.map(({ label, icon: Icon }, index) => (
            <div key={`${label}-${index}`} className="flex items-center gap-1">
              <span className="text-primary text-sm">
                <Icon />
              </span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="text-sub-text mt-1 text-xs">
          {t("Capacity")}: {t("max")} {room.maxGuests}{" "}
          {t(room.maxGuests > 1 ? "guests" : "guest")}
        </div>
      </div>

      {galleryMedia.length > 0 && (
        <GalleryModal
          open={openGallery}
          media={galleryMedia}
          startIndex={startIndex}
          onClose={() => setOpenGallery(false)}
        />
      )}
    </div>
  );
}

export default HotelRoomsSection;
