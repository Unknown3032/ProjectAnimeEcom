'use client';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import Script from 'next/script';

export default function Checkout() {
  const { cart, getCartTotal, getCartCount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

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
    country: 'India',
  });

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
              country: data.data.address?.country || 'India',
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

  // Handle next step
  const handleNext = () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (currentStep === 1 && !validateShipping()) {
      setErrorMessage('Please fill in all required shipping information');
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, 2));
    setErrors({});
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Calculate totals
  const subtotal = getCartTotal();
  const tax = subtotal * 0.18; // 18% GST for India
  const shippingCost = subtotal > 999 ? 0 : 50; // Free shipping above ₹999
  const total = subtotal + tax + shippingCost;

  // ============================================
  // PAYMENT SUCCESS HANDLER - ADD THIS FUNCTION
  // ============================================
  const handlePaymentSuccess = async (paymentResponse, razorpayOrderId) => {
    try {
      console.log('💳 Payment response received:', paymentResponse);

      // Verify payment signature
      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        }),
      });

      const verifyData = await verifyResponse.json();
      console.log('✅ Verification response:', verifyData);

      if (!verifyData.success) {
        throw new Error('Payment verification failed');
      }

      // Fetch payment details from Razorpay (optional - for getting payment method)
      let paymentDetails = {};
      try {
        const paymentDetailsResponse = await fetch(
          `/api/payment/details/${paymentResponse.razorpay_payment_id}`
        );
        
        if (paymentDetailsResponse.ok) {
          const detailsData = await paymentDetailsResponse.json();
          paymentDetails = detailsData.payment || {};
          console.log('📄 Payment details:', paymentDetails);
        }
      } catch (detailsError) {
        console.log('⚠️ Could not fetch payment details:', detailsError);
      }

      // Create order in database
      const orderData = {
        user: user._id,
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
          razorpayOrderId: paymentResponse.razorpay_order_id,
          razorpayPaymentId: paymentResponse.razorpay_payment_id,
          razorpaySignature: paymentResponse.razorpay_signature,
          paymentStatus: 'completed',
          paymentMethod: paymentDetails.method || 'razorpay',
          paymentDetails: {
            bank: paymentDetails.bank || '',
            wallet: paymentDetails.wallet || '',
            vpa: paymentDetails.vpa || '',
            cardType: paymentDetails.card?.type || '',
            cardNetwork: paymentDetails.card?.network || '',
            email: paymentDetails.email || shippingInfo.email,
            contact: paymentDetails.contact || shippingInfo.phone,
          },
        },
        subtotal,
        tax,
        shippingCost,
        totalAmount: total,
        total,
        status: 'processing',
      };

      console.log('📦 Creating order with data:', orderData);

      const createOrderResponse = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user._id}`,
        },
        body: JSON.stringify(orderData),
      });

      const createOrderData = await createOrderResponse.json();
      console.log('🎉 Order creation response:', createOrderData);

      if (createOrderData.success) {
        setSuccessMessage('Payment successful! Redirecting...');
        await clearCart();
        
        setTimeout(() => {
          const orderId = createOrderData.order?._id || createOrderData.data?._id;
          router.push(`/order-confirmation/${orderId}`);
        }, 1500);
      } else {
        throw new Error(createOrderData.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('❌ Order creation error:', error);
      setErrorMessage(
        'Payment successful but order creation failed. Please contact support with payment ID: ' + 
        paymentResponse.razorpay_payment_id
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RAZORPAY PAYMENT HANDLER
  // ============================================
  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      setErrorMessage('Payment system is loading. Please wait...');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      console.log('🚀 Initiating payment...');

      // Step 1: Create Razorpay order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const orderData = await orderResponse.json();
      console.log('📝 Order created:', orderData);

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      // Step 2: Razorpay checkout options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Your Store Name',
        description: `Order for ${getCartCount()} items`,
        image: '/logo.png', // Optional: Add your logo
        order_id: orderData.orderId,
        
        // Prefill customer information
        prefill: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        
        // Notes (optional - visible in dashboard)
        notes: {
          shipping_address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          pincode: shippingInfo.zipCode,
        },
        
        // Theme customization
        theme: {
          color: '#000000',
          hide_topbar: false,
        },
        
        // Method configuration - enable all payment methods
        method: {
          netbanking: true,
          card: true,
          wallet: true,
          upi: true,
          upi_intent: true, // Enable UPI intent flow
          cardless_emi: true,
          paylater: true,
          emi: {
            enabled: true,
          },
        },
        
        // Success handler - THIS IS WHERE handlePaymentSuccess IS USED
        handler: async function (response) {
          console.log('✨ Payment successful, processing...');
          await handlePaymentSuccess(response, orderData.orderId);
        },
        
        // Modal configuration
        modal: {
          ondismiss: function () {
            setLoading(false);
            setErrorMessage('Payment cancelled by user');
            console.log('❌ Payment cancelled');
          },
          escape: true,
          backdropclose: false,
          confirm_close: true, // Ask confirmation before closing
        },
        
        // Retry configuration
        retry: {
          enabled: true,
          max_count: 3,
        },
        
        // Timeout in seconds (15 minutes)
        timeout: 900,
        
        // Remember customer preference
        remember_customer: true,
        
        // Readonly fields
        readonly: {
          email: false,
          contact: false,
          name: false,
        },
      };

      const razorpay = new window.Razorpay(options);
      
      // Handle payment failure
      razorpay.on('payment.failed', function (response) {
        setLoading(false);
        console.error('💥 Payment failed:', response.error);
        setErrorMessage(
          response.error.description || 
          response.error.reason || 
          'Payment failed. Please try again.'
        );
      });
      
      // Open Razorpay checkout
      console.log('🔓 Opening Razorpay checkout...');
      razorpay.open();
      
    } catch (error) {
      console.error('❌ Payment error:', error);
      setErrorMessage(error.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (!isAuthenticated || cart.length === 0) {
    return null;
  }

  const steps = [
    { number: 1, title: 'Shipping', subtitle: 'Enter your shipping details' },
    { number: 2, title: 'Review & Pay', subtitle: 'Review and complete payment' },
  ];

  return (
    <>
      {/* Load Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => {
          setRazorpayLoaded(true);
          console.log('✅ Razorpay script loaded');
        }}
        onError={() => {
          setErrorMessage('Failed to load payment system');
          console.error('❌ Failed to load Razorpay script');
        }}
      />

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
                        placeholder="+91 98765 43210"
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
                        placeholder="Mumbai"
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
                        placeholder="Maharashtra"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1 font-light">{errors.state}</p>
                      )}
                    </div>

                    {/* ZIP Code */}
                    <div>
                      <label className="block text-sm font-light text-neutral-700 mb-2">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.zipCode}
                        onChange={e => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                        className={`w-full px-4 py-3 border ${
                          errors.zipCode ? 'border-red-500' : 'border-neutral-300'
                        } focus:outline-none focus:border-neutral-900 transition-colors font-light`}
                        placeholder="400001"
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
                        <option>India</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Canada</option>
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
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Review & Payment */}
              {currentStep === 2 && (
                <div ref={el => (stepsRef.current[1] = el)} className="bg-white p-6 sm:p-8">
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

                  {/* Order Items */}
                  <div className="pb-8 border-b border-neutral-200">
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
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Button */}
                  <div className="mt-8">
                    <button
                      onClick={handleRazorpayPayment}
                      disabled={loading || !razorpayLoaded}
                      className="w-full px-8 py-4 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors font-light tracking-wide text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : !razorpayLoaded ? (
                        'Loading Payment System...'
                      ) : (
                        `Pay ₹${total.toFixed(2)}`
                      )}
                    </button>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={handlePrevious}
                      disabled={loading}
                      className="px-6 py-3 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors font-light tracking-wide text-sm disabled:opacity-50"
                    >
                      Back
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
                    <span className="font-light text-neutral-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-light text-neutral-600">Shipping</span>
                    <span className="font-light text-neutral-900">
                      {shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-light text-neutral-600">Tax (GST 18%)</span>
                    <span className="font-light text-neutral-900">₹{tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-light text-neutral-900">Total</span>
                  <span className="text-2xl font-light text-neutral-900">
                    ₹{total.toFixed(2)}
                  </span>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 border-t border-neutral-200 space-y-3">
                  <div className="flex items-center gap-3 text-neutral-600">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    <span className="text-xs font-light tracking-wide">Secure Payment with Razorpay</span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-600">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                    <span className="text-xs font-light tracking-wide">7-Day Returns</span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-600">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                    <span className="text-xs font-light tracking-wide">
                      {shippingCost === 0 ? 'Free Shipping' : 'Free Shipping on orders above ₹999'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}