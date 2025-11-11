'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import CustomerDetailsModal from './CustomerDetailsModal';

const CustomersTable = () => {
  const tableRef = useRef(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  // Sample customers data
  const customers = [
    {
      id: 1,
      name: 'Sakura Tanaka',
      email: 'sakura.tanaka@email.com',
      phone: '+81 90-1234-5678',
      avatar: '👤',
      orders: 45,
      totalSpent: 3420.50,
      status: 'vip',
      lastOrder: '2024-01-20',
      joinedDate: '2023-03-15',
      location: 'Tokyo, Japan',
      loyaltyPoints: 3420
    },
    {
      id: 2,
      name: 'Yuki Nakamura',
      email: 'yuki.nakamura@email.com',
      phone: '+81 80-9876-5432',
      avatar: '👤',
      orders: 38,
      totalSpent: 2890.00,
      status: 'active',
      lastOrder: '2024-01-19',
      joinedDate: '2023-05-20',
      location: 'Osaka, Japan',
      loyaltyPoints: 2890
    },
    {
      id: 3,
      name: 'Hiro Yamamoto',
      email: 'hiro.yamamoto@email.com',
      phone: '+81 70-5555-1234',
      avatar: '👤',
      orders: 32,
      totalSpent: 2650.75,
      status: 'active',
      lastOrder: '2024-01-18',
      joinedDate: '2023-06-10',
      location: 'Kyoto, Japan',
      loyaltyPoints: 2650
    },
    {
      id: 4,
      name: 'Aiko Sato',
      email: 'aiko.sato@email.com',
      phone: '+81 90-7777-8888',
      avatar: '👤',
      orders: 28,
      totalSpent: 2340.25,
      status: 'active',
      lastOrder: '2024-01-15',
      joinedDate: '2023-07-22',
      location: 'Yokohama, Japan',
      loyaltyPoints: 2340
    },
    {
      id: 5,
      name: 'Kenji Takahashi',
      email: 'kenji.takahashi@email.com',
      phone: '+81 80-1111-2222',
      avatar: '👤',
      orders: 2,
      totalSpent: 189.99,
      status: 'new',
      lastOrder: '2024-01-22',
      joinedDate: '2024-01-10',
      location: 'Sapporo, Japan',
      loyaltyPoints: 190
    },
    {
      id: 6,
      name: 'Mei Yoshida',
      email: 'mei.yoshida@email.com',
      phone: '+81 70-3333-4444',
      avatar: '👤',
      orders: 15,
      totalSpent: 1250.00,
      status: 'active',
      lastOrder: '2024-01-10',
      joinedDate: '2023-09-05',
      location: 'Fukuoka, Japan',
      loyaltyPoints: 1250
    },
    {
      id: 7,
      name: 'Ryu Watanabe',
      email: 'ryu.watanabe@email.com',
      phone: '+81 90-6666-7777',
      avatar: '👤',
      orders: 8,
      totalSpent: 680.50,
      status: 'inactive',
      lastOrder: '2023-11-20',
      joinedDate: '2023-04-12',
      location: 'Nagoya, Japan',
      loyaltyPoints: 680
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      vip: { class: 'bg-black text-white', label: 'VIP' },
      active: { class: 'bg-black/80 text-white', label: 'Active' },
      new: { class: 'bg-black/60 text-white', label: 'New' },
      inactive: { class: 'bg-black/20 text-black/60', label: 'Inactive' },
    };
    return badges[status] || badges.active;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(tableRef.current.querySelectorAll('.customer-row'), {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.4,
      });
    }, tableRef);

    return () => ctx.revert();
  }, [currentPage]);

  const totalPages = Math.ceil(customers.length / customersPerPage);
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-black/5 overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-black/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-black">Customer Database</h2>
              <p className="text-sm text-black/50 mt-1">
                Showing {indexOfFirstCustomer + 1}-{Math.min(indexOfLastCustomer, customers.length)} of {customers.length} customers
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-black/5 rounded-lg text-sm font-medium text-black hover:bg-black/10 transition-colors inline-flex items-center gap-2">
                <span>📥</span>
                <span className="hidden sm:inline">Import</span>
              </button>
              <button className="px-4 py-2 bg-black/5 rounded-lg text-sm font-medium text-black hover:bg-black/10 transition-colors inline-flex items-center gap-2">
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
                  <input type="checkbox" className="w-4 h-4 rounded border-black/20 cursor-pointer" />
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
              {currentCustomers.map((customer) => {
                const badge = getStatusBadge(customer.status);
                return (
                  <tr
                    key={customer.id}
                    className="customer-row hover:bg-black/5 transition-colors duration-200 cursor-pointer"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-black/20 cursor-pointer" 
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-xl flex-shrink-0">
                          {customer.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-black">{customer.name}</p>
                          <p className="text-xs text-black/50">{customer.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-black">{customer.email}</p>
                        <p className="text-xs text-black/50">{customer.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-black">{customer.orders}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-black">${customer.totalSpent.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.class}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-black/60">
                      {new Date(customer.lastOrder).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCustomer(customer);
                          }}
                          className="text-sm font-medium text-black hover:underline"
                        >
                          View
                        </button>
                        <span className="text-black/20">|</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Email ${customer.name}`);
                          }}
                          className="text-sm font-medium text-black hover:underline"
                        >
                          Email
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
          {currentCustomers.map((customer) => {
            const badge = getStatusBadge(customer.status);
            return (
              <div
                key={customer.id}
                onClick={() => setSelectedCustomer(customer)}
                className="p-4 hover:bg-black/5 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center text-2xl flex-shrink-0">
                    {customer.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-black">{customer.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${badge.class}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-black/50">{customer.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center py-3 bg-black/5 rounded-lg">
                  <div>
                    <p className="text-xs text-black/50 mb-1">Orders</p>
                    <p className="text-sm font-bold text-black">{customer.orders}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 mb-1">Spent</p>
                    <p className="text-sm font-bold text-black">${customer.totalSpent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 mb-1">Points</p>
                    <p className="text-sm font-bold text-black">{customer.loyaltyPoints}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-black/5 flex items-center justify-between">
          <p className="text-sm text-black/60">
            Page {currentPage} of {totalPages}
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-black/10 text-sm font-medium text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
            >
              Previous
            </button>
            
            <div className="hidden sm:flex items-center gap-1">
              {[...Array(totalPages)].map((_, idx) => (
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-black/10 text-sm font-medium text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </>
  );
};

export default CustomersTable;