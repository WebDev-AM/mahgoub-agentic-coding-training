import { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { t } from "i18next";
import { useFunctionDebounce } from "../../hooks/useDebounce";
import { useCountryAddresses } from "./useCountryAddresses";
import { useCountryAddress } from "./useCountryAddress";

function SelectCountry({
  onSelect,
  value,
}: {
  onSelect: (id: string) => void;
  value?: string;
}) {
  const [search, setSearch] = useState("");

  const debouncedSearch = useFunctionDebounce((searchValue: string) =>
    setSearch(searchValue)
  );

  const { isLoading, countryAddresses } = useCountryAddresses({
    search: search || undefined,
  });

  const { countryAddress } = useCountryAddress(value);

  return (
    <Autocomplete
      fullWidth
      loading={isLoading}
      options={countryAddresses || []}
      onInputChange={(_, value) => debouncedSearch(value)}
      getOptionLabel={(option) => `${option.nameEn} - ${option.nameAr}`}
      isOptionEqualToValue={(option, value) =>
        option.countryId === value.countryId
      }
      value={countryAddress || undefined}
      size="small"
      onChange={(_, newValue) => {
        onSelect(newValue?.countryId || "");
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          size="small"
          label={t("Select Country")}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ "& input": { color: "#666" } }}
        />
      )}
      renderOption={(props, option) => {
        props.key = option.countryId;
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

export default SelectCountry;
