import { useState, Dispatch } from "react";
import { FilterDispatchAction } from "../../types/FilterTypes";

export type FilterKey =
  | "type"
  | "view"
  | "minPrice"
  | "maxPrice"
  | "rooms"
  | "beds"
  | "bathrooms"
  | "kitchens"
  | "pools"
  | "experienceVibes"
  | "nearbyLocations"
  | "nearbyPopulatedPlaces";

export type FiltersState = {
  type: string;
  view: string;
  minPrice: string;
  maxPrice: string;
  rooms: string;
  beds: string;
  bathrooms: string;
  kitchens: string;
  pools: string;

  experienceVibes: string;
  nearbyLocations: string;
  nearbyPopulatedPlaces: string;
};

const MIN_PRICE = 0;
const MAX_PRICE = 500;

export const typeOptions = [
  { value: "CHALET", key: "Chalet" },
  { value: "FLOOR", key: "Floor" },
  { value: "VILLA", key: "Villa" },
  { value: "APARTMENT", key: "Apartment" },
  { value: "HOTEL", key: "Hotel" },
];

export const viewOptions = [
  { value: "SEA", key: "Sea" },
  { value: "POOL", key: "Pool" },
  { value: "STREET", key: "Street" },
  { value: "GARDEN", key: "Garden" },
];

export const experienceVibesOptions = [
  { value: "ROMANTIC", key: "Romantic" },
  { value: "FAMILY", key: "Family" },
  { value: "ADVENTURE", key: "Adventure" },
  { value: "LUXURY", key: "Luxury" },
  { value: "RELAXATION", key: "Relaxation" },
  { value: "PARTY", key: "Party" },
  { value: "BUSINESS", key: "Business" },
  { value: "BEACH", key: "Beach" },
  { value: "NATURE", key: "Nature" },
  { value: "CULTURAL", key: "Cultural" },
];

export const nearbyLocationOptions = [
  { value: "SEA", key: "Sea" },
  { value: "NILE", key: "Nile" },
  { value: "RIVER", key: "River" },
  { value: "LAKE", key: "Lake" },
  { value: "MALL", key: "Mall" },
  { value: "MOUNTAIN", key: "Mountain" },
  { value: "FOREST", key: "Forest" },
  { value: "DESERT", key: "Desert" },
];

export const priceOptions = [
  { key: "minPrice" as const, label: "Minimum Price" },
  { key: "maxPrice" as const, label: "Maximum Price" },
];

export const amenitiesKeys = [
  "rooms",
  "beds",
  "bathrooms",
  "kitchens",
  "pools",
] as const;

type AmenityKey = (typeof amenitiesKeys)[number];

export function useSidebarFilters(
  filtersDispatch: Dispatch<FilterDispatchAction>
) {
  const INITIAL_FILTERS: FiltersState = {
    type: "",
    view: "",
    minPrice: "",
    maxPrice: "",
    rooms: "",
    beds: "",
    bathrooms: "",
    kitchens: "",
    pools: "",

    experienceVibes: "",
    nearbyLocations: "",
    nearbyPopulatedPlaces: "",
  };

  const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS);

  const handleFilterChange = (
    key: Exclude<FilterKey, "experienceVibes" | "nearbyLocations">,
    value: string | number
  ) => {
    const stringValue = value === "" ? "" : String(value);

    setFilters((prev) => ({
      ...prev,
      [key]: stringValue,
    }));

    filtersDispatch({
      type: "ADD_FILTERS",
      payload: {
        key,
        operator: "=",
        value: stringValue,
      },
    });
  };

  const handleRangeChange = (min: number | string, max: number | string) => {
    const minNum = Number(min);
    const maxNum = Number(max);

    // Treat default bounds as "no filter"
    const minValue = min === "" || minNum === MIN_PRICE ? "" : String(minNum);
    const maxValue = max === "" || maxNum === MAX_PRICE ? "" : String(maxNum);

    // Update local state once
    setFilters((prev) => ({
      ...prev,
      minPrice: minValue,
      maxPrice: maxValue,
    }));

    // Dispatch both filters in a single batched action (empty string clears the filter)
    filtersDispatch({
      type: "ADD_FILTERS_BATCH",
      payload: [
        { key: "minPrice", operator: "=", value: minValue },
        { key: "maxPrice", operator: "=", value: maxValue },
      ],
    });
  };

  const handleSelectFilterToggle = (
    key: "experienceVibes" | "nearbyLocations" | "nearbyPopulatedPlaces",
    value: string
  ) => {
    const updatedValue = filters[key] === value ? "" : value;

    setFilters((prev) => ({
      ...prev,
      [key]: updatedValue,
    }));

    filtersDispatch({
      type: "ADD_FILTERS",
      payload: {
        key,
        operator: "=",
        value: updatedValue,
      },
    });
  };

  const handleReset = (
    key: Exclude<FilterKey, "experienceVibes" | "nearbyLocations">
  ) => {
    handleFilterChange(key, "");
  };

  const handleCountChange = (key: AmenityKey, delta: number) => {
    const current = Number(filters[key]) || 0;
    const newValue = Math.max(current + delta, 0);

    handleFilterChange(key, newValue === 0 ? "" : newValue);
  };

  const resetAllAmenities = () => {
    filtersDispatch({
      type: "RESET_AMENITIES",
    });

    setFilters((prev) => ({
      ...prev,
      rooms: "",
      beds: "",
      bathrooms: "",
      kitchens: "",
      pools: "",
    }));
  };

  const resetExperienceVibes = () => {
    setFilters((prev) => ({
      ...prev,
      experienceVibes: "",
    }));

    filtersDispatch({
      type: "ADD_FILTERS",
      payload: {
        key: "experienceVibes",
        operator: "=",
        value: "",
      },
    });
  };

  const resetNearbyLocations = () => {
    setFilters((prev) => ({
      ...prev,
      nearbyLocations: "",
    }));

    filtersDispatch({
      type: "ADD_FILTERS",
      payload: {
        key: "nearbyLocations",
        operator: "=",
        value: "",
      },
    });
  };

  const resetNearbyPopulatedPlaces = () => {
    setFilters((prev) => ({
      ...prev,
      nearbyPopulatedPlaces: "",
    }));

    filtersDispatch({
      type: "ADD_FILTERS",
      payload: {
        key: "nearbyPopulatedPlaces",
        operator: "=",
        value: "",
      },
    });
  };

  const resetAllFilters = () => {
    // Clear local UI state
    setFilters(INITIAL_FILTERS);

    // Clear global filter params used by the data layer
    filtersDispatch({
      type: "RESET_FILTERS",
    });
  };

  return {
    filters,
    setFilters,

    handleFilterChange,
    handleRangeChange,
    handleSelectFilterToggle,
    handleReset,
    handleCountChange,

    resetAllAmenities,
    resetExperienceVibes,
    resetNearbyLocations,
    resetNearbyPopulatedPlaces,

    typeOptions,
    viewOptions,
    experienceVibesOptions,
    nearbyLocationOptions,
    priceOptions,
    amenitiesKeys,
    resetAllFilters,
    MIN_PRICE,
    MAX_PRICE,
  };
}
