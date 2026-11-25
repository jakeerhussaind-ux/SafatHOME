import type { Metadata } from "next";
import RoomStudio from "../../features/room-inspirations/RoomStudio";

export const metadata: Metadata = { title: "Room Inspirations | SafatHOME" };

export default function RoomInspirationsPage() {
  return <RoomStudio />;
}
