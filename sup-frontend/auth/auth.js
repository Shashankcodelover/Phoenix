const API = window.location.protocol === 'file:' ? 'http://localhost:5000/api' : (window.location.origin.includes('localhost') ? 'http://localhost:5000/api' : '/api');

/* =========================
   GLOBAL AUTH HELPER
========================= */
window.PhoenixAuth = {
  getToken: () => localStorage.getItem("token"),
  getUser: () => {
    try { return JSON.parse(localStorage.getItem("user")); } catch (e) { return null; }
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "../auth/login.html";
  },
  requireAuth: (redirectUrl = "../auth/login.html") => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }
};

/* =========================
   LOGIN LOGIC
========================= */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    if (message) {
      message.innerText = "";
      message.style.color = "var(--red, #ef4444)";
    }

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        if (message) message.innerText = data.message || "Login failed";
        return;
      }

      // Save token and user info
      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      if (message) {
        message.style.color = "var(--emerald-light, #34d399)";
        message.innerText = "Login verified! Redirecting to Command Center...";
      }

      // Redirect smoothly
      setTimeout(() => {
        window.location.href = "../dashboard/dashboard.html";
      }, 500);

    } catch (error) {
      console.error("Login Error:", error);
      if (message) message.innerText = "Server error. Please try again.";
    }
  });
}

/* =========================
   1-CLICK GUEST / INVESTOR DEMO LOGIN
========================= */
async function loginAsGuest() {
  const message = document.getElementById("message");
  if (message) {
    message.style.color = "var(--cyan-light, #22d3ee)";
    message.innerText = "Initializing Instant Investor / Demo Session...";
  }

  try {
    const res = await fetch(`${API}/auth/guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Apex Founder / Investor", targetDomain: "startup" })
    });

    const data = await res.json();
    if (!res.ok) {
      if (message) message.innerText = data.message || "Guest session failed";
      return;
    }

    localStorage.setItem("token", data.token);
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    if (message) {
      message.style.color = "var(--emerald-light, #34d399)";
      message.innerText = "Access granted! Redirecting...";
    }

    setTimeout(() => {
      window.location.href = "../dashboard/dashboard.html";
    }, 400);

  } catch (err) {
    console.error("Guest Auth Error:", err);
    if (message) message.innerText = "Unable to start guest session. Check backend status.";
  }
}
window.loginAsGuest = loginAsGuest;

/* =========================
   SIGNUP LOGIC
========================= */
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    if (message) {
      message.innerText = "";
      message.style.color = "var(--red, #ef4444)";
    }

    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        if (message) message.innerText = data.message || "Signup failed";
        return;
      }

      // Auto-login if token provided
      if (data.token) {
        localStorage.setItem("token", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      }

      if (message) {
        message.style.color = "var(--emerald-light, #34d399)";
        message.innerText = "Account created successfully! Launching workspace...";
      }

      setTimeout(() => {
        window.location.href = "../dashboard/dashboard.html";
      }, 600);

    } catch (error) {
      console.error("Signup Error:", error);
      if (message) message.innerText = "Server error. Please try again.";
    }
  });
}