import data from "./catalogue.json";
import imageData from "./visuals.json";

type Room = { name: string; description: string; looks: Record<string, string[]> };
type Palette = { name: string; cloth: string; wood: string };
type Product = { name: string; kind: string; priceFils: number; available: boolean };
type Look = { width: number; height: number; items: { x: number; y: number; finish?: string }[] };

export const rooms: Record<string, Room> = data.rooms;
export const palettes: Record<string, Palette> = data.palettes;
export const products: Record<string, Product> = data.products;
export const looks: Record<string, Look> = imageData;
export const finishes: Record<string, Record<string, string>> = data.finishes;
export const moods: Record<string, string> = { calm: "Calm & Minimal", cozy: "Warm & Cosy" };
export const formatPrice = (fils: number) =>
  new Intl.NumberFormat("en-KW", { style: "currency", currency: "KWD", currencyDisplay: "code" }).format(fils / 1000);
