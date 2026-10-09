import { useState } from "react";
import MediaPreview from "../../ui/MediaPreview";
import GalleryModal from "../../ui/GalleryModal";
import { Media } from "../../types/ChaletSchema";

const baseClass =
  "rounded-2xl shadow w-full sm:h-[320px] md:h-[400px] lg:h-[500px]";

function UnitsImages({ unitImages }: { unitImages: Media[] }) {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const openGallery = (index: number) => {
    setStartIndex(index);
    setOpen(true);
  };

  const count = unitImages.length;

  return (
    <>
      {/* ONE IMAGE */}
      {count === 1 && (
        <div
          className={`cursor-pointer ${baseClass}`}
          onClick={() => openGallery(0)}
        >
          <MediaPreview media={unitImages[0]} />
        </div>
      )}

      {/* TWO IMAGES */}
      {count === 2 && (
        <div
          className={`grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 ${baseClass}`}
        >
          {unitImages.map((media, i) => (
            <div
              key={media.url}
              className="h-40 cursor-pointer sm:h-full"
              onClick={() => openGallery(i)}
            >
              <MediaPreview media={media} />
            </div>
          ))}
        </div>
      )}

      {/* THREE OR MORE */}
      {count >= 3 && (
        <div
          className={`grid grid-cols-1 gap-2 sm:grid-cols-2 sm:grid-rows-2 sm:gap-4 ${baseClass}`}
        >
          {/* MAIN IMAGE */}
          <div
            className="h-40 cursor-pointer sm:row-span-2 sm:h-full"
            onClick={() => openGallery(0)}
          >
            <MediaPreview media={unitImages[0]} />
          </div>

          {/* SECOND + THIRD */}
          {unitImages.slice(1, 3).map((media, index) => {
            const realIndex = index + 1;
            const remaining = unitImages.length - 3;
            const isLast = index === 1 && remaining > 0;

            return (
              <div
                key={media.url}
                className="relative h-40 cursor-pointer sm:h-full"
                onClick={() => openGallery(realIndex)}
              >
                <MediaPreview media={media} />

                {isLast && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xl font-semibold text-white sm:text-2xl">
                    +{remaining}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <GalleryModal
        open={open}
        startIndex={startIndex}
        onClose={() => setOpen(false)}
        media={unitImages}
      />
    </>
  );
}

export default UnitsImages;
