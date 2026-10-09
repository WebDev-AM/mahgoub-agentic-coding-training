import { t } from "i18next";
import { ReactNode } from "react";

type UnitSectionCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
};

function UnitSectionCard({
  title,
  children,
  className = "",
  action,
}: UnitSectionCardProps) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">{t(title)}</h3>

        {action}
      </div>

      <div className="gap-inside-spacing-y flex flex-col">{children}</div>
    </div>
  );
}

export default UnitSectionCard;
