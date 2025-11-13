import axios from "axios";

// Product-specific Axios Instance
const productAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  timeout: 30000, // 30 seconds for file uploads
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
productAxios.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add user ID header if exists
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData._id) {
          config.headers["x-user-id"] = userData._id;
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
productAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      window.dispatchEvent(
        new CustomEvent("authChange", {
          detail: { type: "logout" },
        })
      );

      if (!window.location.pathname.includes("/signin")) {
        window.location.href = "/signin";
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Permission denied");
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error("Server error occurred");
    }

    return Promise.reject(error);
  }
);

class ProductService {
  /**
   * Add a new product
   */
  async addProduct(productData) {
    try {
      const transformedData = this.transformProductData(productData);
      const response = await productAxios.post(
        "/api/products/add",
        transformedData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update existing product
   */
  async updateProduct(productId, productData) {
    try {
      const transformedData = this.transformProductData(productData);
      const response = await productAxios.put(
        `/api/products/${productId}`,
        transformedData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all products with filters
   */
  async getProducts(params = {}) {
    try {
      const response = await productAxios.get("/api/products", { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get single product by slug
   */
  async getProductBySlug(slug) {
    try {
      const response = await productAxios.get(`/api/products/${slug}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(productId) {
    try {
      const response = await productAxios.delete(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search anime for autocomplete
   */
  async searchAnime(query) {
    try {
      const response = await productAxios.get("/api/anime/search", {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all categories
   */
  async getCategories() {
    try {
      const response = await productAxios.get("/api/category/get");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Transform form data to API format
   */
  transformProductData(formData) {
    return {
      // Basic info
      name: formData.name?.trim(),
      description: formData.description?.trim(),
      shortDescription:
        formData.shortDescription?.trim() ||
        formData.description?.substring(0, 200),

      // Anime info
      anime: {
        name: formData.anime?.name?.trim() || "",
        character: formData.anime?.character?.trim() || "",
        series: formData.anime?.series?.trim() || "",
        season: formData.anime?.season?.trim() || "",
        episode: formData.anime?.episode?.trim() || "",
      },

      // Category
      category: formData.category,
      subCategory: formData.subcategory || "",
      tags: Array.isArray(formData.tags) ? formData.tags : [],

      // Pricing
      price: parseFloat(formData.price) || 0,
      originalPrice: formData.compareAtPrice
        ? parseFloat(formData.compareAtPrice)
        : null,
      currency: "USD",

      // Inventory
      stock: parseInt(formData.quantity) || 0,
      sku: formData.sku?.trim(),

      // Images
      images: Array.isArray(formData.images)
        ? formData.images
            .filter((img) =>
              typeof img === "string" ? img.trim() !== "" : img.url
            )
            .map((img) =>
              typeof img === "string" ? { url: img, alt: formData.name } : img
            )
        : [],

      // Brand
      brand: formData.brand?.trim(),
      manufacturer: formData.manufacturer?.trim() || formData.brand?.trim(),
      isOfficial: Boolean(formData.isOfficial),
      licensedBy: formData.licensedBy?.trim() || "",

      // Availability
      isAvailable: formData.status === "active",
      isFeatured: Boolean(formData.featured),
      isNewArrival: Boolean(formData.isNewArrival),
      isBestseller: Boolean(formData.isBestseller),

      // Shipping
      shipping: {
        weight: parseFloat(formData.weight) || 0.5,
        dimensions: {
          length: parseFloat(formData.length) || 0,
          width: parseFloat(formData.width) || 0,
          height: parseFloat(formData.height) || 0,
        },
        freeShipping: Boolean(formData.freeShipping),
        estimatedDelivery: formData.estimatedDelivery || "5-7 business days",
      },

      // Status
      status: formData.status === "active" ? "published" : "draft",

      // Age rating
      ageRating: formData.ageRating || "All Ages",
    };
  }

  /**
   * Handle API errors
   */
  handleError(error) {
    if (error.response) {
      return {
        error: error.response.data?.error || "Server error occurred",
        status: error.response.status,
        details: error.response.data,
      };
    } else if (error.request) {
      return {
        error: "No response from server. Please check your connection.",
        status: 0,
      };
    } else {
      return {
        error: error.message || "An unexpected error occurred",
        status: 0,
      };
    }
  }
}

export default new ProductService();
