import { CityAddress, CountryAddress } from "../types/AddressSchema";
import { PopulatedPlace } from "../types/PopulatedPlacesSchema";
import customFetch from "./customFetch";

const API_END_POINT_URL = "/api/addresses";

// Get All Countries
export async function getAllCountriesApi(queryObject?: {
  [key: string]: string | number;
}) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/countries/list`,
    {
      params: queryObject,
    }
  );

  return data as {
    content: CountryAddress[];
    totalPages: number;
    pageable: { pageNumber: number };
  };
}

// Get All Cities
export async function getAllCitiesApi(queryObject?: {
  [key: string]: string | number;
}) {
  const { data } = await customFetch.get(`${API_END_POINT_URL}/cities/list`, {
    params: queryObject,
  });

  return data as {
    content: CityAddress[];
    totalPages: number;
    pageable: { pageNumber: number };
  };
}

// Get All Cities
export async function getCitiesForSearch(queryObject?: {
  [key: string]: string | number;
}) {
  const { data } = await customFetch.get(`/api/salamwebbff/discovery/cities`, {
    params: queryObject,
  });

  return data as {
    content: CityAddress[];
    totalPages: number;
    pageable: { pageNumber: number };
  };
}

// Get Country By Id
export async function getCountryAddressApi(countryId: string) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/countries/${countryId}`
  );

  return data as CountryAddress;
}

// Get City By Id
export async function getCityAddressApi(cityId: string) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/cities/${cityId}`
  );

  return data as CityAddress;
}

// Get Active city Populated Places
export async function getCityActivePopulatedPlacesApi(cityId: string) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/populated-places/city/${cityId}/active`
  );

  return data as PopulatedPlace[];
}
