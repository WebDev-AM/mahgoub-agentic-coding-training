import { MdOutlineShoppingCart } from "react-icons/md";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { Badge } from "@mui/material";
import { useCart } from "./useCart";
import { useHasLanding } from "../../../hooks/useHasLanding";

function MyCartButton() {
  const navigate = useNavigate();
  const hasLanding = useHasLanding();
  const { cart } = useCart();
  return (
    <Badge color="primary" badgeContent={cart ? Object.keys(cart).length : 0}>
      <button
        onClick={() => navigate("/order-cart")}
        className={`${hasLanding ? "bg-primary text-white hover:bg-primary-dark" : "primary-button"} flex cursor-pointer items-center gap-2 rounded-xl p-2 text-lg font-semibold transition hover:shadow-2xl`}
      >
        <MdOutlineShoppingCart className="inline-block" />
        <span className="hidden lg:block">{t("My Cart")}</span>
      </button>
    </Badge>
  );
}

export default MyCartButton;
