// File: HotelRooms.tsx
import { Dispatch, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import HotelRoomsHeader from "../features/units/hotels/HotelRoomsHeader";
import { useRoomGroups } from "../features/units/hotels/useRoomGroups";
import { useFunctionDebounce } from "../hooks/useDebounce";
import { FilterDispatchAction } from "../types/FilterTypes";
import FilterSidebar from "../features/units/FilterSidebar";
import Pagination from "../ui/Pagination";
import RoomsWrapper from "../features/units/hotels/RoomsWrapper";

import { useHotelCartContext } from "../contexts/HotelCartContext";
import { useHotelUuid } from "../features/units/hotels/useHotelUuid";
import SelectedRoomsSummary from "../features/units/hotels/SelectedRoomsSummary";

function HotelRooms() {
  const { isLoading, roomGroups, filtersDispatch, pageNumber, totalPages } =
    useRoomGroups();

  const { hotel } = useHotelUuid();
  const { setHotel, clearRooms } = useHotelCartContext();
  const [searchParams] = useSearchParams();

  // ✅ IMPORTANT: initialize cart here
  useEffect(() => {
    if (!hotel) return;

    setHotel(hotel, {
      checkIn: searchParams.get("checkIn") ?? undefined,
      checkOut: searchParams.get("checkOut") ?? undefined,
      numberOfGuests: searchParams.get("guests")
        ? Number(searchParams.get("guests"))
        : undefined,
    });
    clearRooms();
  }, [hotel, searchParams, setHotel, clearRooms]);

  const debouncedFiltersDispatch: Dispatch<FilterDispatchAction> =
    useFunctionDebounce((action: FilterDispatchAction) => {
      filtersDispatch(action);
    }, 600);

  return (
    <>
      <HotelRoomsHeader filtersDispatch={filtersDispatch} />

      <SelectedRoomsSummary />
      <div className="lg:gap-spacing-y py-spacing-y container-fix relative container flex flex-col">
        <div className="items-start gap-5 lg:flex">
          <FilterSidebar filtersDispatch={debouncedFiltersDispatch} />

          <RoomsWrapper roomGroups={roomGroups} isLoading={isLoading} />
        </div>

        {totalPages > 1 && (
          <Pagination
            page={pageNumber}
            totalPages={totalPages}
            filtersDispatch={filtersDispatch}
          />
        )}
      </div>
    </>
  );
}

export default HotelRooms;
