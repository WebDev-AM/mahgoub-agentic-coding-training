import { Skeleton } from "@mui/material";

export default function ReservationMessageSkeleton() {
  return (
    <div className="w-[80%] min-w-[330px] overflow-hidden rounded-3xl shadow-md">
      {/* Header */}
      <div className="bg-primary px-4 py-3">
        <Skeleton
          variant="text"
          width={160}
          height={20}
          sx={{ bgcolor: "rgba(255,255,255,0.25)" }}
        />

        <div className="mt-2 flex justify-between">
          <Skeleton
            variant="text"
            width={90}
            height={14}
            sx={{ bgcolor: "rgba(255,255,255,0.25)" }}
          />
          <Skeleton
            variant="text"
            width={120}
            height={14}
            sx={{ bgcolor: "rgba(255,255,255,0.25)" }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="space-y-4 p-4">
        {/* Chalet Section */}
        <div className="border-border border-b pb-4">
          <div className="flex gap-3">
            {/* Image */}
            <Skeleton
              variant="rectangular"
              width={72}
              height={72}
              className="rounded"
            />

            {/* Text Content */}
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton width={140} height={16} />

              <div className="flex items-center gap-1">
                <Skeleton width={12} height={12} />
                <Skeleton width={120} height={12} />
              </div>

              {/* Entry / Exit */}
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <Skeleton width={12} height={12} />
                  <Skeleton width={70} height={12} />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton width={12} height={12} />
                  <Skeleton width={70} height={12} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="bg-primary-light space-y-3 rounded-xl p-5">
          <Skeleton width={140} height={18} />

          <div className="space-y-2">
            <Skeleton height={14} />
            <Skeleton height={14} />
            <Skeleton height={14} />
            <Skeleton height={14} />
            <Skeleton height={14} />
          </div>

          {/* Total */}
          <div className="flex justify-between pt-2">
            <Skeleton width={120} height={16} />
            <Skeleton width={80} height={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
