/* =========================================================
   Southern Spur Aesthetics — site logic
   Everything business-specific lives in CONFIG / SERVICES.
   ========================================================= */

const CONFIG = {
  // ZIP prefixes you serve (first 3 digits). Leave empty to accept every ZIP.
  serviceZipPrefixes: [],
  travelFee: 40,
  freeTravelOver: 250,      // subtotal that waives the travel fee
  groupDiscountMin: 4,      // guests needed for the group discount
  groupDiscountPct: 10,
  deposit: 50,
  leadTimeHours: 2,         // earliest bookable slot from now
  bookingWindowDays: 60,
  hours: {                  // 0 = Sunday … 6 = Saturday  [openHour, closeHour]
    0: [8, 17], 1: [8, 17], 2: [8, 17], 3: [8, 17], 4: [8, 17], 5: [8, 17], 6: [8, 17],
  },
  slotMinutes: 60,
  promoCodes: { GLOW50: { type: "flat", value: 50 }, VIP10: { type: "pct", value: 10 } },
  storageKey: "southernspur_appts",
};

const CATEGORIES = [
  { id: "injectables", label: "Injectables" },
  { id: "iv", label: "IV Therapy" },
  { id: "skin", label: "Skin Care" },
  { id: "glp1", label: "GLP-1 Weight Loss" },
];

const SERVICES = [
  // Injectables
  { id: "botox", cat: "injectables", name: "Botox / Dysport", price: 300, from: true, unit: "$12/unit · avg 25 units", dur: 30, tag: "Best seller",
    desc: "Smooth forehead lines, crow's feet and frown lines. Natural, refreshed results in 7–14 days." },
  { id: "lipflip", cat: "injectables", name: "Lip Flip", price: 150, dur: 20,
    desc: "A few units of neurotoxin to subtly roll the upper lip outward for a fuller look — no filler." },
  { id: "lipfiller", cat: "injectables", name: "Lip Filler", price: 650, unit: "per syringe", dur: 45, tag: "Popular",
    desc: "Hyaluronic acid filler for volume, shape and hydration. Juvéderm® & RHA® options." },
  { id: "dermalfiller", cat: "injectables", name: "Cheek, Chin & Jaw Filler", price: 750, unit: "per syringe", dur: 60,
    desc: "Restore volume and sculpt contours along the cheeks, chin, jawline and under-eyes." },
  { id: "kybella", cat: "injectables", name: "Kybella®", price: 600, unit: "per vial", dur: 30,
    desc: "Permanently dissolve stubborn fat under the chin. Typically 2–4 sessions." },
  { id: "consult", cat: "injectables", name: "Aesthetic Consultation", price: 0, dur: 20,
    desc: "Free 1:1 with a nurse injector to build a custom treatment plan. No obligation." },

  // IV therapy
  { id: "iv-hydrate", cat: "iv", name: "Hydration Drip", price: 175, dur: 45,
    desc: "1L saline + electrolytes. Rehydrate after travel, workouts, or a long week." },
  { id: "iv-myers", cat: "iv", name: "Myers' Cocktail", price: 199, dur: 45, tag: "Classic",
    desc: "Magnesium, calcium, B-complex and vitamin C for energy, immunity and recovery." },
  { id: "iv-recovery", cat: "iv", name: "Hangover Recovery", price: 189, dur: 45,
    desc: "Fluids, anti-nausea, anti-inflammatory and B-vitamins. Feel human again in under an hour." },
  { id: "iv-glow", cat: "iv", name: "Beauty Glow Drip", price: 225, dur: 45, tag: "Skin favorite",
    desc: "Biotin, vitamin C and a glutathione push for brighter, clearer, more radiant skin." },
  { id: "iv-immunity", cat: "iv", name: "Immunity Boost", price: 210, dur: 45,
    desc: "High-dose vitamin C, zinc and B-vitamins to help your body fight back." },
  { id: "iv-nad", cat: "iv", name: "NAD+ Infusion", price: 450, unit: "250mg", dur: 120,
    desc: "Cellular energy, mental clarity and healthy aging support. Slow, relaxing infusion." },
  { id: "b12", cat: "iv", name: "B12 Shot", price: 35, dur: 5, unit: "add-on",
    desc: "Quick energy and metabolism boost. Perfect add-on to any visit." },

  // Skin
  { id: "facial", cat: "skin", name: "Hydrating Glow Facial", price: 195, dur: 60,
    desc: "Medical-grade cleanse, exfoliation, extraction and hydration infusion. Instant glow." },
  { id: "peel", cat: "skin", name: "Chemical Peel", price: 175, dur: 45,
    desc: "Customized peel for tone, texture, acne and sun damage. Light to medium depth." },
  { id: "microneedle", cat: "skin", name: "Microneedling", price: 325, dur: 60, tag: "Collagen boost",
    desc: "Stimulate collagen to improve fine lines, scarring and pores with minimal downtime." },
  { id: "prp", cat: "skin", name: "PRP Microneedling", price: 550, dur: 90,
    desc: "The 'vampire facial' — microneedling with your own growth factors for accelerated renewal." },
  { id: "led", cat: "skin", name: "LED Light Therapy", price: 50, dur: 20, unit: "add-on",
    desc: "Red & blue light to calm inflammation, fight acne and support healing." },
  { id: "skinplan", cat: "skin", name: "Skin Analysis & Product Plan", price: 0, dur: 30,
    desc: "Complimentary skin assessment with a personalized medical-grade product routine." },

  // GLP-1
  { id: "glp-consult", cat: "glp1", name: "Medical Evaluation", sub: "Provider visit, vitals and lab review", chip: "Credited toward your first month", price: 99, dur: 45, tag: "Start here",
    desc: "Provider assessment, vitals, body composition and lab review. Credited toward month one." },
  { id: "glp-sema", cat: "glp1", name: "Semaglutide", sub: "Compounded, once-weekly injection", chip: "Supplies and check-ins included", price: 299, from: true, unit: "/month", dur: 30,
    desc: "Weekly GLP-1 injection, supplies, dosing plan and monthly check-in. Requires evaluation." },
  { id: "glp-tirz", cat: "glp1", name: "Tirzepatide", sub: "Compounded, once-weekly injection", chip: "Supplies and check-ins included", price: 449, from: true, unit: "/month", dur: 30, tag: "Most effective",
    desc: "Dual GIP/GLP-1 weekly injection with supplies & monthly check-in. Requires evaluation." },
  { id: "lipo", cat: "glp1", name: "Lipo-B Injection", sub: "MIC + B12 lipotropic injection", price: 45, dur: 5, unit: "add-on",
    desc: "MIC + B12 lipotropic injection to support metabolism and energy while on your program." },
];

// Each service uses images/<id>.jpg unless it sets its own `img`.
SERVICES.forEach((s) => { s.img ??= `images/${s.id}.jpg`; });

const FAQS = [
  ["Who performs the treatments?", "Every treatment is performed by a licensed Registered Nurse or Nurse Practitioner with advanced aesthetic training, under the supervision of our Medical Director."],
  ["What do I need to prepare at home?", "Just a well-lit space and a place to sit or recline. We bring sterile supplies, an IV pole, lighting, and everything else."],
  ["Is there a travel fee?", `Travel is free on visits over $${CONFIG.freeTravelOver}. Smaller visits have a $${CONFIG.travelFee} travel fee.`],
  ["What's your cancellation policy?", `Cancel or reschedule anytime with 24+ hours' notice for a full refund of your $${CONFIG.deposit} deposit. Late cancellations forfeit the deposit.`],
  ["How does the GLP-1 program work?", "Start with a medical evaluation (in-home or virtual). If you qualify, your provider prescribes semaglutide or tirzepatide, teaches you to self-inject, and checks in monthly to adjust your dose."],
  ["Do you accept HSA/FSA?", "Many IV and GLP-1 services are HSA/FSA eligible. We'll provide an itemized receipt — check with your plan administrator."],
  ["How long does Botox last?", "Results typically last 3–4 months. Most clients book touch-ups every 12–16 weeks."],
  ["Can I book for a group?", "Yes! Add guests in the booking flow, or request a party quote for 4+ guests. Groups of 4+ get 10% off and the host's treatment is free up to $300."],
];

/* ---------------- helpers ---------------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = (n) => (n < 0 ? "−" : "") + "$" + Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 0 });
const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseYmd = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const fmtTime = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return `${((h + 11) % 12) + 1}:${pad(m)} ${h < 12 ? "AM" : "PM"}`; };
const fmtDate = (s, opts = { weekday: "long", month: "long", day: "numeric" }) => parseYmd(s).toLocaleDateString(undefined, opts);
const svcById = (id) => SERVICES.find((s) => s.id === id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 3500);
}

const store = {
  all() { try { return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || []; } catch { return []; } },
  save(list) { try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(list)); } catch { /* storage unavailable */ } },
  upsert(appt) { const list = store.all().filter((a) => a.id !== appt.id); list.push(appt); store.save(list); },
};

function zipServed(zip) {
  if (!/^\d{5}$/.test(zip)) return false;
  return !CONFIG.serviceZipPrefixes.length || CONFIG.serviceZipPrefixes.some((p) => zip.startsWith(p));
}

/* ---------------- availability ---------------- */
// Deterministic pseudo-"already booked" slots so the calendar feels real.
// Replace with a call to your scheduling backend (Acuity, Boulevard, Vagaro, etc.).
function hash(str) { let h = 0; for (const c of str) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); }

function slotsFor(dateStr, ignoreId) {
  const d = parseYmd(dateStr);
  const [open, close] = CONFIG.hours[d.getDay()] || [0, 0];
  const earliest = Date.now() + CONFIG.leadTimeHours * 3600e3;
  const mine = store.all().filter((a) => a.status === "booked" && a.date === dateStr && a.id !== ignoreId).map((a) => a.time);
  const out = [];
  for (let m = open * 60; m < close * 60; m += CONFIG.slotMinutes) {
    const time = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
    const when = new Date(d); when.setHours(Math.floor(m / 60), m % 60);
    const taken = hash(dateStr + time) % 10 < 3 || mine.includes(time);
    out.push({ time, available: when.getTime() >= earliest && !taken });
  }
  return out;
}

function dateBookable(d) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const max = new Date(today); max.setDate(max.getDate() + CONFIG.bookingWindowDays);
  return d >= today && d <= max && slotsFor(ymd(d)).some((s) => s.available);
}

function nextAvailable() {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  for (let i = 0; i < 14; i++) {
    const slot = slotsFor(ymd(d)).find((s) => s.available);
    if (slot) {
      const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
      return `${label}, ${fmtTime(slot.time)}`;
    }
    d.setDate(d.getDate() + 1);
  }
  return "Call us";
}

/* ---------------- page sections ---------------- */
let activeTab = "injectables";

function renderTabs(container, current, onPick, cats = CATEGORIES) {
  container.innerHTML = cats.map((c) =>
    `<button type="button" role="tab" data-cat="${c.id}" class="${c.id === current ? "active" : ""}" aria-selected="${c.id === current}">${c.label}</button>`
  ).join("");
  container.onclick = (e) => { const b = e.target.closest("button[data-cat]"); if (b) onPick(b.dataset.cat); };
}

const ARROW = `<svg><use href="#i-arrow"/></svg>`;

function priceLine(s) {
  if (s.price === 0) return "<strong>Complimentary</strong>";
  return `${s.from ? "Starting at " : ""}<strong>${money(s.price)}${s.unit?.startsWith("/") ? esc(s.unit) : ""}</strong>${s.unit && !s.unit.startsWith("/") ? ` ${esc(s.unit)}` : ""}`;
}

// Set `img: "images/botox.jpg"` on a service to replace the placeholder art with a photo.
function productArt(s) {
  return `<div class="product__img product__img--${s.cat}">
    ${s.img ? `<img src="${esc(s.img)}" alt="${esc(s.name)}" loading="lazy">` : `<span class="shape shape--a"></span><span class="shape shape--b"></span>`}
    ${s.tag ? `<span class="product__badge">${esc(s.tag)}</span>` : ""}
  </div>`;
}

function productCard(s, i) {
  return `<article class="product${s.cat === "glp1" ? " product--glp" : ""}" style="animation-delay:${i * 40}ms">
    ${productArt(s)}
    <h3>${esc(s.name)}</h3>
    <p class="product__sub">${esc(s.sub || s.desc.split(". ")[0].replace(/\.$/, "") + ".")}</p>
    <p class="product__price">${priceLine(s)}</p>
    ${s.chip ? `<span class="product__save">${esc(s.chip)}</span>` : ""}
    <div class="product__actions">
      <button class="pill pill--dark" data-book="${s.id}">${s.cat === "glp1" ? "Get started" : "Book"}</button>
      <button class="pill pill--outline" data-detail="${s.id}">Learn more</button>
    </div>
    ${s.cat === "glp1" ? `<a href="#safety" class="product__link">Important safety information</a>` : ""}
  </article>`;
}

const PAGE_CATS = CATEGORIES.filter((c) => c.id !== "glp1");

function renderServices() {
  renderTabs($("#serviceTabs"), activeTab, (cat) => { activeTab = cat; renderServices(); }, PAGE_CATS);
  const track = $("#servicesGrid");
  track.innerHTML = SERVICES.filter((s) => s.cat === activeTab).map(productCard).join("");
  track.scrollLeft = 0;
  updateCarouselNav(track);
}

function renderGlp() {
  $("#glpTrack").innerHTML = SERVICES.filter((s) => s.cat === "glp1").map(productCard).join("");
}

function updateCarouselNav(track) {
  const nav = $(`[data-carousel="${track.id}"]`);
  if (!nav) return;
  const [prev, next] = $$("button", nav);
  prev.disabled = track.scrollLeft <= 2;
  next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
}

function openDetail(id) {
  const s = svcById(id);
  $("#detailBody").innerHTML = `
    <div class="detail__img product__img product__img--${s.cat}">${s.img ? `<img src="${esc(s.img)}" alt="">` : `<span class="shape shape--a"></span><span class="shape shape--b"></span>`}</div>
    <h3>${esc(s.name)}</h3>
    <p>${esc(s.desc)}</p>
    <div class="detail__meta">
      <div><span class="muted">Price</span><strong>${s.price ? (s.from ? "From " : "") + money(s.price) : "Complimentary"}</strong></div>
      <div><span class="muted">Duration</span><strong>${s.dur} min</strong></div>
      ${s.unit ? `<div><span class="muted">Pricing</span><strong>${esc(s.unit.replace(/^\//, "per "))}</strong></div>` : ""}
    </div>
    <button class="pill pill--dark pill--block" data-book="${s.id}">Book ${esc(s.name)} ${ARROW}</button>`;
  openModal("detailModal");
}

function renderFaq() {
  $("#faqList").innerHTML = FAQS.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");
}

/* ---------------- modals ---------------- */
function openModal(id) {
  $$(".modal.open").forEach((m) => closeModal(m.id));
  const m = $("#" + id);
  m.classList.add("open");
  m.setAttribute("aria-hidden", "false");
  $("#nav").classList.remove("open");
  $("#burger").setAttribute("aria-expanded", false);
  document.body.classList.add("lock");
  // skip autofocus on touch screens so the keyboard doesn't cover the sheet
  if (matchMedia("(hover: hover)").matches) setTimeout(() => m.querySelector("input, button:not(.modal__close)")?.focus(), 50);
}
function closeModal(id) {
  const m = $("#" + id);
  m.classList.remove("open");
  m.setAttribute("aria-hidden", "true");
  if (!$(".modal.open")) document.body.classList.remove("lock");
}

/* ---------------- booking wizard ---------------- */
const STEP_COUNT = 5;
let bk; // booking state

function freshBooking() {
  const today = new Date();
  return {
    step: 0, services: new Set(), tab: "injectables",
    date: null, time: null, calMonth: new Date(today.getFullYear(), today.getMonth(), 1),
    editingId: null, lastAppt: null,
  };
}

function openBooking(preselect) {
  bk = freshBooking();
  ["bAddress", "bCity", "bState", "bZip", "bAccess", "notes", "promo", "card", "exp", "cvc"].forEach((id) => ($("#" + id).value = ""));
  $("#bGuests").value = 1;
  $("#consent").checked = false;
  if (preselect) {
    bk.services.add(preselect);
    bk.tab = svcById(preselect)?.cat || bk.tab;
  }
  renderPicker();
  goStep(0);
  openModal("bookingModal");
}

function renderPicker() {
  renderTabs($("#bookTabs"), bk.tab, (cat) => { bk.tab = cat; renderPicker(); });
  $("#pickList").innerHTML = SERVICES.filter((s) => s.cat === bk.tab).map((s) => `
    <label>
      <input type="checkbox" value="${s.id}" ${bk.services.has(s.id) ? "checked" : ""}>
      <span class="pick__card">
        <span class="pick__box"></span>
        <span class="pick__info"><strong>${esc(s.name)}</strong><small>${s.dur} min${s.unit ? " · " + esc(s.unit) : ""}</small></span>
        <span class="pick__price">${s.price ? (s.from ? "from " : "") + money(s.price) : "Free"}</span>
      </span>
    </label>`).join("");
  updateCart();
}

function calcTotals() {
  const guests = Math.max(1, parseInt($("#bGuests").value) || 1);
  const items = [...bk.services].map(svcById);
  const perGuest = items.reduce((t, s) => t + s.price, 0);
  const subtotal = perGuest * guests;
  const duration = items.reduce((t, s) => t + s.dur, 0) * guests;
  const travel = subtotal >= CONFIG.freeTravelOver || subtotal === 0 ? 0 : CONFIG.travelFee;
  const group = guests >= CONFIG.groupDiscountMin ? Math.round(subtotal * CONFIG.groupDiscountPct / 100) : 0;
  const code = $("#promo").value.trim().toUpperCase();
  const promoDef = CONFIG.promoCodes[code];
  let promo = 0;
  if (promoDef) promo = Math.min(subtotal - group, promoDef.type === "flat" ? promoDef.value : Math.round((subtotal - group) * promoDef.value / 100));
  const total = Math.max(0, subtotal + travel - group - promo);
  return { items, guests, perGuest, subtotal, travel, group, promo, promoCode: promoDef ? code : "", total, duration };
}

function updateCart() {
  const t = calcTotals();
  const n = bk.services.size;
  $("#cartCount").textContent = `${n} treatment${n === 1 ? "" : "s"}${t.guests > 1 ? ` × ${t.guests} guests` : ""} · ~${t.duration} min`;
  $("#cartTotal").textContent = money(t.total);
}

function goStep(n) {
  bk.step = n;
  $$(".step").forEach((s) => s.classList.toggle("active", +s.dataset.step === n));
  $$("#progress li").forEach((li, i) => { li.classList.toggle("active", i === n); li.classList.toggle("done", i < n); });
  $("#progress").style.display = n >= STEP_COUNT ? "none" : "";
  $("#wizFoot").style.display = n >= STEP_COUNT ? "none" : "";
  $("#backBtn").style.visibility = n === 0 || (bk.editingId && n === 2) ? "hidden" : "visible";
  $("#nextBtn").textContent = n === STEP_COUNT - 1 ? (bk.editingId ? "Confirm New Time" : `Pay ${money(CONFIG.deposit)} Deposit & Book`) : "Continue";
  if (n === 2) renderCalendar();
  if (n === 4) renderSummary($("#summary"), currentDraft());
  $(".wizard__body").scrollTop = 0;
}

function setMsg(id, text) { $("#" + id).textContent = text || ""; }

function validateStep() {
  $$(".invalid").forEach((el) => el.classList.remove("invalid"));
  const need = (ids) => {
    const bad = ids.filter((id) => !$("#" + id).value.trim());
    bad.forEach((id) => $("#" + id).classList.add("invalid"));
    return bad.length === 0;
  };
  switch (bk.step) {
    case 0:
      if (!bk.services.size) { toast("Please choose at least one treatment"); return false; }
      return true;
    case 1: {
      if (!need(["bAddress", "bCity", "bState", "bZip"])) return setMsg("locMsg", "Please complete your address."), false;
      const zip = $("#bZip").value.trim();
      if (!zipServed(zip)) { $("#bZip").classList.add("invalid"); return setMsg("locMsg", "Sorry — that ZIP is outside our service area. Call us for travel options."), false; }
      setMsg("locMsg"); return true;
    }
    case 2:
      if (!bk.date || !bk.time) { toast("Please choose a date and time"); return false; }
      return true;
    case 3: {
      if (!need(["fName", "lName", "email", "phone", "dob"])) return setMsg("infoMsg", "Please fill in all required fields."), false;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#email").value.trim())) { $("#email").classList.add("invalid"); return setMsg("infoMsg", "Please enter a valid email."), false; }
      if ($("#phone").value.replace(/\D/g, "").length < 10) { $("#phone").classList.add("invalid"); return setMsg("infoMsg", "Please enter a valid phone number."), false; }
      const dob = new Date($("#dob").value); const age18 = new Date(); age18.setFullYear(age18.getFullYear() - 18);
      if (dob > age18) { $("#dob").classList.add("invalid"); return setMsg("infoMsg", "You must be 18 or older to book."), false; }
      if ($("#promo").value.trim() && !CONFIG.promoCodes[$("#promo").value.trim().toUpperCase()]) { $("#promo").classList.add("invalid"); return setMsg("infoMsg", "That promo code isn't valid."), false; }
      if (!$("#consent").checked) return setMsg("infoMsg", "Please accept the consent & deposit terms."), false;
      setMsg("infoMsg"); return true;
    }
    case 4: {
      if (bk.editingId) return true; // deposit already on file
      const card = $("#card").value.replace(/\D/g, "");
      const [mm, yy] = $("#exp").value.split("/").map(Number);
      const expOk = mm >= 1 && mm <= 12 && yy >= 0 && new Date(2000 + yy, mm) > new Date();
      if (card.length < 15 || !luhn(card)) { $("#card").classList.add("invalid"); return setMsg("payMsg", "Please enter a valid card number."), false; }
      if (!expOk) { $("#exp").classList.add("invalid"); return setMsg("payMsg", "Please enter a valid expiration (MM/YY)."), false; }
      if (!/^\d{3,4}$/.test($("#cvc").value)) { $("#cvc").classList.add("invalid"); return setMsg("payMsg", "Please enter a valid CVC."), false; }
      setMsg("payMsg"); return true;
    }
  }
  return true;
}

function luhn(num) {
  let sum = 0;
  [...num].reverse().forEach((d, i) => { let n = +d; if (i % 2) { n *= 2; if (n > 9) n -= 9; } sum += n; });
  return sum % 10 === 0;
}

function currentDraft() {
  const t = calcTotals();
  return {
    services: [...bk.services], date: bk.date, time: bk.time, duration: t.duration,
    location: {
      type: $("input[name=locType]:checked").value, address: $("#bAddress").value.trim(), city: $("#bCity").value.trim(),
      state: $("#bState").value.trim().toUpperCase(), zip: $("#bZip").value.trim(), guests: t.guests, access: $("#bAccess").value.trim(),
    },
    client: {
      first: $("#fName").value.trim(), last: $("#lName").value.trim(), email: $("#email").value.trim().toLowerCase(),
      phone: $("#phone").value.trim(), dob: $("#dob").value, prior: $("#prior").value, notes: $("#notes").value.trim(), sms: $("#smsOpt").checked,
    },
    totals: { subtotal: t.subtotal, travel: t.travel, group: t.group, promo: t.promo, promoCode: t.promoCode, total: t.total, deposit: CONFIG.deposit },
  };
}

function renderSummary(el, a) {
  const row = (k, v, cls = "") => `<div class="summary__row ${cls}"><span>${k}</span><span>${v}</span></div>`;
  const L = a.location, T = a.totals;
  el.innerHTML =
    a.services.map((id) => { const s = svcById(id); return row(esc(s.name) + (L.guests > 1 ? ` × ${L.guests}` : ""), s.price ? money(s.price * L.guests) : "Free"); }).join("") +
    row("When", a.date ? `${fmtDate(a.date)} · ${fmtTime(a.time)}` : "—") +
    row("Where", `${esc(L.type)} — ${esc(L.address)}, ${esc(L.city)} ${esc(L.state)} ${esc(L.zip)}`) +
    row("Est. duration", `${a.duration} min`) +
    row("Travel fee", T.travel ? money(T.travel) : "Free") +
    (T.group ? row(`Group discount (${CONFIG.groupDiscountPct}%)`, money(-T.group), "summary__row--discount") : "") +
    (T.promo ? row(`Promo ${esc(T.promoCode)}`, money(-T.promo), "summary__row--discount") : "") +
    row("Estimated total", money(T.total), "summary__row--total") +
    row("Due today (deposit)", money(T.deposit));
}

function renderCalendar() {
  const m = bk.calMonth;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  $("#calTitle").textContent = m.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  $("#calPrev").disabled = m <= new Date(today.getFullYear(), today.getMonth(), 1);
  const maxDate = new Date(today); maxDate.setDate(maxDate.getDate() + CONFIG.bookingWindowDays);
  $("#calNext").disabled = new Date(m.getFullYear(), m.getMonth() + 1, 1) > maxDate;

  const first = m.getDay();
  const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
  let html = "<span class='empty'></span>".repeat(first);
  for (let d = 1; d <= days; d++) {
    const date = new Date(m.getFullYear(), m.getMonth(), d);
    const key = ymd(date);
    const cls = [key === bk.date && "selected", +date === +today && "today"].filter(Boolean).join(" ");
    html += `<button type="button" data-date="${key}" class="${cls}" ${dateBookable(date) ? "" : "disabled"}>${d}</button>`;
  }
  $("#calGrid").innerHTML = html;
  renderSlots();
}

function renderSlots() {
  if (!bk.date) { $("#slotsDate").textContent = "Select a date"; $("#slotsGrid").innerHTML = ""; return; }
  $("#slotsDate").textContent = fmtDate(bk.date);
  const slots = slotsFor(bk.date, bk.editingId);
  const group = (label, list) => list.length ? `<span class="slots__group">${label}</span>` + list.map((s) =>
    `<button type="button" data-time="${s.time}" class="${s.time === bk.time ? "selected" : ""}" ${s.available ? "" : "disabled"}>${fmtTime(s.time)}</button>`).join("") : "";
  const hr = (s) => +s.time.slice(0, 2);
  $("#slotsGrid").innerHTML =
    group("Morning", slots.filter((s) => hr(s) < 12)) +
    group("Afternoon", slots.filter((s) => hr(s) >= 12 && hr(s) < 17)) +
    group("Evening", slots.filter((s) => hr(s) >= 17));
}

function confirmBooking() {
  const draft = currentDraft();
  let appt;
  if (bk.editingId) {
    appt = store.all().find((a) => a.id === bk.editingId);
    Object.assign(appt, { date: bk.date, time: bk.time, updatedAt: new Date().toISOString() });
    toast("Appointment rescheduled");
  } else {
    appt = { ...draft, id: crypto.randomUUID?.() || String(Date.now()), code: "SS-" + Math.random().toString(36).slice(2, 8).toUpperCase(), status: "booked", createdAt: new Date().toISOString() };
  }
  store.upsert(appt);
  bk.lastAppt = appt;
  $("#confCode").textContent = appt.code;
  $("#confEmail").textContent = appt.client.email;
  renderSummary($("#confSummary"), appt);
  $("#nextAvail").textContent = nextAvailable();
  goStep(STEP_COUNT);
}

function downloadIcs(a) {
  const start = parseYmd(a.date); const [h, m] = a.time.split(":").map(Number); start.setHours(h, m);
  const end = new Date(start.getTime() + Math.max(a.duration, 30) * 60e3);
  const stamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const names = a.services.map((id) => svcById(id).name).join(", ");
  const L = a.location;
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Southern Spur Aesthetics//EN", "BEGIN:VEVENT",
    `UID:${a.id}@southernspuraesthetics.com`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
    `SUMMARY:Southern Spur Aesthetics — ${names}`, `LOCATION:${L.address}\\, ${L.city}\\, ${L.state} ${L.zip}`,
    `DESCRIPTION:Confirmation ${a.code}. Questions? Call (555) 555-0123.`, "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  Object.assign(document.createElement("a"), { href: url, download: `southern-spur-${a.code}.ics` }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------------- my appointments ---------------- */
let lookupEmail = "";

function renderAppointments() {
  let list = store.all();
  if (lookupEmail) list = list.filter((a) => a.client.email === lookupEmail);
  list.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const el = $("#apptList");
  if (!list.length) {
    el.innerHTML = `<p class="muted">${lookupEmail ? "No appointments found for that email." : "No appointments on this device yet. Look one up by email above."}</p>
      <button class="pill pill--dark" data-book>Book an appointment</button>`;
    return;
  }
  const now = new Date();
  el.innerHTML = list.map((a) => {
    const start = parseYmd(a.date); const [h, m] = a.time.split(":").map(Number); start.setHours(h, m);
    const past = start < now;
    const status = a.status === "cancelled" ? "cancelled" : past ? "past" : "booked";
    const label = { cancelled: "Cancelled", past: "Completed", booked: "Upcoming" }[status];
    return `<div class="appt">
      <div class="appt__top"><strong>${fmtDate(a.date, { weekday: "short", month: "short", day: "numeric" })} · ${fmtTime(a.time)}</strong>
        <span class="appt__status ${status}">${label}</span></div>
      <p>${a.services.map((id) => esc(svcById(id)?.name)).join(", ")}</p>
      <p>${esc(a.location.address)}, ${esc(a.location.city)} · ${esc(a.code)}</p>
      ${status === "booked" ? `<div class="appt__actions">
        <button class="pill pill--outline" data-resched="${a.id}">Reschedule</button>
        <button class="pill pill--outline" data-ics="${a.id}">Calendar</button>
        <button class="pill pill--outline" data-cancel="${a.id}">Cancel</button></div>` : ""}
      ${status === "past" ? `<div class="appt__actions"><button class="pill pill--outline" data-rebook="${a.id}">Book again</button></div>` : ""}
    </div>`;
  }).join("");
}

function startReschedule(id) {
  const a = store.all().find((x) => x.id === id);
  if (!a) return;
  bk = freshBooking();
  bk.editingId = id;
  a.services.forEach((s) => bk.services.add(s));
  bk.date = a.date; bk.time = a.time;
  bk.calMonth = new Date(parseYmd(a.date).getFullYear(), parseYmd(a.date).getMonth(), 1);
  fillFormFrom(a);
  closeModal("appointmentsModal");
  openModal("bookingModal");
  updateCart();
  goStep(2);
}

function fillFormFrom(a) {
  const L = a.location, C = a.client;
  Object.entries({ bAddress: L.address, bCity: L.city, bState: L.state, bZip: L.zip, bGuests: L.guests, bAccess: L.access,
    fName: C.first, lName: C.last, email: C.email, phone: C.phone, dob: C.dob, notes: C.notes, promo: "" })
    .forEach(([id, v]) => ($("#" + id).value = v ?? ""));
  $$("input[name=locType]").forEach((r) => (r.checked = r.value === L.type));
  $("#consent").checked = true;
}

/* ---------------- wire up ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  renderServices();
  renderGlp();
  renderFaq();
  $$(".track").forEach((t) => { t.addEventListener("scroll", () => updateCarouselNav(t), { passive: true }); updateCarouselNav(t); });
  $$(".carousel-nav").forEach((nav) => nav.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-dir]"); if (!b) return;
    const t = $("#" + nav.dataset.carousel);
    t.scrollBy({ left: +b.dataset.dir * t.clientWidth * 0.75, behavior: "smooth" });
  }));
  addEventListener("resize", () => $$(".track").forEach(updateCarouselNav));
  $("#nextAvail").textContent = nextAvailable();

  // Mobile nav
  const burger = $("#burger"), nav = $("#nav");
  const setMenu = (open) => {
    if (open) nav.style.setProperty("--nav-top", `${$("#top").getBoundingClientRect().bottom}px`);
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("lock", open || !!$(".modal.open"));
  };
  burger.onclick = () => setMenu(!nav.classList.contains("open"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) setMenu(false); });
  matchMedia("(min-width: 1081px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  // Global click delegation
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-book],[data-detail],[data-open],[data-close],[data-tab],[data-resched],[data-cancel],[data-ics],[data-rebook]");
    if (!t) return;
    if (t.hasAttribute("data-book")) { e.preventDefault(); openBooking(t.dataset.book || null); }
    else if (t.dataset.detail) openDetail(t.dataset.detail);
    else if (t.dataset.open) {
      e.preventDefault();
      if (t.dataset.open === "appointments") { lookupEmail = ""; $("#lookupEmail").value = ""; renderAppointments(); openModal("appointmentsModal"); }
      if (t.dataset.open === "gift") openModal("giftModal");
    }
    else if (t.hasAttribute("data-close")) closeModal(t.closest(".modal").id);
    else if (t.dataset.tab) { activeTab = t.dataset.tab; renderServices(); }
    else if (t.dataset.resched) startReschedule(t.dataset.resched);
    else if (t.dataset.ics) downloadIcs(store.all().find((a) => a.id === t.dataset.ics));
    else if (t.dataset.rebook) { const a = store.all().find((x) => x.id === t.dataset.rebook); closeModal("appointmentsModal"); openBooking(); a.services.forEach((s) => bk.services.add(s)); fillFormFrom(a); $("#consent").checked = false; renderPicker(); }
    else if (t.dataset.cancel) {
      if (!confirm("Cancel this appointment? Deposits are refundable with 24+ hours' notice.")) return;
      const list = store.all(); const a = list.find((x) => x.id === t.dataset.cancel);
      a.status = "cancelled"; store.save(list); renderAppointments(); $("#nextAvail").textContent = nextAvailable();
      toast("Appointment cancelled");
    }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") $$(".modal.open").forEach((m) => closeModal(m.id)); });

  // Wizard controls
  $("#pickList").addEventListener("change", (e) => {
    if (e.target.type !== "checkbox") return;
    e.target.checked ? bk.services.add(e.target.value) : bk.services.delete(e.target.value);
    updateCart();
  });
  ["bGuests", "promo"].forEach((id) => $("#" + id).addEventListener("input", updateCart));
  $("#nextBtn").onclick = () => {
    if (!validateStep()) return;
    if (bk.step === STEP_COUNT - 1) confirmBooking(); else goStep(bk.step + 1);
  };
  $("#backBtn").onclick = () => goStep(Math.max(0, bk.step - 1));
  $("#calPrev").onclick = () => { bk.calMonth.setMonth(bk.calMonth.getMonth() - 1); renderCalendar(); };
  $("#calNext").onclick = () => { bk.calMonth.setMonth(bk.calMonth.getMonth() + 1); renderCalendar(); };
  $("#calGrid").onclick = (e) => { const b = e.target.closest("button[data-date]"); if (!b) return; bk.date = b.dataset.date; bk.time = null; renderCalendar(); };
  $("#slotsGrid").onclick = (e) => { const b = e.target.closest("button[data-time]"); if (!b) return; bk.time = b.dataset.time; renderSlots(); };
  $("#icsBtn").onclick = () => bk.lastAppt && downloadIcs(bk.lastAppt);

  // Input masks
  $("#card").addEventListener("input", (e) => (e.target.value = e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ")));
  $("#exp").addEventListener("input", (e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); e.target.value = v.length > 2 ? v.slice(0, 2) + "/" + v.slice(2) : v; });
  $("#bState").addEventListener("input", (e) => (e.target.value = e.target.value.toUpperCase()));

  // Appointment lookup
  $("#lookupForm").addEventListener("submit", (e) => { e.preventDefault(); lookupEmail = $("#lookupEmail").value.trim().toLowerCase(); renderAppointments(); });

  // GLP-1 pre-screen
  $("#bmiForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const inches = (+$("#hFt").value) * 12 + (+$("#hIn").value);
    const bmi = 703 * (+$("#wLbs").value) / (inches * inches);
    const conds = $$("input[name=cond]:checked").map((c) => c.value);
    const out = $("#bmiResult");
    let title, body, cta = true;
    if (conds.includes("exclude")) {
      title = "Let's talk first"; body = "One or more of your answers may make GLP-1 medications unsafe. Book a medical evaluation and our provider will review alternatives with you.";
    } else if (bmi >= 30 || (bmi >= 27 && conds.includes("comorbid"))) {
      title = "You may be a good candidate"; body = "Based on your answers you likely meet the clinical criteria for GLP-1 therapy. Book a medical evaluation to confirm and get started.";
    } else if (bmi >= 25) {
      title = "You may qualify"; body = "You're close to the typical criteria. A provider can review your full health picture — or ask about our Lipo-B and wellness options.";
    } else {
      title = "GLP-1s may not be right for you"; body = "Your BMI is below typical guidelines. Our IV and skin services might be a better fit!"; cta = false;
    }
    out.innerHTML = `<div class="quiz__bmi">${bmi.toFixed(1)} <small class="muted">BMI</small></div><h4>${title}</h4><p>${body}</p>
      ${cta ? `<button class="pill pill--dark pill--block" data-book="glp-consult">Book GLP-1 evaluation, $99</button>` : `<a href="#treatments" class="pill pill--outline pill--block">Explore treatments</a>`}`;
    out.hidden = false;
  });

  // Lead forms (connect to your CRM / email service)
  const leadForm = (sel, msg, after) => $(sel).addEventListener("submit", (e) => {
    e.preventDefault();
    toast(typeof msg === "function" ? msg(e.target) : msg);
    e.target.reset();
    after?.();
  });
  leadForm("#eventForm", "Thank you. Our events team will contact you with a quote within 2 hours.");
  leadForm("#contactForm", "Thank you. We will respond to your message shortly.");
  leadForm("#newsletter", "Thank you. You have been added to our mailing list.");
  leadForm("#giftForm", (f) => `A $${f.amt.value} gift card has been sent to ${f.to.value}.`, () => closeModal("giftModal"));
});
