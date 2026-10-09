import ServiceHeader from "../features/orderServices/ServiceHeader";
import ServicesWrapper from "../features/orderServices/ServicesWrapper";
import { useServices } from "../features/orderServices/useServices";
import Pagination from "../ui/Pagination";

function Services() {
  const { isLoading, services, filtersDispatch, pageNumber, totalPages } =
    useServices();
  return (
    <>
      <ServiceHeader filtersDispatch={filtersDispatch} />
      <div className="lg:gap-inside-spacing-y container-fix relative container flex flex-col lg:py-2">
        <ServicesWrapper isLoading={isLoading} services={services} />
        {totalPages > 1 && (
          <Pagination
            page={pageNumber}
            totalPages={totalPages}
            filtersDispatch={filtersDispatch}
          />
        )}
      </div>
    </>
  );
}

export default Services;
