import { t } from "i18next";
import { ServiceType } from "../../types/ServiceSchema";
import PageSpinner from "../../ui/PageSpinner";
import Paragraph from "../../ui/Paragraph";
import ServiceTypeCard from "./ServiceTypeCard";

type ServiceTypesWrapperProps = {
  isLoading: boolean;
  serviceTypes: ServiceType[];
};
function ServiceTypesWrapper({
  isLoading,
  serviceTypes,
}: ServiceTypesWrapperProps) {
  return (
    <div className="bg-brand-shade flex min-h-[50vh] flex-1 flex-wrap items-center justify-center gap-8">
      {isLoading ? (
        <PageSpinner />
      ) : serviceTypes?.length ? (
        serviceTypes.map((serviceType) => (
          <ServiceTypeCard key={serviceType.id} serviceType={serviceType} />
        ))
      ) : (
        <Paragraph className="text-black/70">
          {t("There is no services with these filters")}
        </Paragraph>
      )}
    </div>
  );
}

export default ServiceTypesWrapper;
