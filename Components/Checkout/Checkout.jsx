// app/checkout/page.js
'use client';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Link from 'next/link';

export default function Checkout() {
  const { cart, getCartTotal, getCartCount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [errors, setErrors] = useState({});

  const containerRef = useRef(null);
  const stepsRef = useRef([]);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin?redirect=/checkout');
    }
  }, [isAuthenticated, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && isAuthenticated) {
      router.push('/cart');
    }
  }, [cart.length, isAuthenticated, router]);

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?._id) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/user/profile/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${user._id}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setUserDetails(data.data);
            
            // Pre-fill form with user data
            setShippingInfo({
              firstName: data.data.firstName || '',
              lastName: data.data.lastName || '',
              email: data.data.email || '',
              phone: data.data.phone || '',
              address: data.data.address?.street || '',
              city: data.data.address?.city || '',
              state: data.data.address?.state || '',
              zipCode: data.data.address?.zipCode || '',
              country: data.data.address?.country || 'United States',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]);

  // Animate steps
  useEffect(() => {
    if (stepsRef.current[currentStep - 1]) {
      gsap.fromTo(
        stepsRef.current[currentStep - 1],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [currentStep]);

  // Validate shipping info
  const validateShipping = () => {
    const newErrors = {};

    if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) newErrors.email = 'Email is invalid';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate payment info
  const validatePayment = () => {
    const newErrors = {};

    if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    else if (paymentInfo.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = 'Card number must be 16 digits';
    if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Name on card is required';
    if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV is required';
    else if (paymentInfo.cvv.length !== 3) newErrors.cvv = 'CVV must be 3 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (currentStep === 1 && !validateShipping()) {
      setErrorMessage('Please fill in all required shipping information');
      return;
    }
    if (currentStep === 2 && !validatePayment()) {
      setErrorMessage('Please fill in all required payment information');
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, 3));
    setErrors({});
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // console.log('🛒 Preparing order with cart:', cart);
      
      const orderData = {
        userId: user._id,
        items: cart.map(item => ({
          productId: item.product._id,
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        shippingInfo,
        paymentInfo: {
          cardNumber: paymentInfo.cardNumber.replace(/\s/g, ''),
          cardName: paymentInfo.cardName,
        },
        totalAmount: getCartTotal(),
        status: 'pending',
      };

      console.log('📤 Sending order data:', orderData);

      const response = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user._id}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      console.log('📥 Order response:', data);

      if (data.success) {
        setSuccessMessage('Order placed successfully! Redirecting...');
        await clearCart();
        
        // Redirect after a short delay to show success message
        setTimeout(() => {
          const orderId = data.data?._id || data.order?._id;
          router.push(`/order-confirmation/${orderId}`);
        }, 1500);
      } else {
        setErrorMessage(data.message || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error placing order:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format card number
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  if (!isAuthenticated || cart.length === 0) {
    return null;
  }

  const steps = [
    { number: 1, title: 'Shipping', subtitle: 'Enter your shipping details' },
    { number: 2, title: 'Payment', subtitle: 'Enter payment information' },
    { number: 3, title: 'Review', subtitle: 'Review your order' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-neutral-50">
      {/* Error/Success Messages */}
      {(errorMessage || successMessage) && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div
            className={`p-4 rounded shadow-lg ${
              errorMessage
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-green-50 border border-green-200 text-green-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {errorMessage ? (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p className="font-light text-sm">{errorMessage || successMessage}</p>
              <button
                onClick={() => {
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="ml-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-neutral-900 tracking-tight">
            Checkout
          </h1>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep >= step.number
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-200 text-neutral-500'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="font-light text-sm sm:text-base">{step.number}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center hidden sm:block">
                    <p className="text-xs font-light tracking-wide text-neutral-900">{step.title}</p>
                    <p className="text-xs font-light text-neutral-500 mt-0.5">{step.subtitle}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
                      currentStep > step.number ? 'bg-neutral-900' : 'bg-neutral-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div ref={el => (stepsRef.current[0] = el)} className="bg-white p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 mb-6 tracking-tight">
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-light text-neutral-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.firstName}
                      onChange={e => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                      className={`w-full px-4 py-3 border ${
                        errors.firstName ? 'border-red-500' : 'border-neutral-300'
                      } focus:outline-none focus:border-neutral-900 transition-colors font-light`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1 font-light">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-light text-neutral-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.lastName}
                      onChange={e => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                      className={`w-full px-4 py-3 border ${
                        errors.lastName ? 'border-red-500' : 'border-neutral-300'
                      } focus:outline-none focus:border-neutral-900 transition-colors font-light`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1 font-light">{errors.lastName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-light text-neutral-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={e => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      className={`w-full px-4 py-3 border ${
                        errors.email ? 'border-red-500' : 'border-neutral-300'
                      } focus:outline-none focus:border-neutral-900 transition-colors font-light`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 font-light">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-light text-neutral-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={e => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className={`w-full px-4 py-3 border ${
                        errors.phone ? 'border-red-500' : 'border-neutral-300'
                      } focus:outline-none focus:border-neutral-900 transition-colors font-light`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1 font-light">{errors.phone}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-light text-neutral-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className={`w-full px-4 py-3 border ${
                        errors.address ? 'border-red-500' : 'border-neutral-300'
                      } focus:outline-none focus:border-neutral-900 transition-colors font-light`}
                      placeholder="123 Main Street"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1 font-light">{errors.address}</p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-light text-neutral-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={e => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className={`w-full px-4 py-3 border ${
                        errors.city ? 'border-red-500' : 'border-neutral-300'
                      } focus:outline-none focus:border-neutral-900 transition-colors font-light`}
                      placeholder="New York"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1 font-light">{errors.city}</p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-light text-neutral-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.state}
                      onChange={e => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                      className={`w-full px-4 py-3 border ${
                        errors.state ? 'border-red-500' : 'border-neutral-300'
                      } focus:outline-none focus:border-neutral-900 transition-colors font-light`}
                      placeholder="NY"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1 font-light">{errors.state}</p>
                    )}
                  </div>

                  {/* ZIP Code */}
                  <div>
                    <label className="block text-sm font-light text-neutral-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.zipCode}
                      onChange={e => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                      className={`w-full px-4 py-3 border ${
                        errors.zipCode ? 'border-red-500' : 'border-neutral-300'
                      } focus:outline-none focus:border-neutral-900 transition-colors font-light`}
                      placeholder="10001"
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-xs mt-1 font-light">{errors.zipCode}</p>
                    )}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-light text-neutral-700 mb-2">
                      Country *
                    </label>
                    <select
                      value={shippingInfo.country}
                      onChange={e => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-neutral-900 transition-colors font-light bg-white"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <Link
                    href="/cart"
                    className="px-6 py-3 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors font-light tracking-wide text-sm"
                  >
                    Back to Cart
                  </Link>
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors font-light tracking-wide text-sm uppercase"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <div ref={el => (stepsRef.current[1] = el)} className="bg-white p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 mb-6 tracking-tight">
                  Payment Information
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-light text-neutral-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cardNumber}
                      onChange={e =>
                        setPaymentInfo({
                          ...paymentInfo,
                          cardNumber: formatCardNumber(e.target.value),
                        })
                      }
                      maxLength="19"
                      className={`w-full px-4 py-3 border ${
                        errors.cardNumber ? 'border-red-500' : 'border-neutral-300'
                      } focus:outline-none focus:border-neutral-900 transition-colors font-light`}
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-xs mt-1 font-light">{errors.cardNumber}</p>
                    )}
                  </div>

                  {/* Name on Card */}
                  <div>
                    <label className="block text-sm font-light text-neutral-700 mb-2">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cardName}
                      onChange={e => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                      className={`w-full px-4 py-3 border ${
                        errors.cardName ? 'border-red-500' : 'border-neutral-300'
                      } focus:outline-none focus:border-neutral-900 transition-colors font-light`}
                      placeholder="John Doe"
                    />
                    {errors.cardName && (
                      <p className="text-red-500 text-xs mt-1 font-light">{errors.cardName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {/* Expiry Date */}
                    <div>
                      <label className="block text-sm font-light text-neutral-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.expiryDate}
                        onChange={e =>
                          setPaymentInfo({
                            ...paymentInfo,
                            expiryDate: formatExpiryDate(e.target.value),
                          })
                        }
                        maxLength="5"
                        className={`w-full px-4 py-3 border ${
                          errors.expiryDate ? 'border-red-500' : 'border-neutral-300'
                        } focus:outline-none focus:border-neutral-900 transition-colors font-light`}
                        placeholder="MM/YY"
                      />
                      {errors.expiryDate && (
                        <p className="text-red-500 text-xs mt-1 font-light">{errors.expiryDate}</p>
                      )}
                    </div>

                    {/* CVV */}
                    <div>
                      <label className="block text-sm font-light text-neutral-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cvv}
                        onChange={e =>
                          setPaymentInfo({
                            ...paymentInfo,
                            cvv: e.target.value.replace(/\D/g, '').slice(0, 3),
                          })
                        }
                        maxLength="3"
                        className={`w-full px-4 py-3 border ${
                          errors.cvv ? 'border-red-500' : 'border-neutral-300'
                        } focus:outline-none focus:border-neutral-900 transition-colors font-light`}
                        placeholder="123"
                      />
                      {errors.cvv && (
                        <p className="text-red-500 text-xs mt-1 font-light">{errors.cvv}</p>
                      )}
                    </div>
                  </div>

                  {/* Billing Address Same as Shipping */}
                  <div className="flex items-center gap-3 pt-4">
                    <input
                      type="checkbox"
                      id="sameAsShipping"
                      checked={sameAsShipping}
                      onChange={e => setSameAsShipping(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="sameAsShipping" className="text-sm font-light text-neutral-700">
                      Billing address same as shipping
                    </label>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrevious}
                    className="px-6 py-3 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors font-light tracking-wide text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors font-light tracking-wide text-sm uppercase"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <div ref={el => (stepsRef.current[2] = el)} className="bg-white p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 mb-6 tracking-tight">
                  Review Your Order
                </h2>

                {/* Shipping Details */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-light text-neutral-900">Shipping Address</h3>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-sm text-neutral-600 hover:text-neutral-900 font-light underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-sm font-light text-neutral-600 space-y-1">
                    <p>
                      {shippingInfo.firstName} {shippingInfo.lastName}
                    </p>
                    <p>{shippingInfo.address}</p>
                    <p>
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                    </p>
                    <p>{shippingInfo.country}</p>
                    <p className="pt-2">{shippingInfo.email}</p>
                    <p>{shippingInfo.phone}</p>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="mb-8 pb-8 border-b border-neutral-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-light text-neutral-900">Payment Method</h3>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-sm text-neutral-600 hover:text-neutral-900 font-light underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-sm font-light text-neutral-600">
                    <p>Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                    <p>{paymentInfo.cardName}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-light text-neutral-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item._id} className="flex gap-4">
                        {item.product.image && (
                          <div className="w-20 h-20 bg-neutral-100 flex-shrink-0">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-light text-neutral-900">{item.product.name}</p>
                          <p className="text-sm text-neutral-600 font-light">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-light text-neutral-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrevious}
                    className="px-6 py-3 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors font-light tracking-wide text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="px-8 py-3 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors font-light tracking-wide text-sm uppercase disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sm:p-8 sticky top-6">
              <h3 className="text-xl font-light text-neutral-900 mb-6 tracking-tight">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-neutral-200">
                <div className="flex justify-between text-sm">
                  <span className="font-light text-neutral-600">Subtotal ({getCartCount()} items)</span>
                  <span className="font-light text-neutral-900">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-light text-neutral-600">Shipping</span>
                  <span className="font-light text-neutral-900">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-light text-neutral-600">Tax</span>
                  <span className="font-light text-neutral-900">
                    ${(getCartTotal() * 0.1).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-light text-neutral-900">Total</span>
                <span className="text-2xl font-light text-neutral-900">
                  ${(getCartTotal() * 1.1).toFixed(2)}
                </span>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-neutral-200 space-y-3">
                <div className="flex items-center gap-3 text-neutral-600">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span className="text-xs font-light tracking-wide">Secure Payment</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-600">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                  </svg>
                  <span className="text-xs font-light tracking-wide">30-Day Returns</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-600">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <span className="text-xs font-light tracking-wide">Free Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}