import { AiOutlineDollarCircle } from "react-icons/ai";
import { t } from "i18next";
import VerifiedUserIcon from "../../assets/icons/VerifiedUserIcon";
import RefreshSquareIcon from "../../assets/icons/RefreshSquareIcon";

function ChooseUsSection() {
  return (
    <div className="py-spacing-y flex w-full flex-col items-center justify-center gap-10 bg-white">
      <h1 className="h1">{t("Why Choose Us ?")}</h1>
      <div className="container flex max-w-250 flex-col justify-between gap-10 px-4 lg:flex-row">
        <div className="flex flex-col items-center gap-6 text-center lg:w-70">
          <div className="shadow-primary/10 text-brand-blue-shade bg-primary-light mb-6 flex h-20 w-20 items-center justify-center rounded-md text-4xl shadow-lg">
            <AiOutlineDollarCircle />
          </div>
          <h3 className="h3">{t("Competitive Prices")}</h3>
          <p className="leading-6">
            {t(
              "Enjoy fair rates and transparent pricing across stays and on-demand services — no hidden fees, ever."
            )}
          </p>
        </div>
        <div className="flex flex-col items-center gap-6 text-center lg:w-70">
          <div className="shadow-primary/10 text-brand-blue-shade bg-primary-light mb-6 flex h-20 w-20 items-center justify-center rounded-md text-4xl shadow-lg">
            <VerifiedUserIcon />
          </div>
          <h3 className="h3">{t("Secure Booking")}</h3>
          <p className="leading-6">
            {t(
              "Book with confidence thanks to verified hosts, protected payments, and a safe, reliable process."
            )}
          </p>
        </div>
        <div className="flex flex-col items-center gap-6 text-center lg:w-70">
          <div className="shadow-primary/10 text-brand-blue-shade bg-primary-light mb-6 flex h-20 w-20 items-center justify-center rounded-md text-4xl shadow-lg">
            <RefreshSquareIcon />
          </div>
          <h3 className="h3">{t("Seamless Experience")}</h3>
          <p className="leading-6">
            {t(
              "Manage your stay, services, and payments effortlessly — all in one smooth, easy-to-use platform."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChooseUsSection;
