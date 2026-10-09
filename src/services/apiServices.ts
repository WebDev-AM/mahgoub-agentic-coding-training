import {
  ProductCategoryMap,
  Service,
  ServiceType,
} from "../types/ServiceSchema";
import customFetch from "./customFetch";

const API_END_POINT_URL = "/api/products";

// Get All Service Types
export async function getAllServiceTypesApi(queryObject: {
  [key: string]: string | number | boolean | undefined;
}) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/service-types/list`,
    {
      params: queryObject,
    }
  );

  return data as {
    content: ServiceType[];
    totalPages: number;
    pageable: { pageNumber: number };
  };
}

// Get Single Service Type
export async function getServiceTypeApi(id: number) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/service-types/${id}`
  );
  return data as ServiceType;
}

// Get All Services
export async function getAllServicesApi(queryObject: {
  typeId: number;
  [key: string]: string | number | undefined;
}) {
  const { data } = await customFetch.get(`${API_END_POINT_URL}/services/list`, {
    params: queryObject,
  });

  return data as {
    content: Service[];
    totalPages: number;
    pageable: { pageNumber: number };
  };
}

// Get Single Service
export async function getServiceApi(id: string) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/services/uuid/${id}`
  );
  return data as Service;
}

// Get All Products
export async function getAllProductsGroupedApi(serviceId: string) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/${serviceId}/products`
  );

  return data as ProductCategoryMap;
}
