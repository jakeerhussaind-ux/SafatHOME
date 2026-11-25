"use client";

import { useState } from "react";
import { finishes, formatPrice, looks, moods, palettes, products, rooms } from "./catalogue";
import styles from "./studio.module.css";

type Choice = { id: string; label: string; swatch?: string };

function Picker({ label, choices, value, onChange }: {
  label: string;
  choices: Choice[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <fieldset className={styles.picker}>
      <legend>{label}</legend>
      {choices.map((choice) => (
        <label className={styles.option} key={choice.id}>
          <input name={label} type="radio" checked={choice.id === value} onChange={() => onChange(choice.id)} />
          {choice.swatch && <span className={styles.swatch} style={{ background: choice.swatch }} aria-hidden="true" />}
          {choice.label}
        </label>
      ))}
    </fieldset>
  );
}

export default function RoomStudio() {
  const [roomId, setRoom] = useState(Object.keys(rooms)[0]);
  const [mood, setMood] = useState(Object.keys(rooms[roomId].looks)[0]);
  const [palette, setPalette] = useState(Object.keys(palettes)[0]);
  const [active, setActive] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const room = rooms[roomId];
  const key = [roomId, mood, palette].join("-");
  const look = looks[key];
  const items = room.looks[mood];
  const total = selected.reduce((sum, id) => sum + products[id].priceFils, 0);
  const availablePalettes = (id: string, ambience: string) =>
    Object.keys(palettes).filter((tone) => looks[[id, ambience, tone].join("-")]);
  const clearShopping = () => { setSelected([]); setActive(""); };
  const chooseMood = (id: string) => {
    const available = availablePalettes(roomId, id);
    setMood(id);
    if (!available.includes(palette)) setPalette(available[0]);
    clearShopping();
  };
  const chooseRoom = (id: string) => {
    const ambience = rooms[id].looks[mood] ? mood : Object.keys(rooms[id].looks)[0];
    const available = availablePalettes(id, ambience);
    setRoom(id);
    setMood(ambience);
    if (!available.includes(palette)) setPalette(available[0]);
    clearShopping();
  };

  return (
    <div className={styles.studio}>
      <header className={styles.header}><div className={styles.shell}>
        <span className={styles.brand}>SafatHOME</span><a href="#shop-the-room">Shop the room ↓</a>
      </div></header>
      <main className={styles.shell}>
        <div className={styles.intro}><h1>Room Inspirations</h1><p>Choose a room, ambience and palette to explore a look.</p></div>
        <div className={styles.workspace}>
          <aside className={styles.controls} aria-label="Room settings">
            <Picker label="Room" value={roomId} onChange={chooseRoom}
              choices={Object.entries(rooms).map(([id, item]) => ({ id, label: item.name }))} />
            <Picker label="Ambience" value={mood} onChange={chooseMood}
              choices={Object.keys(room.looks).map((id) => ({ id, label: moods[id] }))} />
            <Picker label="Colour palette" value={palette} onChange={(id) => { setPalette(id); clearShopping(); }}
              choices={availablePalettes(roomId, mood).map((id) => ({
                id, label: palettes[id].name,
                swatch: "linear-gradient(135deg," + palettes[id].cloth + " 50%," + palettes[id].wood + " 50%)",
              }))} />
          </aside>
          <figure className={styles.figure}>
            <div className={styles.scene}>
              <img src={"/room-inspirations/" + key + ".webp"} width={look.width} height={look.height}
                alt={room.name + " furnished in " + palettes[palette].name} />
              {items.map((id, index) => (
                <a key={id} href={"#piece-" + id} className={styles.marker} aria-label={"See " + products[id].name}
                  aria-current={active === id ? "true" : undefined} style={{ left: look.items[index].x + "%", top: look.items[index].y + "%" }}
                  onClick={(event) => {
                    event.preventDefault();
                    setActive(id);
                    const card = document.getElementById("piece-" + id);
                    card?.focus({ preventScroll: true });
                    card?.scrollIntoView({ block: "nearest" });
                  }}>{index + 1}</a>
              ))}
            </div>
            <figcaption><h2 aria-live="polite">{room.name} · {moods[mood]}</h2><p>{room.description}</p></figcaption>
          </figure>
        </div>
        <section className={styles.catalogue} aria-labelledby="shop-the-room">
          <div className={styles.sectionHeader}><div><h2 id="shop-the-room">Shop the room</h2>
            <p>Products, images, KWD prices and stock are demo data.</p></div>
            <output aria-live="polite">Selected total · {formatPrice(total)}</output>
          </div>
          <div className={styles.cards}>
            {items.map((id, index) => {
              const product = products[id];
              return <article key={id} id={"piece-" + id} tabIndex={-1} data-highlighted={active === id}>
                <div className={styles.thumbnail}>
                  <img src={"/room-inspirations/" + key + "-" + index + ".webp"} alt={product.name + " detail from room"} />
                  <span aria-hidden="true">{index + 1}</span>
                </div>
                <div className={styles.details}>
                  <h3>{product.name}</h3><p>{look.items[index].finish ?? finishes[product.kind][palette]}</p>
                  <div className={styles.meta}><strong>{formatPrice(product.priceFils)}</strong><span>{product.available ? "In stock" : "Out of stock"}</span></div>
                  <label><input type="checkbox" disabled={!product.available} checked={selected.includes(id)}
                    aria-label={"Select " + product.name} onChange={(event) => {
                      const checked = event.target.checked;
                      setSelected((current) => checked ? [...current, id] : current.filter((item) => item !== id));
                    }} /> Select product</label>
                </div>
              </article>;
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
