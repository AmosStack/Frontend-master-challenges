const steps = Array.from(document.querySelectorAll(".step-panel"));
const stepButtons = Array.from(document.querySelectorAll(".step-btn"));
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("goBackBtn");
const confirmBtn = document.getElementById("confirmBtn");
const changePlanBtn = document.getElementById("changePlanBtn");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const phoneError = document.getElementById("phone-error");
const planError = document.getElementById("plan-error");

const planCards = Array.from(document.querySelectorAll(".plan-card"));
const billingToggle = document.getElementById("billingToggle");
const billingLabels = Array.from(document.querySelectorAll(".billing-label"));

const addonCards = Array.from(document.querySelectorAll(".addon-card"));
const addonInputs = Array.from(document.querySelectorAll('.addon-card input[type="checkbox"]'));

const summaryPlanName = document.getElementById("summary-plan-name");
const summaryPlanPrice = document.getElementById("summary-plan-price");
const summaryAddons = document.getElementById("summaryAddons");
const summaryTotalLabel = document.getElementById("summary-total-label");
const summaryTotalPrice = document.getElementById("summary-total-price");

const state = {
  currentStep: 1,
  furthestStep: 1,
  billing: "monthly",
  plan: "arcade",
  personalInfo: {
    name: "",
    email: "",
    phone: ""
  },
  addons: {
    online: true,
    storage: true,
    profile: false
  }
};

const plans = {
  arcade: {
    label: "Arcade",
    monthly: 9,
    yearly: 90
  },
  advanced: {
    label: "Advanced",
    monthly: 12,
    yearly: 120
  },
  pro: {
    label: "Pro",
    monthly: 15,
    yearly: 150
  }
};

const addons = {
  online: {
    label: "Online service",
    monthly: 1,
    yearly: 10
  },
  storage: {
    label: "Larger storage",
    monthly: 2,
    yearly: 20
  },
  profile: {
    label: "Customizable profile",
    monthly: 2,
    yearly: 20
  }
};

function formatCurrency(amount, billing, withPrefix = false) {
  const suffix = billing === "monthly" ? "/mo" : "/yr";
  return `${withPrefix ? "+" : ""}$${amount}${suffix}`;
}

function clearFieldError(input, errorEl) {
  input.classList.remove("is-invalid");
  errorEl.textContent = "";
}

function setFieldError(input, errorEl, message) {
  input.classList.add("is-invalid");
  errorEl.textContent = message;
}

function validateStepOne() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  state.personalInfo.name = name;
  state.personalInfo.email = email;
  state.personalInfo.phone = phone;

  let isValid = true;

  if (!name) {
    setFieldError(nameInput, nameError, "This field is required");
    isValid = false;
  } else {
    clearFieldError(nameInput, nameError);
  }

  if (!email) {
    setFieldError(emailInput, emailError, "This field is required");
    isValid = false;
  } else {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail) {
      setFieldError(emailInput, emailError, "Enter a valid email");
      isValid = false;
    } else {
      clearFieldError(emailInput, emailError);
    }
  }

  if (!phone) {
    setFieldError(phoneInput, phoneError, "This field is required");
    isValid = false;
  } else {
    clearFieldError(phoneInput, phoneError);
  }

  return isValid;
}

function validateStepTwo() {
  const hasPlan = Boolean(state.plan);
  planError.textContent = hasPlan ? "" : "Please select a plan";
  return hasPlan;
}

function updateStepUI() {
  steps.forEach((panel) => {
    const step = Number(panel.dataset.step);
    const isActive = step === state.currentStep;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });

  stepButtons.forEach((button) => {
    const stepTarget = Number(button.dataset.stepTarget);
    const visualStep = state.currentStep === 5 ? 4 : state.currentStep;
    const isActive = stepTarget === visualStep;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "step" : "false");
  });

  const isFirstStep = state.currentStep === 1;
  const isSummaryStep = state.currentStep === 4;
  const isThankYouStep = state.currentStep === 5;

  backBtn.hidden = isFirstStep || isThankYouStep;
  nextBtn.hidden = isSummaryStep || isThankYouStep;
  confirmBtn.hidden = !isSummaryStep;
}

function updatePlanUI() {
  planCards.forEach((card) => {
    const isSelected = card.dataset.plan === state.plan;
    card.classList.toggle("is-selected", isSelected);
    card.setAttribute("aria-checked", String(isSelected));

    const priceEl = card.querySelector(".plan-price");
    const badgeEl = card.querySelector(".plan-badge");
    priceEl.textContent = state.billing === "monthly" ? priceEl.dataset.monthly : priceEl.dataset.yearly;
    badgeEl.hidden = state.billing !== "yearly";
  });

  billingLabels.forEach((label) => {
    const mode = label.dataset.billingLabel;
    label.classList.toggle("is-active", mode === state.billing);
  });

  billingToggle.checked = state.billing === "yearly";
}

function updateAddonsUI() {
  addonInputs.forEach((input) => {
    const addonKey = input.dataset.addon;
    const selected = state.addons[addonKey];
    input.checked = selected;

    const card = input.closest(".addon-card");
    card.classList.toggle("is-selected", selected);

    const priceEl = card.querySelector(".addon-price");
    priceEl.textContent = state.billing === "monthly" ? priceEl.dataset.monthly : priceEl.dataset.yearly;
  });
}

function updateSummary() {
  const selectedPlan = plans[state.plan];
  const planPrice = selectedPlan[state.billing];

  summaryPlanName.textContent = `${selectedPlan.label} (${state.billing === "monthly" ? "Monthly" : "Yearly"})`;
  summaryPlanPrice.textContent = formatCurrency(planPrice, state.billing);

  const selectedAddonEntries = Object.entries(state.addons).filter(([, selected]) => selected);

  summaryAddons.innerHTML = "";
  selectedAddonEntries.forEach(([addonKey]) => {
    const addonData = addons[addonKey];
    const item = document.createElement("li");

    const name = document.createElement("span");
    name.textContent = addonData.label;

    const price = document.createElement("p");
    price.textContent = formatCurrency(addonData[state.billing], state.billing, true);

    item.append(name, price);
    summaryAddons.appendChild(item);
  });

  const addonsTotal = selectedAddonEntries.reduce((sum, [addonKey]) => sum + addons[addonKey][state.billing], 0);
  const grandTotal = planPrice + addonsTotal;

  summaryTotalLabel.textContent = `Total (per ${state.billing === "monthly" ? "month" : "year"})`;
  summaryTotalPrice.textContent = formatCurrency(grandTotal, state.billing, true);
}

function goToStep(step) {
  state.currentStep = step;
  state.furthestStep = Math.max(state.furthestStep, Math.min(step, 4));

  updateStepUI();
  updatePlanUI();
  updateAddonsUI();
  updateSummary();
}

function tryNextStep() {
  if (state.currentStep === 1 && !validateStepOne()) {
    return;
  }

  if (state.currentStep === 2 && !validateStepTwo()) {
    return;
  }

  goToStep(state.currentStep + 1);
}

nextBtn.addEventListener("click", tryNextStep);

backBtn.addEventListener("click", () => {
  if (state.currentStep > 1) {
    goToStep(state.currentStep - 1);
  }
});

confirmBtn.addEventListener("click", () => {
  goToStep(5);
});

changePlanBtn.addEventListener("click", () => {
  goToStep(2);
});

stepButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetStep = Number(button.dataset.stepTarget);
    if (targetStep <= state.furthestStep) {
      goToStep(targetStep);
    }
  });
});

[nameInput, emailInput, phoneInput].forEach((input) => {
  input.addEventListener("input", () => {
    if (input === nameInput) {
      clearFieldError(nameInput, nameError);
      state.personalInfo.name = nameInput.value.trim();
    }

    if (input === emailInput) {
      clearFieldError(emailInput, emailError);
      state.personalInfo.email = emailInput.value.trim();
    }

    if (input === phoneInput) {
      clearFieldError(phoneInput, phoneError);
      state.personalInfo.phone = phoneInput.value.trim();
    }
  });
});

planCards.forEach((card) => {
  card.addEventListener("click", () => {
    state.plan = card.dataset.plan;
    planError.textContent = "";
    updatePlanUI();
    updateSummary();
  });
});

billingToggle.addEventListener("change", () => {
  state.billing = billingToggle.checked ? "yearly" : "monthly";
  updatePlanUI();
  updateAddonsUI();
  updateSummary();
});

addonInputs.forEach((input) => {
  input.addEventListener("change", () => {
    state.addons[input.dataset.addon] = input.checked;
    updateAddonsUI();
    updateSummary();
  });
});

updateStepUI();
updatePlanUI();
updateAddonsUI();
updateSummary();
