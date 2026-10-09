import { t } from "i18next";
import { AmenityItem } from "../../utils/amenitiesUtils";
import AmenityCard from "./AmenityCard";

type AmenitiesModalProps = {
  amenities: AmenityItem[];
  onCloseModal?: () => void;
};

export default function AmenitiesModal({
  amenities,
  onCloseModal,
}: AmenitiesModalProps) {
  return (
    <div className="">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {t("Amenities & Facilities")}
        </h2>

        <button onClick={onCloseModal} className="text-gray-500">
          ✕
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {amenities.map((amenity) => (
          <AmenityCard
            key={amenity.label}
            label={amenity.label}
            emoji={amenity.emoji ?? "✨"}
          />
        ))}
      </div>
    </div>
  );
}
