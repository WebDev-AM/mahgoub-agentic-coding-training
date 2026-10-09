import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

type BackArrowProps = { label?: string; className?: string; url?: string };

function BackArrow({ label, className, url }: BackArrowProps) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  return (
    <div
      className={`flex items-center gap-4 font-medium md:text-3xl ${className}`}
    >
      <span className="relative flex items-center transition-all hover:scale-110">
        <IoArrowBackOutline
          onClick={() => (url ? navigate(`${url}`) : navigate(-1))}
          className="cursor-pointer"
          style={{
            transform: i18n.language === "ar" ? "rotate(180deg)" : "",
          }}
        />
      </span>
      {label && t(label)}
    </div>
  );
}

export default BackArrow;
