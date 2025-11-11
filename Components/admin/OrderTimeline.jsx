'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const OrderTimeline = ({ order }) => {
  const timelineRef = useRef(null);

  const timeline = [
    {
      status: 'Order Placed',
      date: '2024-01-15 10:30 AM',
      description: 'Order received and confirmed',
      completed: true,
      icon: '✓'
    },
    {
      status: 'Payment Confirmed',
      date: '2024-01-15 10:32 AM',
      description: 'Payment processed successfully',
      completed: true,
      icon: '✓'
    },
    {
      status: 'Processing',
      date: '2024-01-15 02:15 PM',
      description: 'Order is being prepared',
      completed: true,
      icon: '✓'
    },
    {
      status: 'Shipped',
      date: '2024-01-16 09:00 AM',
      description: 'Package handed to courier',
      completed: order.status === 'shipped' || order.status === 'delivered',
      icon: order.status === 'shipped' || order.status === 'delivered' ? '✓' : '⏳'
    },
    {
      status: 'Out for Delivery',
      date: order.status === 'delivered' ? '2024-01-17 08:00 AM' : 'Pending',
      description: 'Package is on the way',
      completed: order.status === 'delivered',
      icon: order.status === 'delivered' ? '✓' : '⏳'
    },
    {
      status: 'Delivered',
      date: order.status === 'delivered' ? '2024-01-17 02:30 PM' : 'Pending',
      description: 'Package delivered successfully',
      completed: order.status === 'delivered',
      icon: order.status === 'delivered' ? '✓' : '⏳'
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(timelineRef.current.children, {
        opacity: 0,
        x: -30,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }, timelineRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-black/5">
      <h3 className="text-lg font-bold text-black mb-6">Order Timeline</h3>
      
      <div ref={timelineRef} className="space-y-6">
        {timeline.map((item, index) => (
          <div key={index} className="relative flex gap-4">
            {/* Timeline Line */}
            {index !== timeline.length - 1 && (
              <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-black/10" />
            )}
            
            {/* Icon */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
              item.completed 
                ? 'bg-black text-white' 
                : 'bg-black/10 text-black/40'
            }`}>
              {item.icon}
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-2">
              <div className="flex items-start justify-between mb-1">
                <h4 className={`font-semibold text-sm ${
                  item.completed ? 'text-black' : 'text-black/40'
                }`}>
                  {item.status}
                </h4>
                <span className={`text-xs ${
                  item.completed ? 'text-black/60' : 'text-black/30'
                }`}>
                  {item.date}
                </span>
              </div>
              <p className={`text-xs ${
                item.completed ? 'text-black/50' : 'text-black/30'
              }`}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTimeline;