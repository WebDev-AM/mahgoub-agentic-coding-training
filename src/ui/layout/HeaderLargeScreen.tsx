import { Link } from "react-router-dom";
import { t } from "i18next";
import LanguageSelector from "../LanguageSelector";
import ProfileHeaderIcon from "../../features/authentication/ProfileHeaderIcon";
import { motion } from "framer-motion";
import MyCartButton from "../../features/orderServices/cart/MyCartButton";
import { useHasLanding } from "../../hooks/useHasLanding";
import { NavLink } from "react-router-dom";

const linkStyles =
  (hasLanding: boolean) =>
  ({ isActive }: { isActive: boolean }) =>
    `${isActive && "font-extrabold scale-105"} ${hasLanding ? "text-primary hover:text-primary-dark" : ""} hover:scale-105 flex transition-transform transition-all duration-300 ease-in-out`;

function HeaderLargeScreen() {
  const hasLanding = useHasLanding();

  return (
    <motion.header
      className={`${hasLanding ? "absolute top-0 left-0 h-[50vh] bg-[linear-gradient(to_bottom,white_0%,transparent_100%)]" : ""} hidden w-full lg:block`}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="container-fix container flex h-25 items-center justify-between py-4 text-lg">
        <Link
          to="/"
          className={`${!hasLanding && "text-primary"} flex h-full items-center gap-2 text-2xl font-bold`}
          data-testid="lg-header-logo"
        >
          <motion.img
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            src={"/logo.png"}
            alt="Logo"
            className="h-full"
          />
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <NavLink to="/home" className={linkStyles(hasLanding)}>
            {t("Home")}
          </NavLink>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <NavLink to="/units" className={linkStyles(hasLanding)}>
            {t("Rent & Play")}
          </NavLink>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <NavLink to="/services" className={linkStyles(hasLanding)}>
            {t("Food & Drinks")}
          </NavLink>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <NavLink to="/" className={linkStyles(hasLanding)}>
            {t("Blog")}
          </NavLink>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <NavLink to="/contact-us" className={linkStyles(hasLanding)}>
            {t("Contact Us")}
          </NavLink>
        </motion.div>

        {/* Profile Icon */}
        <ProfileHeaderIcon />
        <LanguageSelector />
        <MyCartButton />
      </div>
    </motion.header>
  );
}

export default HeaderLargeScreen;
