'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactForm() {
  const formRef = useRef(null);
  const fieldsRef = useRef([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        fieldsRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, formRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <div ref={formRef} className="bg-white py-20 lg:py-32">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left - Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Name */}
              <div 
                ref={(el) => (fieldsRef.current[0] = el)}
                className="relative"
              >
                <label
                  htmlFor="name"
                  className={`
                    absolute start-0 top-0 text-xs uppercase transition-all duration-300
                    ${focusedField === 'name' || formData.name ? 'text-black' : 'text-zinc-400'}
                  `}
                  style={{ letterSpacing: '0.15em' }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pt-8 pb-3 border-b-2 border-zinc-200 focus:border-black transition-colors duration-300 bg-transparent outline-none text-black"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  required
                />
              </div>

              {/* Email */}
              <div 
                ref={(el) => (fieldsRef.current[1] = el)}
                className="relative"
              >
                <label
                  htmlFor="email"
                  className={`
                    absolute start-0 top-0 text-xs uppercase transition-all duration-300
                    ${focusedField === 'email' || formData.email ? 'text-black' : 'text-zinc-400'}
                  `}
                  style={{ letterSpacing: '0.15em' }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pt-8 pb-3 border-b-2 border-zinc-200 focus:border-black transition-colors duration-300 bg-transparent outline-none text-black"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  required
                />
              </div>

              {/* Subject */}
              <div 
                ref={(el) => (fieldsRef.current[2] = el)}
                className="relative"
              >
                <label
                  htmlFor="subject"
                  className={`
                    absolute start-0 top-0 text-xs uppercase transition-all duration-300
                    ${focusedField === 'subject' || formData.subject ? 'text-black' : 'text-zinc-400'}
                  `}
                  style={{ letterSpacing: '0.15em' }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pt-8 pb-3 border-b-2 border-zinc-200 focus:border-black transition-colors duration-300 bg-transparent outline-none text-black"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  required
                />
              </div>

              {/* Message */}
              <div 
                ref={(el) => (fieldsRef.current[3] = el)}
                className="relative"
              >
                <label
                  htmlFor="message"
                  className={`
                    absolute start-0 top-0 text-xs uppercase transition-all duration-300
                    ${focusedField === 'message' || formData.message ? 'text-black' : 'text-zinc-400'}
                  `}
                  style={{ letterSpacing: '0.15em' }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  rows={5}
                  className="w-full pt-8 pb-3 border-b-2 border-zinc-200 focus:border-black transition-colors duration-300 bg-transparent outline-none resize-none text-black"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  required
                />
              </div>

              {/* Submit Button */}
              <div ref={(el) => (fieldsRef.current[4] = el)}>
                <button
                  type="submit"
                  className="group relative w-full sm:w-auto px-12 py-4 bg-black text-white overflow-hidden"
                >
                  <span
                    className="relative z-10 text-sm uppercase"
                    style={{ letterSpacing: '0.2em' }}
                  >
                    Send Message
                  </span>
                  <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <span
                    className="absolute inset-0 flex items-center justify-center text-sm uppercase text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ letterSpacing: '0.2em' }}
                  >
                    Send Message
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Right - Image with Animation */}
          <div className="relative hidden lg:block">
            <div className="sticky top-20">
              <div className="relative aspect-[4/5] overflow-hidden border border-black/10">
                <img
                  src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&h=1000&fit=crop&q=90"
                  alt="Contact"
                  className="size-full object-cover animate-float"
                />
                
                {/* Rotating Border */}
                <div className="absolute inset-0 border-2 border-black/5 animate-rotate" 
                  style={{ 
                    borderImage: 'linear-gradient(45deg, transparent, rgba(0,0,0,0.1), transparent) 1',
                  }}
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -start-4 w-24 h-24 border-t-2 border-l-2 border-black/20" />
              <div className="absolute -bottom-4 -end-4 w-24 h-24 border-b-2 border-r-2 border-black/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}