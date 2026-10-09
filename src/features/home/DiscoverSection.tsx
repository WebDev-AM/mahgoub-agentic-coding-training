import { t } from "i18next";
import discoverLandscape from "../../assets/images/discoverLandscape.png";
import discover1 from "../../assets/images/discover1.png";
import discover2 from "../../assets/images/discover2.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function DiscoverSection() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className="bg-bottom-left flex w-full flex-col items-center justify-center bg-cover bg-no-repeat p-10 text-white lg:h-145"
      style={{
        backgroundImage: `url(${discoverLandscape})`,
        backgroundPosition: "center",
      }}
    >
      <h1 className="h1">
        {t("Discover the perfect stay that fits your trip")}
      </h1>
      <div className="container max-w-275">
        <hr className="my-13" />
        <div className="flex flex-col justify-between gap-6 lg:flex-row-reverse">
          <div className="flex items-center justify-center gap-5">
            <div className="flex w-50 flex-col gap-2">
              <img src={discover1} alt="portrait1" />
              <span>{t("Perfect stays, one tap away.")}</span>
            </div>
            <div className="flex w-50 flex-col gap-2">
              <img src={discover2} alt="portrait2" />
              <span>{t("Order your needs and relax.")}</span>
            </div>
          </div>
          <div className="text-center lg:max-w-110 lg:text-start">
            <p className="text-xl">
              {t(
                "Get a full snapshot of your stay and the services that come with it, helping you plan the perfect experience from start to finish"
              )}
            </p>
            <button
              onClick={() => navigate("/units")}
              className="mt-10 cursor-pointer rounded-full bg-white px-4 py-2 text-lg font-semibold text-black hover:shadow-xl"
            >
              {t("Discover More")}
              <span className="ms-1">{i18n.language === "ar" ? "←" : "→"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscoverSection;
