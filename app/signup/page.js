'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import Link from 'next/link';
import authService from '@/services/authService';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const formRef = useRef(null);
  const accentRef = useRef(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Check if already logged in
    if (authService.isAuthenticated()) {
      router.push('/');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Phone is optional, but validate format if provided
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep1()) {
      // Shake animation on error
      gsap.fromTo(
        formRef.current,
        { x: -10 },
        {
          x: 10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: 'power1.inOut',
          onComplete: () => {
            gsap.set(formRef.current, { x: 0 });
          }
        }
      );
      return;
    }

    // Animate to next step
    gsap.to(formRef.current, {
      opacity: 0,
      x: -20,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setStep(2);
        gsap.fromTo(
          formRef.current,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            ease: 'power2.out'
          }
        );
      }
    });
  };

  const prevStep = () => {
    // Animate to previous step
    gsap.to(formRef.current, {
      opacity: 0,
      x: 20,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setStep(1);
        setErrors({});
        gsap.fromTo(
          formRef.current,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            ease: 'power2.out'
          }
        );
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      // Shake animation on error
      gsap.fromTo(
        formRef.current,
        { x: -10 },
        {
          x: 10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: 'power1.inOut',
          onComplete: () => {
            gsap.set(formRef.current, { x: 0 });
          }
        }
      );
      return;
    }

    setLoading(true);

    try {
      const response = await authService.signup({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password
      });

      toast.success(response.message || 'Account created successfully!');

      // Animate out before redirect
      gsap.to(formRef.current, {
        opacity: 0,
        x: 20,
        duration: 0.5,
        ease: 'power3.in',
        onComplete: () => {
          router.push('/signin');
        }
      });

    } catch (error) {
      console.error('Signup error:', error);

      const errorMessage = error.error || 'Signup failed. Please try again.';
      toast.error(errorMessage);

      // If error is related to email, go back to step 2
      if (errorMessage.toLowerCase().includes('email')) {
        setErrors({ email: errorMessage });
      }

      // Shake animation on error
      gsap.fromTo(
        formRef.current,
        { x: -10 },
        {
          x: 10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: 'power1.inOut',
          onComplete: () => {
            gsap.set(formRef.current, { x: 0 });
          }
        }
      );

    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'About You';
      case 2:
        return 'Security';
      default:
        return 'Sign Up';
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Side Accent */}
      <div className="hidden md:block w-2 bg-black origin-top" ref={accentRef} />

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-20 py-12">
        <div ref={formRef} className="w-full max-w-md">
          <div className="mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-black/30 block mb-4">
              Step {step} of 2
            </span>
            <h1 className="text-6xl md:text-7xl font-extralight">
              {getStepTitle()}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* STEP 1: Personal Information */}
            {step === 1 && (
              <>
                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-xs tracking-widest uppercase text-black/40">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full pb-3 bg-transparent border-b ${
                      errors.firstName ? 'border-red-500' : 'border-black/20'
                    } text-lg font-light focus:border-black focus:outline-none transition-colors ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="text-xs tracking-widest uppercase text-black/40">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full pb-3 bg-transparent border-b ${
                      errors.lastName ? 'border-red-500' : 'border-black/20'
                    } text-lg font-light focus:border-black focus:outline-none transition-colors ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                  )}
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={loading}
                  className={`w-full py-5 bg-black text-white text-sm tracking-[0.2em] uppercase transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/90'
                  }`}
                >
                  Next
                </button>
              </>
            )}

            {/* STEP 2: Account Security */}
            {step === 2 && (
              <>
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs tracking-widest uppercase text-black/40">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full pb-3 bg-transparent border-b ${
                      errors.email ? 'border-red-500' : 'border-black/20'
                    } text-lg font-light focus:border-black focus:outline-none transition-colors ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs tracking-widest uppercase text-black/40">
                    Phone <span className="text-black/20">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full pb-3 bg-transparent border-b ${
                      errors.phone ? 'border-red-500' : 'border-black/20'
                    } text-lg font-light focus:border-black focus:outline-none transition-colors ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-xs tracking-widest uppercase text-black/40">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full pb-3 bg-transparent border-b ${
                      errors.password ? 'border-red-500' : 'border-black/20'
                    } text-lg font-light focus:border-black focus:outline-none transition-colors ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-xs tracking-widest uppercase text-black/40">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full pb-3 bg-transparent border-b ${
                      errors.confirmPassword ? 'border-red-500' : 'border-black/20'
                    } text-lg font-light focus:border-black focus:outline-none transition-colors ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={loading}
                    className={`w-1/3 py-5 border border-black text-black text-sm tracking-[0.2em] uppercase transition-colors ${
                      loading 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-black hover:text-white'
                    }`}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-5 bg-black text-white text-sm tracking-[0.2em] uppercase transition-colors ${
                      loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black/90'
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
                        Creating...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Sign In Link */}
            <div className="pt-4 text-sm text-center">
              <span className="text-black/40">Already have an account? </span>
              <Link 
                href="/signin" 
                className="text-black underline hover:no-underline transition-all"
              >
                Sign in
              </Link>
            </div>
          </form>

          {/* Progress Indicator */}
          <div className="mt-12 flex justify-center gap-2">
            <div 
              className={`h-1 w-12 transition-colors ${
                step >= 1 ? 'bg-black' : 'bg-black/20'
              }`}
            />
            <div 
              className={`h-1 w-12 transition-colors ${
                step >= 2 ? 'bg-black' : 'bg-black/20'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}