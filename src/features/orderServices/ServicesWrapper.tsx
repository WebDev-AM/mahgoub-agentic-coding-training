import { t } from "i18next";
import PageSpinner from "../../ui/PageSpinner";
import Paragraph from "../../ui/Paragraph";
import { Service } from "../../types/ServiceSchema";
import ServiceCard from "./ServiceCard";

type ServicesWrapperProps = {
  isLoading: boolean;
  services: Service[];
};
function ServicesWrapper({ isLoading, services }: ServicesWrapperProps) {
  return (
    <div className="flex min-h-[35vh] flex-1 flex-wrap items-center justify-center gap-8 py-4">
      {isLoading ? (
        <PageSpinner />
      ) : services?.length ? (
        services.map((service) => (
          <ServiceCard key={service.serviceId} service={service} />
        ))
      ) : (
        <Paragraph className="text-black/70">
          {t("There is no services with these filters")}
        </Paragraph>
      )}
    </div>
  );
}

export default ServicesWrapper;
