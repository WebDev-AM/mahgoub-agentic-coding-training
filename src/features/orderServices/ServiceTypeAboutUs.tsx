import { FiPhoneCall } from "react-icons/fi";
import { FaCheckCircle, FaTruck, FaShieldAlt } from "react-icons/fa";
import serviceTypeAboutUs from "../../assets/images/placeholder.svg";
import { t } from "i18next";

function ServiceTypeAboutUs() {
  return (
    <section className="flex flex-wrap items-center justify-center gap-10 px-6 py-5 md:px-12 lg:px-20">
      {/* Left Features */}
      <div className="flex flex-1 flex-col gap-5">
        {/* Feature 1 */}
        <div className="flex items-center gap-3 rounded-full px-6 py-3 shadow-md">
          <div className="text-primary flex items-center justify-center rounded-full bg-gray-100 p-3 text-xl">
            <FaCheckCircle />
          </div>
          <span className="font-medium text-gray-700">
            {t("Authenticity Certification")}
          </span>
        </div>

        {/* Feature 2 (Active) */}
        <div className="border-primary flex items-center gap-3 rounded-full border-l-4 px-6 py-3 shadow-md">
          <div className="text-primary flex items-center justify-center rounded-full bg-gray-100 p-3 text-xl">
            <FaTruck />
          </div>
          <span className="font-medium text-gray-700">
            {t("Express Delivery")}
          </span>
        </div>

        {/* Feature 3 */}
        <div className="flex items-center gap-3 rounded-full px-6 py-3 shadow-md">
          <div className="text-primary flex items-center justify-center rounded-full bg-gray-100 p-3 text-xl">
            <FaShieldAlt />
          </div>
          <span className="font-medium text-gray-700">
            {t("Payment Secure")}
          </span>
        </div>
      </div>

      {/* Center Image */}
      <div className="flex min-w-[280px] justify-center">
        <img
          src={serviceTypeAboutUs}
          alt="Service Advertisement"
          className="max-w-[320px] md:max-w-[380px] lg:max-w-[420px]"
        />
      </div>

      {/* Right Text Content */}
      <div className="flex-1 text-center md:text-start">
        <h2 className="mb-4 text-3xl leading-snug font-extrabold text-gray-900">
          <span className="block">{t("Who We Are")}</span>
          <span className="block">{t("What We Do?")}</span>
        </h2>
        <p className="mb-6 leading-relaxed text-gray-600">
          {t(
            "We have been a model of “conservative” family tourism for more than 10 years. We have combined family tourism with its peculiarities, family gatherings and fun in a conservative atmosphere."
          )}
        </p>

        <div className="flex items-center justify-center gap-4 md:justify-start">
          <div className="bg-primary flex items-center justify-center rounded-full p-3 text-xl text-white">
            <FiPhoneCall />
          </div>
          <div className="text-start">
            <div className="font-medium text-gray-800">
              {t("How to Order?")}
            </div>
            <div className="font-bold text-gray-900">
              {t("CALL US:")} +96597666370
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceTypeAboutUs;
