const form = document.querySelector("#age-form");
const fields = {
  day: document.querySelector("#day"),
  month: document.querySelector("#month"),
  year: document.querySelector("#year")
};

const errorNodes = {
  day: document.querySelector("#day-error"),
  month: document.querySelector("#month-error"),
  year: document.querySelector("#year-error")
};

const resultNodes = {
  years: document.querySelector("#years"),
  months: document.querySelector("#months"),
  days: document.querySelector("#days")
};

const currentValues = {
  years: 0,
  months: 0,
  days: 0
};

Object.values(fields).forEach((input) => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "");
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  clearErrors();

  const day = Number.parseInt(fields.day.value, 10);
  const month = Number.parseInt(fields.month.value, 10);
  const year = Number.parseInt(fields.year.value, 10);

  let isValid = true;

  if (!fields.day.value.trim()) {
    showError("day", "This field is required");
    isValid = false;
  }

  if (!fields.month.value.trim()) {
    showError("month", "This field is required");
    isValid = false;
  }

  if (!fields.year.value.trim()) {
    showError("year", "This field is required");
    isValid = false;
  }

  if (!isValid) {
    resetResult();
    return;
  }

  if (day < 1 || day > 31) {
    showError("day", "Must be a valid day");
    isValid = false;
  }

  if (month < 1 || month > 12) {
    showError("month", "Must be a valid month");
    isValid = false;
  }

  const today = new Date();

  if (year < 1 || year > today.getFullYear()) {
    showError("year", "Must be in the past");
    isValid = false;
  }

  if (!isValid) {
    resetResult();
    return;
  }

  const birthDate = new Date(year, month - 1, day);

  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    showError("day", "Must be a valid date");
    resetResult();
    return;
  }

  if (birthDate > today) {
    showError("year", "Must be in the past");
    resetResult();
    return;
  }

  const age = calculateAge(birthDate, today);
  animateResult(age);
});

function clearErrors() {
  Object.keys(fields).forEach((key) => {
    fields[key].closest(".field").classList.remove("has-error");
    fields[key].removeAttribute("aria-invalid");
    errorNodes[key].textContent = "";
  });
}

function showError(fieldName, message) {
  fields[fieldName].closest(".field").classList.add("has-error");
  fields[fieldName].setAttribute("aria-invalid", "true");
  errorNodes[fieldName].textContent = message;
}

function calculateAge(birthDate, today) {
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;

    const previousMonthDate = new Date(today.getFullYear(), today.getMonth(), 0);
    days += previousMonthDate.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

function resetResult() {
  resultNodes.years.textContent = "--";
  resultNodes.months.textContent = "--";
  resultNodes.days.textContent = "--";

  currentValues.years = 0;
  currentValues.months = 0;
  currentValues.days = 0;
}

function animateResult(target) {
  const duration = 700;
  const start = performance.now();

  const from = {
    years: Number.isFinite(currentValues.years) ? currentValues.years : 0,
    months: Number.isFinite(currentValues.months) ? currentValues.months : 0,
    days: Number.isFinite(currentValues.days) ? currentValues.days : 0
  };

  const step = (timestamp) => {
    const progress = Math.min((timestamp - start) / duration, 1);

    ["years", "months", "days"].forEach((unit) => {
      const value = Math.floor(from[unit] + (target[unit] - from[unit]) * progress);
      resultNodes[unit].textContent = value;
    });

    if (progress < 1) {
      requestAnimationFrame(step);
      return;
    }

    currentValues.years = target.years;
    currentValues.months = target.months;
    currentValues.days = target.days;
  };

  requestAnimationFrame(step);
}
