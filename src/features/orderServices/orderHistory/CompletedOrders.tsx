import { t } from "i18next";
import PageSpinner from "../../../ui/PageSpinner";
import Pagination from "../../../ui/Pagination";
import OrdersWrapper from "./OrdersWrapper";
import { useMyOrders } from "./useMyOrders";
import EmptyState from "../../../ui/EmptyState";
import { MdOutlineReceiptLong } from "react-icons/md";

function CompletedOrders() {
  const { orders, isLoading, totalPages, pageNumber, filtersDispatch } =
    useMyOrders();

  if (isLoading) {
    return <PageSpinner />;
  }
  if (!orders?.length) {
    return (
      <EmptyState
        icon={<MdOutlineReceiptLong />}
        title={t("No orders yet")}
        description={t(
          "Once you place and complete orders, they will be listed here with all details so you can review them anytime."
        )}
        buttonText={t("Browse Services")}
        buttonPath="/services"
        buttonDirection="forward"
      />
    );
  }
  return (
    <div className="flex flex-col gap-6">
      <OrdersWrapper orders={orders} completedOrder={true} />
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

export default CompletedOrders;
