'use client';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const itemsRef = useRef([]);
  const summaryRef = useRef(null);
  const [deletingItems, setDeletingItems] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);

  // Format price in INR
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Page entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.8,
          ease: 'power3.out'
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Cart items animation
  useEffect(() => {
    if (cart.length > 0 && !loading && !hasAnimated) {
      const validItems = itemsRef.current.filter(item => item !== null);
      
      if (validItems.length > 0) {
        gsap.fromTo(
          validItems,
          { 
            opacity: 0, 
            y: 30,
            scale: 0.95
          },
          { 
            opacity: 1, 
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            clearProps: 'all'
          }
        );

        // Animate summary
        if (summaryRef.current) {
          gsap.fromTo(
            summaryRef.current,
            { 
              opacity: 0, 
              x: 30 
            },
            { 
              opacity: 1, 
              x: 0,
              duration: 0.8,
              delay: 0.3,
              ease: 'power3.out'
            }
          );
        }

        setHasAnimated(true);
      }
    }
  }, [cart.length, loading, hasAnimated]);

  // Reset animation flag when cart becomes empty
  useEffect(() => {
    if (cart.length === 0) {
      setHasAnimated(false);
    }
  }, [cart.length]);

  // Handle remove with smooth fade and scale animation
  const handleRemove = async (productId, index) => {
    const itemElement = itemsRef.current[index];
    if (!itemElement) {
      await removeFromCart(productId);
      return;
    }

    setDeletingItems(prev => new Set(prev).add(productId));

    // Create timeline for smooth animation
    const tl = gsap.timeline({
      onComplete: async () => {
        await removeFromCart(productId);
        setDeletingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
    });

    // Fade out and scale down
    tl.to(itemElement, {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: 'power2.in'
    })
    // Collapse height smoothly
    .to(itemElement, {
      height: 0,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    }, '-=0.1');
  };

  // Reset refs when cart changes
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, cart.length);
  }, [cart.length]);

  // Show message for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="text-center max-w-md">
          <div className="mb-6 inline-block">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-3 text-neutral-900 tracking-tight">
            Sign in to continue
          </h2>
          <p className="text-neutral-500 mb-8 text-base sm:text-lg font-light">
            Access your shopping cart
          </p>
          <Link 
            href="/signin" 
            className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-neutral-900 text-white text-xs sm:text-sm font-light tracking-wider uppercase hover:bg-neutral-800 transition-all duration-300"
          >
            Sign In
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading && cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center px-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-light tracking-wide text-sm sm:text-base">Loading cart...</p>
        </div>
      </div>
    );
  }

  // Show empty cart
  if (cart.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="text-center max-w-md">
          <div className="mb-6 inline-block">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-3 text-neutral-900 tracking-tight">
            Your cart is empty
          </h2>
          <p className="text-neutral-500 mb-8 text-base sm:text-lg font-light">
            Start adding items to your collection
          </p>
          <Link 
            href="/productspage/all" 
            className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-neutral-900 text-white text-xs sm:text-sm font-light tracking-wider uppercase hover:bg-neutral-800 transition-all duration-300"
          >
            Explore Products
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    router.push('/checkoutpage');
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div ref={headerRef} className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8 md:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-neutral-900 tracking-tight mb-1 sm:mb-2">
                Cart
              </h1>
              <p className="text-neutral-500 font-light tracking-wide text-sm sm:text-base">
                {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'}
              </p>
            </div>
            <Link 
              href="/productspage/all"
              className="hidden sm:flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors font-light tracking-wide text-sm"
            >
              Continue Shopping
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {cart.map((item, index) => (
              <div
                key={`${item._id}-${index}`}
                ref={el => itemsRef.current[index] = el}
                className="bg-white p-4 sm:p-6 md:p-8 group hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Product Image */}
                  {item.product.image && (
                    <div className="w-full sm:w-24 h-48 sm:h-24 md:w-32 md:h-32 bg-neutral-100 flex-shrink-0 overflow-hidden">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-light text-neutral-900 mb-1 sm:mb-2 tracking-tight">
                        {item.product.name}
                      </h3>
                      {/* Updated Price to INR */}
                      <p className="text-neutral-500 font-light tracking-wide text-sm sm:text-base">
                        {formatINR(item.price)}
                      </p>
                    </div>

                    {/* Quantity and Remove - Mobile Layout */}
                    <div className="mt-4 space-y-4 sm:hidden">
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-600 font-light">Quantity</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            disabled={loading || deletingItems.has(item.product._id)}
                            className="w-8 h-8 border border-neutral-300 flex items-center justify-center hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-8 text-center font-light">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            disabled={loading || deletingItems.has(item.product._id)}
                            className="w-8 h-8 border border-neutral-300 flex items-center justify-center hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Price and Remove - Mobile */}
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                        {/* Updated Item Total to INR */}
                        <p className="text-xl font-light text-neutral-900">
                          {formatINR(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => handleRemove(item.product._id, index)}
                          disabled={loading || deletingItems.has(item.product._id)}
                          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="font-light tracking-wide">Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* Quantity and Remove - Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          disabled={loading || deletingItems.has(item.product._id)}
                          className="w-8 h-8 md:w-9 md:h-9 border border-neutral-300 flex items-center justify-center hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-10 text-center font-light text-base md:text-lg">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          disabled={loading || deletingItems.has(item.product._id)}
                          className="w-8 h-8 md:w-9 md:h-9 border border-neutral-300 flex items-center justify-center hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      {/* Item Total and Remove - Desktop */}
                      <div className="flex items-center gap-4 md:gap-6">
                        {/* Updated Item Total to INR */}
                        <p className="text-lg md:text-xl lg:text-2xl font-light text-neutral-900">
                          {formatINR(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => handleRemove(item.product._id, index)}
                          disabled={loading || deletingItems.has(item.product._id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping - Mobile */}
            <Link 
              href="/productspage/all"
              className="sm:hidden flex items-center justify-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors font-light tracking-wide text-sm py-4"
            >
              Continue Shopping
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div 
              ref={summaryRef}
              className="bg-white p-6 sm:p-8 lg:sticky lg:top-6"
            >
              <h2 className="text-xl sm:text-2xl font-light text-neutral-900 mb-6 sm:mb-8 tracking-tight">
                Order Summary
              </h2>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-neutral-200">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 font-light tracking-wide text-sm sm:text-base">
                    Subtotal
                  </span>
                  {/* Updated Subtotal to INR */}
                  <span className="text-neutral-900 font-light text-base sm:text-lg">
                    {formatINR(getCartTotal())}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 font-light tracking-wide text-sm sm:text-base">
                    Shipping
                  </span>
                  <span className="text-neutral-500 font-light text-xs sm:text-sm">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <span className="text-lg sm:text-xl font-light text-neutral-900 tracking-tight">
                  Total
                </span>
                {/* Updated Total to INR */}
                <span className="text-2xl sm:text-3xl font-light text-neutral-900">
                  {formatINR(getCartTotal())}
                </span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-3 sm:py-4 bg-neutral-900 text-white text-xs sm:text-sm font-light tracking-widest uppercase hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group mb-3 sm:mb-4"
              >
                <span className="inline-flex items-center gap-2 justify-center">
                  Proceed to Checkout
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>

              <Link 
                href="/productspage/all"
                className="hidden sm:block text-center text-sm text-neutral-600 hover:text-neutral-900 transition-colors font-light tracking-wide"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-neutral-200 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-3 text-neutral-600">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-light tracking-wide">Secure Checkout</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-600">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                  </svg>
                  <span className="text-xs sm:text-sm font-light tracking-wide">Free Returns</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-600">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <span className="text-xs sm:text-sm font-light tracking-wide">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}