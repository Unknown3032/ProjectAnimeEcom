'use client';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const { isAuthenticated } = useAuth();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-4xl font-extralight mb-4">Your cart is empty</h2>
          <Link 
            href="/productspage/all" 
            className="inline-block px-8 py-3 bg-black text-white text-sm tracking-widest uppercase hover:bg-black/90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6 md:px-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-extralight mb-12">Shopping Cart</h1>

        <div className="space-y-6">
          {cart.map((item) => (
            <div 
              key={item.product._id} 
              className="flex items-center gap-6 border-b border-black/10 pb-6"
            >
              <div className="flex-1">
                <h3 className="text-xl font-light">{item.product.name}</h3>
                <p className="text-black/60 text-sm mt-1">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                  className="w-8 h-8 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                  −
                </button>
                <span className="w-12 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  className="w-8 h-8 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                  +
                </button>
              </div>

              <div className="w-24 text-right font-light">
                ${(item.price * item.quantity).toFixed(2)}
              </div>

              <button
                onClick={() => removeFromCart(item.product._id)}
                className="text-sm text-black/40 hover:text-red-500 transition-colors uppercase tracking-wider"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-black/10 pt-6">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-light">Total</span>
            <span className="text-3xl font-light">${getCartTotal().toFixed(2)}</span>
          </div>

          <button className="w-full py-5 bg-black text-white text-sm tracking-widest uppercase hover:bg-black/90 transition-colors">
            {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}