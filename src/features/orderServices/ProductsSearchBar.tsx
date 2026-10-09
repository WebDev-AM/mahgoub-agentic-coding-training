import { InputAdornment, TextField } from "@mui/material";
import { t } from "i18next";
import { ChangeEvent } from "react";
import { BiSearch } from "react-icons/bi";

type ProductsSearchBarProps = {
  onSearchChange: (searchTerm: string) => void;
  backgroundText?: string;
};

function ProductsSearchBar({
  onSearchChange,
  backgroundText,
}: ProductsSearchBarProps) {
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="xs:flex-row container-fix container flex flex-col items-center justify-between gap-4 py-6 lg:h-30">
      <h3 className="font-bold lg:text-2xl">{backgroundText}</h3>
      {/* Search Input */}
      <TextField
        placeholder={t("Search")}
        size="small"
        className="!min-w-50 rounded-full bg-white"
        onChange={handleSearch}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <BiSearch />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "9999px",
          },
        }}
      />
    </div>
  );
}

export default ProductsSearchBar;
