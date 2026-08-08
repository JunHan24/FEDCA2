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

// WMO Weather interpretation codes
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
    return WEATHER_CODES[code] || {
        label: 'Unknown',
        icon: '❓'
    };
}

// Get weather data
async function initWeatherForecast() {
    const descEl = document.getElementById('weather-current-desc');
    const tempEl = document.getElementById('weather-current-temp');
    const updatedEl = document.getElementById('weather-current-updated');
    const iconEl = document.getElementById('weather-current-icon');

    const forecastEl = document.getElementById('weather-forecast');
    const placeholderEl = document.getElementById('weather-forecast-placeholder');

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${SG_LAT}&longitude=${SG_LON}` +
        `&current=temperature_2m,weather_code` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
        `&timezone=Asia%2FSingapore`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Weather API returned ${response.status}`);
        }

        const data = await response.json();

        renderCurrentWeather(data, {
            descEl,
            tempEl,
            updatedEl,
            iconEl
        });

        renderForecast(data, {
            forecastEl,
            placeholderEl
        });

    } catch (error) {
        console.error('Failed to load weather data:', error);

        if (descEl) {
            descEl.textContent =
                'Unable to load weather right now. Please try again later.';
        }

        if (placeholderEl) {
            placeholderEl.textContent = 'Forecast unavailable.';
        }
    }
}

// Current weather
function renderCurrentWeather(data, elements) {
    const {
        descEl,
        tempEl,
        updatedEl,
        iconEl
    } = elements;

    const current = data.current;
    const info = getWeatherInfo(current.weather_code);

    if (descEl) {
        descEl.textContent = info.label;
    }

    if (tempEl) {
        tempEl.textContent =
            `${Math.round(current.temperature_2m)}°C`;
    }

    if (iconEl) {
        iconEl.replaceWith(
            createWeatherIcon(info.icon, iconEl.id)
        );
    }

    if (updatedEl) {
        const now = new Date(current.time);

        const timeStr = now.toLocaleTimeString('en-SG', {
            hour: '2-digit',
            minute: '2-digit'
        });

        updatedEl.textContent = `Updated ${timeStr} SGT`;
    }
}

// Create weather icon
function createWeatherIcon(emoji, id) {
    const span = document.createElement('span');

    span.id = id;
    span.className = 'weather-current-icon';
    span.textContent = emoji;

    return span;
}

// Forecast
function renderForecast(data, elements) {
    const {
        forecastEl,
        placeholderEl
    } = elements;

    if (!forecastEl) {
        return;
    }

    if (placeholderEl) {
        placeholderEl.remove();
    }

    const days = data.daily.time;
    const codes = data.daily.weather_code;
    const maxTemps = data.daily.temperature_2m_max;
    const minTemps = data.daily.temperature_2m_min;

    days.forEach((dateStr, index) => {

        const date = new Date(dateStr);

        const dayLabel =
            index === 0
                ? 'Today'
                : date.toLocaleDateString('en-SG', {
                    weekday: 'short'
                });

        const info = getWeatherInfo(codes[index]);

        const col = document.createElement('div');

        col.className =
            'col-6 col-sm-4 col-md-3 col-lg';

        col.innerHTML = `
            <div class="weather-day-card p-3 rounded-3 h-100">

                <p class="weather-day-name mb-1 fw-bold">
                    ${dayLabel}
                </p>

                <p class="weather-day-icon mb-1">
                    ${info.icon}
                </p>

                <p class="weather-day-description mb-1 small">
                    ${info.label}
                </p>

                <p class="weather-high mb-0 fw-bold">
                    ${Math.round(maxTemps[index])}°C
                </p>

                <p class="weather-low mb-0 small">
                    ${Math.round(minTemps[index])}°C
                </p>

            </div>
        `;

        forecastEl.appendChild(col);
    });
}

/* This is for the sg clock */
function updateSGClock() {
  const timeEl = document.getElementById('sgClockTime');
  const dateEl = document.getElementById('sgClockDate');

  if (!timeEl || !dateEl) return;

  const now = new Date();

  const timeString = now.toLocaleTimeString('en-SG', {
    timeZone: 'Asia/Singapore',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).toUpperCase();

  const dateString = now.toLocaleDateString('en-SG', {
    timeZone: 'Asia/Singapore',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  timeEl.textContent = timeString;
  dateEl.textContent = dateString;
}

if (document.getElementById('sgClockTime')) {
  updateSGClock();
  setInterval(updateSGClock, 1000);
}
/* This is the currency exchange function */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('currencyCard')) {
    initCurrencyConverter();
  }
});

function initCurrencyConverter() {
  const amountEl = document.getElementById('currencyAmount');
  const fromEl = document.getElementById('currencyFrom');
  const resultEl = document.getElementById('currencyResult');
  const noteEl = document.getElementById('currencyRateNote');

  if (!amountEl || !fromEl || !resultEl) return;

  const rateCache = {};

  function formatResult(value) {
    return value.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function recalculate() {
    const currency = fromEl.value;
    const rate = rateCache[currency];
    const amount = parseFloat(amountEl.value);

    if (rate === undefined) return;

    if (isNaN(amount) || amount < 0) {
      resultEl.textContent = '--';
      return;
    }

    resultEl.textContent = formatResult(amount * rate);
  }

  async function loadRate(currency) {
    if (rateCache[currency] !== undefined) {
      recalculate();
      return;
    }

    noteEl.textContent = 'Loading exchange rate…';

    try {
      const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=${currency}&symbols=SGD`);
      if (!response.ok) throw new Error(`Currency API returned ${response.status}`);
      const data = await response.json();

      const rate = data.rates.SGD;
      rateCache[currency] = rate;

      noteEl.textContent = `1 ${currency} = ${rate.toFixed(4)} SGD (as of ${data.date})`;
      recalculate();

    } catch (error) {
      console.error('Failed to load currency rate:', error);
      noteEl.textContent = 'Unable to load exchange rate right now. Please try again later.';
      resultEl.textContent = '--';
    }
  }

  fromEl.addEventListener('change', () => loadRate(fromEl.value));
  amountEl.addEventListener('input', recalculate);

  loadRate(fromEl.value);
}

// Feedback Form

const form = document.getElementById("feedbackForm");

if(form){
  form.addEventListener("submit", function(event){

    event.preventDefault();

    const email = document.getElementById("email");
    const suggestion = document.getElementById("suggestion");
    const question = document.getElementById("question");

    const error = document.getElementById("messageError");
    const success = document.getElementById("successMessage");

    let valid = true;

    // Reset
    email.classList.remove("is-invalid");
    suggestion.classList.remove("is-invalid");
    question.classList.remove("is-invalid");
    error.classList.add("d-none");
    success.classList.add("d-none");

    // Email required
    if(email.value.trim() === ""){
      email.classList.add("is-invalid");
      valid = false;
    }

    // Must have suggestion or question
    if(
      suggestion.value.trim() === "" &&
      question.value.trim() === ""
    ){
      suggestion.classList.add("is-invalid");
      question.classList.add("is-invalid");
      error.classList.remove("d-none");
      valid = false;
    }

    if(valid){
      success.classList.remove("d-none");
      form.reset();
    }
  });
}