import {
  CreateRatingType,
  Rating,
  UpdateRatingType,
} from "../types/reservation/RatingSchema";
import customFetch from "./customFetch";

const API_END_POINT_URL = "/api/ratings";

export async function getAllRatingsForResource({
  resourceType,
  resourceId,
}: {
  resourceType: string;
  resourceId: string;
}) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/resource/${resourceType}/${resourceId}?sort=createdAt-desc&page=0&size=20`
  );

  return data.content as Rating[];
}

// Create Rating
export async function createRatingApi(rating: CreateRatingType) {
  const { data } = await customFetch.post(`${API_END_POINT_URL}/`, rating);

  return data as Rating;
}

// Update Rating
export async function updateRatingApi(rating: UpdateRatingType) {
  const { id, ...ratingData } = rating;

  const { data } = await customFetch.put(
    `${API_END_POINT_URL}/${id}`,
    ratingData
  );

  return data as Rating;
}

// Delete Rating
export async function deleteRatingApi(ratingId: number) {
  const { data } = await customFetch.delete(`${API_END_POINT_URL}/${ratingId}`);

  return data;
}
