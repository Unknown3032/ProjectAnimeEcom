import axios from "axios";

// Product-specific Axios Instance
const productAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
productAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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
      
      console.log('Sending product data:', transformedData); // Debug log
      
      const response = await productAxios.post(
        "/api/products/add",
        transformedData
      );
      
      return response.data;
    } catch (error) {
      console.error('Add product service error:', error);
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
    // Ensure anime object has required fields
    const animeData = formData.anime || {};
    
    return {
      name: formData.name?.trim(),
      description: formData.description?.trim(),
      shortDescription:
        formData.shortDescription?.trim() ||
        formData.description?.substring(0, 200),

      anime: {
        name: animeData.name?.trim() || formData.animeName?.trim() || "",
        character: animeData.character?.trim() || "",
        series: animeData.series?.trim() || "",
        season: animeData.season?.trim() || "",
        episode: animeData.episode?.trim() || "",
      },

      category: formData.category,
      subCategory: formData.subcategory || formData.subCategory || "",
      tags: Array.isArray(formData.tags) ? formData.tags : [],

      price: parseFloat(formData.price) || 0,
      originalPrice: formData.compareAtPrice
        ? parseFloat(formData.compareAtPrice)
        : formData.originalPrice 
        ? parseFloat(formData.originalPrice)
        : null,
      currency: "USD",

      stock: parseInt(formData.quantity || formData.stock) || 0,
      sku: formData.sku?.trim(),

      images: Array.isArray(formData.images)
        ? formData.images
            .filter((img) =>
              typeof img === "string" ? img.trim() !== "" : img?.url
            )
            .map((img) =>
              typeof img === "string" 
                ? { url: img, alt: formData.name } 
                : { url: img.url, alt: img.alt || formData.name, isPrimary: img.isPrimary || false }
            )
        : [],

      brand: formData.brand?.trim(),
      manufacturer: formData.manufacturer?.trim() || formData.brand?.trim(),
      isOfficial: Boolean(formData.isOfficial),
      licensedBy: formData.licensedBy?.trim() || "",

      isAvailable: formData.status === "active" || formData.isAvailable !== false,
      isFeatured: Boolean(formData.featured || formData.isFeatured),
      isNewArrival: Boolean(formData.isNewArrival),
      isBestseller: Boolean(formData.isBestseller),

      shipping: {
        weight: parseFloat(formData.weight || formData.shipping?.weight) || 0.5,
        dimensions: {
          length: parseFloat(formData.length || formData.shipping?.dimensions?.length) || 0,
          width: parseFloat(formData.width || formData.shipping?.dimensions?.width) || 0,
          height: parseFloat(formData.height || formData.shipping?.dimensions?.height) || 0,
        },
        freeShipping: Boolean(formData.freeShipping || formData.shipping?.freeShipping),
        estimatedDelivery: formData.estimatedDelivery || formData.shipping?.estimatedDelivery || "5-7 business days",
      },

      status: formData.status === "active" ? "published" : (formData.status || "draft"),

      ageRating: formData.ageRating || "All Ages",
    };
  }

  /**
   * Handle API errors
   */
  handleError(error) {
    console.error('Service error:', error);
    
    if (error.response) {
      // Server responded with error
      const errorData = error.response.data;
      
      return {
        error: errorData?.error || errorData?.message || "Server error occurred",
        status: error.response.status,
        details: errorData?.details || errorData,
        validationErrors: errorData?.details?.validationErrors || null
      };
    } else if (error.request) {
      // Request made but no response
      return {
        error: "No response from server. Please check your connection.",
        status: 0,
      };
    } else {
      // Error setting up request
      return {
        error: error.message || "An unexpected error occurred",
        status: 0,
      };
    }
  }
}

export default new ProductService();