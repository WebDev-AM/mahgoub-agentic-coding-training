import { useState } from "react";
import SectionsSwitcher, { SectionOption } from "../../ui/SectionsSwitcher";
import UpcomingReservations from "./UpcomingReservations";
import CompletedReservations from "./CompletedReservations";

const sections: SectionOption<number>[] = [
  {
    labelKey: "Upcoming",
    value: 0,
  },
  {
    labelKey: "History",
    value: 1,
  },
];

function UserReservations() {
  const [renderSection, setRenderSection] = useState(0);
  return (
    <div className="flex flex-col items-center gap-10 py-10">
      <SectionsSwitcher
        renderSection={renderSection}
        setRenderSection={setRenderSection}
        sections={sections}
        key={"reservations-switcher"}
      />
      {renderSection === 0 && <UpcomingReservations key={"upcoming"} />}
      {renderSection === 1 && <CompletedReservations key={"completed"} />}
    </div>
  );
}

export default UserReservations;
