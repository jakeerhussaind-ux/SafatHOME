"use client";

import { useEffect, useRef, useState } from "react";
import { categories, preferences, rooms, roomTotal, say, money, type Category, type Lang, type Product, type Room, type Words } from "./catalog";

const sections: Words[] = [
  ["Room", "الغرفة"], ["Color & Mood", "الألوان والإحساس"], ["Style Preference", "الطراز المفضل"],
  ["Lighting & Atmosphere", "الإضاءة والأجواء"], ["Maximum Budget", "الحد الأقصى للميزانية"],
];

const roomImage = (room: Room) => "/images/" + room.id + ".webp";
const productImage = (product: Product) => "/images/" + product.id + ".webp";

function Icon({ name }: { name: "bag" | "search" | "arrow" | "spark" | "close" }) {
  const paths = {
    bag: <><path d="M4 8h16l1 13H3L4 8Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></>,
    search: <><circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 5 5"/></>,
    arrow: <path d="M3 12h17m-6-6 6 6-6 6"/>,
    spark: <><path d="M12 2c0 6-4 10-10 10 6 0 10 4 10 10 0-6 4-10 10-10-6 0-10-4-10-10Z"/><path d="M20 2v4m-2-2h4"/></>,
    close: <path d="m5 5 14 14M19 5 5 19"/>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [route, setRoute] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Category | "all">("all");
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState<Room[] | null>(null);
  const [isDesigning, setDesigning] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const cartDialog = useRef<HTMLDialogElement>(null);
  const gallery = useRef<HTMLElement>(null);
  const t = (en: string, ar: string) => say([en, ar], lang);

  useEffect(() => {
    const sync = () => {
      const hash = location.hash.slice(1);
      setRoute(hash);
      setSelected([]);
      if (hash !== "gallery") window.scrollTo(0, 0);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    if (route === "gallery") gallery.current?.scrollIntoView();
  }, [route]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    if (isDesigning) dialog.current?.showModal();
    else dialog.current?.close();
  }, [isDesigning]);

  useEffect(() => {
    if (isCartOpen) cartDialog.current?.showModal();
    else cartDialog.current?.close();
  }, [isCartOpen]);

  const room = rooms.find((item) => "room/" + item.id === route);
  const available = room?.products.filter((item) => item.available) ?? [];
  const picked = available.filter((item) => selected.includes(item.id));
  const sum = (items: Product[]) => items.reduce((total, item) => total + item.price, 0);
  const query = search.trim().toLowerCase();
  const visible = rooms.filter((item) => (filter === "all" || item.category === filter) &&
    [item.name, categories[item.category], item.description].flat().some((name) => name.toLowerCase().includes(query)));
  const validBudget = from !== "" && to !== "" && Number(from) >= 0 && Number(to) >= Number(from)
    && [from, to].every((value) => /^\d+(\.\d{1,3})?$/.test(value));
  const optionList: [string, Words][] = Object.entries(step === 0 ? categories : preferences[step - 1] ?? {});
  const showResults = () => {
    const score = (item: Room) => choices.slice(1).filter((choice) => item.tags.includes(choice)).length;
    const lower = Math.round(Number(from) * 1000);
    const upper = Math.round(Number(to) * 1000);
    setResults(rooms.filter((item) => item.category === choices[0] && roomTotal(item) >= lower && roomTotal(item) <= upper)
      .sort((a, b) => score(b) - score(a) || roomTotal(a) - roomTotal(b)));
  };
  const roomCards = (list: Room[], fromResults = false) => (
    <div className="room-grid">
      {list.map((item) => (
        <a key={item.id} className="room-card" href={"#room/" + item.id} onClick={() => { if (fromResults) setDesigning(false); }}>
          <div className="room-image"><img src={roomImage(item)} alt={say(item.name, lang)} /></div>
          <div className="room-caption">
            <div><span className="eyebrow">{say(categories[item.category], lang)}</span><h3>{say(item.name, lang)}</h3><span className="price">{money(roomTotal(item), lang)}</span></div>
            <span className="round-arrow"><Icon name="arrow" /></span>
          </div>
        </a>
      ))}
    </div>
  );

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#" aria-label="SafatHOME"><span>Safat<span>HOME</span></span><small>صفاة هوم</small></a>
          <a className="header-nav" href="#gallery">{t("Room Inspirations", "إلهام الغرف")}</a>
          <div className="header-actions">
            <button type="button" className="language" onClick={() => setLang(lang === "en" ? "ar" : "en")} lang={lang === "en" ? "ar" : "en"}>{t("العربية", "English")}</button>
            <button type="button" className="cart-button" onClick={() => setCartOpen(true)} aria-label={t("Open demo cart", "افتح السلة التجريبية")}>
              <Icon name="bag" /><span>{cart.length}</span>
            </button>
          </div>
        </div>
      </header>

      {room ? (
        <main className="shell room-page">
          <a className="back-link" href="#gallery">‹ {t("Back to rooms", "العودة إلى الغرف")}</a>
          <div className="room-heading">
            <span className="eyebrow">{say(categories[room.category], lang)}</span>
            <h1>{say(room.name, lang)}</h1>
            <p>{say(room.description, lang)}</p>
          </div>
          <div className="shop-layout">
            <img className="room-photo" src={roomImage(room)} alt={say(room.name, lang)} />
            <section className="product-panel" aria-labelledby="shop-title">
              <h2 id="shop-title">{t("Shop the look", "تسوّق الإطلالة")}</h2>
              <p className="muted">{t("Demo products", "منتجات تجريبية")}</p>
              <label className="select-all"><input type="checkbox" checked={available.length > 0 && picked.length === available.length}
                onChange={(event) => setSelected(event.target.checked ? available.map((item) => item.id) : [])} />
                {t("Select all available", "اختر جميع المنتجات المتوفرة")}
              </label>
              <div className="product-list">
                {room.products.map((item) => (
                  <label className="product" key={item.id}>
                    <img src={productImage(item)} alt={say(item.name, lang)} />
                    <div>
                      <h3>{say(item.name, lang)}</h3>
                      <p>{say(item.variant, lang)}</p>
                      <p><bdi>{item.size}</bdi> {t("cm", "سم")}</p>
                      <strong>{money(item.price, lang)}</strong>
                      <span className={item.available ? "in-stock" : "out-stock"}>{item.available ? t("In stock", "متوفر") : t("Out of stock", "غير متوفر")}</span>
                    </div>
                    <input type="checkbox" aria-label={say(item.name, lang)} disabled={!item.available} checked={selected.includes(item.id)}
                      onChange={(event) => setSelected(event.target.checked ? [...selected, item.id] : selected.filter((id) => id !== item.id))} />
                  </label>
                ))}
              </div>
              <div className="total"><span>{t("Selected total", "إجمالي الاختيارات")}</span><strong aria-live="polite">{money(sum(picked), lang)}</strong></div>
              <button className="primary wide" disabled={!picked.length} onClick={() => { setCart(picked); setCartOpen(true); }}>{t("Add selected to demo cart", "أضف الاختيارات إلى السلة التجريبية")}</button>
            </section>
          </div>
        </main>
      ) : (
        <main>
          <section className="hero shell">
            <div className="hero-copy">
              <div className="eyebrow hero-kicker"><span />{t("THE SAFATHOME EDIT", "مختارات صفاة هوم")}</div>
              <h1>{t("Room", "إلهام")}<br /><em>{t("Inspirations", "الغرف")}</em></h1>
              <p>{t("Explore thoughtfully styled spaces and find the pieces that make them feel like home.", "استكشف مساحات منسّقة بعناية واعثر على القطع التي تمنح بيتك طابعه الخاص.")}</p>
              <div className="hero-actions">
                <button className="primary" onClick={() => { setResults(null); setStep(0); setDesigning(true); }}><Icon name="spark" />{t("Design your room", "صمّم غرفتك")}</button>
                <a className="underlink" href="#gallery">{t("Explore rooms", "استكشف الغرف")} <Icon name="arrow" /></a>
              </div>
            </div>
            <img className="hero-image" src={roomImage(rooms[0])} alt={t("A sunlit living room with an ivory linen sofa and walnut coffee table", "غرفة معيشة مشمسة بأريكة كتانية عاجية وطاولة قهوة من الجوز")} fetchPriority="high" />
          </section>

          <section className="gallery shell" id="gallery" ref={gallery}>
            <div className="gallery-heading">
              <div><span className="eyebrow">{t("SHOP THE LOOK", "تسوّق الإطلالة")}</span><h2>{t("Find your inspiration", "اعثر على إلهامك")}</h2></div>
              <label className="search"><Icon name="search" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("Search rooms", "ابحث عن الغرف")} aria-label={t("Search rooms", "ابحث عن الغرف")} /></label>
            </div>
            <div className="filters" aria-label={t("Filter by room", "تصفية حسب الغرفة")}>
              <button aria-pressed={filter === "all"} onClick={() => setFilter("all")}>{t("All rooms", "كل الغرف")}</button>
              {(Object.keys(categories) as Category[]).map((key) => <button key={key} aria-pressed={filter === key} onClick={() => setFilter(key)}>{say(categories[key], lang)}</button>)}
            </div>
            {visible.length ? roomCards(visible) : <p className="empty">{t("No rooms match your search.", "لا توجد غرف تطابق البحث.")}</p>}
          </section>
        </main>
      )}

      <footer className="site-footer"><div className="shell"><strong>SafatHOME</strong><span>{t("Room Inspirations · Demo experience", "إلهام الغرف · تجربة تجريبية")}</span></div></footer>

      <dialog ref={dialog} className="design-dialog" onClose={() => setDesigning(false)} aria-labelledby="design-title">
        <div className="dialog-inner">
          <div className="dialog-top"><span className="eyebrow">{t("ROOM INSPIRATIONS", "إلهام الغرف")}</span><button className="icon-button" onClick={() => setDesigning(false)} aria-label={t("Close design panel", "أغلق لوحة التصميم")}><Icon name="close" /></button></div>
          <h2 id="design-title">{results ? t("Your room matches", "الغرف المطابقة") : t("Design your room", "صمّم غرفتك")}</h2>
          {results ? (
            <>
              <p className="muted">{results.length ? t("Prepared rooms within your budget, ordered by how closely they match your choices.", "غرف منسّقة ضمن ميزانيتك، مرتبة حسب توافقها مع اختياراتك.") : t("No rooms match your budget. Try a wider range.", "لا توجد غرف ضمن ميزانيتك. جرّب نطاقاً أوسع.")}</p>
              {results.length > 0 && roomCards(results, true)}
              <div className="dialog-bottom"><button className="secondary" onClick={() => setResults(null)}>{t("Adjust budget", "عدّل الميزانية")}</button></div>
            </>
          ) : (
            <>
              <ol className="steps">{sections.map((section, index) => <li key={section[0]}><button disabled={index > step} aria-current={index === step ? "step" : undefined} onClick={() => setStep(index)}>{index + 1}<span>{say(section, lang)}</span></button></li>)}</ol>
              <h3 className="step-title">{say(sections[step], lang)}</h3>
              {step === 4 ? (
                <>
                  <p className="muted">{t("Set a range for the available products in the room.", "حدد نطاق ميزانيتك للمنتجات المتوفرة في الغرفة.")}</p>
                  <div className="budget">
                    <label>{t("From (KWD)", "من (د.ك)")}<input type="text" inputMode="decimal" value={from} onChange={(event) => setFrom(event.target.value.replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))).replace("٫", "."))} placeholder="0" dir="ltr" /></label>
                    <label>{t("To (KWD)", "إلى (د.ك)")}<input type="text" inputMode="decimal" value={to} onChange={(event) => setTo(event.target.value.replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))).replace("٫", "."))} placeholder="500" dir="ltr" /></label>
                  </div>
                  {from && to && !validBudget && <p className="out-stock" role="alert">{t("Enter a nonnegative range with up to three decimal places. To must be at least From.", "أدخل نطاقاً غير سالب حتى ثلاث خانات عشرية. يجب ألا يقل الحد الأعلى عن الحد الأدنى.")}</p>}
                </>
              ) : (
                <div className="options">{optionList.map(([key, label]) => <label key={key} className={choices[step] === key ? "option chosen" : "option"}>
                  <input type="radio" name={"choice-" + step} checked={choices[step] === key} onChange={() => setChoices(choices.map((value, index) => index === step ? key : value))} />{say(label, lang)}
                </label>)}</div>
              )}
              <div className="dialog-bottom">
                {step > 0 && <button className="secondary" onClick={() => setStep(step - 1)}>{t("Back", "رجوع")}</button>}
                <button className="primary" disabled={step === 4 ? !validBudget : !choices[step]} onClick={() => step < 4 ? setStep(step + 1) : showResults()}>
                  {step === 4 ? t("Find matching rooms", "اعثر على الغرف المطابقة") : t("Continue", "متابعة")}<Icon name="arrow" />
                </button>
              </div>
            </>
          )}
        </div>
      </dialog>

      <dialog ref={cartDialog} className="cart-dialog" onClose={() => setCartOpen(false)} aria-labelledby="cart-title">
        <div className="dialog-inner">
          <div className="dialog-top"><span className="eyebrow">{t("SAFATHOME DEMO", "تجربة صفاة هوم")}</span><button className="icon-button" onClick={() => setCartOpen(false)} aria-label={t("Close demo cart", "أغلق السلة التجريبية")}><Icon name="close" /></button></div>
          <h2 id="cart-title">{t("Demo cart", "السلة التجريبية")}</h2>
          {cart.length ? <ul className="cart-items">{cart.map((item) => <li key={item.id}><img src={productImage(item)} alt="" /><div><strong>{say(item.name, lang)}</strong><small>{say(item.variant, lang)}</small><span>{money(item.price, lang)}</span></div><button className="icon-button" aria-label={t("Remove " + item.name[0], "أزل " + item.name[1])} onClick={() => setCart(cart.filter((entry) => entry.id !== item.id))}><Icon name="close" /></button></li>)}</ul> :
            <p className="muted">{t("Your demo cart is empty.", "سلتك التجريبية فارغة.")}</p>}
          <div className="total"><span>{t("Cart total", "إجمالي السلة")}</span><strong aria-live="polite">{money(sum(cart), lang)}</strong></div>
          <button className="primary wide" onClick={() => setCartOpen(false)}>{t("Continue exploring", "تابع الاستكشاف")}</button>
        </div>
      </dialog>
    </>
  );
}
