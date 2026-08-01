const USERS_KEY = "teachhub_users";
const CURRENT_USER_KEY = "teachhub_current_user";

/* -----------------------------
   Helper Functions
------------------------------ */

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/* -----------------------------
   Register User
------------------------------ */

export function registerUser(name, email, password) {

  const users = getUsers();

  const existingUser = users.find(
    user => user.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    return {
      success: false,
      message: "An account with this email already exists."
    };
  }

  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  saveUsers(users);

  return {
    success: true,
    message: "Account created successfully."
  };

}

/* -----------------------------
   Login User
------------------------------ */

export function loginUser(email, password) {

  const users = getUsers();

  const user = users.find(
    user =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password
  );

  if (!user) {

    return {
      success: false,
      message: "Invalid email or password."
    };

  }

  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(user)
  );

  return {
    success: true,
    user
  };

}

/* -----------------------------
   Logout
------------------------------ */

export function logoutUser() {

  localStorage.removeItem(CURRENT_USER_KEY);

}

/* -----------------------------
   Current User
------------------------------ */

export function getCurrentUser() {

  return JSON.parse(
    localStorage.getItem(CURRENT_USER_KEY)
  );

}

/* -----------------------------
   Logged In?
------------------------------ */

export function isLoggedIn() {

  return getCurrentUser() !== null;

}

/* -----------------------------
   Protect Pages
------------------------------ */

export function protectPage() {

  const page =
    window.location.pathname.split("/").pop();

  // Only protect the Watchlist page
  const protectedPages = [
    "saved.html"
  ];

  if (
    protectedPages.includes(page) &&
    !isLoggedIn()
  ) {
    window.location.href = "/auth.html";
  }

}