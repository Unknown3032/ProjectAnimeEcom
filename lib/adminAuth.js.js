"use client";

/**
 * Admin Authentication Library
 * Handles all authentication-related functions for admin users
 */

/**
 * Get user from localStorage
 * @returns {Object|null} User object or null
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
 * Get token from localStorage (User ID)
 * @returns {string|null} User ID or null
 */
export function getToken() {
  if (typeof window === "undefined") return null;
  
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user._id || null;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}

/**
 * Get admin token - alias for getToken
 * @returns {string|null} User ID or null
 */
export function getAdminToken() {
  return getToken();
}

/**
 * Check if user is authenticated (has both user and token)
 * @returns {boolean} True if authenticated
 */
export function isAuthenticated() {
  return !!(getUser() && getToken());
}

/**
 * Check if user is admin
 * @returns {boolean} True if user is admin
 */
export function isAdmin() {
  const user = getUser();
  if (!user || !user?.role) return false;
  return user.role === "admin";
}

/**
 * Check if user is vendor
 * @returns {boolean} True if user is vendor
 */
export function isVendor() {
  const user = getUser();
  if (!user || !user?.role) return false;
  return user.role === "vendor";
}

/**
 * Check if user has admin or vendor role
 * @returns {boolean} True if user has elevated privileges
 */
export function hasAdminAccess() {
  const user = getUser();
  if (!user || !user?.role) return false;
  return user.role === "admin" || user.role === "vendor";
}

/**
 * Logout user and redirect to signin
 */
export function logout() {
  if (typeof window === "undefined") return;

  // Clear all auth-related data
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
  localStorage.removeItem("adminToken");

  // Dispatch events for components listening to auth changes
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(
    new CustomEvent("authChange", {
      detail: { type: "logout" },
    })
  );

  // Redirect to signin page
  window.location.href = "/signin";
}

/**
 * Set user data in localStorage
 * @param {Object} userData - User object to store
 */
export function setUser(userData) {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Dispatch event for components listening to auth changes
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(
      new CustomEvent("authChange", {
        detail: { type: "login", user: userData },
      })
    );
  } catch (error) {
    console.error("Error setting user:", error);
  }
}

/**
 * Update user data in localStorage
 * @param {Object} updates - Partial user object with updates
 */
export function updateUser(updates) {
  if (typeof window === "undefined") return;
  
  try {
    const currentUser = getUser();
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...updates };
    setUser(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

// ========================================
// User Information Helper Functions
// ========================================

/**
 * Get user email
 * @returns {string} User email or empty string
 */
export function getUserEmail() {
  const user = getUser();
  return user?.email || "";
}

/**
 * Get user first name
 * @returns {string} User first name or "User"
 */
export function getUserFirstName() {
  const user = getUser();
  return user?.firstName || "User";
}

/**
 * Get user last name
 * @returns {string} User last name or empty string
 */
export function getUserLastName() {
  const user = getUser();
  return user?.lastName || "";
}

/**
 * Get user full name
 * @returns {string} User full name
 */
export function getUserFullName() {
  const user = getUser();
  return user?.fullName || `${getUserFirstName()} ${getUserLastName()}`.trim();
}

/**
 * Get user role
 * @returns {string} User role (admin, vendor, user)
 */
export function getUserRole() {
  const user = getUser();
  return user?.role || "user";
}

/**
 * Get user avatar URL
 * @returns {string} Avatar URL or placeholder
 */
export function getUserAvatar() {
  const user = getUser();
  return user?.avatar || "https://via.placeholder.com/150";
}

/**
 * Get user ID
 * @returns {string|null} User ID or null
 */
export function getUserId() {
  const user = getUser();
  return user?._id || null;
}

/**
 * Get user initials
 * @returns {string} User initials (e.g., "JD" for John Doe)
 */
export function getUserInitials() {
  const user = getUser();
  if (!user) return "U";
  const first = user.firstName?.charAt(0)?.toUpperCase() || "";
  const last = user.lastName?.charAt(0)?.toUpperCase() || "";
  return `${first}${last}` || "U";
}

/**
 * Get user phone number
 * @returns {string} User phone or empty string
 */
export function getUserPhone() {
  const user = getUser();
  return user?.phone || "";
}

/**
 * Get user loyalty points
 * @returns {number} Loyalty points
 */
export function getLoyaltyPoints() {
  const user = getUser();
  return user?.loyaltyPoints || 0;
}

/**
 * Get user total spent
 * @returns {number} Total amount spent
 */
export function getTotalSpent() {
  const user = getUser();
  return user?.totalSpent || 0;
}

/**
 * Check if user email is verified
 * @returns {boolean} True if verified
 */
export function isUserVerified() {
  const user = getUser();
  return user?.isVerified || false;
}

/**
 * Check if user account is active
 * @returns {boolean} True if active
 */
export function isUserActive() {
  const user = getUser();
  return user?.isActive !== false; // Default to true if not set
}

/**
 * Get user last login date
 * @returns {Date|null} Last login date or null
 */
export function getLastLogin() {
  const user = getUser();
  return user?.lastLogin || null;
}

/**
 * Get user creation date
 * @returns {Date|null} Account creation date or null
 */
export function getCreatedAt() {
  const user = getUser();
  return user?.createdAt || null;
}

/**
 * Get user preferences
 * @returns {Object} User preferences object
 */
export function getUserPreferences() {
  const user = getUser();
  return user?.preferences || {
    newsletter: true,
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    language: "en",
    currency: "USD",
  };
}

/**
 * Get user addresses
 * @returns {Array} Array of user addresses
 */
export function getUserAddresses() {
  const user = getUser();
  return user?.addresses || [];
}

/**
 * Get default address
 * @returns {Object|null} Default address or null
 */
export function getDefaultAddress() {
  const addresses = getUserAddresses();
  return addresses.find((addr) => addr.isDefault) || addresses[0] || null;
}

/**
 * Get user wishlist
 * @returns {Array} Array of wishlist items
 */
export function getUserWishlist() {
  const user = getUser();
  return user?.wishlist || [];
}

/**
 * Get user cart
 * @returns {Array} Array of cart items
 */
export function getUserCart() {
  const user = getUser();
  return user?.cart || [];
}

/**
 * Get user orders count
 * @returns {number} Number of orders
 */
export function getOrdersCount() {
  const user = getUser();
  return user?.orders?.length || 0;
}

// ========================================
// Admin-Specific Functions
// ========================================

/**
 * Redirect to admin dashboard if user is admin
 */
export function redirectIfAdmin() {
  if (typeof window === "undefined") return;
  
  if (isAdmin()) {
    window.location.href = "/admin/dashboard";
  }
}

/**
 * Redirect to signin if not authenticated
 */
export function redirectIfNotAuthenticated() {
  if (typeof window === "undefined") return;
  
  if (!isAuthenticated()) {
    window.location.href = "/signin";
  }
}

/**
 * Redirect to signin if not admin
 */
export function redirectIfNotAdmin() {
  if (typeof window === "undefined") return;
  
  if (!isAdmin()) {
    window.location.href = "/signin";
  }
}

/**
 * Check permissions for specific actions
 * @param {string} action - Action to check (e.g., 'manage_users', 'manage_products')
 * @returns {boolean} True if user has permission
 */
export function hasPermission(action) {
  const user = getUser();
  if (!user) return false;
  
  // Admins have all permissions
  if (user.role === "admin") return true;
  
  // Vendors have limited permissions
  if (user.role === "vendor") {
    const vendorPermissions = [
      "manage_products",
      "view_orders",
      "manage_inventory",
    ];
    return vendorPermissions.includes(action);
  }
  
  return false;
}

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  const preferences = getUserPreferences();
  const currency = preferences.currency || "USD";
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

/**
 * Check if user session is valid
 * @returns {boolean} True if session is valid
 */
export function isSessionValid() {
  const user = getUser();
  if (!user) return false;
  
  // Check if user is active
  if (!isUserActive()) return false;
  
  // Check if last login was within 30 days (optional)
  const lastLogin = getLastLogin();
  if (lastLogin) {
    const daysSinceLogin = (Date.now() - new Date(lastLogin).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLogin > 30) {
      return false;
    }
  }
  
  return true;
}

/**
 * Refresh user session
 * Updates last login time
 */
export function refreshSession() {
  updateUser({
    lastLogin: new Date().toISOString(),
  });
}

/**
 * Get auth header for API requests
 * @returns {Object} Authorization header object
 */
export function getAuthHeader() {
  const token = getToken();
  if (!token) return {};
  
  return {
    Authorization: `Bearer ${token}`,
  };
}

// ========================================
// Event Listeners
// ========================================

/**
 * Add auth change listener
 * @param {Function} callback - Function to call on auth change
 * @returns {Function} Cleanup function
 */
export function addAuthChangeListener(callback) {
  if (typeof window === "undefined") return () => {};
  
  const handler = (event) => {
    if (event.detail) {
      callback(event.detail);
    }
  };
  
  window.addEventListener("authChange", handler);
  
  // Return cleanup function
  return () => {
    window.removeEventListener("authChange", handler);
  };
}

/**
 * Add storage change listener
 * @param {Function} callback - Function to call on storage change
 * @returns {Function} Cleanup function
 */
export function addStorageListener(callback) {
  if (typeof window === "undefined") return () => {};
  
  window.addEventListener("storage", callback);
  
  // Return cleanup function
  return () => {
    window.removeEventListener("storage", callback);
  };
}

// ========================================
// Validation Functions
// ========================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function isValidEmail(email) {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format
 * @param {string} phone - Phone to validate
 * @returns {boolean} True if valid
 */
export function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
}

// Export all functions as default object as well
export default {
  // Auth functions
  getUser,
  getToken,
  getAdminToken,
  isAuthenticated,
  isAdmin,
  isVendor,
  hasAdminAccess,
  logout,
  setUser,
  updateUser,
  
  // User info functions
  getUserEmail,
  getUserFirstName,
  getUserLastName,
  getUserFullName,
  getUserRole,
  getUserAvatar,
  getUserId,
  getUserInitials,
  getUserPhone,
  getLoyaltyPoints,
  getTotalSpent,
  isUserVerified,
  isUserActive,
  getLastLogin,
  getCreatedAt,
  getUserPreferences,
  getUserAddresses,
  getDefaultAddress,
  getUserWishlist,
  getUserCart,
  getOrdersCount,
  
  // Admin functions
  redirectIfAdmin,
  redirectIfNotAuthenticated,
  redirectIfNotAdmin,
  hasPermission,
  formatCurrency,
  isSessionValid,
  refreshSession,
  getAuthHeader,
  
  // Event listeners
  addAuthChangeListener,
  addStorageListener,
  
  // Validation
  isValidEmail,
  isValidPhone,
};