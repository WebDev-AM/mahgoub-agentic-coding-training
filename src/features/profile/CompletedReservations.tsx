import { t } from "i18next";
import ChaletReservationCard from "./ChaletReservationCard";
import HotelReservationCard from "./HotelReservationCard";
import PageSpinner from "../../ui/PageSpinner";
import { useState } from "react";
import { useCompletedReservations } from "../reservation/useCompletedReservations";
import EmptyState from "../../ui/EmptyState";
import { MdOutlineEventAvailable } from "react-icons/md";
import { BookingReservationItem } from "../../types/reservation/ReservationsSchema";

const getReservationKey = (item: BookingReservationItem) =>
  item.group
    ? (item.groupReservation?.uuid ?? item.createdAt)
    : (item.reservation?.uuid ?? item.createdAt);

function CompletedReservations() {
  const [page, setPage] = useState(0);

  const { reservations, totalPages, pageNumber, isLoading } =
    useCompletedReservations({
      page,
      size: 4,
    });

  if (isLoading)
    return (
      <div className="justify-ceter flex h-100 items-center">
        <PageSpinner />
      </div>
    );

  if (!reservations?.length)
    return (
      <EmptyState
        icon={<MdOutlineEventAvailable />}
        title={t("No completed reservations")}
        description={t(
          "After you finish your booked stays, they will appear here so you can revisit all completed reservation details."
        )}
        buttonText={t("Explore Units")}
        buttonPath="/units"
        buttonDirection="forward"
      />
    );

  const goNext = () => {
    if ((totalPages ?? 0) === 0) return;
    if ((pageNumber ?? page) + 1 < (totalPages ?? 0)) setPage(page + 1);
  };

  const goPrev = () => {
    if ((pageNumber ?? page) > 0) setPage(Math.max(0, page - 1));
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-8">
        {reservations?.map((item) => {
          if (item.group && item.groupReservation) {
            return (
              <div key={getReservationKey(item)}>
                <HotelReservationCard reservation={item.groupReservation} />
              </div>
            );
          }

          if (!item.group && item.reservation) {
            return (
              <div key={getReservationKey(item)}>
                <ChaletReservationCard reservation={item.reservation} />
              </div>
            );
          }

          return null;
        })}
      </div>
      {/* simple pager */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={goPrev}
          disabled={(pageNumber ?? page) <= 0}
          className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
        >
          {t("Prev")}
        </button>
        <span>
          {(pageNumber ?? page) + 1} / {totalPages ?? 1}
        </span>
        <button
          onClick={goNext}
          disabled={(pageNumber ?? page) + 1 >= (totalPages ?? 1)}
          className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
        >
          {t("Next")}
        </button>
      </div>
    </>
  );
}

export default CompletedReservations;
