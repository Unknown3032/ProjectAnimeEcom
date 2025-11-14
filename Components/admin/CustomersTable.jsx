"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import CustomerDetailsModal from "./CustomerDetailsModal";
import { customerAPI } from "@/lib/apiClient";

const CustomersTable = ({ filters, sortBy, searchQuery, dateRange }) => {
  const tableRef = useRef(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const customersPerPage = 10;

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, filters, sortBy, searchQuery, dateRange]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: customersPerPage,
        segment: filters,
        sortBy: sortBy,
        search: searchQuery,
        dateRange: dateRange,
      };

      const response = await customerAPI.getAll(params);
      setCustomers(response.customers);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      alert("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(customers.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      await customerAPI.delete(id);
      alert("Customer deleted successfully");
      fetchCustomers();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete customer");
    }
  };

const handleViewDetails = async (customer) => {
  try {
     console.log('=== VIEWING CUSTOMER DETAILS ===');
    console.log('Full customer object:', customer);
    console.log('customer.id:', customer.id);
    console.log('customer._id:', customer._id);
    console.log('typeof customer.id:', typeof customer.id);
    console.log('customer.id length:', customer.id?.length);
    
    // Use the ID that exists
    const customerId = customer.id || customer._id;
    
    if (!customerId) {
      console.error('❌ No customer ID found');
      alert('Unable to fetch customer details - no ID found');
      return;
    }
    
    console.log('📡 Fetching customer with ID:', customerId);
    const response = await customerAPI.getById(customerId);
    console.log('✅ Customer data received:', response);
    setSelectedCustomer(response.customer);
  } catch (error) {
    console.error('❌ Failed to fetch customer details:', error);
    alert(`Failed to load customer details: ${error.error || error.message}`);
  }
};

  const getStatusBadge = (status) => {
    const badges = {
      vip: { class: "bg-black text-white", label: "VIP" },
      active: { class: "bg-black/80 text-white", label: "Active" },
      new: { class: "bg-black/60 text-white", label: "New" },
      inactive: { class: "bg-black/20 text-black/60", label: "Inactive" },
    };
    return badges[status] || badges.active;
  };

  useEffect(() => {
    if (customers.length > 0 && tableRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(tableRef.current.querySelectorAll(".customer-row"), {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
        });
      }, tableRef);

      return () => ctx.revert();
    }
  }, [customers]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-black/5 p-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-black/40">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-black/5 overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-black/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-black">
                Customer Database
              </h2>
              <p className="text-sm text-black/50 mt-1">
                Showing{" "}
                {pagination
                  ? `${(pagination.page - 1) * pagination.limit + 1}-${Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )} of ${pagination.total}`
                  : "0"}{" "}
                customers
              </p>
            </div>

            <div className="flex items-center gap-3">
              {selectedIds.length > 0 && (
                <span className="text-sm text-black/60">
                  {selectedIds.length} selected
                </span>
              )}
              <button
                onClick={async () => {
                  try {
                    const blob = await customerAPI.export("csv");
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `customers-${Date.now()}.csv`;
                    a.click();
                  } catch (error) {
                    alert("Failed to export customers");
                  }
                }}
                className="px-4 py-2 bg-black/5 rounded-lg text-sm font-medium text-black hover:bg-black/10 transition-colors inline-flex items-center gap-2"
              >
                <span>📤</span>
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table ref={tableRef} className="w-full">
            <thead className="bg-black/5">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-black/20 cursor-pointer"
                    checked={
                      selectedIds.length === customers.length &&
                      customers.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {customers.map((customer) => {
                const badge = getStatusBadge(customer.status);
                const isSelected = selectedIds.includes(customer.id);

                return (
                  <tr
                    key={customer.id}
                    className="customer-row hover:bg-black/5 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleViewDetails(customer)}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectOne(customer.id);
                        }}
                        checked={isSelected}
                        onChange={() => {}} // Controlled by onClick
                        className="w-4 h-4 rounded border-black/20 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-xl flex-shrink-0">
                        <img className="w-full h-full rounded-full" src={customer.avatar} alt="" />
                         
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-black">
                            {customer.name}
                          </p>
                          <p className="text-xs text-black/50">
                            {customer.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-black">{customer.email}</p>
                        <p className="text-xs text-black/50">
                          {customer.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-black">
                        {customer.orders}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-black">
                        ${customer.totalSpent.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${badge.class}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-black/60">
                      {customer.lastOrder
                        ? new Date(customer.lastOrder).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "No orders"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(customer);
                          }}
                          className="text-sm font-medium text-black hover:underline"
                        >
                          View
                        </button>
                        <span className="text-black/20">|</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(customer.id);
                          }}
                          className="text-sm font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-black/5">
          {customers.map((customer) => {
            const badge = getStatusBadge(customer.status);
            const isSelected = selectedIds.includes(customer.id);

            return (
              <div
                key={customer.id}
                onClick={() => handleViewDetails(customer)}
                className="p-4 hover:bg-black/5 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-3 mb-3">
                  <input
                    type="checkbox"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectOne(customer.id);
                    }}
                    checked={isSelected}
                    onChange={() => {}} // Controlled by onClick
                    className="mt-1"
                  />
                  <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center text-2xl flex-shrink-0">
                    <img className="w-3 h-3 rounded-full" src={customer.avatar} alt="" />
                    
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-black">
                        {customer.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${badge.class}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-black/50">{customer.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center py-3 bg-black/5 rounded-lg">
                  <div>
                    <p className="text-xs text-black/50 mb-1">Orders</p>
                    <p className="text-sm font-bold text-black">
                      {customer.orders}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 mb-1">Spent</p>
                    <p className="text-sm font-bold text-black">
                      ${customer.totalSpent.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 mb-1">Points</p>
                    <p className="text-sm font-bold text-black">
                      {customer.loyaltyPoints}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="px-6 py-4 border-t border-black/5 flex items-center justify-between">
            <p className="text-sm text-black/60">
              Page {pagination.page} of {pagination.pages}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-lg border border-black/10 text-sm font-medium text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
              >
                Previous
              </button>

              <div className="hidden sm:flex items-center gap-1">
                {[...Array(pagination.pages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      pagination.page === idx + 1
                        ? "bg-black text-white"
                        : "text-black hover:bg-black/5"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, pagination.pages))
                }
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 rounded-lg border border-black/10 text-sm font-medium text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onUpdate={fetchCustomers}
        />
      )}
    </>
  );
};

export default CustomersTable;
