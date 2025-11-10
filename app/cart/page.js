'use client';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Minimalist Watch',
      price: 299,
      quantity: 1,
      image: '/api/placeholder/80/80'
    },
    {
      id: 2,
      name: 'Wireless Headphones',
      price: 199,
      quantity: 2,
      image: '/api/placeholder/80/80'
    },
    {
      id: 3,
      name: 'Leather Wallet',
      price: 89,
      quantity: 1,
      image: '/api/placeholder/80/80'
    }
  ]);

  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const summaryRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial page load animation
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      // Stagger animation for cart items
      gsap.fromTo(itemsRef.current,
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.6, 
          stagger: 0.1,
          delay: 0.3,
          ease: "power2.out" 
        }
      );

      // Summary animation
      gsap.fromTo(summaryRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.5, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    const itemElement = itemsRef.current.find(el => 
      el && el.dataset.itemId === id.toString()
    );
    
    if (itemElement) {
      gsap.to(itemElement, {
        opacity: 0,
        x: -100,
        height: 0,
        marginBottom: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          setCartItems(prev => prev.filter(item => item.id !== id));
        }
      });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 15;
  const total = subtotal + shipping;

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-wide mb-2">Shopping Cart</h1>
          <div className="w-16 h-px bg-black"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  ref={el => itemsRef.current[index] = el}
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div ref={summaryRef} className="lg:col-span-1">
            <OrderSummary 
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CartItem = ({ item, onUpdateQuantity, onRemove, ...props }) => {
  const itemRef = useRef(null);
  const quantityRef = useRef(null);

  const handleQuantityChange = (newQuantity) => {
    gsap.to(quantityRef.current, {
      scale: 1.1,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
    onUpdateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <div 
      ref={itemRef}
      data-item-id={item.id}
      className="group border-b border-gray-100 pb-6 last:border-b-0 cursor-pointer"
      {...props}
    >
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-lg mb-1 truncate">{item.name}</h3>
          <p className="text-gray-600 text-sm">${item.price}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-3 ">
          <QuantityButton
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            −
          </QuantityButton>
          
          <span 
            ref={quantityRef}
            className="w-8 text-center font-medium"
          >
            {item.quantity}
          </span>
          
          <QuantityButton
            onClick={() => handleQuantityChange(item.quantity + 1)}
          >
            +
          </QuantityButton>
        </div>

        {/* Price */}
        <div className="text-right min-w-0">
          <p className="font-medium text-lg">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-gray-100 rounded-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const QuantityButton = ({ children, onClick, disabled = false }) => {
  const buttonRef = useRef(null);

  const handleClick = () => {
    if (disabled) return;
    
    gsap.to(buttonRef.current, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
    
    onClick();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      className={`w-8 h-8 cursor-pointer rounded-full border border-gray-300 flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-black hover:text-white hover:border-black'
      }`}
    >
      {children}
    </button>
  );
};

const OrderSummary = ({ subtotal, shipping, total }) => {
  const checkoutRef = useRef(null);

  const handleCheckout = () => {
    gsap.to(checkoutRef.current, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
  };

  return (
    <div className="bg-gray-50 p-8 rounded-lg">
      <h2 className="text-xl font-medium mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-lg font-medium">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        ref={checkoutRef}
        onClick={handleCheckout}
        className="w-full bg-black cursor-pointer text-white py-4 rounded-lg font-medium transition-all duration-200 hover:bg-gray-800 active:scale-98"
      >
        Proceed to Checkout
      </button>

      <div className="mt-4 text-center">
        <button className="text-sm cursor-pointer text-gray-600 hover:text-black transition-colors duration-200 underline">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default CartPage;