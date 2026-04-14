const form = document.querySelector("#mortgage-form");
const clearButton = document.querySelector("#clear-all");

const inputs = {
  amount: document.querySelector("#amount"),
  term: document.querySelector("#term"),
  rate: document.querySelector("#rate")
};

const mortgageTypeInputs = [...document.querySelectorAll('input[name="mortgageType"]')];

const errorNodes = {
  amount: document.querySelector("#amount-error"),
  term: document.querySelector("#term-error"),
  rate: document.querySelector("#rate-error"),
  type: document.querySelector("#type-error")
};

const emptyResults = document.querySelector("#empty-results");
const filledResults = document.querySelector("#filled-results");
const monthlyPaymentNode = document.querySelector("#monthly-payment");
const totalPaymentNode = document.querySelector("#total-payment");

[inputs.amount, inputs.term, inputs.rate].forEach((input) => {
  input.addEventListener("input", () => {
    input.value = sanitizeDecimalInput(input.value);
  });
});

inputs.amount.addEventListener("focus", () => {
  inputs.amount.value = inputs.amount.value.replace(/,/g, "");
});

inputs.amount.addEventListener("blur", () => {
  const parsed = parseNumber(inputs.amount.value);

  if (!Number.isFinite(parsed)) {
    return;
  }

  inputs.amount.value = new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(parsed);
});

clearButton.addEventListener("click", () => {
  form.reset();
  clearErrors();
  showEmptyResults();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const amountValue = inputs.amount.value.trim();
  const termValue = inputs.term.value.trim();
  const rateValue = inputs.rate.value.trim();
  const selectedType = mortgageTypeInputs.find((input) => input.checked)?.value;

  let isValid = true;

  if (!amountValue) {
    showError("amount", "This field is required");
    isValid = false;
  }

  if (!termValue) {
    showError("term", "This field is required");
    isValid = false;
  }

  if (!rateValue) {
    showError("rate", "This field is required");
    isValid = false;
  }

  if (!selectedType) {
    showError("type", "This field is required");
    isValid = false;
  }

  const amount = parseNumber(amountValue);
  const term = parseNumber(termValue);
  const rate = parseNumber(rateValue);

  if (amountValue && (!Number.isFinite(amount) || amount <= 0)) {
    showError("amount", "Must be a valid positive number");
    isValid = false;
  }

  if (termValue && (!Number.isFinite(term) || term <= 0)) {
    showError("term", "Must be a valid positive number");
    isValid = false;
  }

  if (rateValue && (!Number.isFinite(rate) || rate < 0)) {
    showError("rate", "Must be zero or a positive number");
    isValid = false;
  }

  if (!isValid) {
    showEmptyResults();
    return;
  }

  const months = Math.round(term * 12);
  const monthlyRate = rate / 100 / 12;

  let monthlyPayment;
  let totalPayment;

  if (selectedType === "repayment") {
    if (monthlyRate === 0) {
      monthlyPayment = amount / months;
    } else {
      const growth = (1 + monthlyRate) ** months;
      monthlyPayment = amount * ((monthlyRate * growth) / (growth - 1));
    }

    totalPayment = monthlyPayment * months;
  } else {
    monthlyPayment = amount * monthlyRate;
    totalPayment = amount + monthlyPayment * months;
  }

  monthlyPaymentNode.textContent = formatCurrency(monthlyPayment);
  totalPaymentNode.textContent = formatCurrency(totalPayment);
  showFilledResults();
});

function sanitizeDecimalInput(value) {
  const stripped = value.replace(/[^0-9.]/g, "");
  const parts = stripped.split(".");

  if (parts.length <= 1) {
    return stripped;
  }

  return `${parts[0]}.${parts.slice(1).join("")}`;
}

function parseNumber(value) {
  return Number.parseFloat(value.replace(/,/g, ""));
}

function clearErrors() {
  Object.keys(errorNodes).forEach((key) => {
    errorNodes[key].textContent = "";
  });

  document.querySelectorAll(".form-group").forEach((group) => {
    group.classList.remove("has-error");
  });
}

function showError(key, message) {
  const targetGroup = document.querySelector(`[data-field="${key}"]`);

  if (targetGroup) {
    targetGroup.classList.add("has-error");
  }

  errorNodes[key].textContent = message;
}

function showFilledResults() {
  emptyResults.classList.add("is-hidden");
  filledResults.classList.remove("is-hidden");
}

function showEmptyResults() {
  filledResults.classList.add("is-hidden");
  emptyResults.classList.remove("is-hidden");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}
