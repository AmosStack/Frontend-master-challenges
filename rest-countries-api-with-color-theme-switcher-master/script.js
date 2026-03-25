const STORAGE_KEY = "rest-countries-theme";

const state = {
  countries: [],
  byCode: new Map(),
  searchTerm: "",
  region: "",
  currentCountryCode: null,
};

const refs = {
  listView: document.getElementById("listView"),
  detailView: document.getElementById("detailView"),
  countryGrid: document.getElementById("countryGrid"),
  resultSummary: document.getElementById("resultSummary"),
  countryDetail: document.getElementById("countryDetail"),
  searchInput: document.getElementById("searchInput"),
  regionFilter: document.getElementById("regionFilter"),
  backButton: document.getElementById("backButton"),
  themeToggle: document.getElementById("themeToggle"),
  themeText: document.getElementById("themeText"),
};

init();

async function init() {
  initializeTheme();
  wireEvents();
  setLoadingState();

  try {
    const response = await fetch("./data.json");
    if (!response.ok) {
      throw new Error("Could not load country data.");
    }

    state.countries = await response.json();
    state.byCode = new Map(state.countries.map((country) => [country.alpha3Code, country]));

    const countryFromUrl = getCountryCodeFromUrl();
    if (countryFromUrl) {
      openDetail(countryFromUrl, false);
    } else {
      renderList();
    }
  } catch (error) {
    refs.countryGrid.innerHTML = `<p class="empty">${escapeHtml(getReadableLoadError(error))}</p>`;
    refs.resultSummary.textContent = "";
  }
}

function wireEvents() {
  refs.searchInput.addEventListener("input", (event) => {
    state.searchTerm = event.target.value.trim();
    renderList();
  });

  refs.regionFilter.addEventListener("change", (event) => {
    state.region = event.target.value;
    renderList();
  });

  refs.backButton.addEventListener("click", () => {
    closeDetail();
  });

  refs.themeToggle.addEventListener("click", () => {
    const html = document.documentElement;
    const nextTheme = html.dataset.theme === "dark" ? "light" : "dark";
    html.dataset.theme = nextTheme;
    localStorage.setItem(STORAGE_KEY, nextTheme);
    updateThemeText(nextTheme);
  });

  window.addEventListener("popstate", () => {
    const countryCode = getCountryCodeFromUrl();
    if (countryCode) {
      openDetail(countryCode, false);
      return;
    }

    closeDetail(false);
  });
}

function renderList() {
  refs.listView.classList.remove("hidden");
  refs.detailView.classList.add("hidden");

  const countries = getFilteredCountries();
  refs.resultSummary.textContent = `${countries.length} countries found`;

  if (!countries.length) {
    refs.countryGrid.innerHTML = '<p class="empty">No countries match this search/filter.</p>';
    return;
  }

  refs.countryGrid.innerHTML = countries.map(createCountryCard).join("");

  for (const button of refs.countryGrid.querySelectorAll(".card")) {
    button.addEventListener("click", () => {
      openDetail(button.dataset.code);
    });
  }
}

function createCountryCard(country) {
  return `
    <button class="card" type="button" data-code="${escapeHtml(country.alpha3Code)}" aria-label="Open details for ${escapeHtml(country.name)}">
      <img src="${escapeHtml(country.flags.png)}" alt="Flag of ${escapeHtml(country.name)}" loading="lazy" />
      <div class="card-body">
        <h2>${escapeHtml(country.name)}</h2>
        <p><b>Population:</b> ${formatNumber(country.population)}</p>
        <p><b>Region:</b> ${escapeHtml(country.region || "N/A")}</p>
        <p><b>Capital:</b> ${escapeHtml(country.capital || "N/A")}</p>
      </div>
    </button>
  `;
}

function openDetail(countryCode, pushState = true) {
  const country = state.byCode.get(countryCode);
  if (!country) {
    closeDetail(pushState);
    return;
  }

  state.currentCountryCode = countryCode;

  refs.listView.classList.add("hidden");
  refs.detailView.classList.remove("hidden");

  refs.countryDetail.innerHTML = createCountryDetail(country);

  for (const borderButton of refs.countryDetail.querySelectorAll(".border-tag")) {
    borderButton.addEventListener("click", () => {
      openDetail(borderButton.dataset.code);
    });
  }

  if (pushState) {
    const nextUrl = `${window.location.pathname}?country=${countryCode}`;
    history.pushState({ countryCode }, "", nextUrl);
  }
}

function closeDetail(pushState = true) {
  state.currentCountryCode = null;
  if (pushState) {
    history.pushState({}, "", window.location.pathname);
  }
  renderList();
}

function createCountryDetail(country) {
  const nativeName = country.nativeName || "N/A";
  const topLevelDomain = country.topLevelDomain?.join(", ") || "N/A";
  const currencies = country.currencies?.map((item) => item.name).join(", ") || "N/A";
  const languages = country.languages?.map((item) => item.name).join(", ") || "N/A";
  const borders = country.borders || [];

  return `
    <img src="${escapeHtml(country.flags.svg || country.flags.png)}" alt="Flag of ${escapeHtml(country.name)}" />

    <div>
      <h2>${escapeHtml(country.name)}</h2>
      <div class="detail-columns">
        <section class="detail-meta">
          <p><b>Native Name:</b> ${escapeHtml(nativeName)}</p>
          <p><b>Population:</b> ${formatNumber(country.population)}</p>
          <p><b>Region:</b> ${escapeHtml(country.region || "N/A")}</p>
          <p><b>Sub Region:</b> ${escapeHtml(country.subregion || "N/A")}</p>
          <p><b>Capital:</b> ${escapeHtml(country.capital || "N/A")}</p>
        </section>

        <section class="detail-meta">
          <p><b>Top Level Domain:</b> ${escapeHtml(topLevelDomain)}</p>
          <p><b>Currencies:</b> ${escapeHtml(currencies)}</p>
          <p><b>Languages:</b> ${escapeHtml(languages)}</p>
        </section>
      </div>

      <section class="borders" aria-label="Border countries">
        <b>Border Countries:</b>
        ${renderBorders(borders)}
      </section>
    </div>
  `;
}

function renderBorders(borderCodes) {
  if (!borderCodes.length) {
    return "<span>No bordering countries</span>";
  }

  return borderCodes
    .map((code) => {
      const borderCountry = state.byCode.get(code);
      const name = borderCountry?.name || code;
      return `<button class="border-tag" type="button" data-code="${escapeHtml(code)}">${escapeHtml(name)}</button>`;
    })
    .join("");
}

function getFilteredCountries() {
  const term = state.searchTerm.toLowerCase();

  return state.countries
    .filter((country) => {
      const matchesSearch = country.name.toLowerCase().includes(term);
      const matchesRegion = !state.region || country.region === state.region;
      return matchesSearch && matchesRegion;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

function initializeTheme() {
  const storedTheme = localStorage.getItem(STORAGE_KEY);
  const initialTheme = storedTheme || "light";
  document.documentElement.dataset.theme = initialTheme;
  updateThemeText(initialTheme);
}

function updateThemeText(theme) {
  refs.themeText.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
}

function getCountryCodeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("country");
}

function setLoadingState() {
  refs.resultSummary.textContent = "Loading countries...";
  refs.countryGrid.innerHTML = '<p class="empty">Loading country data...</p>';
}

function getReadableLoadError(error) {
  if (window.location.protocol === "file:") {
    return "Data could not be loaded from file:// mode. Start a local server and open the app from http://localhost.";
  }

  return error?.message || "Something went wrong while loading country data.";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
