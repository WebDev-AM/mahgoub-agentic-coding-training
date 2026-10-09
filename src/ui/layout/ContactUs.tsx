import { t } from "i18next";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ContactUs() {
  const navigate = useNavigate();
  return (
    <div className="bg-primary-dark py-16 text-[#ccc]">
      <div className="container-fix container grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-white lg:text-2xl">{t("Support")}</h2>
          <p className="cursor-pointer transition-all duration-150 hover:text-[#eee]">
            {t("Help Center")}
          </p>
          <p className="cursor-pointer transition-all duration-150 hover:text-[#eee]">
            {t("Safety information")}
          </p>
          <p className="cursor-pointer transition-all duration-150 hover:text-[#eee]">
            {t("Cancellation optionss")}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-white lg:text-2xl">{t("Company")}</h2>
          <p className="cursor-pointer transition-all duration-150 hover:text-[#eee]">
            {t("About us")}
          </p>
          <p className="cursor-pointer transition-all duration-150 hover:text-[#eee]">
            {t("Privacy policy")}
          </p>
          <p className="cursor-pointer transition-all duration-150 hover:text-[#eee]">
            {t("Community Blog")}
          </p>
          <p className="cursor-pointer transition-all duration-150 hover:text-[#eee]">
            {t("Terms of services")}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-white lg:text-2xl">{t("Contact")}</h2>
          <p className="cursor-pointer transition-all duration-150 hover:text-[#eee]">
            {t("FAQ")}
          </p>
          <p
            className="cursor-pointer transition-all duration-150 hover:text-[#eee]"
            onClick={() => navigate("/contact-us")}
          >
            {t("Get in touch")}
          </p>
          <p className="cursor-pointer transition-all duration-150 hover:text-[#eee]">
            {t("Partnerships")}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-white lg:text-2xl">{t("Social")}</h2>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/1C23owEnuh/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-dark flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-xl transition-all duration-150 hover:h-9 hover:w-9"
            >
              <FaFacebookF />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/marahep_app?igsh=czF1bDNiaHU4ZDRy&utm_source=ig_contact_invite"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-dark flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-xl transition-all duration-150 hover:h-9 hover:w-9"
            >
              <FaInstagram />
            </a>

            {/* TikTok */}
            {/* <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-dark flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-xl transition-all duration-150 hover:h-9 hover:w-9"
            >
              <RiTiktokFill />
            </a> */}

            {/* YouTube */}
            {/* <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-dark flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-xl transition-all duration-150 hover:h-9 hover:w-9"
            >
              <FaYoutube />
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
