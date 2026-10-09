import ServiceTypeAboutUs from "../features/orderServices/ServiceTypeAboutUs";
import ServiceTypesWrapper from "../features/orderServices/ServiceTypesWrapper";
import { useServiceTypes } from "../features/orderServices/useServiceTypes";
import BackArrow from "../ui/BackArrow";
import Pagination from "../ui/Pagination";

function ServiceTypes() {
  const { isLoading, serviceTypes, filtersDispatch, pageNumber, totalPages } =
    useServiceTypes();
  return (
    <div className="lg:pb-spacing-y relative flex flex-col">
      <div className="bg-brand-shade py-spacing-y">
        <div className="gap-spacing-y container-fix container flex flex-col">
          <BackArrow label="Services" url="/home" />
          <ServiceTypesWrapper
            isLoading={isLoading}
            serviceTypes={serviceTypes}
          />
          {totalPages > 1 && (
            <Pagination
              page={pageNumber}
              totalPages={totalPages}
              filtersDispatch={filtersDispatch}
            />
          )}
          <ServiceTypeAboutUs />
        </div>
      </div>
    </div>
  );
}

export default ServiceTypes;
