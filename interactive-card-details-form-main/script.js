const form = document.getElementById("cardForm");
const completedState = document.getElementById("completedState");
const continueBtn = document.getElementById("continueBtn");

const nameInput = document.getElementById("cardholderName");
const numberInput = document.getElementById("cardNumber");
const monthInput = document.getElementById("expMonth");
const yearInput = document.getElementById("expYear");
const cvcInput = document.getElementById("cvc");

const nameError = document.getElementById("nameError");
const numberError = document.getElementById("numberError");
const expError = document.getElementById("expError");
const cvcError = document.getElementById("cvcError");

const cardNamePreview = document.getElementById("cardNamePreview");
const cardNumberPreview = document.getElementById("cardNumberPreview");
const cardMonthPreview = document.getElementById("cardMonthPreview");
const cardYearPreview = document.getElementById("cardYearPreview");
const cardCvcPreview = document.getElementById("cardCvcPreview");

const defaultPreview = {
  name: "JANE APPLESEED",
  number: "0000 0000 0000 0000",
  month: "00",
  year: "00",
  cvc: "000",
};

const digitsOnly = (value) => value.replace(/\D/g, "");

const formatCardNumber = (value) => {
  const digits = digitsOnly(value).slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};

const updatePreview = () => {
  const trimmedName = nameInput.value.trim();
  const formattedNumber = formatCardNumber(numberInput.value);
  const month = digitsOnly(monthInput.value).slice(0, 2);
  const year = digitsOnly(yearInput.value).slice(0, 2);
  const cvc = digitsOnly(cvcInput.value).slice(0, 3);

  cardNamePreview.textContent = trimmedName ? trimmedName.toUpperCase() : defaultPreview.name;
  cardNumberPreview.textContent = formattedNumber || defaultPreview.number;
  cardMonthPreview.textContent = month || defaultPreview.month;
  cardYearPreview.textContent = year || defaultPreview.year;
  cardCvcPreview.textContent = cvc || defaultPreview.cvc;
};

const setError = (input, errorElement, message) => {
  errorElement.textContent = message;
  input.classList.toggle("invalid", Boolean(message));
};

const clearErrors = () => {
  setError(nameInput, nameError, "");
  setError(numberInput, numberError, "");
  setError(monthInput, expError, "");
  monthInput.classList.remove("invalid");
  yearInput.classList.remove("invalid");
  setError(cvcInput, cvcError, "");
};

const validateForm = () => {
  clearErrors();
  let isValid = true;

  const name = nameInput.value.trim();
  const numberRaw = numberInput.value.trim();
  const numberDigits = digitsOnly(numberRaw);
  const monthDigits = digitsOnly(monthInput.value);
  const yearDigits = digitsOnly(yearInput.value);
  const cvcDigits = digitsOnly(cvcInput.value);

  if (!name) {
    setError(nameInput, nameError, "Can't be blank");
    isValid = false;
  }

  if (!numberRaw) {
    setError(numberInput, numberError, "Can't be blank");
    isValid = false;
  } else if (/[^\d\s]/.test(numberRaw)) {
    setError(numberInput, numberError, "Wrong format, numbers only");
    isValid = false;
  } else if (numberDigits.length !== 16) {
    setError(numberInput, numberError, "Wrong format, numbers only");
    isValid = false;
  }

  if (!monthDigits || !yearDigits) {
    expError.textContent = "Can't be blank";
    monthInput.classList.toggle("invalid", !monthDigits);
    yearInput.classList.toggle("invalid", !yearDigits);
    isValid = false;
  } else {
    const monthNumber = Number(monthDigits);
    if (monthDigits.length !== 2 || monthNumber < 1 || monthNumber > 12 || yearDigits.length !== 2) {
      expError.textContent = "Wrong format";
      monthInput.classList.add("invalid");
      yearInput.classList.add("invalid");
      isValid = false;
    }
  }

  if (!cvcDigits) {
    setError(cvcInput, cvcError, "Can't be blank");
    isValid = false;
  } else if (cvcDigits.length !== 3) {
    setError(cvcInput, cvcError, "Wrong format");
    isValid = false;
  }

  return isValid;
};

numberInput.addEventListener("input", () => {
  numberInput.value = formatCardNumber(numberInput.value);
  updatePreview();
});

monthInput.addEventListener("input", () => {
  monthInput.value = digitsOnly(monthInput.value).slice(0, 2);
  updatePreview();
});

yearInput.addEventListener("input", () => {
  yearInput.value = digitsOnly(yearInput.value).slice(0, 2);
  updatePreview();
});

cvcInput.addEventListener("input", () => {
  cvcInput.value = digitsOnly(cvcInput.value).slice(0, 3);
  updatePreview();
});

nameInput.addEventListener("input", updatePreview);

[nameInput, numberInput, monthInput, yearInput, cvcInput].forEach((input) => {
  input.addEventListener("input", () => {
    if (input.classList.contains("invalid")) {
      input.classList.remove("invalid");
    }
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  form.hidden = true;
  completedState.hidden = false;
});

continueBtn.addEventListener("click", () => {
  form.reset();
  clearErrors();
  updatePreview();

  completedState.hidden = true;
  form.hidden = false;
});

updatePreview();