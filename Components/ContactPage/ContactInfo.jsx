'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactInfo() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const contactDetails = [
    {
      icon: (
        <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
      title: 'Email',
      detail: 'support@animegifts.com',
      link: 'mailto:support@animegifts.com',
    },
    {
      icon: (
        <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      ),
      title: 'Phone',
      detail: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: (
        <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
      title: 'Address',
      detail: '123 Anime Street, Tokyo, Japan',
      link: null,
    },
    {
      icon: (
        <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Working Hours',
      detail: 'Mon - Fri: 9:00 AM - 6:00 PM',
      link: null,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { 
            y: 60,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="bg-zinc-50 py-20 lg:py-32">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-16">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl text-black mb-4"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: '400',
              letterSpacing: '-0.01em',
            }}
          >
            Contact Information
          </h2>
          <p
            className="text-sm text-zinc-600 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300' }}
          >
            Multiple ways to reach us
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {contactDetails.map((item, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group bg-white p-8 border border-black/10 hover:border-black transition-all duration-300 hover:shadow-lg"
            >
              <div className="mb-6 text-black group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>

              <h3
                className="text-sm uppercase mb-3 text-zinc-500"
                style={{ letterSpacing: '0.15em' }}
              >
                {item.title}
              </h3>

              {item.link ? (
                <a
                  href={item.link}
                  className="text-base text-black hover:underline"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: '400' }}
                >
                  {item.detail}
                </a>
              ) : (
                <p
                  className="text-base text-black"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: '400' }}
                >
                  {item.detail}
                </p>
              )}

              {/* Animated Line */}
              <div className="mt-6 h-px bg-black/10 group-hover:bg-black transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* Social Media */}
        <div className="mt-20 text-center">
          <h3
            className="text-sm uppercase mb-8 text-zinc-500"
            style={{ letterSpacing: '0.2em' }}
          >
            Follow Us
          </h3>

          <div className="flex justify-center gap-6">
            {[
              { name: 'Twitter', icon: 'M' },
              { name: 'Instagram', icon: 'I' },
              { name: 'Facebook', icon: 'F' },
              { name: 'LinkedIn', icon: 'L' },
            ].map((social, index) => (
              <button
                key={index}
                className="group size-12 border border-black/20 hover:border-black hover:bg-black transition-all duration-300 flex items-center justify-center"
              >
                <span className="text-sm font-medium text-black group-hover:text-white transition-colors duration-300">
                  {social.icon}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}