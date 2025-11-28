'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/adminAuth.js';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function OrdersPage() {
  const { user} = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusCounts, setStatusCounts] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const containerRef = useRef(null);
  const ordersRef = useRef([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin?redirect=/orders');
    }
  }, [isAuthenticated, router]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;

      setLoading(true);
      setErrorMessage('');

      try {
        const response = await fetch(
          `/api/user/orders?userId=${user._id}&status=${statusFilter}&page=${pagination.currentPage}`,
          {
            headers: {
              'Authorization': `Bearer ${user._id}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setOrders(data.orders);
          setPagination(data.pagination);
          setStatusCounts(data.statusCounts);
        } else {
          setErrorMessage(data.error || 'Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setErrorMessage('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [user, statusFilter, pagination.currentPage, isAuthenticated]);

  // Animate orders on load
  useEffect(() => {
    if (orders.length > 0 && ordersRef.current.length > 0) {
      gsap.fromTo(
        ordersRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }
  }, [orders]);

  // Cancel order
  const handleCancelOrder = async (orderId) => {
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
        // Refresh orders
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status: 'cancelled' } : order
          )
        );
        alert('Order cancelled successfully');
      } else {
        alert(data.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
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
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  const statusTabs = [
    { key: 'all', label: 'All Orders', count: statusCounts.all || 0 },
    { key: 'pending', label: 'Pending', count: statusCounts.pending || 0 },
    { key: 'processing', label: 'Processing', count: statusCounts.processing || 0 },
    { key: 'shipped', label: 'Shipped', count: statusCounts.shipped || 0 },
    { key: 'delivered', label: 'Delivered', count: statusCounts.delivered || 0 },
    { key: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled || 0 },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-light text-neutral-900 tracking-tight">
                My Orders
              </h1>
              <p className="mt-2 text-neutral-600 font-light">
                Track and manage your orders
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors font-light tracking-wide text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-2 sm:gap-4 py-4">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setStatusFilter(tab.key);
                  setPagination({ ...pagination, currentPage: 1 });
                }}
                className={`flex-shrink-0 px-4 py-2 text-sm font-light tracking-wide transition-all ${
                  statusFilter === tab.key
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-opacity-20 bg-white">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-light text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                <div className="h-4 bg-neutral-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-neutral-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="text-xl font-light text-neutral-900 mb-2">No orders found</h3>
            <p className="text-neutral-600 font-light mb-6">
              {statusFilter === 'all'
                ? "You haven't placed any orders yet."
                : `No ${statusFilter} orders found.`}
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors font-light tracking-wide text-sm uppercase"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          // Orders List
          <>
            <div className="space-y-6">
              {orders.map((order, index) => (
                <div
                  key={order._id}
                  ref={(el) => (ordersRef.current[index] = el)}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-neutral-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-light text-neutral-900">
                            Order #{order.orderNumber}
                          </h3>
                          <span
                            className={`px-3 py-1 text-xs font-light tracking-wide border rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 font-light">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/orders/${order._id}`}
                          className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors font-light tracking-wide text-sm"
                        >
                          View Details
                        </Link>
                        {['pending', 'processing'].includes(order.status) && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 transition-colors font-light tracking-wide text-sm"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.slice(0, 2).map((item, itemIndex) => (
                        <div key={itemIndex} className="flex gap-4">
                          {item.image && (
                            <div className="w-16 h-16 bg-neutral-100 flex-shrink-0 rounded">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-light text-neutral-900 truncate">{item.name}</p>
                            <p className="text-sm text-neutral-600 font-light">
                              Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-light text-neutral-900">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm text-neutral-600 font-light">
                          + {order.items.length - 2} more item(s)
                        </p>
                      )}
                    </div>

                    {/* Order Total */}
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600 font-light">Total Amount</span>
                        <span className="text-xl font-light text-neutral-900">
                          ₹{order.totalAmount?.toFixed(2) || order.total?.toFixed(2)}
                        </span>
                      </div>
                      {order.paymentInfo?.paymentMethod && (
                        <p className="text-sm text-neutral-600 font-light mt-2">
                          Payment: {order.paymentInfo.paymentMethod.toUpperCase()}
                          {order.paymentInfo.paymentStatus === 'completed' && (
                            <span className="text-green-600 ml-2">✓ Paid</span>
                          )}
                        </p>
                      )}
                    </div>

                    {/* Tracking Info */}
                    {order.trackingNumber && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm font-light text-blue-900">
                          <strong>Tracking Number:</strong> {order.trackingNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() =>
                    setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })
                  }
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors font-light text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-light text-neutral-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors font-light text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}