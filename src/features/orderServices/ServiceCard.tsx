import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Service } from "../../types/ServiceSchema";
import { useTranslation } from "react-i18next";
import { Avatar } from "@mui/material";

type ServiceCardProps = { service: Service };

function ServiceCard({ service }: ServiceCardProps) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.01 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex h-82 w-47 cursor-pointer flex-col items-center gap-2 overflow-hidden rounded-full p-4 text-center shadow-lg transition-all duration-500 hover:shadow-2xl"
      onClick={() => navigate(`${service.serviceId}/products`)}
    >
      <Avatar src={service.logoImage} className="!h-39 !w-39" />
      <div className="flex flex-col justify-between gap-2">
        <h3 className="text-lg font-bold">
          {isArabic ? service.nameAr : service.nameEn}
        </h3>
        <p className="text-base leading-4 text-gray-600">
          {isArabic ? service.descriptionAr : service.descriptionEn}
        </p>
      </div>
    </motion.div>
  );
}

export default ServiceCard;
