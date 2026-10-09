import { ReactNode } from "react";
import { t } from "i18next";

export type SectionOption<T extends string | number> = {
  labelKey: string;
  icon?: ReactNode;
  value: T;
};

type SwitcherProps<T extends string | number> = {
  renderSection: T;
  setRenderSection: (value: T) => void;
  sections: SectionOption<T>[];
};

function SectionsSwitcher<T extends string | number>({
  renderSection,
  setRenderSection,
  sections,
}: SwitcherProps<T>) {
  return (
    <div className="flex w-full gap-2">
      {sections.map(({ labelKey, value, icon }) => (
        <button
          key={labelKey}
          type="button"
          onClick={() => setRenderSection(value)}
          className={`flex min-w-50 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            renderSection === value
              ? "bg-brand-gold text-white"
              : "hover:bg-yellow-100"
          }`}
        >
          {t(labelKey)}
          {icon}
        </button>
      ))}
    </div>
  );
}

export default SectionsSwitcher;
