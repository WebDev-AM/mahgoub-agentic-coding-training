import { PopulatedPlace } from "./PopulatedPlacesSchema";
import { RatingSummary } from "./reservation/RatingSchema";

export type HotelMedia = {
  id: number;
  type: "image" | "video";
  url: string;
  uploadedAt: string; // ISO 8601
};
export type HotelMediaPreview = {
  id?: number; // exists only if already uploaded
  file?: File; // exists only before upload
  url: string;
  type: "image" | "video";
};

export type HotelFacilities = {
  parkings: number;
  gardens: number;
  commonPools: number;
  games: number;
  hasFootball: boolean;

  hasWifi: boolean;
  hasBeachAccess: boolean;
  hasBreakfast: boolean;
  PetFriendly: boolean;
  hasGym: boolean;
  hasSpa: boolean;
  hasRestaurant: boolean;
  hasAirportShuttle: boolean;
  hasConcierge: boolean;
  hasMeetingRooms: boolean;
  hasLaundry: boolean;
  WheelchairAccessible: boolean;
};

export type HotelTimeDetails = {
  entryTime: string; // HH:mm
  exitTime: string; // HH:mm
};

export type HotelPolicyDetails = {
  reservationLimitInDays: number;
  reservationPrepaidPaymentType: "FIXED" | "PERCENTAGE";
  reservationPrepaidAmount: number;
  advancePaymentDays: number;
  prepaidAmountValid: boolean;
};

export type HotelLocalizedData = {
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  addressEn: string;
  addressAr: string;
};

export type HotelFloor = {
  floorNumber: number;
  unitNumbers: string[];
};

// Add missing properties to Hotel type
export type Hotel = {
  id: number;
  entityType: "HOTEL";
  uuid: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string; // Add this
  city: string;
  country: string;
  localizedData: HotelLocalizedData;
  media: HotelMedia[];
  nearbyPopulatedPlaces: PopulatedPlace[];
  experienceVibes: string[];
  nearbyLocations: string[];
  timeDetails: HotelTimeDetails;
  facilities: HotelFacilities;
  policyDetails: HotelPolicyDetails;
  rating: RatingSummary;
  latitude: number;
  longitude: number;
  approvedBy?: string; // Add this (optional if not always present)
  approvedAt?: string; // Add this (optional if not always present)
  commissionType: "FIXED" | "PERCENTAGE";
  commission: number;
  floors: HotelFloor[]; // Add this (or define a proper Floor type)
  promoterIds: string[];
  freeCancellationActive: boolean;
  published: boolean;
  approved: boolean;
};

export type RoomGroupLocalizedData = {
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
};

export type RoomGroupSpecifications = {
  area: number;
  rooms: number;
  beds: number;
  bathrooms: number;
  kitchens: number;
  maidRooms: number;
  acs: number;
  tvs: number;
  privatePools: number;
  hasWifi: boolean;
  hasMiniFridge: boolean;
  hasHeater: boolean;
  hasWardrobe: boolean;
  hasBalcony: boolean;
  hasElectricCarCharger: boolean;
  hasHairDryer: boolean;
  hasTowels: boolean;
  hasBathtub: boolean;
  hasShower: boolean;
  hasExtraBedSofa: boolean;
  animalsAllowed: boolean;
  childrenAllowed: boolean;
  adultsAllowed: boolean;

  freeCancellationActive: boolean;
  freeCancellationFrom: string;
  freeCancellationTo: string;
  hasGym: boolean;
  hasSpa: boolean;
  hasBeachAccess: boolean;
  hasMinibar: boolean;
  hasRoomService: boolean;
  hasSafe: boolean;
  hasBreakfast: boolean;
  petFriendly: boolean;
};

export type RoomGroupPricingDetails = {
  insurancePrice: number;
  weekdayPrice: number;
  weekendPrice: number;
  dailyPrice: number;
  insurancePrepaid: boolean;
};

export type RoomGroupMedia = {
  id: number;
  type: "image" | "video";
  url: string;
  uploadedAt: string; // ISO 8601
};

export type RoomGroup = {
  id: number;
  hotelId: string;
  localizedData: RoomGroupLocalizedData;
  specifications: RoomGroupSpecifications;
  view: "SEA" | "STREET" | "GARDEN" | "POOL";
  minGuests: number;
  maxGuests: number;
  media: RoomGroupMedia[];
  priceListId: string;
  pricingDetails: RoomGroupPricingDetails;
  roomIds?: string[];
};
