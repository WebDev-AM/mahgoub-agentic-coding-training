import { t } from "i18next";
import { FC } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { PiHouseLineLight } from "react-icons/pi";

interface ProfileSectionsProps {
  active: string;
  setActive: (id: string) => void;
}

export const ProfileSections: FC<ProfileSectionsProps> = ({
  active,
  setActive,
}) => {
  const sections = [
    { id: "overview", label: "Overview", icon: <AiOutlineEye size={20} /> },
    {
      id: "stays",
      label: "Stays Booking",
      icon: <PiHouseLineLight size={20} />,
    },
  ];

  return (
    <div className="mx-auto flex w-full items-center justify-center gap-10 rounded-md">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => setActive(section.id)}
          className={`${
            active === section.id ? "text-primary border-b-2" : "text-sub-text"
          } hover:text-primary border-primary flex cursor-pointer flex-col items-center gap-1 transition-all`}
        >
          <div>{section.icon}</div>
          <span className={`text-sm font-medium`}>{t(section.label)}</span>
        </button>
      ))}
    </div>
  );
};
