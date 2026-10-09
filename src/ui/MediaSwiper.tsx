import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Media } from "../types/ChaletSchema";
import { HotelMedia } from "../types/HotelSchema";
import { ReactNode } from "react";

type MediaSwiperProps = {
  medias: Media[] | HotelMedia[];
  autoplay?: boolean;
  overlayContent?: ReactNode;
};

function isVideo(type: string, url: string) {
  return (
    type?.toLowerCase().includes("video") || /\.(mp4|webm|ogg|mov)$/i.test(url)
  );
}

export default function MediaSwiper({
  medias,
  autoplay = true,
  overlayContent,
}: MediaSwiperProps) {
  if (!medias?.length) return null;

  return (
    <section className="relative w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={
          autoplay
            ? {
                delay: 5000,
                disableOnInteraction: false,
              }
            : false
        }
        loop={medias.length > 1}
        className="h-[50vh] min-h-[350px] w-full lg:h-[80vh] xl:h-[110vh]"
      >
        {medias.map((media) => (
          <SwiperSlide key={media.id}>
            <div className="relative h-full w-full">
              {isVideo(media.type, media.url) ? (
                <video
                  src={media.url}
                  controls
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={media.url}
                  alt={`media-${media.id}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {overlayContent && (
        <>
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <div className="absolute bottom-8 z-10 w-full md:bottom-12">
            {overlayContent}
          </div>
        </>
      )}
    </section>
  );
}
