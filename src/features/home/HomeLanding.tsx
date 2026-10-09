import { t } from "i18next";
import landing from "../../assets/images/landing.png";
import { motion } from "framer-motion";
import HomeSecionsButtons from "./HomeSecionsButtons";

function HomeLanding() {
  return (
    <div
      className={`bg-bottom-left flex h-[50vh] w-full items-center justify-center bg-cover bg-no-repeat lg:h-[85vh]`}
      style={{
        backgroundImage: `url(${landing})`,
      }}
    >
      {/* Text block — only visible on large screens */}
      <div className="text-shadow container-fix container flex flex-col items-start gap-4">
        <motion.div
          className="text-2xl leading-7 font-bold text-white sm:text-4xl sm:leading-8 lg:text-6xl lg:leading-10"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t("MARAHEP")}
        </motion.div>
        <motion.div
          className="leading-8 font-bold text-white sm:text-xl sm:leading-9 lg:text-3xl lg:leading-17"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {t("Explore beautiful places in the world")}
        </motion.div>
        <HomeSecionsButtons />
      </div>
    </div>
  );
}

export default HomeLanding;
