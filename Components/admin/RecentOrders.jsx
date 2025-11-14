"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

export default function RecentOrders({ orders, onRefresh }) {
  const tableRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      tableRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.8 }
    );
  }, [orders]);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div ref={tableRef} className="bg-white border border-black/10 rounded-lg overflow-hidden">
      <div className="p-6 border-b border-black/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-light">Recent Orders</h2>
          <p className="text-xs text-black/40 mt-1">Latest customer orders</p>
        </div>
        <button 
          onClick={onRefresh}
          className="text-xs font-medium hover:underline flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

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
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-black/40">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-black/5 hover:bg-black/[0.02] transition-colors"
                >
                  <td className="p-4 text-sm font-medium">{order.id}</td>
                  <td className="p-4">
                    <div className="text-sm font-light">{order.customer}</div>
                    <div className="text-xs text-black/40 hidden xl:block">{order.email}</div>
                  </td>
                  <td className="p-4 text-sm font-light text-black/60 hidden md:table-cell">
                    {order.product}
                    {order.itemCount > 1 && (
                      <span className="text-xs text-black/40 ml-1">
                        +{order.itemCount - 1} more
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm font-medium">{order.amount}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-black/40 hidden lg:table-cell">
                    {order.date}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-black/10 bg-black/[0.01]">
        <button className="text-sm font-medium hover:underline inline-flex items-center gap-1 group">
          View all orders 
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
}