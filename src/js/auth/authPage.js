import {
  registerUser,
  loginUser,
  isLoggedIn
} from "./auth.js";

/* ----------------------------------
   DOM Elements
----------------------------------- */

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const authMessage = document.getElementById("authMessage");

/* ----------------------------------
   Already Logged In?
----------------------------------- */

if (isLoggedIn()) {
  window.location.href = "/";
}

/* ----------------------------------
   Switch Forms
----------------------------------- */

function showLogin() {

  loginTab.classList.add("active");
  signupTab.classList.remove("active");

  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");

  authMessage.textContent = "";

}

function showSignup() {

  signupTab.classList.add("active");
  loginTab.classList.remove("active");

  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");

  authMessage.textContent = "";

}

loginTab.addEventListener("click", showLogin);
signupTab.addEventListener("click", showSignup);

/* ----------------------------------
   Register User
----------------------------------- */

signupForm.addEventListener("submit", event => {

  event.preventDefault();

  const name =
    document.getElementById("fullName").value.trim();

  const email =
    document.getElementById("signupEmail").value.trim();

  const password =
    document.getElementById("signupPassword").value;

  const confirmPassword =
    document.getElementById("confirmPassword").value;

  if (!name || !email || !password) {

    authMessage.textContent =
      "Please complete every field.";

    return;

  }

  if (password.length < 8) {

    authMessage.textContent =
      "Password must be at least 8 characters.";

    return;

  }

  if (password !== confirmPassword) {

    authMessage.textContent =
      "Passwords do not match.";

    return;

  }

  const result =
    registerUser(name, email, password);

  authMessage.textContent = result.message;

  if (result.success) {

    signupForm.reset();

    setTimeout(() => {

      showLogin();

    }, 1200);

  }

});

/* ----------------------------------
   Login User
----------------------------------- */

loginForm.addEventListener("submit", event => {

  event.preventDefault();

  const email =
    document.getElementById("loginEmail").value.trim();

  const password =
    document.getElementById("loginPassword").value;

  const result =
    loginUser(email, password);

  if (!result.success) {

    authMessage.textContent = result.message;

    return;

  }

  authMessage.style.color = "green";
  authMessage.textContent = `Welcome back ${result.user.name}!`;

  setTimeout(() => {

    window.location.href = "/";

  }, 1000);

});