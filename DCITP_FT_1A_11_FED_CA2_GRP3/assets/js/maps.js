// ---- 0. Load the Google Maps API script dynamically ----
// Replace YOUR_API_KEY with a real key from the Google Cloud Console
// (enable "Maps JavaScript API" and "Places API" for that key).
// SECURITY: restrict this key to your domain in the Cloud Console —
// a public repo with an unrestricted key can be abused by anyone who finds it.
// callback=initMap tells this script to run initMap() once Maps has loaded.
(function loadGoogleMaps() {
  const script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAQ07Lz8w5Yc-F7qva-9f00f3WwfMlpPyY&callback=initMap";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
})();

// ---- 1. Category styling for nearby-place markers + legend ----
const CATEGORY_STYLES = {
  restaurants:  { label: "Restaurants",  icon: "orange-dot", color: "#FFA500" },
  attractions:  { label: "Attractions",  icon: "purple-dot", color: "#A020F0" },
  busStops:     { label: "Bus Stops",    icon: "blue-dot",   color: "#1E90FF" },
  taxiStands:   { label: "Taxi Stands",  icon: "green-dot",  color: "#2E8B57" },
  mrtStations:  { label: "MRT Stations", icon: "ltblue-dot", color: "#87CEEB" },
};

// ---- 2. Per-destination data ----
// Each entry's `nearby` places are hand-researched restaurants/attractions/transport
// within ~500m of the landmark. Coordinates are close approximations placed near the
// real landmark, not surveyed GPS points — good enough for a map at this zoom level,
// not for turn-by-turn nav. Double check against Google Maps / LTA MyTransport before
// relying on these for real trips.
const DESTINATIONS = {
  "marina-bay-sands": {
    name: "Marina Bay Sands",
    lat: 1.2834, lng: 103.8607,
    desc: "Iconic hotel with rooftop infinity pool.",
    nearby: {
      restaurants: [
        { name: "CÉ LA VI", lat: 1.2836, lng: 103.8609 },
        { name: "LAVO Italian Restaurant & Rooftop Bar", lat: 1.2833, lng: 103.8610 },
        { name: "Waku Ghin", lat: 1.2831, lng: 103.8605 },
        { name: "Bread Street Kitchen by Gordon Ramsay", lat: 1.2835, lng: 103.8603 },
        { name: "Punjab Grill", lat: 1.2832, lng: 103.8608 },
      ],
      attractions: [
        { name: "ArtScience Museum", lat: 1.2860, lng: 103.8591 },
        { name: "Helix Bridge", lat: 1.2865, lng: 103.8613 },
        { name: "Singapore Flyer", lat: 1.2893, lng: 103.8631 },
      ],
      busStops: [
        { name: "Marina Bay Sands Theatre", lat: 1.2820, lng: 103.8600 },
        { name: "Opp Marina Bay Sands Theatre", lat: 1.2845, lng: 103.8615 },
        { name: "The Float @ Marina Bay", lat: 1.2900, lng: 103.8592 },
        { name: "Promenade Station Exit C", lat: 1.2934, lng: 103.8607 },
        { name: "Marina Bay Financial Centre", lat: 1.2795, lng: 103.8524 },
      ],
      taxiStands: [
        { name: "Marina Bay Sands Casino Taxi Stand", lat: 1.2828, lng: 103.8598 },
        { name: "Taxi Stand @ The Shoppes at MBS", lat: 1.2839, lng: 103.8600 },
      ],
      mrtStations: [
        { name: "Bayfront MRT (CE1 | DT16)", lat: 1.2823, lng: 103.8590 },
        { name: "Marina Bay MRT Station (NS27 | CE2 | TE20)", lat: 1.2761, lng: 103.8546 },
      ],
    },
  },
  "gardens-by-the-bay": {
    name: "Gardens by the Bay",
    lat: 1.2816, lng: 103.8636,
    desc: "Futuristic park with Supertrees and domes.",
    nearby: {
      restaurants: [
        { name: "POLLEN", lat: 1.2822, lng: 103.8642 },
        { name: "Majestic Bay", lat: 1.2820, lng: 103.8630 },
        { name: "Shake Shack (Supertree Grove)", lat: 1.2810, lng: 103.8640 },
        { name: "Satay by the Bay", lat: 1.2800, lng: 103.8645 },
      ],
      attractions: [
        { name: "Supertree Grove", lat: 1.2814, lng: 103.8638 },
        { name: "Flower Dome", lat: 1.2823, lng: 103.8642 },
        { name: "Cloud Forest", lat: 1.2828, lng: 103.8636 },
        { name: "OCBC Skyway", lat: 1.2816, lng: 103.8633 },
      ],
      busStops: [
        { name: "Gardens by the Bay", lat: 1.2818, lng: 103.8648 },
        { name: "Opp Gardens by the Bay", lat: 1.2815, lng: 103.8642 },
        { name: "Bef Gardens by the Bay", lat: 1.2820, lng: 103.8650 },
        { name: "After Gardens by the Bay", lat: 1.2825, lng: 103.8655 },
        { name: "Bayfront Station Exit B", lat: 1.2825, lng: 103.8592 },
      ],
      taxiStands: [
        { name: "Taxi Stand | Gardens by the Bay", lat: 1.2812, lng: 103.8646 },
      ],
      mrtStations: [
        { name: "Gardens by the Bay MRT (TE22)", lat: 1.2790, lng: 103.8636 },
        { name: "Bayfront MRT (CE1 | DT16)", lat: 1.2823, lng: 103.8590 },
      ],
    },
  },
  "orchard-road": {
    name: "Orchard Road",
    lat: 1.3048, lng: 103.8318,
    desc: "Singapore's premier shopping and lifestyle boulevard.",
    nearby: {
      restaurants: [
        { name: "MERCI MARCEL ORCHARD", lat: 1.3057, lng: 103.8283 },
        { name: "FLNT | Nikkei Restaurant & Bar", lat: 1.3040, lng: 103.8318 },
        { name: "The Dim Sum Place", lat: 1.3020, lng: 103.8365 },
      ],
      attractions: [
        { name: "ION Orchard", lat: 1.3040, lng: 103.8318 },
        { name: "ION Sky", lat: 1.3040, lng: 103.8317 },
        { name: "Ngee Ann City", lat: 1.3037, lng: 103.8320 },
        { name: "313@somerset", lat: 1.3007, lng: 103.8385 },
        { name: "Paragon", lat: 1.3018, lng: 103.8352 },
        { name: "Orchard Central", lat: 1.3009, lng: 103.8392 },
      ],
      busStops: [
        { name: "Orchard Stn/Tang Plaza", lat: 1.3046, lng: 103.8322 },
        { name: "Orchard Stn/Lucky Plaza", lat: 1.3037, lng: 103.8324 },
        { name: "Opp Orchard Stn/ION", lat: 1.3042, lng: 103.8318 },
        { name: "Opp Ngee Ann City", lat: 1.3030, lng: 103.8335 },
        { name: "Opp Somerset Stn", lat: 1.3007, lng: 103.8383 },
        { name: "Somerset Youth Park", lat: 1.3015, lng: 103.8395 },
        { name: "Far East Plaza/Scotts Rd", lat: 1.3057, lng: 103.8323 },
      ],
      taxiStands: [],
      mrtStations: [
        { name: "Orchard MRT Station (NS22 | TE14)", lat: 1.3040, lng: 103.8318 },
        { name: "Somerset MRT Station (NS23)", lat: 1.3005, lng: 103.8385 },
        { name: "Dhoby Ghaut MRT Station (NS24 | NE6 | CC1)", lat: 1.2986, lng: 103.8455 },
        { name: "Orchard Boulevard MRT Station (TE13)", lat: 1.3057, lng: 103.8280 },
      ],
    },
  },
  "national-gallery-singapore": {
    name: "National Gallery Singapore",
    lat: 1.2903, lng: 103.8517,
    desc: "Art museum housed in the former City Hall and Supreme Court buildings.",
    nearby: {
      restaurants: [
        { name: "National Kitchen by Violet Oon", lat: 1.2904, lng: 103.8518 },
        { name: "Odette", lat: 1.2903, lng: 103.8516 },
        { name: "Gilmore & Damian D'Silva", lat: 1.2905, lng: 103.8519 },
      ],
      attractions: [
        { name: "Keppel Centre for Art Education", lat: 1.2902, lng: 103.8515 },
        { name: "Padang Atrium", lat: 1.2905, lng: 103.8520 },
        { name: "Supreme Court Historical Balcony", lat: 1.2900, lng: 103.8514 },
      ],
      busStops: [
        { name: "Aft City Hall Stn Exit B", lat: 1.2925, lng: 103.8524 },
        { name: "Opp The Treasury Building", lat: 1.2908, lng: 103.8510 },
        { name: "Victoria Concert Hall", lat: 1.2900, lng: 103.8523 },
      ],
      taxiStands: [],
      mrtStations: [
        { name: "City Hall MRT Station (EW13 | NS25)", lat: 1.2931, lng: 103.8520 },
        { name: "Bras Basah MRT Station (CC2)", lat: 1.2966, lng: 103.8503 },
        { name: "Raffles Place MRT Station (EW14 | NS26)", lat: 1.2837, lng: 103.8515 },
        { name: "Esplanade MRT Station (CC3)", lat: 1.2930, lng: 103.8558 },
      ],
    },
  },
  "chinese-garden": {
    name: "Chinese Garden",
    lat: 1.3416, lng: 103.7268,
    desc: "Tranquil garden inspired by Chinese landscaping.",
    nearby: {
      restaurants: [
        { name: "Mr Bean – Chinese Garden MRT", lat: 1.3419, lng: 103.7272 },
        { name: "Man Zhu Steamboat", lat: 1.3421, lng: 103.7275 },
        { name: "Ji Pin Xiang", lat: 1.3418, lng: 103.7265 },
        { name: "Xiao Yao Ge", lat: 1.3414, lng: 103.7270 },
      ],
      attractions: [
        { name: "Bamboo Grove and Waterfall", lat: 1.3410, lng: 103.7260 },
        { name: "Jurong Lake Gardens", lat: 1.3430, lng: 103.7290 },
        { name: "Rasau Walk", lat: 1.3455, lng: 103.7238 },
        { name: "JEM", lat: 1.3332, lng: 103.7436 },
      ],
      busStops: [
        { name: "Chinese Garden Station (Boon Lay Way)", lat: 1.3420, lng: 103.7268 },
        { name: "Boon Lay Way", lat: 1.3430, lng: 103.7255 },
        { name: "Jurong Town Hall Road", lat: 1.3390, lng: 103.7290 },
      ],
      taxiStands: [
        { name: "Taxi Stand @ Chinese Garden MRT", lat: 1.3417, lng: 103.7273 },
      ],
      mrtStations: [
        { name: "Chinese Garden MRT (EW25)", lat: 1.3421, lng: 103.7271 },
      ],
    },
  },
  sentosa: {
    name: "Sentosa",
    lat: 1.2494, lng: 103.8303,
    desc: "Resort island with beaches and attractions.",
    nearby: {
      restaurants: [
        { name: "Trapizza", lat: 1.2497, lng: 103.8307 },
        { name: "Coastes", lat: 1.2492, lng: 103.8298 },
        { name: "Beach Station Food Court", lat: 1.2499, lng: 103.8312 },
      ],
      attractions: [
        { name: "Universal Studios Singapore", lat: 1.2540, lng: 103.8238 },
        { name: "Singapore Oceanarium", lat: 1.2570, lng: 103.8207 },
        { name: "Skyline Luge Singapore", lat: 1.2565, lng: 103.8225 },
        { name: "Palawan Beach", lat: 1.2489, lng: 103.8195 },
      ],
      busStops: [
        { name: "Sentosa Gateway – Resorts World Sentosa (14519)", lat: 1.2540, lng: 103.8195 },
        { name: "VivoCity", lat: 1.2646, lng: 103.8220 },
        { name: "Opposite HarbourFront Interchange", lat: 1.2650, lng: 103.8225 },
        { name: "Before Seah Im Road", lat: 1.2660, lng: 103.8210 },
        { name: "HarbourFront Bus Interchange", lat: 1.2649, lng: 103.8227 },
      ],
      taxiStands: [
        { name: "Resorts World Sentosa Pick-Up/Drop-Off Point", lat: 1.2539, lng: 103.8194 },
      ],
      mrtStations: [
        // Sentosa itself has no on-island MRT station — HarbourFront is the nearest,
        // roughly 1km from the island entrance (outside the usual 500m radius), but it's
        // listed here since it's the interchange every visitor actually uses to get here.
        { name: "HarbourFront MRT (NE1 | CC29)", lat: 1.2653, lng: 103.8220 },
      ],
    },
  },
  chinatown: {
    name: "Chinatown",
    lat: 1.2838, lng: 103.8437,
    desc: "Historic district with temples and food stalls.",
    nearby: {
      restaurants: [
        { name: "Liao Fan Hawker Chan", lat: 1.2825, lng: 103.8432 },
        { name: "Song Fa Bak Kut Teh", lat: 1.2841, lng: 103.8429 },
        { name: "Maxwell Food Centre", lat: 1.2807, lng: 103.8447 },
      ],
      attractions: [
        { name: "Buddha Tooth Relic Temple & Museum", lat: 1.2815, lng: 103.8443 },
        { name: "Sri Mariamman Temple", lat: 1.2822, lng: 103.8438 },
        { name: "Thian Hock Keng Temple", lat: 1.2807, lng: 103.8482 },
        { name: "Chinatown Street Market", lat: 1.2835, lng: 103.8434 },
      ],
      busStops: [
        { name: "New Bridge Road (Chinatown Point)", lat: 1.2853, lng: 103.8443 },
        { name: "South Bridge Road (Sri Mariamman Temple)", lat: 1.2820, lng: 103.8441 },
        { name: "Maxwell Road (Maxwell Food Centre)", lat: 1.2805, lng: 103.8449 },
      ],
      taxiStands: [
        { name: "Chinatown MRT Taxi Stand", lat: 1.2840, lng: 103.8440 },
      ],
      mrtStations: [
        { name: "Chinatown MRT Station (NE4 | DT19)", lat: 1.2838, lng: 103.8437 },
        { name: "Maxwell MRT Station (TE18)", lat: 1.2811, lng: 103.8443 },
        { name: "Telok Ayer MRT Station (DT18)", lat: 1.2809, lng: 103.8485 },
      ],
    },
  },
  "changi-jewel": {
    name: "Changi Jewel",
    lat: 1.3601, lng: 103.9895,
    desc: "Iconic airport dome with an indoor waterfall.",
    nearby: {
      restaurants: [
        { name: "A&W Jewel Changi Airport", lat: 1.3598, lng: 103.9891 },
        { name: "Sushiro Jewel Changi Airport", lat: 1.3603, lng: 103.9897 },
        { name: "Beauty in the Pot", lat: 1.3600, lng: 103.9899 },
        { name: "Tonkatsu by Ma Maison", lat: 1.3604, lng: 103.9892 },
      ],
      attractions: [
        { name: "HSBC Rain Vortex", lat: 1.3601, lng: 103.9894 },
        { name: "Canopy Park", lat: 1.3599, lng: 103.9897 },
        { name: "Mastercard Canopy Bridge", lat: 1.3600, lng: 103.9896 },
        { name: "Hedge Maze & Mirror Maze", lat: 1.3599, lng: 103.9898 },
        { name: "Pokémon Center Singapore", lat: 1.3602, lng: 103.9893 },
      ],
      busStops: [
        { name: "Terminal 1 Basement Bus Bay", lat: 1.3607, lng: 103.9887 },
        { name: "Terminal 2 Bus Bay", lat: 1.3583, lng: 103.9868 },
        { name: "Terminal 3 Bus Bay", lat: 1.3567, lng: 103.9863 },
      ],
      taxiStands: [
        { name: "Jewel Changi Taxi Stand (Basement)", lat: 1.3599, lng: 103.9889 },
      ],
      mrtStations: [
        { name: "Changi Airport MRT Station (CG2)", lat: 1.3572, lng: 103.9879 },
      ],
    },
  },
  "botanic-gardens": {
    name: "Botanic Gardens",
    lat: 1.3138, lng: 103.8159,
    desc: "UNESCO-listed tropical garden and rainforest.",
    nearby: {
      restaurants: [
        { name: "Food For Thought", lat: 1.3141, lng: 103.8161 },
        { name: "Corner House", lat: 1.3145, lng: 103.8155 },
        { name: "Casa Verde", lat: 1.3151, lng: 103.8152 },
        { name: "Island Creamery @ The Serene Centre", lat: 1.3155, lng: 103.8172 },
      ],
      attractions: [
        { name: "National Orchid Garden", lat: 1.3148, lng: 103.8158 },
        { name: "Eco-Lake", lat: 1.3143, lng: 103.8168 },
        { name: "Jacob Ballas Children's Garden", lat: 1.3158, lng: 103.8163 },
        { name: "Tanglin Gate Visitor Centre", lat: 1.3138, lng: 103.8159 },
        { name: "Dempsey Hill", lat: 1.3068, lng: 103.8106 },
        { name: "Gleneagles Hospital Area", lat: 1.3070, lng: 103.8228 },
        { name: "Nassim Gate", lat: 1.3155, lng: 103.8175 },
        { name: "Bukit Timah Gate", lat: 1.3225, lng: 103.8153 },
        { name: "Tyersall Gate", lat: 1.3115, lng: 103.8140 },
      ],
      busStops: [
        { name: "Botanic Gdns Stn Exit B", lat: 1.3220, lng: 103.8150 },
        { name: "Bt Timah Rd – Botanic Gdns Stn (41021)", lat: 1.3222, lng: 103.8155 },
      ],
      taxiStands: [
        { name: "Botanic Gardens Taxi Stand (Gallop Gate)", lat: 1.3138, lng: 103.8159 },
      ],
      mrtStations: [
        { name: "Botanic Gardens MRT (CC19 | DT9)", lat: 1.3225, lng: 103.8153 },
        { name: "Napier MRT Station (TE12)", lat: 1.3072, lng: 103.8189 },
      ],
    },
  },
};

let map;
let activeInfoWindow = null;
// Nearby markers grouped by category, e.g. { restaurants: [marker, marker], attractions: [...] }
// so the sidebar can show/hide one whole category at a time.
let markersByCategory = {};
// Which categories are currently toggled on (visible on the map)
let activeCategories = new Set();

// ---- 3. Called once by the Google Maps script callback ----
function initMap() {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return; // no map on this page

  const slug = mapDiv.dataset.slug;
  const place = DESTINATIONS[slug];
  if (!place) {
    mapDiv.innerHTML = "<p class='text-muted'>Map unavailable for this destination.</p>";
    return;
  }

  map = new google.maps.Map(mapDiv, {
    center: { lat: place.lat, lng: place.lng },
    zoom: 16,
    mapId: "DEMO_MAP_ID", // optional, needed only for advanced markers/styling
  });

  renderMainMarker(place);
  buildNearbyMarkers(place);
  renderSidebar(place);
}

// ---- 4. Main destination marker ----
function renderMainMarker(place) {
  const marker = new google.maps.Marker({
    position: { lat: place.lat, lng: place.lng },
    map: map,
    title: place.name,
    animation: google.maps.Animation.DROP,
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `<div style="max-width:200px">
                 <strong>${place.name}</strong><br>
                 <span>${place.desc || ""}</span>
               </div>`,
  });

  marker.addListener("click", () => {
    if (activeInfoWindow) activeInfoWindow.close();
    infoWindow.open(map, marker);
    activeInfoWindow = infoWindow;
  });
}

// ---- 5. Build nearby restaurant/attraction/transport markers, hidden until toggled on ----
function buildNearbyMarkers(place) {
  const data = place.nearby || {};
  markersByCategory = {};
  activeCategories = new Set();

  Object.keys(CATEGORY_STYLES).forEach((categoryKey) => {
    const style = CATEGORY_STYLES[categoryKey];
    const items = data[categoryKey] || [];

    markersByCategory[categoryKey] = items.map((item) => {
      const marker = new google.maps.Marker({
        position: { lat: item.lat, lng: item.lng },
        map: null, // hidden until its sidebar category is toggled on
        title: item.name,
        icon: `https://maps.google.com/mapfiles/ms/icons/${style.icon}.png`,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="max-width:200px">
                     <strong>${item.name}</strong><br>
                     <span>${style.label}</span>
                   </div>`,
      });

      marker.addListener("click", () => {
        if (activeInfoWindow) activeInfoWindow.close();
        infoWindow.open(map, marker);
        activeInfoWindow = infoWindow;
      });

      return marker;
    });
  });
}

// ---- 6. Sidebar: click a category to show/hide its pins on the map ----
function renderSidebar(place) {
  const sidebar = document.getElementById("map-sidebar");
  if (!sidebar) return;

  const data = place.nearby || {};

  const rows = Object.keys(CATEGORY_STYLES)
    .map((key) => {
      const style = CATEGORY_STYLES[key];
      const count = (data[key] || []).length;
      const disabled = count === 0;

      return `
        <button
          type="button"
          class="map-sidebar-item${disabled ? " disabled" : ""}"
          data-category="${key}"
          ${disabled ? "disabled" : ""}
        >
          <span class="legend-dot" style="background-color:${style.color}"></span>
          <span class="map-sidebar-label">${style.label}</span>
          <span class="map-sidebar-count">${count}</span>
        </button>
      `;
    })
    .join("");

  sidebar.innerHTML = `
    <h5>Show on Map</h5>
    <div class="map-sidebar-list">${rows}</div>
  `;

  sidebar.querySelectorAll(".map-sidebar-item:not(.disabled)").forEach((button) => {
    button.addEventListener("click", () => toggleCategory(button.dataset.category, button));
  });
}

// ---- 7. Toggle a category's markers on/off, and update the button's active state ----
function toggleCategory(categoryKey, button) {
  const markers = markersByCategory[categoryKey] || [];
  const isActive = activeCategories.has(categoryKey);

  if (isActive) {
    markers.forEach((marker) => marker.setMap(null));
    activeCategories.delete(categoryKey);
    button.classList.remove("active");
  } else {
    markers.forEach((marker) => marker.setMap(map));
    activeCategories.add(categoryKey);
    button.classList.add("active");
  }
}
