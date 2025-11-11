"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { recentOrders } from "@/lib/dashboardData";

export default function RecentOrders() {
  const tableRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      tableRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.8 }
    );
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-black text-white";
      case "processing":
        return "bg-black/10 text-black";
      case "pending":
        return "border border-black/20 text-black/60";
      case "shipped":
        return "bg-black/5 text-black/80";
      default:
        return "bg-black/10 text-black";
    }
  };

  return (
    <div ref={tableRef} className="bg-white border border-black/10">
      <div className="p-6 border-b border-black/10">
        <h2 className="text-xl font-light">Recent Orders</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/10">
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
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-black/5 hover:bg-black/[0.02] transition-colors"
              >
                <td className="p-4 text-sm font-medium">{order.id}</td>
                <td className="p-4 text-sm font-light">{order.customer}</td>
                <td className="p-4 text-sm font-light text-black/60 hidden md:table-cell">
                  {order.product}
                </td>
                <td className="p-4 text-sm font-medium">{order.amount}</td>
                <td className="p-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase ${getStatusColor(
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
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-black/10">
        <button className="text-sm font-medium hover:underline">
          View all orders →
        </button>
      </div>
    </div>
  );
}
