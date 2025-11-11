"use client";
import OrderTimeline from './OrderTimeline';

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const OrderDetailsModal = ({ order, onClose }) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(modalRef.current, {
        opacity: 0,
        duration: 0.3,
      });

      gsap.from(contentRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    });

    return () => ctx.revert();
  }, []);

  const handleClose = () => {
    gsap.to(contentRef.current, {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    });

    gsap.to(modalRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: onClose,
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      delivered: "bg-black text-white",
      shipped: "bg-black/80 text-white",
      processing: "bg-black/60 text-white",
      pending: "bg-black/20 text-black",
      cancelled: "bg-black/10 text-black/40",
    };
    return colors[status] || "bg-black/5 text-black/40";
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black mb-1">
              Order Details
            </h2>
            <p className="text-sm text-black/50">{order.id}</p>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 transition-colors flex items-center justify-center group"
          >
            <span className="text-xl group-hover:rotate-90 transition-transform duration-300">
              ✕
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
          {/* Status & Date */}
          <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-black/5 rounded-xl">
            <div>
              <p className="text-xs text-black/50 mb-1">Status</p>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-xs text-black/50 mb-1">Order Date</p>
              <p className="text-sm font-medium text-black">
                {new Date(order.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-black/50 mb-1">Payment Method</p>
              <p className="text-sm font-medium text-black">
                {order.paymentMethod}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="p-4 bg-black/5 rounded-xl">
            <h3 className="text-sm font-semibold text-black mb-3">
              Customer Information
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center text-2xl">
                {order.customer.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-black">
                  {order.customer.name}
                </p>
                <p className="text-xs text-black/50">{order.customer.email}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-3">
              Order Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-black/5 rounded-xl hover:bg-black/10 transition-colors"
                >
                  <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center text-3xl border border-black/10">
                    {item.image}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-black">
                      {item.name}
                    </p>
                    <p className="text-xs text-black/50 mt-1">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-black">
                      $
                      {(
                        (order.total / order.items.length) *
                        item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <OrderTimeline order={order} />

          {/* Order Summary */}
          <div className="p-4 bg-black/5 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-black/60">Subtotal</span>
              <span className="font-medium text-black">
                ${(order.total * 0.9).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-black/60">Shipping</span>
              <span className="font-medium text-black">
                ${(order.total * 0.05).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-black/60">Tax</span>
              <span className="font-medium text-black">
                ${(order.total * 0.05).toFixed(2)}
              </span>
            </div>
            <div className="pt-2 border-t border-black/10 flex items-center justify-between">
              <span className="font-semibold text-black">Total</span>
              <span className="text-xl font-bold text-black">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-black/5 flex items-center gap-3">
          <button className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all duration-300 hover:shadow-lg">
            Update Status
          </button>
          <button className="flex-1 px-6 py-3 bg-black/5 text-black rounded-xl font-medium hover:bg-black/10 transition-all duration-300">
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
