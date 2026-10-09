import { Navigate, useNavigate } from "react-router-dom";
import PageSpinner from "../../../ui/PageSpinner";
import CartItemsWrapper from "./CartItemsWrapper";
import OrderSummary from "./OrderSummary";
import { useCart } from "./useCart";
import { t } from "i18next";
import { MdOutlineShoppingCart } from "react-icons/md";
import EmptyState from "../../../ui/EmptyState";

function CartReview() {
  const { cart, isLoading } = useCart();
  const cartArray = cart ? Object.values(cart) : [];
  const navigate = useNavigate();
  if (isLoading) return <PageSpinner />;
  if (!cart) return <Navigate to="../" />;
  if (!cartArray.length)
    return (
      <EmptyState
        icon={<MdOutlineShoppingCart />}
        title={t("Your cart is empty")}
        description={t(
          "Start adding items to the cart, and they will appear here so you can review everything before checkout."
        )}
        buttonText={t("Continue Shopping")}
        buttonPath="/services"
        buttonDirection="forward"
      />
    );

  return (
    <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start">
      <CartItemsWrapper cart={cartArray} />
      <OrderSummary>
        <button
          onClick={() => navigate("/order-checkout/0")}
          className="bg-primary hover:bg-primary-shade flex h-12 w-full cursor-pointer items-center justify-center text-lg font-semibold text-white transition hover:shadow-2xl"
        >
          {t("Checkout")}
        </button>
      </OrderSummary>
    </div>
  );
}

export default CartReview;
