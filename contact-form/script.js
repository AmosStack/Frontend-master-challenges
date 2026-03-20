const form = document.getElementById("contact-form");
const successToast = document.getElementById("success-toast");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let isValid = true;

  const firstName = document.getElementById("first-name");
  const lastName = document.getElementById("last-name");

  if (!firstName.value.trim()) {
    showError("error-first-name", firstName);
    isValid = false;
  } else {
    hideError("error-first-name", firstName);
  }

  if (!lastName.value.trim()) {
    showError("error-last-name", lastName);
    isValid = false;
  } else {
    hideError("error-last-name", lastName);
  }

  const email = document.getElementById("email");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    showError("error-email", email);
    isValid = false;
  } else {
    hideError("error-email", email);
  }

  const queryType = document.querySelector('input[name="query-type"]:checked');
  const queryError = document.getElementById("error-query");
  if (!queryType) {
    queryError.style.display = "block";
    isValid = false;
  } else {
    queryError.style.display = "none";
  }

  const message = document.getElementById("message");
  if (!message.value.trim()) {
    showError("error-message", message);
    isValid = false;
  } else {
    hideError("error-message", message);
  }

  const consent = document.querySelector('input[name="consent"]');
  const consentError = document.getElementById("error-consent");
  if (!consent.checked) {
    consentError.style.display = "block";
    isValid = false;
  } else {
    consentError.style.display = "none";
  }

  if (isValid) {
    showSuccess();
    form.reset();
  }
});

function showError(errorId, inputElement) {
  document.getElementById(errorId).style.display = "block";
  inputElement.style.borderColor = "var(--red)";
}

function hideError(errorId, inputElement) {
  document.getElementById(errorId).style.display = "none";
  inputElement.style.borderColor = "var(--grey-medium)";
}

function showSuccess() {
  successToast.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });

  setTimeout(() => {
    successToast.classList.add("hidden");
  }, 4000);
}
