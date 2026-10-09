import { Dispatch } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FilterDispatchAction } from "../types/FilterTypes";

interface PaginationProps {
  page: number; // 0-indexed
  totalPages: number;
  displayPage?: boolean;
  filtersDispatch: Dispatch<FilterDispatchAction>;
}

export default function Pagination({
  page,
  totalPages,
  displayPage = false,
  filtersDispatch,
}: PaginationProps) {
  const isFirstPage = page === 0;
  const isLastPage = page === totalPages - 1;

  const handlePrev = () => {
    if (!isFirstPage) {
      filtersDispatch({ type: "SET_PAGE", payload: page - 1 });
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      filtersDispatch({ type: "SET_PAGE", payload: page + 1 });
    }
  };

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <button
        onClick={handlePrev}
        disabled={isFirstPage}
        className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 ${isFirstPage ? "cursor-not-allowed opacity-50" : ""}`}
        aria-label="Previous Page"
      >
        <FaChevronLeft size={20} />
      </button>

      {displayPage && (
        <span className="text-2xl font-semibold">{page + 1}</span>
      )}

      <button
        onClick={handleNext}
        disabled={isLastPage}
        className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-gray-300 transition hover:bg-gray-100 ${isLastPage ? "cursor-not-allowed opacity-50" : ""}`}
        aria-label="Next Page"
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  );
}
