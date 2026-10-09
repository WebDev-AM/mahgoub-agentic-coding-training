import { t } from "i18next";
import PageSpinner from "../../../ui/PageSpinner";
import OrdersWrapper from "./OrdersWrapper";
import Pagination from "../../../ui/Pagination";
import { useMyOngoingOrders } from "./useMyOngoingOrders";
import EmptyState from "../../../ui/EmptyState";
import { MdOutlineLocalShipping } from "react-icons/md";

function OngoingOrders() {
  const { orders, isLoading, totalPages, pageNumber, filtersDispatch } =
    useMyOngoingOrders();

  if (isLoading) {
    return <PageSpinner />;
  }
  if (!orders?.length) {
    return (
      <EmptyState
        icon={<MdOutlineLocalShipping />}
        title={t("No Ongoing orders")}
        description={t(
          "When you have active orders in progress, you will see their latest status updates here in one place."
        )}
        buttonText={t("Go Back")}
        buttonDirection="backward"
      />
    );
  }
  return (
    <div className="flex flex-col gap-6">
      <OrdersWrapper orders={orders} completedOrder={false} />
      {totalPages > 1 && (
        <Pagination
          page={pageNumber}
          totalPages={totalPages}
          filtersDispatch={filtersDispatch}
        />
      )}
    </div>
  );
}

export default OngoingOrders;
