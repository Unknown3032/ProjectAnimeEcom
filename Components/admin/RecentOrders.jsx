"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

export default function RecentOrders({ orders, onRefresh }) {
  const tableRef = useRef(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    gsap.fromTo(
      tableRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.8 }
    );
  }, [orders]);

  // Format currency to INR
  const formatINR = (amount) => {
    // Remove any existing currency symbols and parse
    const numAmount = typeof amount === 'string' 
      ? parseFloat(amount.replace(/[^0-9.-]+/g, ''))
      : amount;
    
    return `₹${numAmount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return "✓";
      case "shipped":
        return "🚚";
      case "processing":
        return "⏳";
      case "pending":
        return "⏸";
      case "cancelled":
        return "✕";
      default:
        return "•";
    }
  };

  // Filter and sort orders
  const processedOrders = orders
    .filter(order => filterStatus === 'all' || order.status === filterStatus)
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortOrder === 'highest') {
        const amountA = parseFloat(a.amount.replace(/[^0-9.-]+/g, ''));
        const amountB = parseFloat(b.amount.replace(/[^0-9.-]+/g, ''));
        return amountB - amountA;
      }
      return 0;
    });

  // Calculate totals
  const totalAmount = processedOrders.reduce((sum, order) => {
    const amount = parseFloat(order.amount.replace(/[^0-9.-]+/g, ''));
    return sum + amount;
  }, 0);

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div ref={tableRef} className="bg-white border border-black/10 rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-black/10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <p className="text-xs text-black/40 mt-1">
              Latest customer orders • Total: {formatINR(totalAmount)}
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs border border-black/10 rounded-lg px-3 py-2 bg-white hover:border-black/30 transition-colors focus:outline-none focus:ring-2 focus:ring-black/20"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending ({statusCounts.pending || 0})</option>
              <option value="processing">Processing ({statusCounts.processing || 0})</option>
              <option value="shipped">Shipped ({statusCounts.shipped || 0})</option>
              <option value="delivered">Delivered ({statusCounts.delivered || 0})</option>
              <option value="cancelled">Cancelled ({statusCounts.cancelled || 0})</option>
            </select>

            {/* Sort */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="text-xs border border-black/10 rounded-lg px-3 py-2 bg-white hover:border-black/30 transition-colors focus:outline-none focus:ring-2 focus:ring-black/20"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Amount</option>
            </select>

            {/* Refresh Button */}
            <button 
              onClick={onRefresh}
              className="text-xs font-medium px-4 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-all flex items-center gap-2 group"
            >
              <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        {orders.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div 
                key={status}
                className={`px-3 py-2 rounded-lg text-xs flex items-center justify-between ${getStatusColor(status).replace('border', '')}`}
              >
                <span className="capitalize font-medium">{status}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/10 bg-black/[0.02]">
              <th className="text-left p-4 text-xs tracking-wider uppercase text-black/40 font-medium">
                Order ID
              </th>
              <th className="text-left p-4 text-xs tracking-wider uppercase text-black/40 font-medium">
                Customer
              </th>
              <th className="text-left p-4 text-xs tracking-wider uppercase text-black/40 font-medium hidden md:table-cell">
                Product
              </th>
              <th className="text-left p-4 text-xs tracking-wider uppercase text-black/40 font-medium">
                Amount
              </th>
              <th className="text-left p-4 text-xs tracking-wider uppercase text-black/40 font-medium">
                Status
              </th>
              <th className="text-left p-4 text-xs tracking-wider uppercase text-black/40 font-medium hidden lg:table-cell">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {processedOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center text-black/40">
                    <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-sm font-medium">No orders found</p>
                    <p className="text-xs mt-1">
                      {filterStatus !== 'all' 
                        ? `No ${filterStatus} orders available`
                        : 'Orders will appear here once created'
                      }
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              processedOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className="border-b border-black/5 hover:bg-black/[0.02] transition-colors group"
                  style={{
                    animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                  }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-medium">#{order.id}</span>
                      <button 
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-black/40 hover:text-black"
                        onClick={() => navigator.clipboard.writeText(order.id)}
                        title="Copy Order ID"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-black/5 rounded-full flex items-center justify-center text-xs font-medium">
                        {order.customer.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{order.customer}</div>
                        <div className="text-xs text-black/40 hidden xl:block">{order.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-black/70 hidden md:table-cell">
                    <div className="max-w-[200px] truncate">{order.product}</div>
                    {order.itemCount > 1 && (
                      <span className="text-xs text-black/40">
                        +{order.itemCount - 1} more item{order.itemCount > 2 ? 's' : ''}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold">{formatINR(order.amount)}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wide uppercase rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <span>{getStatusIcon(order.status)}</span>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-black/40 hidden lg:table-cell">
                    <div className="flex flex-col">
                      <span>{new Date(order.date).toLocaleDateString('en-IN')}</span>
                      <span className="text-xs text-black/30">
                        {new Date(order.date).toLocaleTimeString('en-IN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-black/10 bg-black/[0.01] flex items-center justify-between">
        <div className="text-xs text-black/40">
          Showing {processedOrders.length} of {orders.length} orders
          {filterStatus !== 'all' && ` • Filtered by ${filterStatus}`}
        </div>
        <button className="text-sm font-medium hover:underline inline-flex items-center gap-1 group">
          View all orders 
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      {/* Add fadeIn animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}