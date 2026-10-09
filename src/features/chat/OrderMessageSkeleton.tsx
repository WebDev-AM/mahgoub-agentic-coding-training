import { Skeleton } from "@mui/material";

export default function OrderMessageSkeleton() {
  return (
    <div className={`w-[80%] overflow-hidden rounded-3xl shadow-md`}>
      {/* Header */}
      <div className="bg-primary p-4">
        <Skeleton
          variant="text"
          width={96}
          height={20}
          sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
        />
        <div className="mt-2 flex justify-between">
          <Skeleton
            variant="text"
            width={80}
            height={16}
            sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
          />
          <Skeleton
            variant="text"
            width={64}
            height={16}
            sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
          />
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1">
            <Skeleton width={80} height={16} />
            <Skeleton width={120} height={12} />
          </div>
          <Skeleton width={64} height={24} />
        </div>

        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton variant="rounded" width={48} height={48} />
            <div className="flex-1">
              <Skeleton width={96} height={16} />
              <Skeleton width={64} height={12} />
            </div>
            <Skeleton width={64} height={16} />
          </div>
        ))}

        <div className="space-y-2 border-t pt-3">
          <Skeleton height={16} />
          <Skeleton height={16} />
          <Skeleton height={20} />
        </div>
      </div>
    </div>
  );
}
