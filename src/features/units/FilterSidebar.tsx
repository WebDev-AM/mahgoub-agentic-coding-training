import { Button, Drawer, IconButton, Slider } from "@mui/material";
import { t } from "i18next";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import { BiFilter } from "react-icons/bi";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { FilterDispatchAction } from "../../types/FilterTypes";
import { useCityPopulatedPlaces } from "../address/useCityPopulatedPlaces";
import { useSidebarFilters } from "./useSidebarFilters";
import FilterSection from "./FilterSection";
import { FaFilter } from "react-icons/fa6";

type FilterSidebarProps = {
  filtersDispatch: React.Dispatch<FilterDispatchAction>;
};

function FilterSidebar({ filtersDispatch }: FilterSidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const {
    filters,
    handleFilterChange,
    handleRangeChange,
    handleSelectFilterToggle,
    handleReset,
    handleCountChange,
    resetAllAmenities,
    resetExperienceVibes,
    resetNearbyLocations,
    resetNearbyPopulatedPlaces,
    resetAllFilters,
    typeOptions,
    viewOptions,
    experienceVibesOptions,
    nearbyLocationOptions,
    priceOptions,
    amenitiesKeys,
    MIN_PRICE,
    MAX_PRICE,
  } = useSidebarFilters(filtersDispatch);

  const [searchParams] = useSearchParams();
  const city = searchParams.get("city") ?? "";
  const { populatedPlaces, isLoading } = useCityPopulatedPlaces(city);

  const selectedNearbyPopulatedPlace = populatedPlaces.find(
    (option) => option.populatedPlaceId === filters.nearbyPopulatedPlaces
  );

  const getOptionKey = (
    value: string,
    options?: { value: string; key: string }[]
  ) => {
    if (!value) return "";
    if (!options) return value;

    const found = options.find((o) => o.value === value);
    return found ? found.key : value;
  };

  const activeFilters = [
    filters.type ? getOptionKey(filters.type, typeOptions) : "",
    filters.view ? getOptionKey(filters.view, viewOptions) : "",
    filters.experienceVibes
      ? getOptionKey(filters.experienceVibes, experienceVibesOptions)
      : "",
    filters.nearbyLocations
      ? getOptionKey(filters.nearbyLocations, nearbyLocationOptions)
      : "",
    filters.nearbyPopulatedPlaces && selectedNearbyPopulatedPlace
      ? selectedNearbyPopulatedPlace.nameEn ||
        selectedNearbyPopulatedPlace.nameAr
      : "",
    filters.minPrice ? "minPrice" : "",
    filters.maxPrice ? "maxPrice" : "",
    ...amenitiesKeys
      .filter((key) => filters[key])
      .map((key) => `${key}: ${filters[key]}`),
  ].filter(Boolean);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="bg-primary flex items-center justify-between px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <FaFilter />
          <span className="text-[17px] font-semibold">{t("Filters")}</span>
        </div>

        <Button
          size="small"
          sx={{
            color: "#fff",
            textTransform: "none",
            minWidth: "unset",
            p: 0,
          }}
          onClick={resetAllFilters}
        >
          {t("Reset all")}
        </Button>

        <div className="lg:hidden">
          <IconButton
            sx={{ color: "#fff" }}
            onClick={() => toggleDrawer(false)}
          >
            <FaTimes />
          </IconButton>
        </div>
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Property Details */}
        <FilterSection title={t("Property & stay details")}>
          <div className="space-y-6">
            {/* Type */}
            <div>
              <p className="mb-3 text-xs text-gray-500">{t("Property type")}</p>

              <div className="grid grid-cols-3 gap-2">
                {typeOptions.map((option) => {
                  const active = filters.type === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={chipClass(active)}
                      onClick={() =>
                        handleFilterChange("type", active ? "" : option.value)
                      }
                    >
                      {t(option.key)}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Counters */}
            <div className="mt-5 space-y-2">
              {amenitiesKeys.map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-1"
                >
                  <span className="text-sm text-gray-700">{t(key)}</span>

                  <div className="flex items-center gap-3">
                    <button
                      className="text-sky-600"
                      onClick={() => handleCountChange(key, -1)}
                    >
                      <FaMinus size={10} />
                    </button>

                    <span className="w-5 text-center text-sm">
                      {filters[key] || 0}
                    </span>

                    <button
                      className="text-sky-600"
                      onClick={() => handleCountChange(key, 1)}
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Button
                size="small"
                onClick={resetAllAmenities}
                disabled={!amenitiesKeys.some((key) => filters[key])}
              >
                {t("Reset Amenities")}
              </Button>
            </div>
          </div>
        </FilterSection>

        {/* View */}
        <FilterSection title={t("View")}>
          <div className="grid grid-cols-2 gap-2">
            {viewOptions.map((option) => {
              const active = filters.view === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={chipClass(active)}
                  onClick={() =>
                    handleFilterChange("view", active ? "" : option.value)
                  }
                >
                  {t(option.key)}
                </button>
              );
            })}
          </div>
        </FilterSection>

        <FilterSection title={t("Nearby Locations")}>
          <div className="grid grid-cols-2 gap-2">
            {nearbyLocationOptions.map((option) => {
              const active = filters.nearbyLocations === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={chipClass(active)}
                  onClick={() =>
                    handleSelectFilterToggle("nearbyLocations", option.value)
                  }
                >
                  {t(option.key)}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {city && (
          <FilterSection title={t("Nearby Populated Places")}>
            <div className="grid grid-cols-1 gap-2">
              {isLoading ? (
                <span className="text-sm text-gray-500">
                  {t("Loading nearby places...")}
                </span>
              ) : populatedPlaces.length === 0 ? (
                <span className="text-sm text-gray-500">
                  {t("No nearby places found")}
                </span>
              ) : (
                populatedPlaces.map((option) => {
                  const active =
                    filters.nearbyPopulatedPlaces === option.populatedPlaceId;

                  return (
                    <button
                      key={option.populatedPlaceId}
                      type="button"
                      className={chipClass(active)}
                      onClick={() =>
                        handleSelectFilterToggle(
                          "nearbyPopulatedPlaces",
                          option.populatedPlaceId
                        )
                      }
                    >
                      {option.nameEn || option.nameAr}
                    </button>
                  );
                })
              )}
            </div>
          </FilterSection>
        )}

        {/* Prices */}
        <FilterSection title={t("Price & offers")}>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">{t("Price Range")}</span>

              <Button
                size="small"
                disabled={!filters.minPrice && !filters.maxPrice}
                onClick={() => {
                  handleReset("minPrice");
                  handleReset("maxPrice");
                }}
              >
                {t("Reset")}
              </Button>
            </div>

            <div className="mb-2 flex justify-between text-sm text-gray-500">
              <span>
                {filters.minPrice || MIN_PRICE} {t("KWD")}
              </span>

              <span>
                {filters.maxPrice || MAX_PRICE} {t("KWD")}
              </span>
            </div>

            <Slider
              value={[
                Number(filters.minPrice || MIN_PRICE),
                Number(filters.maxPrice || MAX_PRICE),
              ]}
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={1}
              onChange={(_, value) => {
                const [min, max] = value as number[];
                handleRangeChange(min, max);
              }}
              valueLabelDisplay="auto"
              sx={sliderStyles}
            />
          </div>
        </FilterSection>
        <FilterSection title={t("Experience Vibes")}>
          <div className="grid grid-cols-2 gap-2">
            {experienceVibesOptions.map((option) => {
              const active = filters.experienceVibes === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={chipClass(active)}
                  onClick={() =>
                    handleSelectFilterToggle("experienceVibes", option.value)
                  }
                >
                  {t(option.key)}
                </button>
              );
            })}
          </div>
        </FilterSection>
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <FilterSection title={t("Active filters")}>
            <div className="flex flex-col gap-2">
              {filters.nearbyLocations && (
                <button
                  onClick={resetNearbyLocations}
                  className="rounded-md border border-sky-400 bg-sky-50 px-2 py-1 text-[12px] text-sky-600"
                >
                  {t(
                    getOptionKey(filters.nearbyLocations, nearbyLocationOptions)
                  )}{" "}
                  ×
                </button>
              )}
              {filters.nearbyPopulatedPlaces &&
                selectedNearbyPopulatedPlace && (
                  <button
                    onClick={resetNearbyPopulatedPlaces}
                    className="rounded-md border border-sky-400 bg-sky-50 px-2 py-1 text-[12px] text-sky-600"
                  >
                    {selectedNearbyPopulatedPlace.nameEn ||
                      selectedNearbyPopulatedPlace.nameAr}{" "}
                    ×
                  </button>
                )}
              {filters.experienceVibes && (
                <button
                  onClick={resetExperienceVibes}
                  className="rounded-md border border-sky-400 bg-sky-50 px-2 py-1 text-[12px] text-sky-600"
                >
                  {t(
                    getOptionKey(
                      filters.experienceVibes,
                      experienceVibesOptions
                    )
                  )}{" "}
                  ×
                </button>
              )}
              {filters.type && (
                <button
                  onClick={() => handleReset("type")}
                  className="rounded-md border border-sky-400 bg-sky-50 px-2 py-1 text-[12px] text-sky-600"
                >
                  {t(getOptionKey(filters.type, typeOptions))} ×
                </button>
              )}

              {filters.view && (
                <button
                  onClick={() => handleReset("view")}
                  className="rounded-md border border-sky-400 bg-sky-50 px-2 py-1 text-[12px] text-sky-600"
                >
                  {t(getOptionKey(filters.view, viewOptions))} ×
                </button>
              )}

              {priceOptions.map(({ key, label }) =>
                filters[key] ? (
                  <button
                    key={key}
                    onClick={() => handleReset(key)}
                    className="rounded-md border border-sky-400 bg-sky-50 px-2 py-1 text-[12px] text-sky-600"
                  >
                    {t(label)} ({filters[key]}) ×
                  </button>
                ) : null
              )}

              {amenitiesKeys.map((key) =>
                filters[key] ? (
                  <button
                    key={key}
                    onClick={() => handleReset(key)}
                    className="rounded-md border border-sky-400 bg-sky-50 px-2 py-1 text-[12px] text-sky-600"
                  >
                    {t(key)} ({filters[key]}) ×
                  </button>
                ) : null
              )}
            </div>
          </FilterSection>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Button */}
      <div className="mx-2 mb-4 lg:hidden">
        <Button
          variant="outlined"
          onClick={() => toggleDrawer(true)}
          startIcon={<BiFilter size={20} />}
        >
          {t("Filters")}
        </Button>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        sx={{
          display: {
            xs: "block",
            lg: "none",
          },

          "& .MuiDrawer-paper": {
            width: 320,
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop */}
      <div className="hidden min-w-[300px] lg:block">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {sidebarContent}
        </div>
      </div>
    </>
  );
}

export default FilterSidebar;

const chipClass = (active: boolean) =>
  `
  rounded-md
  border
  px-3
  py-1.5
  text-[13px]
  transition
  ${
    active
      ? "border-sky-500 bg-sky-50 text-sky-600"
      : "border-gray-300 bg-[#f5f5f5] text-gray-600"
  }
`;

const sliderStyles = {
  color: "#1694d7",

  "& .MuiSlider-thumb": {
    width: 18,
    height: 18,
    backgroundColor: "#fff",
    border: "3px solid #1694d7",
  },

  "& .MuiSlider-track": {
    height: 4,
  },

  "& .MuiSlider-rail": {
    height: 4,
    backgroundColor: "#ddd",
  },
};
