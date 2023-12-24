const apiBaseURL = "https://microbloglite.cyclic.app";

// POST /auth/login
async function login(loginData) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  };

  return await fetch(apiBaseURL + "/auth/login", options)
    .then((res) => res.json())
    .then((userData) => {
      // Check where to save storage and save it
      loginData.remember
        ? window.localStorage.setItem("user-data", JSON.stringify(userData))
        : window.sessionStorage.setItem("user-data", JSON.stringify(userData));
      window.location.assign("/posts"); // redirect to posts
      return userData;
    });
}

// GET /auth/logout
async function logout() {
  const loginData = getLoginData();
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  };

  return await fetch(apiBaseURL + "/auth/logout", options)
    .then((response) => response.json())
    .then((data) => data)
    .finally(() => {
      // Clear all storage
      window.sessionStorage.removeItem("user-data");
      window.localStorage.removeItem("user-data");
      window.location.assign("/"); // redirect back to landing page
    });
}

// Retrive login data from session storage
let getLoginData = () => {
  // Checks for user-data and gives empty if not found
  let userData =
    window.sessionStorage.getItem("user-data") ||
    window.localStorage.getItem("user-data") ||
    "{}";
  return JSON.parse(userData);
};

// Checks if use login token is saved locally
let isLoggedIn = () => "token" in getLoginData();
