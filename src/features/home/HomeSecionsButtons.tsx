import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import PlayIcon from "../../assets/images/placeholder.svg";
import FoodIcon from "../../assets/icons/FoodIcon";

function HomeSecionsButtons() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center gap-2 text-sm font-semibold text-black sm:gap-3 sm:text-lg lg:text-xl">
      <button
        type="button"
        onClick={() => navigate("/units")}
        className="active:text-brand-gold active:border-brand-gold flex h-8 w-36 cursor-pointer items-center justify-center gap-2 !rounded-2xl bg-white p-2 text-center shadow hover:shadow-md active:border sm:h-12 sm:w-52 lg:w-68"
      >
        <img src={PlayIcon} alt="Play Icon" className="h-full" />
        {t("Rent service")}
      </button>
      <button
        type="button"
        className="active:text-brand-gold active:border-brand-gold flex h-8 w-36 cursor-pointer items-center justify-center gap-2 !rounded-2xl bg-white p-2 text-center shadow hover:shadow-md active:border sm:h-12 sm:w-52 lg:w-68"
        onClick={() => navigate("/services")}
      >
        <FoodIcon />
        {t("Order service")}
      </button>
    </div>
  );
}

export default HomeSecionsButtons;
