import axios from "@/lib/axios";

/**
 * Cart API Helper Functions using Axios
 */

// Add item to cart
export async function addToCart(userId, product) {

  try {
    const { data } = await axios.post("/api/user/cart", {
      userId,
      productId: product.productId,
      name: product.name,
      price: product.price,
      quantity: product.quantity || 1,
      image: product.image,
    });

    return data;
  } catch (error) {
    console.error("Add to cart error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to add item to cart",
    };
  }
}

// Get cart
export async function getCart(userId) {
  try {
    const { data } = await axios.get(`/api/user/cart?userId=${userId}`);
    return data;
  } catch (error) {
    console.error("Get cart error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to get cart",
    };
  }
}

// Update cart item quantity
export async function updateCartItem(userId, itemId, quantity) {
  try {
    const { data } = await axios.put(`/api/user/cart/${itemId}`, {
      userId,
      quantity,
    });
    return data;
  } catch (error) {
    console.error("Update cart error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update cart item",
    };
  }
}

// Remove
// Remove item from cart
export async function removeCartItem(userId, itemId) {
  try {
    const { data } = await axios.delete(
      `/api/user/cart/${itemId}?userId=${userId}`
    );
    return data;
  } catch (error) {
    console.error("Remove from cart error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to remove item from cart",
    };
  }
}

// Clear cart
export async function clearCart(userId) {
  try {
    const { data } = await axios.delete(`/api/user/cart?userId=${userId}`);
    return data;
  } catch (error) {
    console.error("Clear cart error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to clear cart",
    };
  }
}
