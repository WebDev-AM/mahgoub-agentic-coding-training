import { t } from "i18next";
import orderSuccessPayment from "../../../assets/images/placeholder.svg";
import { Link, Navigate } from "react-router-dom";
import OrderCard from "../orderHistory/OrderCard";
import { useOrderDetails } from "./useOrderDetails";
import PageSpinner from "../../../ui/PageSpinner";
import { IoCalendarOutline } from "react-icons/io5";
import dayjs from "dayjs";
import { MdEmail, MdPhone } from "react-icons/md";
import { FaUser } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import { Button } from "@mui/material";
import { BiDownload } from "react-icons/bi";
import { GeneratePdfButton } from "../../../ui/GeneratePdfButton";
import OrderInvoicePdf from "./OrderInvoicePdf";
import { fromUTCToLocal } from "../../../utils/dateUtils";
import i18n from "../../../i18n";

function OrderSuccessPayment() {
  const { isLoading, order } = useOrderDetails();

  if (isLoading) return <PageSpinner />;
  if (!order) return <Navigate to={"/"} />;

  return (
    <div className="rel flex flex-col-reverse items-center gap-10 lg:flex-row lg:items-start lg:gap-20">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="h3">
              {t("Order Number")}: {order.orderNumber}
            </h3>
            <p className="mt-2 flex items-center gap-2 text-xl">
              <IoCalendarOutline />
              {dayjs(fromUTCToLocal(order.createdAt))
                .locale(i18n.language)
                .format("MMMM DD, YYYY hh:mm A")}
            </p>
          </div>
          <p className="flex h-10 w-20 items-center justify-center rounded-full bg-[#17C964] text-lg text-white">
            {t("Paid")}
          </p>
        </div>
        <div className="bg-primary-light flex flex-col gap-5 rounded-xl p-5">
          <h3 className="h3">{t("Order Summary")}</h3>
          <div>
            <p className="flex justify-between text-lg font-medium">
              <span className="text-gray-500">{t("Subtotal")}:</span>
              <span className="leading-relaxed tracking-wide">
                {order.totalSubtotal} {t("KWD")}
              </span>
            </p>
            {summaryRow({
              label: "Delivery fees",
              value: order.totalDeliveryFee,
            })}
            {summaryRow({
              label: "Tax",
              value: order.taxAmount,
            })}
            {summaryRow({
              label: "Vat Amount",
              value: order.vatAmount,
            })}
            {summaryRow({
              label: "Zakat Amount",
              value: order.zakatAmount,
            })}
          </div>
          <p className="flex justify-between text-lg font-semibold">
            <span className="font-semibold">{t("Total Price")}:</span>
            <span className="text-primary leading-relaxed font-semibold tracking-wide">
              {order.totalAmount} {t("KWD")}
            </span>
          </p>
        </div>
        <div className="space-y-2 rounded-2xl p-4 shadow-md">
          <h3 className="font-semibold">{t("Contact Information")}</h3>
          <div className="flex items-center justify-between font-medium">
            <p className="flex items-center gap-2">
              <FaUser className="text-[#7D7D7D]" />{" "}
              {`${order.serviceOrderDTOS?.[0].userDetails?.firstName} ${order.serviceOrderDTOS?.[0].userDetails?.lastName}`}
            </p>
            <p className="flex items-center gap-2">
              <MdEmail className="text-[#7D7D7D]" />{" "}
              {order.serviceOrderDTOS?.[0].userDetails?.email}
            </p>
            {order.serviceOrderDTOS?.[0].userDetails?.phoneNumber && (
              <p className="flex items-center gap-2">
                <MdPhone className="text-[#7D7D7D]" />{" "}
                {order.serviceOrderDTOS?.[0].userDetails?.phoneNumber}
              </p>
            )}
          </div>
          <p className="flex items-center gap-2">
            <TbTruckDelivery className="text-[#7D7D7D]" />{" "}
            {order.serviceOrderDTOS?.[0].deliveryAddress}
          </p>
        </div>
        <OrderCard order={order} header={false} />
        <GeneratePdfButton
          documentComponent={<OrderInvoicePdf orderDetails={order} />}
          Button={
            <Button
              sx={{ textTransform: "none" }}
              variant="contained"
              className="!bg-primary hover:!bg-primary-shade mx-auto! h-10 w-60 cursor-pointer rounded-lg! !text-xs !tracking-tight"
            >
              <BiDownload className="me-1" /> {t("Download Invoice")}
            </Button>
          }
          fileName="invoice.pdf"
        />
      </div>
      <div className="flex w-100 max-w-full shrink-0 flex-col items-center gap-8 px-4 lg:sticky lg:top-30">
        <h2 className="h2">{t("Payment Completed")}</h2>
        <img
          src={orderSuccessPayment}
          alt="success-payment"
          className="w-[100%] object-cover"
        />
        <p className="text-center text-gray-600">
          {t(
            "We will inform you via email later once the transaction has been accepted"
          )}
        </p>
        <Link
          to="/"
          className="bg-primary hover:bg-primary-shade rounded-lg px-5 py-2 text-center text-sm tracking-wide text-white transition-colors duration-200 sm:w-auto"
        >
          {t("Take Me Home")}
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccessPayment;

type SummaryRowParams = {
  label: string;
  value: number | string | null | undefined;
};

function summaryRow({ label, value }: SummaryRowParams) {
  const numericValue = Number(value);

  if (!numericValue || numericValue <= 0) return null;

  return (
    <p className="flex justify-between text-lg font-medium">
      <span className="text-gray-500">{t(label)}:</span>
      <span className="leading-relaxed tracking-wide">
        {numericValue} {t("KWD")}
      </span>
    </p>
  );
}
