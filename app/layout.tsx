import type { Metadata } from "next";
import "./style.css";

export const metadata: Metadata = {
  title: "Room Inspirations | SafatHOME",
  description: "Explore styled rooms and shop the look in the SafatHOME demo.",
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
