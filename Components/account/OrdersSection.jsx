'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrdersSection() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusCounts, setStatusCounts] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
  });

  // Get user from localStorage
  const getUserId = () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user._id || user.id;
      }
    }
    return null;
  };

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      const userId = getUserId();
      if (!userId) return;

      setLoading(true);
      setErrorMessage('');

      try {
        const response = await fetch(
          `/api/user/orders?userId=${userId}&status=${statusFilter}&page=${currentPage}`,
          {
            headers: {
              'Authorization': `Bearer ${userId}`,
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

    fetchOrders();
  }, [statusFilter, currentPage]);

  // Cancel order
  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    const userId = getUserId();
    if (!userId) return;

    try {
      const response = await fetch(`/api/user/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userId}`,
        },
        body: JSON.stringify({
          action: 'cancel',
          userId: userId,
        }),
      });

      const data = await response.json();

      if (data.success) {
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

  // Get status badge style
  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      processing: 'bg-blue-50 text-blue-700 border-blue-200',
      shipped: 'bg-purple-50 text-purple-700 border-purple-200',
      delivered: 'bg-green-50 text-green-700 border-green-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
      refunded: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return styles[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const statusTabs = [
    { key: 'all', label: 'All', count: statusCounts.all || 0 },
    { key: 'pending', label: 'Pending', count: statusCounts.pending || 0 },
    { key: 'processing', label: 'Processing', count: statusCounts.processing || 0 },
    { key: 'shipped', label: 'Shipped', count: statusCounts.shipped || 0 },
    { key: 'delivered', label: 'Delivered', count: statusCounts.delivered || 0 },
    { key: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">Orders</h2>
          <p className="text-sm text-black/60 mt-1">Track and manage your orders</p>
        </div>
        <Link
          href="/"
          className="hidden sm:flex items-center gap-2 px-6 py-2.5 border border-black/20 text-black hover:bg-black hover:text-white transition-all duration-300 text-sm tracking-wide"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="border-b border-black/10">
        <div className="flex overflow-x-auto scrollbar-hide gap-1">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setStatusFilter(tab.key);
                setCurrentPage(1);
              }}
              className={`flex-shrink-0 px-4 md:px-6 py-3 text-sm font-medium tracking-wide transition-all relative ${
                statusFilter === tab.key
                  ? 'text-black'
                  : 'text-black/40 hover:text-black/60'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-black/5">
                  {tab.count}
                </span>
              )}
              {statusFilter === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-black/10 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-black/5 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-black/5 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-black/5 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        // Empty State
        <div className="bg-white border border-black/10 rounded-lg p-12 text-center">
          <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-black/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-black mb-2">No orders found</h3>
          <p className="text-black/60 mb-6">
            {statusFilter === 'all'
              ? "You haven't placed any orders yet."
              : `No ${statusFilter} orders found.`}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white hover:bg-black/90 transition-colors text-sm tracking-wide"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        // Orders List
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-black/10 rounded-lg overflow-hidden hover:border-black/20 transition-all duration-300"
              >
                {/* Order Header */}
                <div className="p-4 md:p-6 border-b border-black/10 bg-black/[0.02]">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-bold text-black">
                          #{order.orderNumber}
                        </h3>
                        <span
                          className={`px-2.5 py-1 text-xs font-medium tracking-wide border rounded-full ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-black/60">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/orders/${order._id}`}
                        className="px-4 py-2 border border-black/20 text-black hover:bg-black hover:text-white transition-all duration-300 text-sm tracking-wide"
                      >
                        View Details
                      </Link>
                      {['pending', 'processing'].includes(order.status) && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="px-4 py-2 border border-red-200 text-red-700 hover:bg-red-50 transition-colors text-sm tracking-wide"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 md:p-6">
                  <div className="space-y-4 mb-4">
                    {order.items.slice(0, 2).map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-4">
                        {item.image && (
                          <div className="w-16 h-16 bg-black/5 flex-shrink-0 rounded overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-black truncate">{item.name}</p>
                          <p className="text-sm text-black/60">
                            Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-medium text-black">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-black/60">
                        + {order.items.length - 2} more item(s)
                      </p>
                    )}
                  </div>

                  {/* Order Total */}
                  <div className="pt-4 border-t border-black/10">
                    <div className="flex justify-between items-center">
                      <span className="text-black/60 text-sm">Total Amount</span>
                      <span className="text-xl font-bold text-black">
                        ₹{(order.totalAmount || order.total)?.toFixed(2)}
                      </span>
                    </div>
                    {order.paymentInfo?.paymentMethod && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-black/60 text-sm">Payment Method</span>
                        <span className="text-sm font-medium text-black">
                          {order.paymentInfo.paymentMethod.toUpperCase()}
                          {order.paymentInfo.paymentStatus === 'completed' && (
                            <span className="text-green-600 ml-2">✓</span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tracking Info */}
                  {order.trackingNumber && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-blue-900">
                        <strong>Tracking:</strong> {order.trackingNumber}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-black/20 text-black hover:bg-black hover:text-white transition-all duration-300 text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-black/60">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 border border-black/20 text-black hover:bg-black hover:text-white transition-all duration-300 text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}