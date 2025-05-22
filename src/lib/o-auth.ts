function loginWithGoogle() {
  window.location.href = "http://localhost:4000/api/auth/google";
}

function handleLogout() {
  // Use your backend logout endpoint
  const logoutUrl =
    process.env.NEXT_PUBLIC_LOGOUT_URL || "http://localhost:4000/logout"; // fallback for local dev

  window.location.href = logoutUrl;
}

async function checkSession() {
  try {
    const res = await fetch("http://localhost:4000/api/me", {
      credentials: "include",
    });
    const data = await res.json();
    console.log("Session check /api/me:", data);
    return data;
  } catch (err) {
    console.error("Error checking session:", err);
    return null;
  }
}

export { loginWithGoogle, handleLogout, checkSession };
