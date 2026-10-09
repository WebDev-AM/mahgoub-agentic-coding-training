/* FILTER TYPES */

import { Hotel } from "./HotelSchema";
import { PopulatedPlace } from "./PopulatedPlacesSchema";
import { RatingSummary } from "./reservation/RatingSchema";

type ViewType = "SEA" | "STREET" | "GARDEN" | "POOL";
export type EntityType = "CHALET" | "FLOOR" | "VILLA" | "APARTMENT";

type Amenities = {
  floorCount: number;
  roomCount: number;
  bedCount: number;
  kitchenCount: number;
  bathroomCount: number;
  maidQuarters: number;
  poolCount: number;
  airConditionerCount: number;
  televisionCount: number;
  hasFootball: boolean;
  parkingSpots: number;
  gardenCount: number;
  gamesCount: number;

  hasWifi: boolean;
  hasBeachAccess: boolean;
  hasBreakfast: boolean;
  PetFriendly: boolean;
  hasGym: boolean;
  hasSpa: boolean;
  hasBbq: boolean;
  hasBalcony: boolean;
  hasElevator: boolean;
};

type LocalizedData = {
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  addressEn: string;
  addressAr: string;
};

export type Media = {
  type: string;
  url: string;
  uploadedAt: string; // ISO 8601 date-time string
  id: number;
};

export type PricingDetails = {
  weekendPrice: number; // Price for weekends
  weekdayPrice: number; // Price for weekdays
  dailyPrice: number; // Price for daily stays
  insurancePrice: number; // Price for holidays (renamed for clarity)
  reservationLimitInDays: number; // Max days in advance booking is allowed
  reservationPrepaidPaymentType?: "FIXED" | "PERCENTAGE"; // Type of prepaid value
  reservationPrepaidAmount?: number; // Prepaid amount (fixed or percent)
  advanceCompletePaymentDays?: number; // Number of days before payment is due
  insurancePrepaid?: boolean; // Indicates if insurance is prepaid
  prepaidAmountValid?: boolean; // Indicates if the prepaid amount is valid
};

export type TimeDetails = {
  entryTime: string;
  exitTime: string;
};

export type Chalet = {
  id: number;
  entityType: "CHALET";
  uuid: string;
  reservationType: "PERIODIC" | "DAILY";
  localizedData: LocalizedData;
  media: Media[];
  experienceVibes: string[];
  nearbyLocations: string[];
  timeDetails: TimeDetails;
  amenities: Amenities;
  viewType: ViewType;
  chaletType: EntityType;
  pricingDetails: PricingDetails;
  nearbyPopulatedPlaces: PopulatedPlace[];
  rating: RatingSummary;
  area?: number;
  latitude: number;
  longitude: number;
  minCapacity: number;
  maxCapacity: number;
};

export type Unit = Chalet | Hotel;
