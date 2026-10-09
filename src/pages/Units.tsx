import { Dispatch } from "react";
import { useFunctionDebounce } from "../hooks/useDebounce";
import { FilterDispatchAction } from "../types/FilterTypes";
import UnitsHeader from "../features/units/UnitsHeader";
import FilterSidebar from "../features/units/FilterSidebar";
import Pagination from "../ui/Pagination";
import { useUnits } from "../features/units/useUnits";
import UnitsWrapper from "../features/units/UnitsWrapper";

function Chalets() {
  const { isLoading, units, filtersDispatch, pageNumber, totalPages } =
    useUnits();

  const debouncedFiltersDispatch: Dispatch<FilterDispatchAction> =
    useFunctionDebounce((action: FilterDispatchAction) => {
      filtersDispatch(action);
    }, 600);

  return (
    <>
      <UnitsHeader filtersDispatch={filtersDispatch} />
      <div className="lg:gap-spacing-y pb-spacing-y lg:py-spacing-y container-fix relative container flex flex-col lg:pb-0">
        <div className="items-start gap-5 p-4 lg:flex">
          <FilterSidebar filtersDispatch={debouncedFiltersDispatch} />
          <UnitsWrapper
            units={units}
            isLoading={isLoading}
            allowThree={false}
          />
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

export default Chalets;
