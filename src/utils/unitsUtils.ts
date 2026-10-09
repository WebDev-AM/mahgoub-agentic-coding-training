import { Chalet } from "../types/ChaletSchema";
import { Hotel, RoomGroup } from "../types/HotelSchema";

// List of amenities to display
export const featuresAmenities: (keyof Chalet["amenities"])[] = [
  "maidQuarters",
  "poolCount",
  "airConditionerCount",
  "televisionCount",
  "hasFootball",
  "parkingSpots",
  "gardenCount",
  "gamesCount",
];

export function isHotelUnit(unit: Chalet | Hotel): unit is Hotel {
  return unit.entityType === "HOTEL";
}
export function isChaletUnit(unit: Chalet | Hotel | RoomGroup): unit is Chalet {
  return (unit as Chalet).entityType === "CHALET";
}
