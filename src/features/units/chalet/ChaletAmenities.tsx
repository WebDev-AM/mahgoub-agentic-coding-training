import { t } from "i18next";
import { Chalet } from "../../../types/ChaletSchema";

import ModalComponent from "../../../ui/ModalComponent";

import AmenityCard from "../AmenityCard";
import AmenitiesModal from "../AmenitiesModal";
import { getAmenities } from "../../../utils/amenitiesUtils";
import UnitSectionCard from "../UnitSectionCard";

type ChaletAmenitiesProps = {
  chalet: Chalet;
};

function ChaletAmenities({ chalet }: ChaletAmenitiesProps) {
  const amenities = getAmenities(chalet).filter(
    (item) => (item.count ?? 0) > 0 || item.condition
  );

  const visibleAmenities = amenities.slice(0, 8);

  return (
    <UnitSectionCard
      title={t("Amenities & Facilities")}
      action={
        amenities.length > 8 ? (
          <ModalComponent
            openButton={
              <button className="text-primary cursor-pointer text-sm font-medium">
                {t("View all")} {amenities.length} →
              </button>
            }
          >
            <AmenitiesModal amenities={amenities} />
          </ModalComponent>
        ) : undefined
      }
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {visibleAmenities.map((amenity) => (
          <AmenityCard
            key={amenity.label}
            label={amenity.label}
            emoji={amenity.emoji ?? "✨"}
          />
        ))}
      </div>
    </UnitSectionCard>
  );
}

export default ChaletAmenities;
