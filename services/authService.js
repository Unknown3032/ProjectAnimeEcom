import { getToken } from "@/lib/adminAuth.js";
import axiosInstance from "@/lib/axios";

class AuthService {
  // Signup
  async signup(userData) {
    try {
      const response = await axiosInstance.post("/api/auth/signup", userData);

      // Save user data (token is in HTTP-only cookie)
      if (response.data.data) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
        window.dispatchEvent(
          new CustomEvent("authChange", {
            detail: { type: "login", user: response.data.data },
          })
        );
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Signup failed" };
    }
  }

  // Login
  async login(credentials) {
    try {
      const response = await axiosInstance.post(
        "/api/auth/signin",
        credentials
      );

      // Save user data only (token is stored in HTTP-only cookie)
      if (response.data.data) {
        localStorage.setItem("user", JSON.stringify(response.data.data));

        // Trigger auth change event
        window.dispatchEvent(
          new CustomEvent("authChange", {
            detail: { type: "login", user: response.data.data },
          })
        );
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Login failed" };
    }
  }

  // Logout
  async logout() {
    try {
      // Call logout endpoint to clear cookie
      await axiosInstance.post("/api/auth/signout");

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("cart");

      // Trigger auth change event
      window.dispatchEvent(
        new CustomEvent("authChange", {
          detail: { type: "logout" },
        })
      );

      // Redirect to signin
      window.location.href = "/signin";
    } catch (error) {
      // Even if API call fails, clear local data
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      window.location.href = "/signin";
    }
  }

  // Get current user (from localStorage or API)
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  // Fetch fresh user data from API
  async fetchCurrentUser() {
    try {
      const response = await axiosInstance.get("/api/auth/me");

      if (response.data.data) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
        window.dispatchEvent(
          new CustomEvent("authChange", {
            detail: { type: "refresh", user: response.data.data },
          })
        );
      }

      return response.data;
    } catch (error) {
      // If token is invalid, clear user data
      localStorage.removeItem("user");
      throw error.response?.data || { error: "Failed to fetch user" };
    }
  }

  // Check if authenticated
  isAuthenticated() {
    let token;
    let user = localStorage.getItem("user");
    token = JSON.parse(user)?._id;
    if (!token) {
      return false;
    }
    return true;
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await axiosInstance.get("/api/user/profile");

      // Update localStorage
      if (response.data.data) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
        window.dispatchEvent(
          new CustomEvent("authChange", {
            detail: { type: "refresh", user: response.data.data },
          })
        );
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch profile" };
    }
  }

  // Update profile
  async updateProfile(userData) {
    try {
      const response = await axiosInstance.put("/api/user/profile", userData);

      // Update localStorage
      if (response.data.data) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
        window.dispatchEvent(
          new CustomEvent("authChange", {
            detail: { type: "refresh", user: response.data.data },
          })
        );
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to update profile" };
    }
  }

  // Verify authentication status
  async verifyAuth() {
    try {
      await this.fetchCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();
