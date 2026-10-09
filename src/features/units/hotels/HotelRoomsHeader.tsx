import { useSearchParams } from "react-router-dom";
import chaletsHeader1 from "../../../assets/images/chaletsHeader1.png";
import chaletsHeader2 from "../../../assets/images/chaletsHeader2.png";
import { FilterDispatchAction } from "../../../types/FilterTypes";
import { Dispatch, useEffect } from "react";
import SearchHotelRooms from "./SearchHotelRooms";

type HotelRoomsHeaderProps = {
  filtersDispatch: Dispatch<FilterDispatchAction>;
};

function HotelRoomsHeader({ filtersDispatch }: HotelRoomsHeaderProps) {
  const [searchParams] = useSearchParams();

  /* ----------------------------------
     URL Values (Applied)
  ---------------------------------- */
  const search = searchParams.get("search") ?? "";
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const numberOfGuests = searchParams.get("numberOfGuests") ?? "";
  useEffect(() => {
    filtersDispatch({
      type: "SET_FROM_URL",
      payload: {
        search,
        start: checkIn,
        end: checkOut,
        numberOfGuests,
      },
    });
  }, [search, checkIn, checkOut, numberOfGuests, filtersDispatch]);
  /* ----------------------------------
     Apply Button Handler
  ---------------------------------- */

  return (
    <div className="relative flex h-70 items-center justify-center border-b border-[#D7D9D9]">
      <img
        src={chaletsHeader1}
        className="absolute bottom-0 left-0 h-[60%] object-cover sm:h-[100%]"
      />
      <img
        src={chaletsHeader2}
        className="absolute right-0 bottom-0 h-[45%] object-cover sm:h-[70%]"
      />

      <div className="container-fix z-1 container flex flex-col items-center gap-4">
        {/* start search chalets component  */}
        <SearchHotelRooms />
        {/* end search chalets component  */}
      </div>
    </div>
  );
}

export default HotelRoomsHeader;
