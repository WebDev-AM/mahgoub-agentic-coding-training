import { useSearchParams } from "react-router-dom";
import chaletsHeader1 from "../../assets/images/placeholder.svg";
import chaletsHeader2 from "../../assets/images/placeholder.svg";
import { FilterDispatchAction } from "../../types/FilterTypes";
import { Dispatch, useEffect } from "react";
import SearchUnits from "./SearchUnits";

type UnitsHeaderProps = {
  filtersDispatch: Dispatch<FilterDispatchAction>;
};

function UnitsHeader({ filtersDispatch }: UnitsHeaderProps) {
  const [searchParams] = useSearchParams();

  /* ----------------------------------
     URL Values (Applied)
  ---------------------------------- */
  const search = searchParams.get("search") ?? "";
  const city = searchParams.get("city") ?? "";
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const numberOfGuests = searchParams.get("numberOfGuests") ?? "";

  useEffect(() => {
    filtersDispatch({
      type: "SET_FROM_URL",
      payload: {
        search,
        city,
        start: checkIn,
        end: checkOut,
        numberOfGuests,
      },
    });
  }, [search, checkIn, checkOut, city, numberOfGuests, filtersDispatch]);
  /* ----------------------------------
     Apply Button Handler
  ---------------------------------- */

  return (
    <div className="relative flex h-100 items-center justify-center border-b border-[#D7D9D9] lg:h-70">
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
        <SearchUnits />
        {/* end search chalets component  */}
      </div>
    </div>
  );
}

export default UnitsHeader;
