import { Media } from "../types/ChaletSchema";

export default function MediaPreview({ media }: { media: Media }) {
  if (media.type === "video") {
    return (
      <video
        src={media.url}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
      />
    );
  }

  return <img src={media.url} className="h-full w-full object-cover" alt="" />;
}
