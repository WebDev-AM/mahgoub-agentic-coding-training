import { Link } from "react-router-dom";
import LanguageSelector from "../LanguageSelector";
import ProfileHeaderIcon from "../../features/authentication/ProfileHeaderIcon";
import MyCartButton from "../../features/orderServices/cart/MyCartButton";
import { useHasLanding } from "../../hooks/useHasLanding";

function HeaderMobileScreen() {
  const hasLanding = useHasLanding();

  return (
    <div
      className={`${hasLanding && "absolute top-0 left-0 text-white"} flex h-[70px] w-full items-center justify-between px-5 lg:hidden`}
    >
      {/* Logo */}
      <div className="h-[50px] cursor-pointer">
        <Link
          to="/"
          data-testid="sm-header-logo"
          className={`${!hasLanding && "text-primary"} flex h-full items-center gap-2 text-2xl font-bold`}
        >
          <img src={"/logo.png"} alt="Logo" className="h-full" />
        </Link>
      </div>

      {/* Language Selector */}
      <div className="flex items-center gap-2">
        <LanguageSelector />
        <ProfileHeaderIcon />
        <MyCartButton />
      </div>
    </div>
  );
}

export default HeaderMobileScreen;
