// app/order-confirmation/[orderId]/page.js
'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  const orderId = params.orderId || params.id;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Fetching order:', orderId);
        
        const response = await fetch(`/api/admin/orders/${orderId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', response.headers.get('content-type'));

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('❌ Non-JSON response:', text.substring(0, 200));
          throw new Error('Server returned an invalid response. Please try again.');
        }

        const data = await response.json();
        console.log('📦 Order data:', data);

        if (response.ok && data.success) {
          const orderData = data.data || data.order;
          if (orderData) {
            setOrder(orderData);
          } else {
            throw new Error('Order data is missing');
          }
        } else {
          throw new Error(data.message || data.error || 'Failed to fetch order');
        }
      } catch (err) {
        console.error('❌ Error fetching order:', err);
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (!loading && order && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [loading, order]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-light">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-light text-neutral-900 mb-4 tracking-tight">
            Order Not Found
          </h2>
          <p className="text-neutral-600 font-light mb-8">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="px-8 py-3 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors font-light tracking-wide text-sm uppercase text-center"
            >
              View Orders
            </Link>
            <Link
              href="/productspage/all"
              className="px-8 py-3 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors font-light tracking-wide text-sm uppercase text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No order data
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-light text-neutral-900 mb-4 tracking-tight">
            Order Not Found
          </h2>
          <Link
            href="/productspage/all"
            className="inline-block px-8 py-3 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors font-light tracking-wide text-sm uppercase"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16">
        <div ref={containerRef} className="bg-white p-8 sm:p-12">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-4xl sm:text-5xl font-light text-neutral-900 mb-4 tracking-tight">
              Order Confirmed!
            </h1>
            <p className="text-neutral-600 font-light mb-2">
              Thank you for your purchase
            </p>
            {order.orderNumber && (
              <p className="text-sm text-neutral-500 font-light">
                Order Number: <span className="font-normal text-neutral-900">{order.orderNumber}</span>
              </p>
            )}
          </div>

          {/* Order Details */}
          <div className="border-t border-neutral-200 pt-8 mb-8">
            <h2 className="text-2xl font-light text-neutral-900 mb-6 tracking-tight">Order Details</h2>
            
            {/* Items */}
            {order.items && order.items.length > 0 && (
              <div className="space-y-4 mb-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    {item.image && (
                      <div className="w-20 h-20 bg-neutral-100 flex-shrink-0 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-light text-neutral-900 text-lg">{item.name}</p>
                      <p className="text-sm text-neutral-600 font-light mt-1">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-neutral-600 font-light">
                        ${item.price?.toFixed(2)} each
                      </p>
                    </div>
                    <p className="font-light text-neutral-900 text-lg">
                      ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Totals */}
            <div className="space-y-2 text-sm border-t border-neutral-200 pt-4">
              {order.subtotal !== undefined && (
                <div className="flex justify-between">
                  <span className="font-light text-neutral-600">Subtotal</span>
                  <span className="font-light text-neutral-900">${order.subtotal.toFixed(2)}</span>
                </div>
              )}
              {order.tax !== undefined && (
                <div className="flex justify-between">
                  <span className="font-light text-neutral-600">Tax</span>
                  <span className="font-light text-neutral-900">${order.tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-light text-neutral-600">Shipping</span>
                <span className="font-light text-neutral-900">
                  {(order.shippingCost === 0 || !order.shippingCost) ? 'Free' : `$${order.shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-lg pt-3 border-t border-neutral-200 mt-3">
                <span className="font-light text-neutral-900">Total</span>
                <span className="font-light text-neutral-900">${order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          {(order.shippingInfo || order.shippingAddress) && (
            <div className="border-t border-neutral-200 pt-8 mb-8">
              <h3 className="text-xl font-light text-neutral-900 mb-4 tracking-tight">
                Shipping Address
              </h3>
              <div className="text-sm font-light text-neutral-600 space-y-1">
                {(() => {
                  const shipping = order.shippingInfo || order.shippingAddress;
                  return (
                    <>
                      <p className="text-neutral-900 font-normal">
                        {shipping.firstName} {shipping.lastName}
                      </p>
                      {shipping.address && <p>{shipping.address}</p>}
                      <p>
                        {shipping.city && `${shipping.city}, `}
                        {shipping.state && `${shipping.state} `}
                        {shipping.zipCode}
                      </p>
                      {shipping.country && <p>{shipping.country}</p>}
                      {shipping.email && <p className="pt-2">{shipping.email}</p>}
                      {shipping.phone && <p>{shipping.phone}</p>}
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Order Status */}
          <div className="border-t border-neutral-200 pt-8 mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-light text-neutral-900 tracking-tight">Status</h3>
              <span className={`px-4 py-2 text-sm font-light tracking-wide uppercase ${
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-neutral-100 text-neutral-900'
              }`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-neutral-200">
            <Link
              href="/productspage/all"
              className="px-8 py-3 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors font-light tracking-wide text-sm uppercase text-center"
            >
              Continue Shopping
            </Link>
            <Link
              href="/orders"
              className="px-8 py-3 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors font-light tracking-wide text-sm uppercase text-center"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}