import { z } from "zod";

// Core rating fields used for both create and update payloads
export const BaseRatingDataSchema = z.object({
  overallRating: z
    .number({ invalid_type_error: "Overall rating must be a number" })
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating must not exceed 5" }),
  title: z.string().min(1, { message: "Title is required" }),
  review: z.string().min(1, { message: "Review is required" }),
  anonymous: z.boolean({
    invalid_type_error: "anonymous must be a boolean",
  }),
});

export const CreateRatingSchema = z
  .object({
    resourceType: z.string().min(1, { message: "Resource type is required" }),
    resourceId: z.string().min(1, { message: "Resource ID is required" }),
    reservationId: z.string().min(1, { message: "Reservation ID is required" }),
  })
  .merge(BaseRatingDataSchema);

export type CreateRatingType = z.infer<typeof CreateRatingSchema>;

export const UpdateRatingSchema = z
  .object({
    id: z.number(),
  })
  .merge(BaseRatingDataSchema);

export type UpdateRatingType = z.infer<typeof UpdateRatingSchema>;

export type Rating = {
  id: number;
  resourceType: string;
  resourceId: string;
  reservationId?: string;
  overallRating: number;
  title: string;
  review: string;
  anonymous: boolean;
  userId?: string;
  userName?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type RatingSummary = {
  averageRating: number;
  totalRatings: number;
  star1: number;
  star2: number;
  star3: number;
  star4: number;
  star5: number;
  recommendationPercentage: number;
};
