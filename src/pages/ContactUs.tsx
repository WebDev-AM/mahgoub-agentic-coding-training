import { t } from "i18next";
import contactUs from "../assets/images/placeholder.svg";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { TbMailFilled } from "react-icons/tb";
function ContactUs() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[420px] overflow-hidden md:h-[500px]">
        <img
          src={contactUs}
          alt={t("Contact Us")}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 flex h-full items-center px-6 md:px-16">
          <h1 className="text-4xl font-bold text-white md:text-6xl">
            {t("Contact Us")}
          </h1>
        </div>
      </section>

      {/* Contact Information */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Location */}
          <div>
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-2xl text-white">
                <FaLocationDot />
              </div>

              <h2 className="text-xl font-semibold">{t("Location")}</h2>
            </div>

            <div className="space-y-6 text-gray-600">
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  {t("Travel Agency")}
                </h3>

                <p>{t("Al Khiran, Kuwait")}</p>
              </div>
            </div>
          </div>

          {/* Call */}
          <div>
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-2xl text-white">
                <FaPhoneAlt />
              </div>

              <h2 className="text-xl font-semibold">{t("Give us a call")}</h2>
            </div>

            <div className="space-y-6 text-gray-600">
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  {t("Office Number")}
                </h3>

                <p dir="ltr" className="inline">
                  +96597666370
                </p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-2xl text-white">
                <TbMailFilled />
              </div>

              <h2 className="text-xl font-semibold">
                {t("Write for anything")}
              </h2>
            </div>

            <div className="space-y-6 text-gray-600">
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  {t("Consulting")}
                </h3>

                <p>
                  {t(
                    "Our free consultation service can be requested here every day."
                  )}
                </p>

                <p>info@marahep.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;
