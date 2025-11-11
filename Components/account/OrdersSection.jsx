'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const OrdersSection = () => {
  const containerRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const orders = [
    {
      id: 'ORD-2024-0156',
      date: '2024-01-20',
      items: 3,
      total: 245.99,
      status: 'delivered',
      products: [
        { name: 'Naruto Figure Set', image: '🎁', quantity: 2 },
        { name: 'Attack on Titan Poster', image: '🖼️', quantity: 1 },
      ]
    },
    {
      id: 'ORD-2024-0155',
      date: '2024-01-15',
      items: 2,
      total: 159.98,
      status: 'shipped',
      products: [
        { name: 'Demon Slayer Keychain', image: '🔑', quantity: 2 },
      ]
    },
    {
      id: 'ORD-2024-0154',
      date: '2024-01-10',
      items: 1,
      total: 89.99,
      status: 'processing',
      products: [
        { name: 'One Piece Mug', image: '☕', quantity: 1 },
      ]
    },
  ];

  const filters = [
    { id: 'all', label: 'All', count: orders.length },
    { id: 'delivered', label: 'Delivered', count: 1 },
    { id: 'shipped', label: 'Shipped', count: 1 },
    { id: 'processing', label: 'Processing', count: 1 },
  ];

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'bg-black text-white',
      shipped: 'bg-black/80 text-white',
      processing: 'bg-black/60 text-white',
      pending: 'bg-black/30 text-black',
      cancelled: 'bg-black/10 text-black/40',
    };
    return colors[status];
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current?.children || [], {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activeFilter]);

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeFilter);

  return (
    <div ref={containerRef} className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Orders</h1>
        <p className="text-black/50">Track and manage your orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 inline-flex items-center gap-2 ${
              activeFilter === filter.id
                ? 'bg-black text-white'
                : 'bg-white border border-black/10 text-black/60 hover:border-black/30 hover:text-black'
            }`}
          >
            <span>{filter.label}</span>
            <span className={`min-w-[20px] h-5 px-2 flex items-center justify-center rounded-full text-xs font-bold ${
              activeFilter === filter.id
                ? 'bg-white/20 text-white'
                : 'bg-black/5 text-black/40'
            }`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white border border-black/10 rounded-2xl overflow-hidden hover:border-black/30 transition-all duration-300 group">
            {/* Order Header */}
            <div className="p-6 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-black">{order.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-black/50">
                  {new Date(order.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })} • {order.items} items
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-black">${order.total.toFixed(2)}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="px-6 pb-6 space-y-3">
              {order.products.map((product, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-black/5 rounded-xl">
                  <div className="w-14 h-14 rounded-lg bg-white border border-black/10 flex items-center justify-center text-2xl flex-shrink-0">
                    {product.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-black truncate">{product.name}</p>
                    <p className="text-sm text-black/50">Qty: {product.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-black/5 border-t border-black/10 flex gap-3">
              <button className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all">
                View Details
              </button>
              {order.status === 'delivered' && (
                <button className="flex-1 px-6 py-3 bg-white border border-black/10 text-black rounded-xl font-medium hover:bg-black/5 transition-all">
                  Buy Again
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white border border-black/10 rounded-2xl p-16 text-center">
          <div className="text-7xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-black mb-2">No Orders Found</h3>
          <p className="text-black/50 mb-6">Start shopping to see your orders here</p>
          <button className="px-8 py-4 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all">
            Browse Products
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersSection;