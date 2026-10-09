// SearchUnits.tsx
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LuUsersRound } from "react-icons/lu";
import { BiSearch } from "react-icons/bi";
import { t } from "i18next";
import { IoCalendarOutline } from "react-icons/io5";
import dayjs, { Dayjs } from "dayjs";
import SelectCityForSearch from "../address/SelectCityForSearch";

const SearchUnits = () => {
  const today = dayjs().startOf("day");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") || "");
  const [numberOfGuests, setNumberOfGuests] = useState(
    searchParams.get("numberOfGuests") || ""
  );
  const [checkInStr, setCheckInStr] = useState(
    searchParams.get("checkIn") || ""
  );
  const [checkOutStr, setCheckOutStr] = useState(
    searchParams.get("checkOut") || ""
  );

  const checkInDate = checkInStr ? dayjs(checkInStr) : null;
  const checkOutDate = checkOutStr ? dayjs(checkOutStr) : null;

  const [openCheckIn, setOpenCheckIn] = useState(false);
  const [openCheckOut, setOpenCheckOut] = useState(false);

  const handleCheckInChange = (date: Dayjs | null) => {
    setCheckInStr(date ? date.format("YYYY-MM-DD") : "");
  };

  const handleCheckOutChange = (date: Dayjs | null) => {
    setCheckOutStr(date ? date.format("YYYY-MM-DD") : "");
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (city) params.append("city", city);
    if (checkInStr) params.append("checkIn", checkInStr);
    if (checkOutStr) params.append("checkOut", checkOutStr);
    if (numberOfGuests) params.append("numberOfGuests", numberOfGuests);

    navigate(`/units?${params.toString()}`);
  };

  const hasExistingDates =
    !!searchParams.get("checkIn") || !!searchParams.get("checkOut");

  return (
    <div className="flex w-full flex-col gap-4 rounded-3xl border border-gray-300 bg-white p-4 shadow-md sm:flex-row sm:flex-wrap sm:items-center sm:p-5">
      {/* City */}
      <div className="flex w-full items-center gap-3 sm:w-[260px]">
        <div className="bg-brand-blue-light text-brand-blue-shade flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl">
          <BiSearch />
        </div>

        <div className="flex-1">
          <SelectCityForSearch value={city} onSelect={(id) => setCity(id)} />
        </div>
      </div>

      {/* Guests */}
      <div className="flex w-full items-center gap-3 sm:w-[260px]">
        <div className="bg-brand-blue-light text-brand-blue-shade flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl">
          <LuUsersRound />
        </div>

        <TextField
          fullWidth
          label={t("Number Of Guests")}
          variant="standard"
          size="small"
          placeholder={t("Guests")}
          value={numberOfGuests}
          type="number"
          onChange={(e) => setNumberOfGuests(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
      </div>

      {/* Check-in */}
      <div className="flex w-full items-center gap-3 sm:w-[260px]">
        <div className="bg-brand-blue-light text-brand-blue-shade flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl">
          <IoCalendarOutline />
        </div>

        <DatePicker
          label={t("Check-in")}
          format="DD-MM-YYYY"
          value={checkInDate}
          onChange={handleCheckInChange}
          open={openCheckIn}
          onOpen={() => setOpenCheckIn(true)}
          onClose={() => setOpenCheckIn(false)}
          minDate={today}
          maxDate={checkOutDate ? checkOutDate.subtract(1, "day") : undefined}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: "standard",
              size: "small",
              placeholder: t("YYYY/MM/DD"),
              InputLabelProps: { shrink: true },
              onClick: () => setOpenCheckIn(true),
              inputProps: {
                readOnly: true,
              },
            },
          }}
        />
      </div>

      {/* Check-out + Button */}
      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
        {/* Check-out */}
        <div className="flex w-full items-center gap-3 sm:w-[260px]">
          <div className="bg-brand-blue-light text-brand-blue-shade flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl">
            <IoCalendarOutline />
          </div>

          <DatePicker
            label={t("Check-out")}
            format="DD-MM-YYYY"
            value={checkOutDate}
            onChange={handleCheckOutChange}
            open={openCheckOut}
            onOpen={() => setOpenCheckOut(true)}
            onClose={() => setOpenCheckOut(false)}
            minDate={checkInDate ? checkInDate.add(1, "day") : today}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "standard",
                size: "small",
                placeholder: t("YYYY/MM/DD"),
                InputLabelProps: { shrink: true },
                onClick: () => setOpenCheckOut(true),
                inputProps: {
                  readOnly: true,
                },
              },
            }}
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-primary hover:bg-primary-shade flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-medium text-white transition sm:h-auto sm:w-auto sm:px-4 sm:py-3"
        >
          {hasExistingDates ? t("Modify") : <BiSearch className="text-2xl" />}
        </button>
      </div>
    </div>
  );
};

export default SearchUnits;
