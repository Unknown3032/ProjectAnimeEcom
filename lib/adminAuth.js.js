"use client";

/**
 * Get user from localStorage
 */
export function getUser() {
  if (typeof window === "undefined") return null;

  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

/**
 * Get token from localStorage
 */
export function getToken() {
  let token;
  if (typeof window === "undefined") return null;
  let user = localStorage.getItem("user");
  token = JSON.parse(user)._id;


  return token;
}

/**
 * Check if user is authenticated (has both user and token)
 */
export function isAuthenticated() {
  return !!(getUser() && getToken());
}

/**
 * Check if user is admin
 */
export function isAdmin() {
  const user = getUser();
  if (!user || !user?.role) return false;
  return user.role === "admin" ;
}

/**
 * Logout and redirect to signin
 */
export function logout() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("cart");

  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(
    new CustomEvent("authChange", {
      detail: { type: "logout" },
    })
  );

  window.location.href = "/signin";
}

// Helper functions
export function getUserEmail() {
  const user = getUser();
  return user?.email || "";
}

export function getUserFirstName() {
  const user = getUser();
  return user?.firstName || "User";
}

export function getUserLastName() {
  const user = getUser();
  return user?.lastName || "";
}

export function getUserFullName() {
  const user = getUser();
  return user?.fullName || `${getUserFirstName()} ${getUserLastName()}`.trim();
}

export function getUserRole() {
  const user = getUser();
  return user?.role || "user";
}

export function getUserAvatar() {
  const user = getUser();
  return user?.avatar || "https://via.placeholder.com/150";
}

export function getUserId() {
  const user = getUser();
  return user?._id || null;
}

export function getUserInitials() {
  const user = getUser();
  if (!user) return "U";
  const first = user.firstName?.charAt(0)?.toUpperCase() || "";
  const last = user.lastName?.charAt(0)?.toUpperCase() || "";
  return `${first}${last}` || "U";
}

export function getLoyaltyPoints() {
  const user = getUser();
  return user?.loyaltyPoints || 0;
}

export function getTotalSpent() {
  const user = getUser();
  return user?.totalSpent || 0;
}

export function isUserVerified() {
  const user = getUser();
  return user?.isVerified || false;
}

export function getLastLogin() {
  const user = getUser();
  return user?.lastLogin || null;
}
