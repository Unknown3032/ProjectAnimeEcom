'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import Link from 'next/link';
import authService from '@/services/authService';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const formRef = useRef(null);
  const accentRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Check if already logged in
    if (authService.isAuthenticated()) {
      router.push('/admin/dashboard');
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        accentRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1,
          ease: 'power3.out'
        }
      );

      gsap.fromTo(
        formRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.3
        }
      );
    });

    return () => ctx.revert();
  }, [router]);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setLoading(true);

  try {
    const response = await authService.login({
      email: email.trim(),
      password: password
    });

    toast.success(response.message || 'Login successful!');

    // Sync cart will happen automatically via AuthContext
    // Wait a bit for sync to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    gsap.to(formRef.current, {
      opacity: 0,
      x: 20,
      duration: 0.5,
      ease: 'power3.in',
      onComplete: () => {
        
        router.push('/admin/dashboard');
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    toast.error(error.error || 'Login failed. Please try again.');
    
    // ... rest of error handling
  } finally {
    setLoading(false);
  }
};

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Side Accent */}
      <div className="hidden md:block w-2 bg-black origin-top" ref={accentRef} />

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-20">
        <div ref={formRef} className="w-full max-w-md">
          <div className="mb-20">
            <span className="text-xs tracking-[0.3em] uppercase text-black/30 block mb-4">
              Welcome Back
            </span>
            <h1 className="text-6xl md:text-7xl font-extralight">
              Sign In
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs tracking-widest uppercase text-black/40">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                disabled={loading}
                className={`w-full pb-3 bg-transparent border-b ${
                  errors.email 
                    ? 'border-red-500' 
                    : 'border-black/20'
                } text-lg font-light focus:border-black focus:outline-none transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs tracking-widest uppercase text-black/40">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-black/40 hover:text-black transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                disabled={loading}
                className={`w-full pb-3 bg-transparent border-b ${
                  errors.password 
                    ? 'border-red-500' 
                    : 'border-black/20'
                } text-lg font-light focus:border-black focus:outline-none transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-5 bg-black text-white text-sm tracking-[0.2em] uppercase transition-all relative overflow-hidden ${
                loading 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:bg-black/90'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg 
                    className="animate-spin h-5 w-5 mr-3" 
                    viewBox="0 0 24 24"
                  >
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
                  Signing In...
                </span>
              ) : (
                'Enter'
              )}
            </button>

            {/* Sign Up Link */}
            <div className="pt-4 text-sm text-center">
              <span className="text-black/40">New here? </span>
              <Link 
                href="/signup" 
                className="text-black underline hover:no-underline transition-all"
              >
                Create account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}