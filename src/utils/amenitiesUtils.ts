import { IoBed, IoShirtOutline, IoWifi } from "react-icons/io5";
import { PiToiletFill, PiBathtub } from "react-icons/pi";
import { RiFridgeFill, RiKnifeFill } from "react-icons/ri";
import { BiSwim } from "react-icons/bi";
import { FaTv, FaThermometerHalf, FaGamepad, FaWind } from "react-icons/fa";
import { TbSoccerField } from "react-icons/tb";
import {
  MdBalcony,
  MdPets,
  MdLocalParking,
  MdNature,
  MdChildCare,
  MdPerson,
  MdRoomService,
  MdLocalLaundryService,
  MdElectricCar,
  MdOutlineMeetingRoom,
  MdWeekend,
  MdLayers,
  MdOutlineFreeCancellation,
  MdFitnessCenter,
  MdFreeBreakfast,
  MdRestaurant,
  MdAirportShuttle,
  MdSupportAgent,
  MdMeetingRoom,
  MdAccessible,
  MdOutdoorGrill,
  MdElevator,
  MdLock,
  MdLocalBar,
} from "react-icons/md";

import { FaSpa, FaUmbrellaBeach } from "react-icons/fa";
import { GiShower } from "react-icons/gi";
import { TbAirConditioning } from "react-icons/tb";
import { t } from "i18next";
import { Hotel, RoomGroup } from "../types/HotelSchema";
import { Chalet } from "../types/ChaletSchema";
import { IconType } from "react-icons/lib";

export type AmenityItem = {
  label: string;
  icon: IconType;
  emoji?: string;
  count?: number;
  section?: "general" | "premium" | "highlight";
  condition?: boolean;
};

export function getAmenities(item: Hotel | RoomGroup | Chalet): AmenityItem[] {
  if (!item) return [];

  // ROOM GROUP
  if ("specifications" in item) {
    const spec = item.specifications;

    return [
      {
        label: t("Bathrooms"),
        icon: PiToiletFill,
        emoji: "🚿",
        count: spec.bathrooms,
      },
      {
        label: t("Kitchens"),
        icon: RiKnifeFill,
        emoji: "🍳",
        count: spec.kitchens,
      },
      {
        label: t("Maid rooms"),
        icon: MdRoomService,
        emoji: "🧹",
        count: spec.maidRooms,
      },
      {
        label: t("Air conditioning"),
        icon: TbAirConditioning,
        emoji: "❄️",
        count: spec.acs,
      },
      {
        label: t("Televisions"),
        icon: FaTv,
        emoji: "📺",
        count: spec.tvs,
      },
      {
        label: t("Private Pools"),
        icon: BiSwim,
        emoji: "🏊",
        count: spec.privatePools,
      },
      {
        label: t("Wi-Fi"),
        icon: IoWifi,
        emoji: "📶",
        condition: spec.hasWifi,
      },
      {
        label: t("Mini fridge"),
        icon: RiFridgeFill,
        emoji: "🧊",
        condition: spec.hasMiniFridge,
      },
      {
        label: t("Hair dryer"),
        icon: FaWind,
        emoji: "💨",
        condition: spec.hasHairDryer,
      },
      {
        label: t("Towels"),
        icon: MdLocalLaundryService,
        emoji: "🧺",
        condition: spec.hasTowels,
      },
      {
        label: t("Electric car charger"),
        icon: MdElectricCar,
        emoji: "🔌",
        condition: spec.hasElectricCarCharger,
      },
      {
        label: t("Heater"),
        icon: FaThermometerHalf,
        emoji: "🔥",
        condition: spec.hasHeater,
      },
      {
        label: t("Wardrobe"),
        icon: IoShirtOutline,
        emoji: "👔",
        condition: spec.hasWardrobe,
      },
      {
        label: t("Balcony"),
        icon: MdBalcony,
        emoji: "🌅",
        condition: spec.hasBalcony,
      },
      {
        label: t("Extra bed sofa"),
        icon: MdWeekend,
        emoji: "🛋️",
        condition: spec.hasExtraBedSofa,
      },
      {
        label: t("Free cancellation"),
        icon: MdOutlineFreeCancellation,
        emoji: "✅",
        condition: spec.freeCancellationActive,
      },
      {
        label: t("Bathtub"),
        icon: PiBathtub,
        emoji: "🛁",
        condition: spec.hasBathtub,
      },
      {
        label: t("Shower"),
        icon: GiShower,
        emoji: "🚿",
        condition: spec.hasShower,
      },
      {
        label: t("Animals allowed"),
        icon: MdPets,
        emoji: "🐾",
        condition: spec.animalsAllowed,
      },
      {
        label: t("Children allowed"),
        icon: MdChildCare,
        emoji: "👶",
        condition: spec.childrenAllowed,
      },
      {
        label: t("Adults allowed"),
        icon: MdPerson,
        emoji: "🧑",
        condition: spec.adultsAllowed,
      },
      {
        label: t("Gym"),
        icon: MdFitnessCenter,
        emoji: "🏋️",
        condition: spec.hasGym,
      },
      {
        label: t("Spa"),
        icon: FaSpa,
        emoji: "💆",
        condition: spec.hasSpa,
      },
      {
        label: t("Beach access"),
        icon: FaUmbrellaBeach,
        emoji: "🏖️",
        condition: spec.hasBeachAccess,
      },
      {
        label: t("Minibar"),
        icon: MdLocalBar,
        emoji: "🍹",
        condition: spec.hasMinibar,
      },
      {
        label: t("Room service"),
        icon: MdRoomService,
        emoji: "🛎️",
        condition: spec.hasRoomService,
      },
      {
        label: t("Safe"),
        icon: MdLock,
        emoji: "🔒",
        condition: spec.hasSafe,
      },
      {
        label: t("Breakfast"),
        icon: MdFreeBreakfast,
        emoji: "🥐",
        condition: spec.hasBreakfast,
      },
      {
        label: t("Pet friendly"),
        icon: MdPets,
        emoji: "🐕",
        condition: spec.petFriendly,
      },
    ];
  }

  // CHALET
  if ("amenities" in item) {
    const a = item.amenities;

    return [
      {
        label: t("Floors"),
        icon: MdLayers,
        emoji: "🏢",
        section: "general",
        count: a.floorCount,
      },
      {
        label: t("Rooms"),
        icon: MdOutlineMeetingRoom,
        emoji: "🚪",
        section: "premium",
        count: a.roomCount,
      },
      {
        label: t("Beds"),
        icon: IoBed,
        emoji: "🛏️",
        section: "premium",
        count: a.bedCount,
      },
      {
        label: t("Bathrooms"),
        icon: PiToiletFill,
        emoji: "🚿",
        section: "premium",
        count: a.bathroomCount,
      },
      {
        label: t("Kitchens"),
        icon: RiKnifeFill,
        emoji: "🍳",
        section: "premium",
        count: a.kitchenCount,
      },
      {
        label: t("Maid quarters"),
        icon: MdRoomService,
        emoji: "🧹",
        section: "premium",
        count: a.maidQuarters,
      },
      {
        label: t("Air conditioning"),
        icon: TbAirConditioning,
        emoji: "❄️",
        section: "premium",
        count: a.airConditionerCount,
      },
      {
        label: t("Televisions"),
        icon: FaTv,
        emoji: "📺",
        section: "premium",
        count: a.televisionCount,
      },
      {
        label: t("Pools"),
        icon: BiSwim,
        emoji: "🏊",
        section: "premium",
        count: a.poolCount,
      },
      {
        label: t("Parkings"),
        icon: MdLocalParking,
        emoji: "🅿️",
        section: "highlight",
        count: a.parkingSpots,
      },
      {
        label: t("Gardens"),
        icon: MdNature,
        emoji: "🌳",
        section: "highlight",
        count: a.gardenCount,
      },
      {
        label: t("Games"),
        icon: FaGamepad,
        emoji: "🎮",
        section: "highlight",
        count: a.gamesCount,
      },
      {
        label: t("Football Field"),
        icon: TbSoccerField,
        emoji: "⚽",
        section: "highlight",
        condition: a.hasFootball,
      },
      {
        label: t("Wi-Fi"),
        icon: IoWifi,
        emoji: "📶",
        section: "highlight",
        condition: a.hasWifi,
      },
      {
        label: t("Beach access"),
        icon: FaUmbrellaBeach,
        emoji: "🏖️",
        section: "highlight",
        condition: a.hasBeachAccess,
      },
      {
        label: t("Breakfast"),
        icon: MdFreeBreakfast,
        emoji: "🥐",
        section: "highlight",
        condition: a.hasBreakfast,
      },
      {
        label: t("Pet friendly"),
        icon: MdPets,
        emoji: "🐕",
        section: "highlight",
        condition: a.PetFriendly,
      },
      {
        label: t("Gym"),
        icon: MdFitnessCenter,
        emoji: "🏋️",
        section: "highlight",
        condition: a.hasGym,
      },
      {
        label: t("Spa"),
        icon: FaSpa,
        emoji: "💆",
        section: "highlight",
        condition: a.hasSpa,
      },
      {
        label: t("BBQ"),
        icon: MdOutdoorGrill,
        emoji: "🍖",
        section: "highlight",
        condition: a.hasBbq,
      },
      {
        label: t("Balcony"),
        icon: MdBalcony,
        emoji: "🌅",
        section: "highlight",
        condition: a.hasBalcony,
      },
      {
        label: t("Elevator"),
        icon: MdElevator,
        emoji: "🛗",
        section: "highlight",
        condition: a.hasElevator,
      },
    ];
  }

  // HOTEL
  if ("facilities" in item) {
    const f = item.facilities;

    return [
      {
        label: t("Parkings"),
        icon: MdLocalParking,
        emoji: "🅿️",
        count: f.parkings,
      },
      {
        label: t("Gardens"),
        icon: MdNature,
        emoji: "🌳",
        count: f.gardens,
      },
      {
        label: t("Common Pools"),
        icon: BiSwim,
        emoji: "🏊",
        count: f.commonPools,
      },
      {
        label: t("Games"),
        icon: FaGamepad,
        emoji: "🎮",
        count: f.games,
      },
      {
        label: t("Football Field"),
        icon: TbSoccerField,
        emoji: "⚽",
        condition: f.hasFootball,
      },
      {
        label: t("Wi-Fi"),
        icon: IoWifi,
        emoji: "📶",
        condition: f.hasWifi,
      },
      {
        label: t("Beach access"),
        icon: FaUmbrellaBeach,
        emoji: "🏖️",
        condition: f.hasBeachAccess,
      },
      {
        label: t("Breakfast"),
        icon: MdFreeBreakfast,
        emoji: "🥐",
        condition: f.hasBreakfast,
      },
      {
        label: t("Pet friendly"),
        icon: MdPets,
        emoji: "🐕",
        condition: f.PetFriendly,
      },
      {
        label: t("Gym"),
        icon: MdFitnessCenter,
        emoji: "🏋️",
        condition: f.hasGym,
      },
      {
        label: t("Spa"),
        icon: FaSpa,
        emoji: "💆",
        condition: f.hasSpa,
      },
      {
        label: t("Restaurant"),
        icon: MdRestaurant,
        emoji: "🍽️",
        condition: f.hasRestaurant,
      },
      {
        label: t("Airport shuttle"),
        icon: MdAirportShuttle,
        emoji: "🚌",
        condition: f.hasAirportShuttle,
      },
      {
        label: t("Concierge"),
        icon: MdSupportAgent,
        emoji: "🛎️",
        condition: f.hasConcierge,
      },
      {
        label: t("Meeting rooms"),
        icon: MdMeetingRoom,
        emoji: "🏢",
        condition: f.hasMeetingRooms,
      },
      {
        label: t("Laundry"),
        icon: MdLocalLaundryService,
        emoji: "🧺",
        condition: f.hasLaundry,
      },
      {
        label: t("Wheelchair accessible"),
        icon: MdAccessible,
        emoji: "♿",
        condition: f.WheelchairAccessible,
      },
    ];
  }

  return [];
}
