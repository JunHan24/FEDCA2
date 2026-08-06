
/* =======================================================
   SGCompass — Trip Planner
   Steps: Trip Basics -> Itinerary -> Eats -> Attractions -> Download
======================================================= */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('tripPlanner')) {
    initTripPlanner();
  }
});

// Destinations (mirrors the 9 destination pages, used for the Attractions step)
const TP_DESTINATIONS = [
  { name: "Marina Bay", categories: ["hotel", "shopping"], link: "mainpages/destination1.html",
    desc: "Iconic waterfront district home to Marina Bay Sands, the Helix Bridge and the Singapore Flyer." },
  { name: "Gardens By The Bay", categories: ["nature"], link: "mainpages/destination2.html",
    desc: "Futuristic nature park famous for the Supertree Grove and the Cloud Forest & Flower Dome conservatories." },
  { name: "Orchard Road", categories: ["shopping"], link: "mainpages/destination3.html",
    desc: "Singapore's premier shopping belt, lined with malls, department stores and street-side cafes." },
  { name: "National Gallery Singapore", categories: ["museum"], link: "mainpages/destination4.html",
    desc: "Housed in two restored national monuments, showcasing the largest collection of Southeast Asian art." },
  { name: "Chinese Garden", categories: ["nature"], link: "mainpages/destination5.html",
    desc: "Tranquil Chinese-style landscaped garden with pagodas, bridges and a bonsai garden." },
  { name: "Sentosa", categories: ["hotel", "nature"], link: "mainpages/destination6.html",
    desc: "Resort island with beaches, theme parks and family attractions just off the southern coast." },
  { name: "Chinatown", categories: ["heritage", "shopping"], link: "mainpages/destination7.html",
    desc: "Historic ethnic quarter with heritage shophouses, temples and bustling street markets." },
  { name: "Changi Jewel", categories: ["shopping"], link: "mainpages/destination8.html",
    desc: "Nature-themed lifestyle hub at Changi Airport, home to the world's tallest indoor waterfall." },
  { name: "Botanic Gardens", categories: ["nature"], link: "mainpages/destination9.html",
    desc: "UNESCO World Heritage tropical garden, home to the National Orchid Garden." }
];

const TP_CATEGORY_LABELS = {
  hotel: "Hotel",
  nature: "Nature & Beauty",
  shopping: "Shopping",
  museum: "Museum",
  heritage: "Heritage"
};

const TP_TIME_OPTIONS = ["Morning", "Afternoon", "Evening", "Night"];

// Eateries by destination area, then by budget tier.
// Keys must match TP_DESTINATIONS "name" values exactly.
// Prices researched from restaurant sites, Burpple, Tripadvisor and food blogs.
// Menus and rates change often, so treat these as a starting estimate, not a quote.
const TP_EATERIES_BY_AREA = {
  "Marina Bay": {
    midrange: [
      { name: "RISE", price: "S$52 – S$112 per person",
        desc: "All-day buffet at Marina Bay Sands; lunch runs cheaper than the more elaborate dinner spread." }
    ],
    luxury: [
      { name: "Spago Dining Room", price: "S$68 (3-course lunch set) – S$150+ (a la carte dinner)",
        desc: "Wolfgang Puck's rooftop fine dining at Marina Bay Sands with skyline and pool views." },
      { name: "LAVO Italian Restaurant and Rooftop Bar", price: "S$90 – S$160 per person",
        desc: "NYC-style Italian-American rooftop restaurant and bar atop Marina Bay Sands." }
    ]
  },
  "Gardens By The Bay": {
    budget: [
      { name: "Satay by the Bay", price: "S$7 – S$20 per meal",
        desc: "Open-air hawker court within the gardens, known for satay and local seafood." }
    ],
    midrange: [
      { name: "Hortus", price: "S$50 – S$90 per person",
        desc: "Mediterranean sharing plates inside the Flower Dome; S$50/pax minimum spend applies." }
    ],
    luxury: [
      { name: "Marguerite", price: "S$120 – S$290 per person",
        desc: "Michelin-starred tasting menus in the Flower Dome — lunch from S$120, dinner from S$228." }
    ]
  },
  "Orchard Road": {
    budget: [
      { name: "The Dim Sum Place", price: "S$15 – S$25 per person",
        desc: "Casual dim sum restaurant with individual dishes from around S$4–S$10 each." }
    ],
    midrange: [
      { name: "MERCI MARCEL ORCHARD", price: "S$30 – S$55 per person",
        desc: "French café-bistro with an all-day brunch and lifestyle-store setting." }
    ],
    luxury: [
      { name: "FLNT | Nikkei Restaurant & Bar", price: "S$90 – S$150 per person",
        desc: "Japanese-Peruvian (Nikkei) sumiyaki grill and bar on the 55th floor of ION Orchard." }
    ]
  },
  "National Gallery Singapore": {
    midrange: [
      { name: "National Kitchen by Violet Oon", price: "S$45 – S$80 per person",
        desc: "Peranakan restaurant inside the National Gallery, known for its chicken buah keluak." },
      { name: "Smoke & Mirrors", price: "S$50 – S$60+ per person",
        desc: "Rooftop bar atop the National Gallery with cocktails and light bites — mostly a drinks stop." }
    ],
    luxury: [
      { name: "Odette", price: "S$300 – S$550 per person",
        desc: "Three Michelin-starred contemporary French tasting menu inside the National Gallery." }
    ]
  },
  "Chinese Garden": {
    budget: [
      { name: "Taman Jurong Market & Food Centre", price: "S$3 – S$7 per meal",
        desc: "Neighbourhood hawker centre nearby, popular for economical local rice and noodle stalls." }
    ],
    midrange: [
      { name: "Eden | Chinese Garden | Halal-Certified", price: "S$20 – S$40 per person",
        desc: "Halal-certified café with garden and pagoda views, serving Western and local brunch fare." },
      { name: "Canopy Jurong Lake Gardens", price: "S$20 – S$35 per person",
        desc: "Family- and pet-friendly garden café known for brunch, burgers and pasta by the lake." }
    ]
  },
  "Sentosa": {
    budget: [
      { name: "Seah Im Food Centre", price: "S$3 – S$8 per meal",
        desc: "Hawker centre near the cable car station, handy before or after Sentosa." }
    ],
    midrange: [
      { name: "Native Kitchen (Village Hotel Sentosa)", price: "S$35 – S$60 per person (buffet from ~S$43)",
        desc: "Local and Asian dining inside Village Hotel at Sentosa, with an all-day buffet option." }
    ],
    luxury: [
      { name: "OCEAN Restaurant", price: "S$45 – S$160 per person",
        desc: "Underwater set-menu dining beside the S.E.A. Aquarium; lunch sets are far cheaper than dinner." }
    ]
  },
  "Chinatown": {
    budget: [
      { name: "Maxwell Food Centre", price: "S$3 – S$6 per meal",
        desc: "Historic hawker centre famous for Tian Tian Hainanese Chicken Rice and local classics." },
      { name: "Chinatown Complex Food Centre", price: "S$5 – S$10 per meal",
        desc: "Singapore's largest hawker centre, with over 200 stalls across two floors." }
    ],
    midrange: [
      { name: "Chinatown Food Street", price: "S$15 – S$30 per person",
        desc: "Open-air dining street with local and Asian favourites, lively in the evenings." }
    ]
  },
  "Changi Jewel": {
    budget: [
      { name: "Shake Shack", price: "S$15 – S$25 per person",
        desc: "Casual fast-casual burger joint inside Jewel Changi Airport." }
    ],
    midrange: [
      { name: "Din Tai Fung", price: "S$15 – S$30 per person",
        desc: "Michelin-recognised chain famous for handmade xiao long bao and noodle dishes." },
      { name: "Dian Xiao Er", price: "S$20 – S$45 per person",
        desc: "Homely Chinese restaurant known for its herbal roast duck." }
    ]
  },
  "Botanic Gardens": {
    midrange: [
      { name: "Park Side by PS.Cafe", price: "S$25 – S$45 per person",
        desc: "Garden-side brunch café from the PS.Cafe group, at the Nassim Gate entrance." }
    ],
    luxury: [
      { name: "Corner House", price: "S$78 (lunch) – S$270 (dinner) per person",
        desc: "Michelin-starred omakase-style French-Asian dining in a restored 1910 colonial bungalow." }
    ]
  }
};

const TP_TIER_INFO = {
  budget: {
    label: "Budget-Friendly",
    badgeClass: "text-bg-success",
    text: "Under S$60 a day — think hawker centres, free attractions and public transport."
  },
  midrange: {
    label: "Mid-Range",
    badgeClass: "text-bg-warning",
    text: "S$60 – S$150 a day — a mix of casual dining, paid attractions and the occasional taxi ride."
  },
  luxury: {
    label: "Luxury",
    badgeClass: "text-bg-dark",
    text: "Over S$150 a day — fine dining, premium attractions and private transport."
  }
};

// Trip state
let tpState = {
  days: 0,
  budget: 0,
  tier: "",
  itinerary: {},      // { 1: [{place, time}], 2: [...] }
  activeDay: 1,
  selectedCategories: []
};

function initTripPlanner() {
  const startBtn = document.getElementById("startPlanningBtn");
  const downloadBtn = document.getElementById("downloadPlanBtn");

  if (startBtn) {
    startBtn.addEventListener("click", handleStartPlanning);
  }

  if (downloadBtn) {
    downloadBtn.addEventListener("click", handleDownloadPlan);
  }

  buildAttractionChips();
}

function handleStartPlanning() {
  const daysInput = document.getElementById("tripDays");
  const budgetInput = document.getElementById("tripBudget");
  const errorEl = document.getElementById("tripBasicsError");

  const days = parseInt(daysInput.value, 10);
  const budget = parseFloat(budgetInput.value);

  // Validation
  if (errorEl) errorEl.classList.add("d-none");
  daysInput.classList.remove("is-invalid");
  budgetInput.classList.remove("is-invalid");

  let valid = true;
  if (!days || days < 1) {
    daysInput.classList.add("is-invalid");
    valid = false;
  }
  if (isNaN(budget) || budget < 0) {
    budgetInput.classList.add("is-invalid");
    valid = false;
  }
  if (!valid) {
    if (errorEl) errorEl.classList.remove("d-none");
    return;
  }

  tpState.days = days;
  tpState.budget = budget;
  tpState.tier = getBudgetTier(budget, days);
  tpState.activeDay = 1;

  // Reset itinerary state for the chosen number of days
  tpState.itinerary = {};
  for (let d = 1; d <= days; d++) {
    tpState.itinerary[d] = [];
  }

  renderBudgetTier();
  renderDayTabs(); // also renders eateries for the (currently empty) itinerary
  renderAttractionResults();

  document.getElementById("itineraryStep").classList.remove("d-none");
  document.getElementById("eatStep").classList.remove("d-none");
  document.getElementById("attractionsStep").classList.remove("d-none");
  document.getElementById("downloadStep").classList.remove("d-none");
}

function getBudgetTier(budget, days) {
  const perDay = budget / days;
  if (perDay < 60) return "budget";
  if (perDay <= 150) return "midrange";
  return "luxury";
}

function renderBudgetTier() {
  const result = document.getElementById("budgetTierResult");
  const badge = document.getElementById("budgetTierBadge");
  const text = document.getElementById("budgetTierText");
  const info = TP_TIER_INFO[tpState.tier];

  badge.textContent = info.label;
  badge.className = "badge " + info.badgeClass;
  text.textContent = info.text;
  result.classList.remove("d-none");
}

/* ---------- Step 2: Itinerary ---------- */

function renderDayTabs() {
  const nav = document.getElementById("dayTabsNav");
  const content = document.getElementById("dayTabsContent");
  nav.innerHTML = "";
  content.innerHTML = "";

  for (let d = 1; d <= tpState.days; d++) {
    const tabBtn = document.createElement("button");
    tabBtn.type = "button";
    tabBtn.className = "day-tab-btn" + (d === tpState.activeDay ? " active" : "");
    tabBtn.textContent = "Day " + d;
    tabBtn.addEventListener("click", () => {
      tpState.activeDay = d;
      renderDayTabs();
    });
    nav.appendChild(tabBtn);
  }

  const panel = document.createElement("div");
  panel.className = "day-panel";

  const d = tpState.activeDay;

  const formRow = document.createElement("div");
  formRow.className = "row g-2 align-items-end mb-3";
  formRow.innerHTML = `
    <div class="col-sm-5">
      <label class="form-label small mb-1">Place</label>
      <select class="form-select" id="dayPlaceSelect">
        ${TP_DESTINATIONS.map(dest => `<option value="${dest.name}">${dest.name}</option>`).join("")}
      </select>
    </div>
    <div class="col-sm-4">
      <label class="form-label small mb-1">Time of Day</label>
      <select class="form-select" id="dayTimeSelect">
        ${TP_TIME_OPTIONS.map(t => `<option value="${t}">${t}</option>`).join("")}
      </select>
    </div>
    <div class="col-sm-3">
      <button type="button" id="addDayStopBtn" class="btn text-white w-100" style="background-color:#0F6B72;">Add</button>
    </div>
  `;
  panel.appendChild(formRow);

  const list = document.createElement("ul");
  list.className = "itinerary-list";

  if (tpState.itinerary[d].length === 0) {
    const empty = document.createElement("li");
    empty.className = "itinerary-empty";
    empty.textContent = "No places added yet for this day.";
    list.appendChild(empty);
  } else {
    tpState.itinerary[d].forEach((stop, index) => {
      const item = document.createElement("li");
      item.className = "itinerary-item";
      item.innerHTML = `
        <span><strong>${stop.time}</strong> — ${stop.place}</span>
        <button type="button" class="itinerary-remove" aria-label="Remove">&times;</button>
      `;
      item.querySelector(".itinerary-remove").addEventListener("click", () => {
        tpState.itinerary[d].splice(index, 1);
        renderDayTabs();
      });
      list.appendChild(item);
    });
  }

  panel.appendChild(list);
  content.appendChild(panel);

  document.getElementById("addDayStopBtn").addEventListener("click", () => {
    const place = document.getElementById("dayPlaceSelect").value;
    const time = document.getElementById("dayTimeSelect").value;
    tpState.itinerary[tpState.activeDay].push({ place, time });
    renderDayTabs();
  });

  // Keep the "Places to Eat" step in sync with whatever is in the itinerary
  renderEateries();
}

/* ---------- Step 3: Eateries ---------- */

// Every unique destination currently in the itinerary, in the order first added
function getSelectedDestinations() {
  const seen = new Set();
  const ordered = [];
  for (let d = 1; d <= tpState.days; d++) {
    (tpState.itinerary[d] || []).forEach(stop => {
      if (!seen.has(stop.place)) {
        seen.add(stop.place);
        ordered.push(stop.place);
      }
    });
  }
  return ordered;
}

function renderEateries() {
  const container = document.getElementById("eateryResults");
  if (!container) return;
  container.innerHTML = "";

  const selectedDestinations = getSelectedDestinations();

  if (selectedDestinations.length === 0) {
    container.innerHTML = `<p class="text-muted small mb-0">Add destinations to your itinerary above to see food recommendations nearby.</p>`;
    return;
  }

  selectedDestinations.forEach(destName => {
    const areaData = TP_EATERIES_BY_AREA[destName];
    const list = areaData ? (areaData[tpState.tier] || []) : [];
    if (list.length === 0) return;

    const heading = document.createElement("div");
    heading.className = "col-12";
    heading.innerHTML = `<h6 class="eatery-area-heading mb-2 mt-2">Near ${destName}</h6>`;
    container.appendChild(heading);

    list.forEach(eatery => {
      const col = document.createElement("div");
      col.className = "col-md-6 col-lg-4";
      col.innerHTML = `
        <div class="eatery-card h-100 p-3">
          <h6 class="mb-1">${eatery.name}</h6>
          <p class="mb-2 small">${eatery.desc}</p>
          <p class="mb-0 fw-bold" style="color:#0F6B72;">${eatery.price}</p>
        </div>
      `;
      container.appendChild(col);
    });
  });
}

/* ---------- Step 4: Attractions ---------- */

function buildAttractionChips() {
  const container = document.getElementById("attractionChips");
  if (!container) return;
  container.innerHTML = "";

  Object.keys(TP_CATEGORY_LABELS).forEach(cat => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "attraction-chip";
    chip.textContent = TP_CATEGORY_LABELS[cat];
    chip.dataset.category = cat;
    chip.addEventListener("click", () => {
      chip.classList.toggle("active");
      const index = tpState.selectedCategories.indexOf(cat);
      if (index === -1) {
        tpState.selectedCategories.push(cat);
      } else {
        tpState.selectedCategories.splice(index, 1);
      }
      renderAttractionResults();
    });
    container.appendChild(chip);
  });
}

function renderAttractionResults() {
  const container = document.getElementById("attractionResults");
  if (!container) return;
  container.innerHTML = "";

  const filtered = tpState.selectedCategories.length === 0
    ? TP_DESTINATIONS
    : TP_DESTINATIONS.filter(dest =>
        dest.categories.some(cat => tpState.selectedCategories.includes(cat))
      );

  filtered.forEach(dest => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    col.innerHTML = `
      <a href="${dest.link}" class="attraction-card h-100 p-3 d-block">
        <h6 class="mb-1">${dest.name}</h6>
        <p class="mb-0 small">${dest.desc}</p>
      </a>
    `;
    container.appendChild(col);
  });
}

/* ---------- Step 5: Download ---------- */

function handleDownloadPlan() {
  if (!window.jspdf) {
    console.error("jsPDF failed to load.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const marginX = 15;
  let y = 20;

  const tealColor = [15, 107, 114];

  doc.setFontSize(20);
  doc.setTextColor(...tealColor);
  doc.text("SGCompass Trip Plan", marginX, y);
  y += 10;

  doc.setDrawColor(...tealColor);
  doc.line(marginX, y, 195, y);
  y += 10;

  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text(`Trip Length: ${tpState.days} day${tpState.days > 1 ? "s" : ""}`, marginX, y);
  y += 7;
  doc.text(`Total Budget: S$${tpState.budget.toFixed(2)} (${TP_TIER_INFO[tpState.tier].label})`, marginX, y);
  y += 10;

  // Itinerary
  doc.setFontSize(14);
  doc.setTextColor(...tealColor);
  doc.text("Itinerary", marginX, y);
  y += 8;
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);

  for (let d = 1; d <= tpState.days; d++) {
    y = checkPageBreak(doc, y);
    doc.setFont(undefined, "bold");
    doc.text(`Day ${d}`, marginX, y);
    doc.setFont(undefined, "normal");
    y += 6;

    const stops = tpState.itinerary[d];
    if (!stops || stops.length === 0) {
      y = checkPageBreak(doc, y);
      doc.text("  No places added.", marginX, y);
      y += 6;
    } else {
      stops.forEach(stop => {
        y = checkPageBreak(doc, y);
        doc.text(`  ${stop.time} — ${stop.place}`, marginX, y);
        y += 6;
      });
    }
    y += 3;
  }

  // Eateries (grouped by destination, filtered to the chosen budget tier)
  y = checkPageBreak(doc, y);
  doc.setFontSize(14);
  doc.setTextColor(...tealColor);
  doc.text(`Recommended Places to Eat (${TP_TIER_INFO[tpState.tier].label})`, marginX, y);
  y += 8;
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);

  const selectedDestinations = getSelectedDestinations();
  if (selectedDestinations.length === 0) {
    y = checkPageBreak(doc, y);
    doc.text("  No destinations added to the itinerary yet.", marginX, y);
    y += 8;
  } else {
    selectedDestinations.forEach(destName => {
      const areaData = TP_EATERIES_BY_AREA[destName];
      const list = areaData ? (areaData[tpState.tier] || []) : [];
      if (list.length === 0) return;

      y = checkPageBreak(doc, y);
      doc.setFont(undefined, "bold");
      doc.text(`  Near ${destName}`, marginX, y);
      doc.setFont(undefined, "normal");
      y += 6;

      list.forEach(eatery => {
        y = checkPageBreak(doc, y);
        doc.text(`    ${eatery.name} — ${eatery.price}`, marginX, y);
        y += 6;
      });
      y += 2;
    });
  }

  // Attractions
  y = checkPageBreak(doc, y);
  doc.setFontSize(14);
  doc.setTextColor(...tealColor);
  doc.text("Attraction Interests", marginX, y);
  y += 8;
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);

  const catLabels = tpState.selectedCategories.length === 0
    ? ["All types"]
    : tpState.selectedCategories.map(c => TP_CATEGORY_LABELS[c]);
  y = checkPageBreak(doc, y);
  doc.text(`  ${catLabels.join(", ")}`, marginX, y);

  doc.save("SGCompass-Trip-Plan.pdf");
}

function checkPageBreak(doc, y) {
  if (y > 275) {
    doc.addPage();
    return 20;
  }
  return y;
}
