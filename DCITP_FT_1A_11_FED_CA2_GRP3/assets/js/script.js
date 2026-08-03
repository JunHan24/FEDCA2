// Search Bar & Filter
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const cards = document.querySelectorAll(".image-card");

if (searchInput && categoryFilter) {

    function filterDestinations() {

        const searchText = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        cards.forEach(card => {

            const destinationName = card.querySelector("h3").textContent.toLowerCase();
            const categories = card.dataset.category.split(",");

            const matchesSearch = destinationName.includes(searchText);
            const matchesCategory =
                selectedCategory === "all" ||
                categories.includes(selectedCategory);

            card.style.display =
                matchesSearch && matchesCategory ? "" : "none";

        });
    }

    searchInput.addEventListener("input", filterDestinations);
    categoryFilter.addEventListener("change", filterDestinations);
}

// Banner Effect
const banner = document.getElementById("banner1");

if (banner) {

    const imagePath = banner.dataset.imagePath;

    const images = [
        `${imagePath}/MBSImgs/marinaBaySandsNight.jpg`,
        `${imagePath}/GBTBImgs/gardensBayTheBayNight.jpg`,
        `${imagePath}/ORImgs/OrchardRoad.jpg`,
        `${imagePath}/NGSImgs/NationalGallerySingapore.jpg`,
        `${imagePath}/CG_IMG/ChineseGarden.jpg`,
        `${imagePath}/ST_IMG/Sentosa.jpg`,
        `${imagePath}/CTImgs/chinatown.jpg`,
        `${imagePath}/CJ_IMGS/ChangiJewel.jpg`,
        `${imagePath}/BG_Imgs/BotanicGardens.jpg`
    ];

    let currentImage = 0;

    function changeBanner() {

        banner.style.opacity = 0;

        setTimeout(() => {

            banner.style.backgroundImage = `url("${images[currentImage]}")`;
            banner.style.opacity = 1;

            currentImage = (currentImage + 1) % images.length;

        }, 400);
    }

    changeBanner();
    setInterval(changeBanner, 3000);
}

/* =======================================================
   SGCompass — Singapore Weather Forecast
   Powered by Open-Meteo (free, no API key required)
   Docs: https://open-meteo.com/
   ======================================================= */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('weather-tool')) {
    initWeatherForecast();
  }
});

// Singapore coordinates
const SG_LAT = 1.3521;
const SG_LON = 103.8198;

// WMO Weather interpretation codes -> { label, icon (emoji) }
const WEATHER_CODES = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mainly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Fog', icon: '🌫️' },
  48: { label: 'Depositing rime fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Moderate drizzle', icon: '🌦️' },
  55: { label: 'Dense drizzle', icon: '🌧️' },
  61: { label: 'Slight rain', icon: '🌦️' },
  63: { label: 'Moderate rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  80: { label: 'Slight rain showers', icon: '🌦️' },
  81: { label: 'Moderate rain showers', icon: '🌧️' },
  82: { label: 'Violent rain showers', icon: '⛈️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm, slight hail', icon: '⛈️' },
  99: { label: 'Thunderstorm, heavy hail', icon: '⛈️' }
};

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { label: 'Unknown', icon: '❓' };
}

async function initWeatherForecast() {
  const descEl = document.getElementById('weather-current-desc');
  const tempEl = document.getElementById('weather-current-temp');
  const updatedEl = document.getElementById('weather-current-updated');
  const iconEl = document.getElementById('weather-current-icon');
  const forecastEl = document.getElementById('weather-forecast');
  const placeholderEl = document.getElementById('weather-forecast-placeholder');

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${SG_LAT}&longitude=${SG_LON}` +
              `&current=temperature_2m,weather_code` +
              `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
              `&timezone=Asia%2FSingapore`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Weather API returned ${response.status}`);
    const data = await response.json();

    renderCurrentWeather(data, { descEl, tempEl, updatedEl, iconEl });
    renderForecast(data, { forecastEl, placeholderEl });

  } catch (error) {
    console.error('Failed to load weather data:', error);
    if (descEl) descEl.textContent = 'Unable to load weather right now. Please try again later.';
    if (placeholderEl) placeholderEl.textContent = 'Forecast unavailable.';
  }
}

function renderCurrentWeather(data, els) {
  const { descEl, tempEl, updatedEl, iconEl } = els;
  const current = data.current;
  const info = getWeatherInfo(current.weather_code);

  if (descEl) descEl.textContent = info.label;
  if (tempEl) tempEl.textContent = `${Math.round(current.temperature_2m)}°C`;

  if (iconEl) {
    // Using emoji as a lightweight, no-API-key icon — swap src for a real icon set later if desired
    iconEl.replaceWith(createEmojiIcon(info.icon, iconEl.id));
  }

  if (updatedEl) {
    const now = new Date(current.time);
    const timeStr = now.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' });
    updatedEl.textContent = `Updated ${timeStr} SGT`;
  }
}

function createEmojiIcon(emoji, id) {
  const span = document.createElement('span');
  span.id = id;
  span.textContent = emoji;
  span.style.fontSize = '2.5rem';
  span.style.lineHeight = '1';
  return span;
}

function renderForecast(data, els) {
  const { forecastEl, placeholderEl } = els;
  if (!forecastEl) return;

  if (placeholderEl) placeholderEl.remove();

  const days = data.daily.time;
  const codes = data.daily.weather_code;
  const maxTemps = data.daily.temperature_2m_max;
  const minTemps = data.daily.temperature_2m_min;

  days.forEach((dateStr, index) => {
    const date = new Date(dateStr);
    const dayLabel = index === 0
      ? 'Today'
      : date.toLocaleDateString('en-SG', { weekday: 'short' });

    const info = getWeatherInfo(codes[index]);

    const col = document.createElement('div');
    col.className = '';
    col.innerHTML = `
      <div class="p-3 rounded-3 h-100" style="background-color:#ffffff; border:1px solid #dddddd;">
        <p class="mb-1 fw-bold" style="color:#2B2B2B;">${dayLabel}</p>
        <p class="mb-1" style="font-size:2rem; line-height:1;">${info.icon}</p>
        <p class="mb-0 small" style="color:#2B2B2B;">${info.label}</p>
        <p class="mb-0 fw-bold" style="color:#0F6B72;">${Math.round(maxTemps[index])}°C</p>
        <p class="mb-0 small text-muted">${Math.round(minTemps[index])}°C</p>
      </div>
    `;
    forecastEl.appendChild(col);
  });
}