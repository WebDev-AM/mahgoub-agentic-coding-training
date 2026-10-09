import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useMe } from "../features/authentication/useMe";
import PageSpinner from "../ui/PageSpinner";
import ProfileHeader from "../features/profile/ProfileHeader";
import { ProfileSections } from "../features/profile/ProfileSections";
import UserDetails from "../features/profile/UserDetails";
import UserReservations from "../features/profile/UserReservations";

function Profile() {
  const { user, isLoading } = useMe();

  const [active, setActive] = useState("overview");

  if (isLoading) return <PageSpinner />;
  if (!user) return <Navigate to={"/"} />;

  return (
    <div className="gap-spacing-y container-fix container flex flex-col py-6">
      <ProfileHeader />
      <ProfileSections active={active} setActive={setActive} />
      {active === "overview" && <UserDetails />}
      {active === "stays" && <UserReservations />}
    </div>
  );
}

export default Profile;
