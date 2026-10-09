import { useMemo } from "react";
import { t } from "i18next";
import { RoomGroup } from "../../../types/HotelSchema";
import PageSpinner from "../../../ui/PageSpinner";
import Paragraph from "../../../ui/Paragraph";
import RoomCard from "./RoomCard";
import { useHotelCartContext } from "../../../contexts/HotelCartContext";

type RoomsWrapperProps = {
  isLoading: boolean;
  roomGroups?: RoomGroup[];
};

function RoomsWrapper({ isLoading, roomGroups = [] }: RoomsWrapperProps) {
  const { cartItem, addRoom, increaseRoom, decreaseRoom, removeRoom } =
    useHotelCartContext();

  const selectedRoomsMap = useMemo(() => {
    const map: Record<number, number> = {};
    cartItem?.selectedRooms.forEach((item) => {
      map[item.unitType.id] = item.count;
    });
    return map;
  }, [cartItem]);

  if (isLoading) return <PageSpinner />;

  if (!roomGroups.length)
    return (
      <Paragraph className="text-black/70">
        {t("There is no rooms with these filters")}
      </Paragraph>
    );

  return (
    <div className="flex flex-1 flex-col gap-5">
      {roomGroups.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          selectedCount={selectedRoomsMap[room.id] ?? 0}
          onAddRoom={() => addRoom(room)}
          onIncreaseRoom={() => increaseRoom(room.id)}
          onDecreaseRoom={() => decreaseRoom(room.id)}
          onRemoveRoom={() => removeRoom(room.id)}
        />
      ))}
    </div>
  );
}

export default RoomsWrapper;
