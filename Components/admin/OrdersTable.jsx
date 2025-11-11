'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import OrderDetailsModal from './OrderDetailsModal';

const OrdersTable = () => {
  const tableRef = useRef(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Sample orders data
  const orders = [
    {
      id: 'ORD-2024-0156',
      customer: {
        name: 'Sakura Tanaka',
        email: 'sakura@email.com',
        avatar: '👤'
      },
      items: [
        { name: 'Naruto Figure Set', quantity: 2, image: '🎁' },
        { name: 'Attack on Titan Poster', quantity: 1, image: '🎁' }
      ],
      total: 245.99,
      status: 'delivered',
      date: '2024-01-15',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'ORD-2024-0155',
      customer: {
        name: 'Yuki Nakamura',
        email: 'yuki@email.com',
        avatar: '👤'
      },
      items: [
        { name: 'Demon Slayer Keychain', quantity: 3, image: '🎁' }
      ],
      total: 89.97,
      status: 'shipped',
      date: '2024-01-15',
      paymentMethod: 'PayPal'
    },
    {
      id: 'ORD-2024-0154',
      customer: {
        name: 'Hiro Yamamoto',
        email: 'hiro@email.com',
        avatar: '👤'
      },
      items: [
        { name: 'One Piece Mug', quantity: 1, image: '🎁' }
      ],
      total: 34.99,
      status: 'processing',
      date: '2024-01-14',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'ORD-2024-0153',
      customer: {
        name: 'Aiko Sato',
        email: 'aiko@email.com',
        avatar: '👤'
      },
      items: [
        { name: 'My Hero Academia T-Shirt', quantity: 2, image: '🎁' }
      ],
      total: 59.98,
      status: 'pending',
      date: '2024-01-14',
      paymentMethod: 'Debit Card'
    },
    {
      id: 'ORD-2024-0152',
      customer: {
        name: 'Kenji Takahashi',
        email: 'kenji@email.com',
        avatar: '👤'
      },
      items: [
        { name: 'Dragon Ball Z Figure', quantity: 1, image: '🎁' }
      ],
      total: 129.99,
      status: 'cancelled',
      date: '2024-01-13',
      paymentMethod: 'Credit Card'
    },
  ];

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(tableRef.current.querySelectorAll('.order-row'), {
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

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-black/5 overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-black/5">
          <h2 className="text-xl font-bold text-black">Recent Orders</h2>
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
              {currentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="order-row hover:bg-black/5 transition-colors duration-200 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-black">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-xl">
                        {order.customer.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">{order.customer.name}</p>
                        <p className="text-xs text-black/50">{order.customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center border-2 border-white"
                          >
                            <span className="text-sm">{item.image}</span>
                          </div>
                        ))}
                      </div>
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
                    {new Date(order.date).toLocaleDateString('en-US', {
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
          {currentOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="p-4 hover:bg-black/5 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-black mb-1">{order.id}</p>
                  <p className="text-xs text-black/50">{order.customer.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center border-2 border-white"
                      >
                        <span className="text-sm">{item.image}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-black/60">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-bold text-black">${order.total.toFixed(2)}</p>
                  <p className="text-xs text-black/50">
                    {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-black/5 flex items-center justify-between">
          <p className="text-sm text-black/60">
            Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, orders.length)} of {orders.length} orders
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
};

export default OrdersTable;