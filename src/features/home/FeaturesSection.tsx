import { t } from "i18next";
import { motion } from "framer-motion";

import feature1 from "../../assets/images/feature1.png";
import feature2 from "../../assets/images/feature2.png";
import feature3 from "../../assets/images/feature3.png";
import { CiCircleChevRight, CiCircleChevLeft } from "react-icons/ci";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function FeaturesSection() {
  return (
    <div className="py-spacing-y bg-secondary flex flex-col items-center justify-center">
      <div className="gap-spacing-y container flex max-w-280 flex-col">
        <h1 className="h1">{t("Feature News")}</h1>
        <div className="flex flex-1 flex-wrap items-center justify-center gap-5 xl:justify-between">
          {items.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.01 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group flex h-125 w-75 flex-col overflow-hidden rounded-xl bg-white shadow-2xl lg:h-145 lg:w-85"
    >
      <div className="relative h-60 overflow-hidden">
        <img
          src={feature.image}
          alt={feature.title}
          className="h-full w-full object-cover transition-transform duration-600 ease-in-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-8">
        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-semibold">{t(feature.title)}</h3>
          <p className="text-lg">{t(feature.description)}</p>
        </div>

        {feature.link && (
          <div
            className="flex cursor-pointer items-center justify-between"
            onClick={() => navigate(`${feature.link}`)}
          >
            <span className="text-primary flex items-center gap-2 font-semibold">
              {t("See more")}
              {isArabic ? (
                <CiCircleChevLeft size={20} />
              ) : (
                <CiCircleChevRight size={20} />
              )}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

type Feature = {
  title: string;
  description: string;
  image: string;
  link?: string;
};
const items: Feature[] = [
  {
    title: "Delicious Meals Delivered to Your Stay",
    description:
      "Enjoy a curated selection of meals from local restaurants delivered right to your door. Order anytime and experience comfort dining without leaving your stay.",
    link: "/services",
    image: feature1,
  },
  {
    title: "Reliable Transport for Your Stay",
    description:
      "Enjoy seamless rides, airport pickups, and local transportation services ready whenever you need them. Move effortlessly and reach your destination with comfort and ease.",
    image: feature2,
    link: "/coming-soon",
  },
  {
    title: "Essentials & Souvenirs — Order Essentials and Souvenirs Anytime",
    description:
      "Get what you need delivered to your door — whether it’s medicine, daily essentials, or local souvenirs. Fast delivery and trusted stores, all available within Marahep.",
    image: feature3,
    link: "/coming-soon",
  },
];
