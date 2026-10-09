import { t } from "i18next";
import { ReactNode } from "react";

type FormGroupProps = {
  children?: ReactNode;
  icon?: ReactNode;
  header?: string;
  className?: string;
};
function FormGroup({ children, icon, header, className }: FormGroupProps) {
  return (
    <div className={`bg-secondary mb-5 rounded-xl p-4 ${className}`}>
      {header && (
        <h1 className="text-primary mb-spacing-y flex items-center gap-3 text-2xl">
          {icon}
          {t(header)}
        </h1>
      )}
      {children}
    </div>
  );
}

export default FormGroup;
