import { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { t } from "i18next";
import { useFunctionDebounce } from "../../hooks/useDebounce";
import { useCityAddresses } from "./useCityAddresses";
import { useCityAddress } from "./useCityAddress";

const MIN_SEARCH_LENGTH = 2;

function SelectCity({
  onSelect,
  value,
  variant = "standard",
  error,
  helperText,
}: {
  onSelect: (id: string) => void;
  value?: string;
  variant?: "standard" | "outlined" | "filled";
  error?: boolean;
  helperText?: string;
}) {
  const [search, setSearch] = useState("");
  const isSearchValid = search.trim().length >= MIN_SEARCH_LENGTH;

  const debouncedSearch = useFunctionDebounce((searchValue: string) => {
    const trimmedValue = searchValue.trim();
    setSearch(trimmedValue.length >= MIN_SEARCH_LENGTH ? trimmedValue : "");
  });

  const { isLoading, cityAddresses } = useCityAddresses(
    { search: isSearchValid ? search : undefined },
    isSearchValid
  );
  const { cityAddress } = useCityAddress(value);

  return (
    <Autocomplete
      fullWidth
      open={isSearchValid && cityAddresses.length > 0}
      loading={isLoading}
      options={isSearchValid ? cityAddresses : []}
      onInputChange={(_, value) => debouncedSearch(value)}
      getOptionLabel={(option) => `${option.nameEn} - ${option.nameAr}`}
      isOptionEqualToValue={(option, value) => option.cityId === value.cityId}
      value={cityAddress ?? null}
      filterOptions={(options) => options}
      slotProps={{
        paper: {
          sx: {
            width: 350,
          },
        },
      }}
      size="small"
      onChange={(_, newValue) => {
        onSelect(newValue?.cityId || "");
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant={variant}
          size="small"
          placeholder={t("Select City")}
          label={t("Select City")}
          error={error}
          helperText={helperText}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ "& input": { color: "#666" } }}
        />
      )}
      renderOption={(props, option) => {
        props.key = option.cityId;
        const { key, ...rest } = props;

        return (
          <li key={key} {...rest}>
            {option.nameEn} - {option.nameAr}
          </li>
        );
      }}
    />
  );
}

export default SelectCity;
