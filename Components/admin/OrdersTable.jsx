'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import OrderDetailsModal from './OrderDetailsModal';

const OrdersTable = ({ filters }) => {
  const tableRef = useRef(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, [currentPage, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: ordersPerPage,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.dateRange && { dateRange: filters.dateRange })
      });

      const response = await fetch(`/api/admin/orders?${params}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'bg-black text-white',
      shipped: 'bg-black/80 text-white',
      processing: 'bg-black/60 text-white',
      pending: 'bg-black/20 text-black',
      cancelled: 'bg-black/10 text-black/40',
    };
    return colors[status] || 'bg-black/5 text-black/40';
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        // Refresh orders
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    if (!loading && orders.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from(tableRef.current.querySelectorAll('.order-row'), {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
        });
      }, tableRef);

      return () => ctx.revert();
    }
  }, [loading, orders]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-black/5 p-12">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-black/20 border-t-black rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-black/5 overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-black/5">
          <h2 className="text-xl font-bold text-black">Recent Orders</h2>
          <p className="text-sm text-black/50 mt-1">
            {pagination?.totalOrders || 0} total orders found
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table ref={tableRef} className="w-full">
            <thead className="bg-black/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="order-row hover:bg-black/5 transition-colors duration-200 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-black">
                      {order.orderNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-xl">
                        👤
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">
                          {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                        </p>
                        <p className="text-xs text-black/50">
                          {order.user?.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-black/60">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-black">
                      ${order.total.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black/60">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                      className="text-sm font-medium text-black hover:underline"
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-black/5">
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => setSelectedOrder(order)}
              className="p-4 hover:bg-black/5 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-black mb-1">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-black/50">
                    {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-black/60">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </span>
                
                <div className="text-right">
                  <p className="text-sm font-bold text-black">${order.total.toFixed(2)}</p>
                  <p className="text-xs text-black/50">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="px-6 py-4 border-t border-black/5 flex items-center justify-between">
            <p className="text-sm text-black/60">
              Showing {((currentPage - 1) * ordersPerPage) + 1} to {Math.min(currentPage * ordersPerPage, pagination.totalOrders)} of {pagination.totalOrders} orders
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-black/10 text-sm font-medium text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(pagination.totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      currentPage === idx + 1
                        ? 'bg-black text-white'
                        : 'text-black hover:bg-black/5'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 rounded-lg border border-black/10 text-sm font-medium text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </>
  );
};

export default OrdersTable;