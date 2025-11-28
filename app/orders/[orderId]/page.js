'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '@/lib/adminAuth.js';
import Link from 'next/link';
import { use } from 'react';

export default function OrderDetailPage({ params }) {
  const { user } = useAuth();
  const router = useRouter();

  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.orderId;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin?redirect=/orders');
    }
  }, [isAuthenticated, router]);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      setLoading(true);
      setErrorMessage('');

      try {
        const response = await fetch(`/api/user/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${user?._id}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          // Verify user owns this order
          if (data.order.userId !== user._id) {
            setErrorMessage('You do not have permission to view this order');
            setTimeout(() => router.push('/orders'), 2000);
            return;
          }
          setOrder(data.order);
        } else {
          setErrorMessage(data.error || 'Order not found');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setErrorMessage('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchOrder();
    }
  }, [orderId, user, isAuthenticated, router]);

  // Cancel order
  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await fetch(`/api/user/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user._id}`,
        },
        body: JSON.stringify({
          action: 'cancel',
          userId: user._id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrder({ ...order, status: 'cancelled' });
        alert('Order cancelled successfully');
      } else {
        alert(data.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  if (errorMessage || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-neutral-900 mb-4">
            {errorMessage || 'Order not found'}
          </h1>
          <Link
            href="/orders"
            className="text-neutral-600 hover:text-neutral-900 underline font-light"
          >
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/orders"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-light text-neutral-900 tracking-tight">
              Order Details
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-lg text-neutral-600 font-light">Order #{order.orderNumber}</p>
            <span
              className={`px-3 py-1 text-xs font-light tracking-wide border rounded-full ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Order Status Timeline */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-light text-neutral-900 mb-6">Order Status</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-light text-neutral-900">Order Placed</p>
                  <p className="text-sm text-neutral-600 font-light">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              
              {['processing', 'shipped', 'delivered'].includes(order.status) && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-light text-neutral-900">Processing</p>
                    <p className="text-sm text-neutral-600 font-light">Order is being prepared</p>
                  </div>
                </div>
              )}

              {['shipped', 'delivered'].includes(order.status) && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-light text-neutral-900">Shipped</p>
                    <p className="text-sm text-neutral-600 font-light">
                      {order.shippedDate ? formatDate(order.shippedDate) : 'In transit'}
                    </p>
                    {order.trackingNumber && (
                      <p className="text-sm text-blue-600 font-light mt-1">
                        Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {order.status === 'delivered' && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-light text-neutral-900">Delivered</p>
                    <p className="text-sm text-neutral-600 font-light">
                      {order.deliveredDate ? formatDate(order.deliveredDate) : 'Successfully delivered'}
                    </p>
                  </div>
                </div>
              )}

              {order.status === 'cancelled' && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-light text-neutral-900">Cancelled</p>
                    <p className="text-sm text-neutral-600 font-light">Order has been cancelled</p>
                  </div>
                </div>
              )}
            </div>

            {/* Cancel Button */}
            {['pending', 'processing'].includes(order.status) && (
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <button
                  onClick={handleCancelOrder}
                  className="px-6 py-3 border border-red-300 text-red-700 hover:bg-red-50 transition-colors font-light tracking-wide text-sm"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-light text-neutral-900 mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-neutral-200 last:border-0 last:pb-0">
                  {item.image && (
                    <div className="w-20 h-20 bg-neutral-100 flex-shrink-0 rounded">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-light text-neutral-900">{item.name}</p>
                    <p className="text-sm text-neutral-600 font-light mt-1">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-neutral-600 font-light">
                      Price: ₹{item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-light text-neutral-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-light text-neutral-900 mb-6">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-light text-neutral-600">Subtotal</span>
                <span className="font-light text-neutral-900">₹{order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-light text-neutral-600">Shipping</span>
                <span className="font-light text-neutral-900">
                  {(order.shippingCost || order.shipping) === 0
                    ? 'Free'
                    : `₹${(order.shippingCost || order.shipping)?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-light text-neutral-600">Tax (GST 18%)</span>
                <span className="font-light text-neutral-900">₹{order.tax?.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="font-light text-neutral-600">Discount</span>
                  <span className="font-light text-green-600">-₹{order.discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg pt-3 border-t border-neutral-200">
                <span className="font-light text-neutral-900">Total</span>
                <span className="font-light text-neutral-900">
                  ₹{(order.totalAmount || order.total)?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-light text-neutral-900 mb-4">Shipping Address</h2>
            <div className="text-sm font-light text-neutral-600 space-y-1">
              <p className="font-normal text-neutral-900">
                {order.shippingInfo.firstName} {order.shippingInfo.lastName}
              </p>
              <p>{order.shippingInfo.address}</p>
              <p>
                {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
              </p>
              <p>{order.shippingInfo.country}</p>
              <p className="pt-2">{order.shippingInfo.email}</p>
              <p>{order.shippingInfo.phone}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-light text-neutral-900 mb-4">Payment Information</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-light text-neutral-600">Payment Method</span>
                <span className="font-light text-neutral-900">
                  {(order.paymentInfo?.paymentMethod || order.paymentMethod || 'N/A').toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-light text-neutral-600">Payment Status</span>
                <span
                  className={`font-light ${
                    order.paymentInfo?.paymentStatus === 'completed'
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {order.paymentInfo?.paymentStatus === 'completed' ? '✓ Paid' : 'Pending'}
                </span>
              </div>
              {order.paymentInfo?.razorpayPaymentId && (
                <div className="flex justify-between">
                  <span className="font-light text-neutral-600">Transaction ID</span>
                  <span className="font-light text-neutral-900 text-xs">
                    {order.paymentInfo.razorpayPaymentId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Notes */}
          {order.customerNotes && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-light text-neutral-900 mb-4">Order Notes</h2>
              <p className="text-sm font-light text-neutral-600">{order.customerNotes}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/orders"
            className="flex-1 text-center px-6 py-3 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors font-light tracking-wide text-sm"
          >
            Back to Orders
          </Link>
          {order.status === 'delivered' && (
            <button className="flex-1 px-6 py-3 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors font-light tracking-wide text-sm uppercase">
              Reorder
            </button>
          )}
        </div>
      </div>
    </div>
  );
}