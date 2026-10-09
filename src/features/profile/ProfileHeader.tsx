import { Avatar } from "@mui/material";
import { useMe } from "../authentication/useMe";
import { MdEmail, MdPhone } from "react-icons/md";
import { FaCamera, FaTrashAlt } from "react-icons/fa";
import { useWallet } from "../reservation/useWallet";
import PageSpinner from "../../ui/PageSpinner";
import { t } from "i18next";
import { useUploadProfileImage } from "./useUploadProfileImage";
import { useDeleteProfileImage } from "./useDeleteProfileImage";
import { useRef } from "react";
import ModalComponent from "../../ui/ModalComponent";
import ConfirmAction from "../../ui/ConfirmAction";

function ProfileHeader() {
  const { user } = useMe();
  const { wallet, isLoading } = useWallet();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadProfileImage, isUploading } = useUploadProfileImage();
  const { deleteProfileImage, isDeleting } = useDeleteProfileImage();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: validate file type and size
    if (!file.type.startsWith("image/")) {
      alert(t("Please select an image file"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(t("Image size should be less than 5MB"));
      return;
    }

    if (user?.id) {
      uploadProfileImage({ profileImage: file, userId: user.id });
    }
    // Reset file input value to allow uploading the same file again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isMutating = isUploading || isDeleting;

  return (
    <div className="flex flex-col items-center justify-between gap-10 rounded-4xl bg-[linear-gradient(90deg,#005AF1_0%,#004FDC_46.92%,#003969_100%)] p-8 text-white md:flex-row">
      <div className="xs:flex-row flex flex-col items-center gap-4">
        {/* Avatar with hover overlay */}
        <div className="relative">
          <Avatar
            key={Date.now()} // Force re-render when profileImage changes
            variant="square"
            src={user?.profileImage}
            className="!h-30 !w-30 !rounded-2xl"
          />
          {/* Overlay that appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-2xl bg-black/50 opacity-0 transition-opacity duration-200 hover:opacity-100">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isMutating}
              className="flex cursor-pointer items-center justify-center rounded-full bg-white p-2 text-blue-600 transition hover:bg-gray-100 disabled:opacity-50"
              aria-label={t("Upload profile image")}
            >
              <FaCamera size={16} />
            </button>
            {user?.profileImage && (
              <ModalComponent
                className="w-fit"
                openButton={
                  <button className="flex cursor-pointer items-center justify-center rounded-full bg-white p-2 text-red-600 transition hover:bg-gray-100 disabled:opacity-50">
                    <FaTrashAlt size={14} />
                  </button>
                }
                fitContent
              >
                <ConfirmAction
                  onConfirm={() => deleteProfileImage(user.id)}
                  disabled={isDeleting}
                />
              </ModalComponent>
            )}
          </div>
          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            disabled={isMutating}
          />
          {/* Optional loading spinner overlay when uploading/deleting */}
          {isMutating && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          )}
        </div>

        <div className="xs:items-start flex flex-col items-center justify-between">
          <h1 className="h1">{`${user?.firstName} ${user?.lastName}`}</h1>
          <p className="flex items-center gap-2">
            <MdEmail /> {user?.email}
          </p>
          {user?.phoneNumber && (
            <p className="flex items-center gap-2">
              <MdPhone /> {user?.phoneNumber}
            </p>
          )}
        </div>
      </div>
      <div className="flex h-30 w-35 flex-col items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#1A64D7_0%,#1A5CC6_100%)] text-xl font-semibold">
        {isLoading ? (
          <PageSpinner />
        ) : (
          <div>
            <span className="text-xl">{wallet?.balance}</span> {t("KWD")}
          </div>
        )}
        <p>{t("Wallet")}</p>
      </div>
    </div>
  );
}

export default ProfileHeader;
