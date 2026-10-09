import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ServiceType } from "../../types/ServiceSchema";
import { useTranslation } from "react-i18next";
import { CgArrowLongLeft, CgArrowLongRight } from "react-icons/cg";

type ServiceTypeCardProps = { serviceType: ServiceType };

function ServiceTypeCard({ serviceType }: ServiceTypeCardProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.01 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group flex h-115 w-70 flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
    >
      <div className="relative h-70 overflow-hidden">
        <img
          src={serviceType.logoImage}
          alt={isArabic ? serviceType.nameAr : serviceType.nameEn}
          className="h-full w-full object-cover transition-transform duration-600 ease-in-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_120px_60px_-40px_rgba(0,0,0,0.5)]" />
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="text-xl font-semibold">
            {isArabic ? serviceType.nameAr : serviceType.nameEn}
          </h3>
          <p className="text-lg">
            {isArabic ? serviceType.descriptionAr : serviceType.descriptionEn}
          </p>
        </div>
        <div
          className="flex cursor-pointer items-center justify-between"
          onClick={() => navigate(`/services/${serviceType.id}`)}
        >
          <span className="text-primary text-xl font-medium">
            {t("Shop now")}
          </span>
          <span className={`group-hover:animate-bounce-x text-2xl`}>
            {isArabic ? <CgArrowLongLeft /> : <CgArrowLongRight />}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default ServiceTypeCard;
