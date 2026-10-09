import { t } from "i18next";
import Paragraph from "../../ui/Paragraph";
import { Unit } from "../../types/ChaletSchema";
import PageSpinner from "../../ui/PageSpinner";
import UnitCard from "./UnitCard";

type UnitsWrapperProps = {
  allowThree?: boolean;
  isLoading: boolean;
  units?: Unit[];
};
function UnitsWrapper({
  isLoading,
  units = [],
  allowThree = true,
}: UnitsWrapperProps) {
  if (isLoading) return <PageSpinner />;
  if (!units?.length)
    return (
      <Paragraph className="text-black/70">
        {t("There is no units with these filters")}
      </Paragraph>
    );

  return (
    <div
      className={`grid max-w-300 gap-5 md:grid-cols-2 ${allowThree && "xl:grid-cols-3"}`}
    >
      {units.map((unit) => (
        <UnitCard unit={unit} key={unit.uuid} />
      ))}
    </div>
  );
}

export default UnitsWrapper;
