'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function LoginForm() {
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const inputRefs = useRef([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.2
        }
      );

      // Form elements stagger
      gsap.fromTo(
        inputRefs.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.4
        }
      );
    }, formRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
  };

  const InputField = ({ label, type, value, onChange, placeholder, index }) => {
    const inputRef = useRef(null);
    const labelRef = useRef(null);
    const lineRef = useRef(null);

    const handleFocus = () => {
      gsap.to(lineRef.current, {
        scaleX: 1,
        duration: 0.3,
        ease: 'power2.out'
      });

      gsap.to(labelRef.current, {
        y: -2,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleBlur = () => {
      if (!value) {
        gsap.to(lineRef.current, {
          scaleX: 0,
          duration: 0.3,
          ease: 'power2.out'
        });

        gsap.to(labelRef.current, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    return (
      <div 
        ref={(el) => (inputRefs.current[index] = el)}
        className="relative"
      >
        <label 
          ref={labelRef}
          className="block text-xs tracking-[0.15em] uppercase mb-3 text-black/50 font-medium"
        >
          {label}
        </label>
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full px-0 py-3 bg-transparent border-b border-black/10 focus:border-black/30 outline-none transition-colors text-base font-light placeholder:text-black/20"
        />
        <div 
          ref={lineRef}
          className="absolute bottom-0 left-0 h-px bg-black w-full origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    );
  };

  return (
    <div ref={formRef}>
      {/* Mobile Logo */}
      <div className="lg:hidden mb-12">
        <h1 className="text-3xl font-extralight tracking-tight">
          Anime Store
        </h1>
      </div>

      {/* Title */}
      <div ref={titleRef} className="mb-12">
        <h2 className="text-4xl sm:text-5xl font-extralight tracking-tight mb-4">
          Welcome Back
        </h2>
        <p className="text-base font-light text-black/60">
          Sign in to continue to your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <InputField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          index={0}
        />

        <div className="relative">
          <InputField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            index={1}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-9 text-black/40 hover:text-black transition-colors"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Remember & Forgot */}
        <div 
          ref={(el) => (inputRefs.current[2] = el)}
          className="flex items-center justify-between text-sm"
        >
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              className="w-4 h-4 accent-black"
            />
            <span className="font-light text-black/60 group-hover:text-black transition-colors">
              Remember me
            </span>
          </label>
          <a 
            href="/forgot-password" 
            className="font-medium tracking-wider uppercase text-xs hover:underline transition-all"
          >
            Forgot Password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          ref={(el) => (inputRefs.current[3] = el)}
          type="submit"
          disabled={isLoading}
          className="group relative w-full py-4 bg-black text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 text-sm font-medium tracking-[0.15em] uppercase flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <svg 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </button>

        {/* Divider */}
        <div 
          ref={(el) => (inputRefs.current[4] = el)}
          className="relative"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-white text-black/40 tracking-wider uppercase">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Login */}
        <div 
          ref={(el) => (inputRefs.current[5] = el)}
          className="grid grid-cols-2 gap-4"
        >
          <button
            type="button"
            className="py-3 border border-black/10 hover:border-black/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            className="py-3 border border-black/10 hover:border-black/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        {/* Sign Up Link */}
        <div 
          ref={(el) => (inputRefs.current[6] = el)}
          className="text-center text-sm"
        >
          <span className="text-black/60 font-light">Don't have an account? </span>
          <a 
            href="/signup" 
            className="font-medium tracking-wider uppercase hover:underline transition-all"
          >
            Sign Up
          </a>
        </div>
      </form>
    </div>
  );
}