import { useMe } from "../authentication/useMe";
import { t } from "i18next";
import ModalComponent from "../../ui/ModalComponent";
import UpdateUserForm from "../authentication/UpdateUserForm.tsx";
import { LuPencilLine } from "react-icons/lu";

function UserDetails() {
  const { user } = useMe();

  return (
    <div className="rounded-xl border border-gray-200 p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="h2">{t("Personal Information")}</h2>
        <ModalComponent
          fitContent
          openButton={
            <button className="text-primary flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-gray-50">
              <LuPencilLine className="text-base" />
              {t("Edit")}
            </button>
          }
        >
          <UpdateUserForm userToEdit={user!} />
        </ModalComponent>
      </div>

      <div className="grid grid-cols-[1fr] gap-6 md:grid-cols-[1fr_1fr]">
        <div>
          <span className="text-gray-500">{t("First Name")}</span>
          <div className="font-semibold">{user!.firstName}</div>
        </div>
        <div>
          <span className="text-gray-500">{t("Last Name")}</span>
          <div className="font-semibold">{user!.lastName}</div>
        </div>
        <div>
          <span className="text-gray-500">{t("Email")}</span>
          <div className="font-semibold">{user!.email}</div>
        </div>
        {user?.phoneNumber && (
          <>
            <div>
              <span className="text-gray-500">{t("Phone Number")}</span>
              <div className="font-semibold">{user!.phoneNumber}</div>
            </div>
            <div>
              <span className="text-gray-500">{t("Country")}</span>
              <div className="font-semibold">
                {user!.phoneNumber.startsWith("+20") ? t("Egypt") : t("Kuwait")}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UserDetails;
