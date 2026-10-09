import "../services/swipe.css";
import { Modal, IconButton, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { IoClose } from "react-icons/io5";
import { Media } from "../types/ChaletSchema";
import { useRef } from "react";

type GalleryModalProps = {
  open: boolean;
  startIndex: number;
  media: Media[];
  onClose: () => void;
};

function GalleryModal({ open, media, startIndex, onClose }: GalleryModalProps) {
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  const handleSlideChange = () => {
    videoRefs.current.forEach((video) => {
      if (video && !video.paused) {
        video.pause();
      }
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="media-gallery"
      sx={{ bgcolor: "rgba(0,0,0,0.7)" }}
    >
      <Box className="relative flex h-screen w-screen items-center justify-center">
        {/* Close button */}
        <IconButton
          onClick={onClose}
          className="!absolute top-4 right-4 z-50 rounded-full bg-white/80! p-1! text-red-500! transition-colors hover:bg-white!"
        >
          <IoClose size={28} />
        </IconButton>

        {/* Swiper container */}
        <Box className="h-full w-full max-w-6xl">
          <Swiper
            modules={[Navigation, Pagination]}
            initialSlide={startIndex}
            navigation
            pagination={{ clickable: true }}
            loop
            className="h-full"
            onSlideChange={handleSlideChange}
          >
            {media.map((item, index) => (
              <SwiperSlide key={`${item.url}-${index}`}>
                <div className="flex h-full items-center justify-center">
                  {item.type === "video" ? (
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current[index] = el;
                      }}
                      src={item.url}
                      controls
                      className="max-h-[75vh] max-w-full"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt=""
                      className="max-h-[75vh] max-w-full object-contain"
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>
    </Modal>
  );
}

export default GalleryModal;
