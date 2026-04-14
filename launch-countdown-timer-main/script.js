const DAY_MS = 24 * 60 * 60 * 1000;
const countdownEnd = Date.now() + 14 * DAY_MS;

const elements = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds")
};

let previous = {
  days: null,
  hours: null,
  minutes: null,
  seconds: null
};

updateCountdown();
setInterval(updateCountdown, 1000);

function updateCountdown() {
  const now = Date.now();
  const remaining = Math.max(0, countdownEnd - now);

  const days = Math.floor(remaining / DAY_MS);
  const hours = Math.floor((remaining % DAY_MS) / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

  const nextValues = { days, hours, minutes, seconds };

  Object.entries(nextValues).forEach(([unit, value]) => {
    const formatted = String(value).padStart(2, "0");

    if (previous[unit] !== null && previous[unit] !== formatted) {
      triggerFlip(elements[unit].closest(".flip-card"));
    }

    elements[unit].textContent = formatted;
    previous[unit] = formatted;
  });
}

function triggerFlip(card) {
  card.classList.remove("is-flipping");

  requestAnimationFrame(() => {
    card.classList.add("is-flipping");
  });

  setTimeout(() => {
    card.classList.remove("is-flipping");
  }, 380);
}
