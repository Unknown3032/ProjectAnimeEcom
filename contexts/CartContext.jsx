"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

const CartContext = createContext({});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Sync cart with server (for logged in users)
  const syncCartWithServer = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      // Get server cart
      const response = await axiosInstance.get("/api/user/cart");
      const serverCart = response.data.data || [];

      // Merge local cart with server cart
      const mergedCart = mergeCartItems(cart, serverCart);

      // Update server with merged cart
      for (const item of cart) {
        if (!serverCart.find((i) => i.product._id === item.product._id)) {
          await axiosInstance.post("/api/user/cart", {
            productId: item.product._id,
            quantity: item.quantity,
            price: item.price,
          });
        }
      }

      setCart(mergedCart);
    } catch (error) {
      console.error("Error syncing cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const mergeCartItems = (localCart, serverCart) => {
    const merged = [...serverCart];

    localCart.forEach((localItem) => {
      const existingIndex = merged.findIndex(
        (item) => item.product._id === localItem.product._id
      );

      if (existingIndex >= 0) {
        // Update quantity if item exists
        merged[existingIndex].quantity += localItem.quantity;
      } else {
        // Add new item
        merged.push(localItem);
      }
    });

    return merged;
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      const token = localStorage.getItem("token");

      // Add to local cart
      const existingIndex = cart.findIndex(
        (item) => item.product._id === product._id
      );

      let updatedCart;
      if (existingIndex >= 0) {
        updatedCart = [...cart];
        updatedCart[existingIndex].quantity += quantity;
      } else {
        updatedCart = [
          ...cart,
          {
            product,
            quantity,
            price: product.price,
            addedAt: new Date().toISOString(),
          },
        ];
      }

      setCart(updatedCart);

      // Sync with server if logged in
      if (token) {
        await axiosInstance.post("/api/user/cart", {
          productId: product._id,
          quantity,
          price: product.price,
        });
      }

      toast.success("Added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      // Remove from local cart
      const updatedCart = cart.filter((item) => item.product._id !== productId);
      setCart(updatedCart);

      // Sync with server if logged in
      if (token) {
        await axiosInstance.delete(`/api/user/cart?productId=${productId}`);
      }

      toast.success("Removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove from cart");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("token");

      if (quantity <= 0) {
        return removeFromCart(productId);
      }

      // Update local cart
      const updatedCart = cart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      );
      setCart(updatedCart);

      // Sync with server if logged in
      if (token) {
        await axiosInstance.patch("/api/user/cart", {
          productId,
          quantity,
        });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");

      setCart([]);
      localStorage.removeItem("cart");

      // Clear server cart if logged in
      if (token) {
        await axiosInstance.delete("/api/user/cart/clear");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCartWithServer,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
