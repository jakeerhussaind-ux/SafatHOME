export type Lang = "en" | "ar";
export type Words = [string, string];
export const say = (words: Words, lang: Lang) => words[lang === "ar" ? 1 : 0];

export const categories = {
  living: ["Living Room", "غرفة المعيشة"],
  bedroom: ["Bedroom", "غرفة النوم"],
  dining: ["Dining Room", "غرفة الطعام"],
  outdoor: ["Outdoor", "المساحات الخارجية"],
} satisfies Record<string, Words>;
export type Category = keyof typeof categories;

export const preferences = [
  { warm: ["Warm Neutrals", "درجات حيادية دافئة"], earthy: ["Earthy Tones", "درجات ترابية"], cool: ["Cool Neutrals", "درجات حيادية باردة"] },
  { modern: ["Modern", "عصري"], minimal: ["Minimal", "بسيط"], natural: ["Natural", "طبيعي"] },
  { daylight: ["Bright Daylight", "ضوء نهار ساطع"], soft: ["Soft & Cozy", "إضاءة ناعمة ودافئة"], evening: ["Evening Glow", "وهج المساء"] },
] satisfies Record<string, Words>[];

export type Product = {
  id: string;
  name: Words;
  variant: Words;
  size: string;
  price: number; // Whole fils
  available: boolean;
};

export type Room = {
  id: string;
  name: Words;
  category: Category;
  description: Words;
  tags: string[];
  products: Product[];
};

const product = (id: string, name: Words, variant: Words, size: string, price: number, available = true): Product =>
  ({ id, name, variant, size, price, available });

export const rooms: Room[] = [
  {
    id: "quiet-mornings", name: ["Quiet Mornings", "صباح هادئ"], category: "living",
    description: ["Soft linen, warm walnut and sunlit neutrals make this living room an easy place to slow down.", "كتان ناعم وجوز دافئ ودرجات حيادية مضيئة تمنح غرفة المعيشة إحساساً بالهدوء."],
    tags: ["warm", "minimal", "daylight"],
    products: [
      product("linen-sofa", ["Noura Linen Sofa", "أريكة نورة الكتانية"], ["Ivory linen · 3-seater", "كتان عاجي · ثلاثة مقاعد"], "220 × 92 × 82", 199000),
      product("walnut-table", ["Rami Walnut Coffee Table", "طاولة قهوة رامي من خشب الجوز"], ["Dark walnut · Round", "جوز داكن · مستديرة"], "80 × 80 × 42", 69000),
      product("arc-lamp", ["Luma Arc Floor Lamp", "مصباح لوما الأرضي المقوس"], ["Matte black", "أسود مطفي"], "45 × 110 × 190", 49000, false),
    ],
  },
  {
    id: "olive-hour", name: ["The Olive Hour", "ساعة الزيتون"], category: "living",
    description: ["A deep olive sectional and pale stone create a relaxed room with an earthy palette.", "أريكة زيتونية وطاولة حجرية فاتحة تضيفان لمسة ترابية مريحة."],
    tags: ["earthy", "modern", "soft"],
    products: [
      product("olive-sofa", ["Zaina Sectional", "أريكة زينة الركنية"], ["Olive velvet · Right chaise", "مخمل زيتوني · امتداد يمين"], "290 × 170 × 86", 389000),
      product("stone-table", ["Mina Travertine Table", "طاولة مينا من الترافرتين"], ["Natural travertine", "ترافرتين طبيعي"], "105 × 65 × 38", 129000),
    ],
  },
  {
    id: "soft-retreat", name: ["The Soft Retreat", "ملاذ هادئ"], category: "bedroom",
    description: ["An upholstered bed and a small walnut nightstand set the tone for quiet evenings.", "سرير مبطن وطاولة جانبية من الجوز لأمسيات هادئة."],
    tags: ["warm", "minimal", "soft"],
    products: [
      product("linen-bed", ["Dalia Upholstered Bed", "سرير داليا المبطن"], ["Sand fabric · King", "قماش رملي · كينغ"], "195 × 215 × 105", 249000),
      product("nightstand", ["Dana Nightstand", "طاولة دانة الجانبية"], ["Walnut · 1 drawer", "جوز · درج واحد"], "46 × 42 × 52", 59000),
    ],
  },
  {
    id: "around-the-table", name: ["Around the Table", "حول المائدة"], category: "dining",
    description: ["An oval oak table and upholstered seating make room for long lunches and good company.", "طاولة بلوط بيضاوية ومقاعد مبطنة تناسب وجبات الغداء الطويلة واللقاءات الجميلة."],
    tags: ["warm", "natural", "daylight"],
    products: [
      product("dining-table", ["Sami Oak Dining Table", "طاولة طعام سامي من البلوط"], ["Natural oak · Seats six", "بلوط طبيعي · ستة مقاعد"], "180 × 95 × 76", 229000),
      product("dining-chair", ["Leen Dining Chair", "كرسي طعام لين"], ["Beige fabric · Oak frame", "قماش بيج · إطار بلوط"], "50 × 58 × 82", 55000),
    ],
  },
  {
    id: "open-air", name: ["Open Air", "في الهواء الطلق"], category: "outdoor",
    description: ["Airy textures and natural teak bring a little calm to the terrace.", "خامات خفيفة وخشب الساج الطبيعي يضفيان هدوءاً على التراس."],
    tags: ["earthy", "natural", "daylight"],
    products: [
      product("teak-seat", ["Joud Outdoor Loveseat", "أريكة جود الخارجية"], ["Teak · Ivory cushions", "ساج · وسائد عاجية"], "150 × 82 × 78", 189000),
      product("parasol", ["Shams Patio Parasol", "مظلة شمس للتراس"], ["Cream canopy", "غطاء كريمي"], "250 × 250 × 240", 79000),
    ],
  },
];

export const roomTotal = (room: Room) => room.products.reduce((sum, item) => sum + (item.available ? item.price : 0), 0);
export const money = (fils: number, lang: Lang) =>
  new Intl.NumberFormat(lang === "ar" ? "ar-KW" : "en-KW", { style: "currency", currency: "KWD", currencyDisplay: "code" })
    .format(fils / 1000);
