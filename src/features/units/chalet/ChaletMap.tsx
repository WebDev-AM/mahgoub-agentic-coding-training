import { Button } from "@mui/material";
import { t } from "i18next";
import UnitSectionCard from "../UnitSectionCard";

type ChaletMapProps = {
  lat: number;
  long: number;
};

function ChaletMap({ lat, long }: ChaletMapProps) {
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2000!2d${long}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f18!5e0!3m2!1sen!2s!4v${Date.now()}`;
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${long}`;

  const handleOpenGoogleMaps = () => {
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <UnitSectionCard title={"Location"}>
      <iframe
        title="Google Map"
        src={mapEmbedUrl}
        className="w-full rounded-xl"
        allowFullScreen
        loading="lazy"
      />
      <Button
        variant="contained"
        onClick={handleOpenGoogleMaps}
        className="brand-button"
        sx={{ textTransform: "none" }}
      >
        {t("Show in map")}
      </Button>
    </UnitSectionCard>
  );
}

export default ChaletMap;
