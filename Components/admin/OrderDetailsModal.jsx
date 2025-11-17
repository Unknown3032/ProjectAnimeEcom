"use client";

import { useState } from "react";

const OrderDetailsModal = ({ order, onClose, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber || ""
  );
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    setError("");
    setSuccess("");

    try {
        await onStatusUpdate({ orderId: order._id, newStatus, trackingNumber, adminNotes });
    } catch (err) {
      // console.error("❌ Error updating status:", err);
      setError(err.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const statuses = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "processing",
      label: "Processing",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "shipped",
      label: "Shipped",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
    {
      value: "refunded",
      label: "Refunded",
      color: "bg-gray-100 text-gray-800",
    },
  ];

  // Show tracking input only for shipped/delivered status
  const showTrackingInput =
    newStatus === "shipped" || newStatus === "delivered";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-black/10 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black">
              {order.orderNumber}
            </h2>
            <p className="text-sm text-black/50">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
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
          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Customer Info */}
          <div>
            <h3 className="text-lg font-bold text-black mb-4">
              Customer Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/5 rounded-xl p-4">
                <p className="text-xs text-black/50 mb-1">Name</p>
                <p className="text-sm font-medium text-black">
                  {order.shippingAddress?.firstName ||
                    order.shippingInfo?.firstName}{" "}
                  {order.shippingAddress?.lastName ||
                    order.shippingInfo?.lastName}
                </p>
              </div>
              <div className="bg-black/5 rounded-xl p-4">
                <p className="text-xs text-black/50 mb-1">Email</p>
                <p className="text-sm font-medium text-black">
                  {order.user?.email ||
                    order.shippingAddress?.email ||
                    order.shippingInfo?.email}
                </p>
              </div>
              <div className="bg-black/5 rounded-xl p-4">
                <p className="text-xs text-black/50 mb-1">Phone</p>
                <p className="text-sm font-medium text-black">
                  {order.shippingAddress?.phone || order.shippingInfo?.phone}
                </p>
              </div>
              <div className="bg-black/5 rounded-xl p-4">
                <p className="text-xs text-black/50 mb-1">Payment Method</p>
                <p className="text-sm font-medium text-black">
                  {order.paymentMethod ||
                    order.paymentInfo?.paymentMethod ||
                    "Card"}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-bold text-black mb-4">
              Shipping Address
            </h3>
            <div className="bg-black/5 rounded-xl p-4">
              <p className="text-sm text-black">
                {order.shippingAddress?.street ||
                  order.shippingAddress?.address ||
                  order.shippingInfo?.address}
                {order.shippingAddress?.apartment &&
                  `, ${order.shippingAddress.apartment}`}
              </p>
              <p className="text-sm text-black">
                {order.shippingAddress?.city || order.shippingInfo?.city},{" "}
                {order.shippingAddress?.state || order.shippingInfo?.state}{" "}
                {order.shippingAddress?.zipCode || order.shippingInfo?.zipCode}
              </p>
              <p className="text-sm text-black">
                {order.shippingAddress?.country || order.shippingInfo?.country}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-bold text-black mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="bg-black/5 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-black">{item.name}</p>
                      <p className="text-sm text-black/50">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-black/50">
                        ${item.price?.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-black">
                    ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-bold text-black mb-4">Order Summary</h3>
            <div className="bg-black/5 rounded-xl p-4 space-y-2">
              {order.subtotal !== undefined && (
                <div className="flex justify-between">
                  <span className="text-sm text-black/60">Subtotal</span>
                  <span className="text-sm font-medium text-black">
                    ${order.subtotal?.toFixed(2)}
                  </span>
                </div>
              )}
              {order.shippingCost !== undefined && (
                <div className="flex justify-between">
                  <span className="text-sm text-black/60">Shipping</span>
                  <span className="text-sm font-medium text-black">
                    {order.shippingCost === 0
                      ? "Free"
                      : `$${order.shippingCost?.toFixed(2)}`}
                  </span>
                </div>
              )}
              {order.tax !== undefined && (
                <div className="flex justify-between">
                  <span className="text-sm text-black/60">Tax</span>
                  <span className="text-sm font-medium text-black">
                    ${order.tax?.toFixed(2)}
                  </span>
                </div>
              )}
              {order.discount && (
                <div className="flex justify-between">
                  <span className="text-sm text-black/60">Discount</span>
                  <span className="text-sm font-medium text-green-600">
                    -${order.discount?.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="border-t border-black/10 pt-2 flex justify-between">
                <span className="font-bold text-black">Total</span>
                <span className="font-bold text-black">
                  ${(order.totalAmount || order.total)?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div>
            <h3 className="text-lg font-bold text-black mb-4">Update Status</h3>
            <div className="space-y-4">
              {/* Current Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-black/60">Current Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statuses.find((s) => s.value === order.status)?.color ||
                    "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status?.charAt(0).toUpperCase() +
                    order.status?.slice(1)}
                </span>
              </div>

              {/* Status Selector */}
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>

              {/* Tracking Number Input */}
              {showTrackingInput && (
                <div>
                  <label className="block text-sm font-medium text-black/60 mb-2">
                    Tracking Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-black/60 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this order..."
                  rows={3}
                  className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
                />
              </div>

              {/* Update Button */}
              <button
                onClick={handleStatusUpdate}
                disabled={
                  isUpdating ||
                  (newStatus === order.status &&
                    trackingNumber === (order.trackingNumber || "") &&
                    adminNotes === (order.adminNotes || ""))
                }
                className="w-full px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </button>
            </div>
          </div>

          {/* Order Timeline (if dates exist) */}
          {(order.orderDate || order.shippedDate || order.deliveredDate) && (
            <div>
              <h3 className="text-lg font-bold text-black mb-4">
                Order Timeline
              </h3>
              <div className="bg-black/5 rounded-xl p-4 space-y-3">
                {order.orderDate && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-black">
                        Order Placed
                      </p>
                      <p className="text-xs text-black/50">
                        {new Date(order.orderDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {order.shippedDate && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-black">Shipped</p>
                      <p className="text-xs text-black/50">
                        {new Date(order.shippedDate).toLocaleString()}
                      </p>
                      {order.trackingNumber && (
                        <p className="text-xs text-black/70 mt-1">
                          Tracking: {order.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {order.deliveredDate && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-black">
                        Delivered
                      </p>
                      <p className="text-xs text-black/50">
                        {new Date(order.deliveredDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
