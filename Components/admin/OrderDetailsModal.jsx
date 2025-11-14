'use client';

import { useState } from 'react';

const OrderDetailsModal = ({ order, onClose, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status);

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    await onStatusUpdate(order._id, newStatus);
    setIsUpdating(false);
    onClose();
  };

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-black/10 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black">{order.orderNumber}</h2>
            <p className="text-sm text-black/50">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 transition-colors flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="text-lg font-bold text-black mb-4">Customer Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/5 rounded-xl p-4">
                <p className="text-xs text-black/50 mb-1">Name</p>
                <p className="text-sm font-medium text-black">
                  {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                </p>
              </div>
              <div className="bg-black/5 rounded-xl p-4">
                <p className="text-xs text-black/50 mb-1">Email</p>
                <p className="text-sm font-medium text-black">{order.user?.email}</p>
              </div>
              <div className="bg-black/5 rounded-xl p-4">
                <p className="text-xs text-black/50 mb-1">Phone</p>
                <p className="text-sm font-medium text-black">{order.shippingAddress?.phone}</p>
              </div>
              <div className="bg-black/5 rounded-xl p-4">
                <p className="text-xs text-black/50 mb-1">Payment Method</p>
                <p className="text-sm font-medium text-black">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-bold text-black mb-4">Shipping Address</h3>
            <div className="bg-black/5 rounded-xl p-4">
              <p className="text-sm text-black">
                {order.shippingAddress?.street}
                {order.shippingAddress?.apartment && `, ${order.shippingAddress.apartment}`}
              </p>
              <p className="text-sm text-black">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
              </p>
              <p className="text-sm text-black">{order.shippingAddress?.country}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-bold text-black mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="bg-black/5 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-black">{item.name}</p>
                    <p className="text-sm text-black/50">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-black">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-bold text-black mb-4">Order Summary</h3>
            <div className="bg-black/5 rounded-xl p-4 space-y-2">
              {order.subtotal && (
                <div className="flex justify-between">
                  <span className="text-sm text-black/60">Subtotal</span>
                  <span className="text-sm font-medium text-black">${order.subtotal.toFixed(2)}</span>
                </div>
              )}
              {order.shipping && (
                <div className="flex justify-between">
                  <span className="text-sm text-black/60">Shipping</span>
                  <span className="text-sm font-medium text-black">${order.shipping.toFixed(2)}</span>
                </div>
              )}
              {order.tax && (
                <div className="flex justify-between">
                  <span className="text-sm text-black/60">Tax</span>
                  <span className="text-sm font-medium text-black">${order.tax.toFixed(2)}</span>
                </div>
              )}
              {order.discount && (
                <div className="flex justify-between">
                  <span className="text-sm text-black/60">Discount</span>
                  <span className="text-sm font-medium text-green-600">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-black/10 pt-2 flex justify-between">
                <span className="font-bold text-black">Total</span>
                <span className="font-bold text-black">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div>
            <h3 className="text-lg font-bold text-black mb-4">Update Status</h3>
            <div className="flex gap-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="flex-1 px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating || newStatus === order.status}
                className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;