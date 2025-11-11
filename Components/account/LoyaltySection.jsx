'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const LoyaltySection = ({ user }) => {
  const containerRef = useRef(null);

  const pointsHistory = [
    { type: 'earned', amount: 250, description: 'Purchase Order #ORD-156', date: '2024-01-20' },
    { type: 'earned', amount: 160, description: 'Purchase Order #ORD-155', date: '2024-01-15' },
    { type: 'redeemed', amount: -100, description: 'Discount on Order #ORD-154', date: '2024-01-10' },
    { type: 'earned', amount: 90, description: 'Purchase Order #ORD-153', date: '2024-01-08' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const currentPoints = user?.loyaltyPoints || 3420;
  const nextTier = 5000;
  const progress = (currentPoints / nextTier) * 100;

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-black/5">
        <h2 className="text-2xl font-bold text-black mb-1">Loyalty Program</h2>
        <p className="text-sm text-black/50">Earn points with every purchase</p>
      </div>

      {/* Points Balance */}
      <div className="bg-gradient-to-br from-black to-black/80 rounded-2xl p-8 shadow-lg text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/60 text-sm mb-2">Your Points Balance</p>
            <p className="text-5xl font-bold">{currentPoints.toLocaleString()}</p>
          </div>
          <div className="text-6xl">⭐</div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/80">Progress to VIP Status</span>
            <span className="text-white font-medium">{currentPoints} / {nextTier}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <p className="text-white/60 text-xs">
          Earn {nextTier - currentPoints} more points to reach VIP status
        </p>
      </div>

      {/* How to Earn */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-black/5">
        <h3 className="text-lg font-bold text-black mb-6">How to Earn Points</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-black/5 rounded-xl">
            <div className="text-3xl mb-2">🛍️</div>
            <p className="font-bold text-black mb-1">1 Point = $1</p>
            <p className="text-xs text-black/50">On every purchase</p>
          </div>
          <div className="text-center p-4 bg-black/5 rounded-xl">
            <div className="text-3xl mb-2">⭐</div>
            <p className="font-bold text-black mb-1">100 Points</p>
            <p className="text-xs text-black/50">On product review</p>
          </div>
          <div className="text-center p-4 bg-black/5 rounded-xl">
            <div className="text-3xl mb-2">🎁</div>
            <p className="font-bold text-black mb-1">500 Points</p>
            <p className="text-xs text-black/50">Birthday bonus</p>
          </div>
        </div>
      </div>

      {/* Points History */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-black/5">
        <h3 className="text-lg font-bold text-black mb-6">Points History</h3>
        <div className="space-y-3">
          {pointsHistory.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-black/5 rounded-xl">
              <div>
                <p className="font-medium text-black text-sm">{item.description}</p>
                <p className="text-xs text-black/50">
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className={`text-right ${
                item.type === 'earned' ? 'text-black' : 'text-black/40'
              }`}>
                <p className="text-lg font-bold">
                  {item.type === 'earned' ? '+' : ''}{item.amount}
                </p>
                <p className="text-xs">{item.type === 'earned' ? 'Earned' : 'Redeemed'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoyaltySection;