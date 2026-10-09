import { CityAddress } from "./AddressSchema";

export interface PopulatedPlace {
  populatedPlaceId: string;
  nameEn: string;
  nameAr: string;
  code: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  cityId: string;
  city: CityAddress;
  type: "NEIGHBORHOOD" | "DISTRICT";
  postalCode: string;
  alternateNames: string;
}
