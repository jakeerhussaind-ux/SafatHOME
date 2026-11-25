"use strict";

const data = JSON.parse(document.querySelector("#catalogue-data").textContent);
const moods = { calm: "Calm & Minimal", cozy: "Warm & Cosy" };
const state = { room: "bedroom", mood: "calm", palette: "sand" };
const selected = new Set();
const get = (id) => document.getElementById(id);
const text = (value) => String(value).replace(/[&<>"']/g, (character) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const cost = (fils) => new Intl.NumberFormat("en-KW", {
  style: "currency", currency: "KWD", currencyDisplay: "code",
}).format(fils / 1000);

function radioOptions(id, values, key) {
  get(id).innerHTML = Object.entries(values).map(([value,label]) => {
    const p = key === "palette" ? data.palettes[value] : undefined;
    const swatch = p ? `<span class="swatch" aria-hidden="true" style="background:linear-gradient(135deg,${p.cloth} 50%,${p.wood} 50%)"></span>` : "";
    return `<label class="option"><input type="radio" name="${key}" value="${value}" ${state[key] === value ? "checked" : ""}>${swatch}${text(label)}</label>`;
  }).join("");
  get(id).addEventListener("change", (event) => {
    state[key] = event.target.value;
    selected.clear();
    render();
  });
}

function renderTotal() {
  const total = [...selected].reduce((sum, id) => sum + data.products[id].priceFils, 0);
  get("total").textContent = "Selected total · " + cost(total);
}

function render() {
  const room = data.rooms[state.room];
  const palette = data.palettes[state.palette];
  const visual = data.visuals[[state.room,state.mood,state.palette].join("-")];
  const ids = room.looks[state.mood];
  get("room-name").textContent = room.name + " · " + moods[state.mood];
  get("room-description").textContent = room.description;
  get("scene").innerHTML = `<img width="${visual.width}" height="${visual.height}"
    alt="${text(room.name + " furnished scene, " + moods[state.mood] + ", " + palette.name)}" src="${visual.scene}">` +
    visual.items.map((item,index) => `<a class="hotspot" href="#piece-${ids[index]}"
      aria-label="See ${text(data.products[ids[index]].name)}" aria-controls="piece-${ids[index]}" style="left:${item.x}%;top:${item.y}%">${index+1}</a>`).join("");
  get("products").innerHTML = ids.map((id,index) => {
    const item = data.products[id];
    const asset = visual.items[index];
    const finish = asset.finish ?? data.finishes[item.kind][state.palette];
    return `<article class="product-card" id="piece-${id}" aria-labelledby="title-${id}" tabindex="-1">
      <div class="product-photo"><img src="${asset.image}" alt="${text(item.name)} detail from the room">
      <span class="photo-number" aria-hidden="true">${index+1}</span></div>
      <div class="product-details">
        <h3 id="title-${id}">${text(item.name)}</h3><p>${text(finish)}</p>
        <div class="product-meta"><strong>${cost(item.priceFils)}</strong>
          <span class="${item.available ? "in-stock" : "out-stock"}">${item.available ? "In stock" : "Out of stock"}</span></div>
        <label class="select-product"><input type="checkbox" value="${id}" ${item.available ? "" : "disabled"} aria-label="Select ${text(item.name)}"> Select product</label>
      </div></article>`;
  }).join("");
  renderTotal();
}

get("products").addEventListener("change", (event) => {
  const item = event.target;
  if (item.checked) selected.add(item.value);
  else selected.delete(item.value);
  renderTotal();
});
get("scene").addEventListener("click", (event) => {
  const link = event.target.closest(".hotspot");
  if (!link) return;
  event.preventDefault();
  const card = get(link.hash.slice(1));
  for (const marker of get("scene").querySelectorAll(".hotspot")) {
    marker.classList.toggle("active", marker === link);
  }
  for (const product of get("products").querySelectorAll(".product-card")) {
    product.classList.toggle("active", product === card);
  }
  card.focus({ preventScroll: true });
  card.scrollIntoView({ block: "nearest" });
});
radioOptions("rooms", Object.fromEntries(Object.entries(data.rooms).map(([id,room]) => [id,room.name])), "room");
radioOptions("moods", moods, "mood");
radioOptions("palettes", Object.fromEntries(Object.entries(data.palettes).map(([id,palette]) => [id,palette.name])), "palette");
render();
