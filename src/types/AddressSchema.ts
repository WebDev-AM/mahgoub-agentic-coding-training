export type ContinentAddress = {
  continentId: string;
  nameEn: string;
  nameAr: string;
  code: string;
  isActive: boolean;
};

export type CountryAddress = {
  countryId: string;
  nameEn: string;
  nameAr: string;
  code: string;
  code3: string;
  phoneCode: string;
  currency: string;
  currencySymbol: string;
  isActive: boolean;
  continentId: string;
  continent: ContinentAddress;
};

export type GovernorateAddress = {
  governorateId: string;
  nameEn: string;
  nameAr: string;
  code: string;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  countryId: string;
  country: CountryAddress;
};

export type CityAddress = {
  cityId: string;
  nameEn: string;
  nameAr: string;
  code: string;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  governorateId: string;
  governorate: GovernorateAddress;
};
