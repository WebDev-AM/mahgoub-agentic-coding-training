import { Avatar, Rating as MuiRating } from "@mui/material";
import { t } from "i18next";

import { useResourceRatings } from "./useResourceRatings";
import { Rating } from "../../types/reservation/RatingSchema";
import UnitSectionCard from "../units/UnitSectionCard";

type ResourceRatingsProps = {
  resourceType: string;
  resourceId: string;
};

function getRatingLabel(rating: number) {
  if (rating >= 4.5) return t("Exceptional");
  if (rating >= 4) return t("Excellent");
  if (rating >= 3) return t("Very Good");
  if (rating >= 2) return t("Good");

  return t("Below Average");
}

function calculateAverageRating(ratings: Rating[]) {
  if (!ratings.length) return 0;

  const total = ratings.reduce((sum, rating) => sum + rating.overallRating, 0);

  return total / ratings.length;
}

function ResourceRatings({ resourceType, resourceId }: ResourceRatingsProps) {
  const { ratings, isLoading, error } = useResourceRatings(
    resourceType,
    resourceId
  );

  if (isLoading) {
    return (
      <UnitSectionCard title={t("Guest Reviews")}>
        <div className="flex h-24 items-center justify-center">
          <div className="border-t-primary size-5 animate-spin rounded-full border-2 border-slate-200" />
        </div>
      </UnitSectionCard>
    );
  }

  if (error) {
    return (
      <UnitSectionCard title={t("Guest Reviews")}>
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {t("Failed to load reviews.")}
        </div>
      </UnitSectionCard>
    );
  }

  if (!ratings?.length) {
    return (
      <UnitSectionCard title={t("Guest Reviews")}>
        <div className="py-4 text-center">
          <h3 className="text-sm font-semibold text-slate-700">
            {t("No reviews yet")}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {t("There are no reviews for this resource yet.")}
          </p>
        </div>
      </UnitSectionCard>
    );
  }

  const averageRating = calculateAverageRating(ratings);

  return (
    <UnitSectionCard title={t("Guest Reviews")}>
      <div className="space-y-4">
        {/* Rating Summary */}
        <div className="flex items-center gap-5 rounded-xl bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl leading-none font-semibold text-slate-900">
              {averageRating.toFixed(1)}
            </span>

            <div>
              <MuiRating
                value={averageRating}
                precision={0.1}
                readOnly
                size="small"
              />

              <p className="mt-0.5 text-xs text-slate-500">
                {getRatingLabel(averageRating)}
              </p>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          <p className="text-sm text-slate-500">
            {ratings.length} {ratings.length === 1 ? t("review") : t("reviews")}
          </p>
        </div>

        {/* Scrollable Reviews */}
        <div className="max-h-[360px] overflow-y-auto pr-1">
          <div className="divide-y divide-slate-100">
            {ratings.map((rating) => (
              <article key={rating.id} className="py-4 first:pt-1 last:pb-1">
                <div className="flex items-start gap-3">
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      fontSize: 14,
                      bgcolor: "#cbd5e1",
                    }}
                    alt={rating.userName || "User"}
                  >
                    {(rating.userName || "U").charAt(0).toUpperCase()}
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {rating.userName || t("User")}
                        </p>
                        <p className="text-xs text-slate-500">
                          {rating.createdAt
                            ? new Date(rating.createdAt).toLocaleDateString()
                            : t("Recently")}
                        </p>
                        <MuiRating
                          value={rating.overallRating}
                          precision={0.1}
                          readOnly
                          size="small"
                        />
                      </div>

                      <span className="text-primary shrink-0 text-sm font-semibold">
                        {rating.overallRating.toFixed(1)}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-slate-800">
                          {rating.title}
                        </h3>
                      </div>

                      <p className="mt-1.5 text-sm leading-6 text-slate-500">
                        {rating.review}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </UnitSectionCard>
  );
}

export default ResourceRatings;
