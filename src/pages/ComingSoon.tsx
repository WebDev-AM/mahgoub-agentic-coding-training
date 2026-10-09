import { t } from "i18next";
import comingSoonBg from "../assets/images/comingSoonBg.jpg";
import comingSoonLogo from "../assets/images/comingSoonLogo.png";
import { Link } from "react-router-dom";

function ComingSoon() {
  return (
    <div
      className={`bg-bottom-left flex h-[50vh] w-full flex-col items-center justify-center gap-20 bg-cover bg-no-repeat lg:h-[90vh]`}
      style={{
        backgroundImage: `url(${comingSoonBg})`,
      }}
    >
      <div className="flex max-w-full flex-col items-center gap-5">
        <img
          src={comingSoonLogo}
          alt="coming soon"
          className="w-45 max-w-full lg:w-70"
        />
        <h1 className="h1">{t("Coming Soon")}</h1>
        <p className="w-120 max-w-full! text-center text-lg font-medium">
          {t(
            "Are you Ready to get something new from us. Then subscribe the news latter to get latest updates?"
          )}
        </p>
      </div>
      <Link
        to="/"
        className="w-60! shrink-0 rounded-lg bg-blue-500 px-5 py-2 text-center text-sm tracking-wide text-white transition-colors duration-200 hover:bg-blue-600 sm:w-auto"
      >
        {t("Back Home")}
      </Link>
    </div>
  );
}

export default ComingSoon;
