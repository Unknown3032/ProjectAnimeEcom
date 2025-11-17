'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { addToCart, getCart, updateCartItem, removeCartItem, clearCart } from '@/lib/api/cartApi';
import authService from '@/services/authService';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Get current user
  const getCurrentUser = () => {
    return authService.getCurrentUser();
  };

  // Fetch cart from backend
  const fetchCart = useCallback(async (showLoading = true) => {
    const user = getCurrentUser();
    if (!user?._id) {
      setCart([]);
      setInitialized(true);
      return;
    }
    
    if (showLoading) setLoading(true);
    
    try {
      console.log('🔄 Fetching cart for user:', user._id);
      const response = await getCart(user._id);
      
      if (response.success && response.data) {
        // Transform backend data to match frontend structure
        const transformedCart = response.data.items.map(item => ({
          product: {
            _id: item.productId,
            name: item.name,
            image: item.image
          },
          price: item.price,
          quantity: item.quantity,
          _id: item._id
        }));
        
        console.log('✅ Cart fetched:', transformedCart.length, 'items');
        setCart(transformedCart);
      } else {
        console.log('⚠️ No cart data');
        setCart([]);
      }
    } catch (error) {
      console.error('❌ Error fetching cart:', error);
      setCart([]);
    } finally {
      if (showLoading) setLoading(false);
      setInitialized(true);
    }
  }, []);

  // Sync cart with server
  const syncCartWithServer = useCallback(async () => {
    await fetchCart(false); // Don't show loading for background sync
  }, [fetchCart]);

  // Initial load
  useEffect(() => {
    const user = getCurrentUser();
    console.log('🚀 CartContext initialized, user:', user?._id);
    if (user?._id) {
      fetchCart();
    } else {
      setInitialized(true);
    }
  }, [fetchCart]);

  // Listen for auth events
  useEffect(() => {
    const handleUserSignedIn = () => {
      console.log('👤 User signed in, syncing cart...');
      fetchCart();
    };

    const handleUserSignedOut = () => {
      console.log('👋 User signed out, clearing cart...');
      setCart([]);
    };

    // Custom event for cart updates from other components
    const handleCartUpdate = () => {
      console.log('🔔 Cart update event received');
      fetchCart(false);
    };

    window.addEventListener('userSignedIn', handleUserSignedIn);
    window.addEventListener('userSignedOut', handleUserSignedOut);
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('userSignedIn', handleUserSignedIn);
      window.removeEventListener('userSignedOut', handleUserSignedOut);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [fetchCart]);

  // Add to cart
  const addToCartHandler = async (product, quantity = 1) => {
    const user = getCurrentUser();
    
    if (!user?._id) {
      alert('Please sign in to add items to cart');
      return { success: false };
    }

    setLoading(true);
    try {
      console.log('➕ Adding to cart:', product.name);
      const response = await addToCart(user._id, {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image
      });

      if (response.success) {
        console.log('✅ Item added to cart');
        // Immediately fetch updated cart
        await fetchCart(false);
        // Dispatch event for other components
        window.dispatchEvent(new Event('cartUpdated'));
        return { success: true };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      alert(error.message || 'Failed to add item to cart');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (productId, newQuantity) => {
    const user = getCurrentUser();
    if (!user?._id) return;

    if (newQuantity < 1) {
      await removeFromCart(productId);
      return;
    }

    // Find the cart item _id
    const cartItem = cart.find(item => item.product._id === productId);
    if (!cartItem) return;

    // Optimistic update
    setCart(prevCart =>
      prevCart.map(item =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    try {
      console.log('🔢 Updating quantity for:', productId);
      const response = await updateCartItem(user._id, cartItem._id, newQuantity);

      if (!response.success) {
        throw new Error(response.message);
      }
      
      console.log('✅ Quantity updated');
      // Fetch latest to ensure sync
      await fetchCart(false);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('❌ Error updating quantity:', error);
      alert('Failed to update quantity');
      await fetchCart(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    const user = getCurrentUser();
    if (!user?._id) return;

    // Find the cart item _id
    const cartItem = cart.find(item => item.product._id === productId);
    if (!cartItem) return;

    // Optimistic update
    const previousCart = [...cart];
    setCart(prevCart => prevCart.filter(item => item.product._id !== productId));

    try {
      console.log('🗑️ Removing from cart:', productId);
      const response = await removeCartItem(user._id, cartItem._id);

      if (!response.success) {
        setCart(previousCart);
        throw new Error(response.message);
      }
      
      console.log('✅ Item removed');
      // Fetch latest to ensure sync
      await fetchCart(false);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('❌ Error removing from cart:', error);
      alert('Failed to remove item');
      setCart(previousCart);
    }
  };

  // Clear entire cart
  const clearCartHandler = async () => {
    const user = getCurrentUser();
    
    // Clear cart locally immediately
    setCart([]);
    
    // If user is logged in, clear on server too
    if (user?._id) {
      setLoading(true);
      try {
        const response = await clearCart(user._id);

        if (!response.success) {
          throw new Error(response.message);
        }
        window.dispatchEvent(new Event('cartUpdated'));
      } catch (error) {
        console.error('Error clearing cart:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get cart count
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    initialized,
    addToCart: addToCartHandler,
    removeFromCart,
    updateQuantity,
    clearCart: clearCartHandler,
    getCartTotal,
    getCartCount,
    refreshCart: fetchCart,
    syncCartWithServer,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}