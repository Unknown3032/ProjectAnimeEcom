// components/ReviewSection.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ReviewSection = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const reviewsRef = useRef([]);
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    {
      id: 1,
      name: "Akira Tanaka",
      location: "Tokyo, Japan",
      rating: 5,
      date: "2 days ago",
      product: "Demon Slayer Figure",
      review: "Absolutely stunning quality! The attention to detail is incredible. Every aspect of the figure is perfectly crafted. Worth every penny for any serious collector.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format&q=80",
      verified: true
    },
    {
      id: 2,
      name: "Sarah Chen",
      location: "Singapore",
      rating: 5,
      date: "1 week ago",
      product: "Attack on Titan Hoodie",
      review: "The hoodie exceeded my expectations! Super comfortable material and the design is exactly as shown. Fast shipping and excellent packaging.",
      avatar: "https://i.pinimg.com/736x/a8/5c/26/a85c262c7bdf615d480e013477beacd4.jpg",
      verified: true
    },
    {
      id: 3,
      name: "Raj Patel",
      location: "Mumbai, India",
      rating: 5,
      date: "3 days ago",
      product: "Naruto Art Collection",
      review: "Museum quality prints! The colors are vibrant and the paper quality is premium. Perfect for decorating my anime room. Highly recommended!",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format&q=80",
      verified: true
    },
    {
      id: 4,
      name: "Emma Wilson",
      location: "London, UK",
      rating: 4,
      date: "5 days ago",
      product: "One Piece Keychain",
      review: "Great quality keychain with beautiful detailing. Shipping took a bit longer than expected but the product quality makes up for it. Will order again!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&auto=format&q=80",
      verified: true
    },
    {
      id: 5,
      name: "Kenji Nakamura",
      location: "Osaka, Japan",
      rating: 5,
      date: "1 week ago",
      product: "Studio Ghibli Collection",
      review: "As a long-time Ghibli fan, this collection is absolutely perfect. The craftsmanship and authenticity are top-notch. Customer service was also excellent.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face&auto=format&q=80",
      verified: true
    }
  ];

  useEffect(() => {
    // Scroll animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(headerRef.current, {
      y: 30,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    })
    .fromTo(reviewsRef.current, {
      y: 50,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.4");

    // Auto-rotate reviews
    const interval = setInterval(() => {
      setCurrentReview(prev => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleReviewChange = (index) => {
    setCurrentReview(index);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-neutral-50 font-sans"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div 
          ref={headerRef}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-light text-black mb-4 tracking-tight">
            Customer Reviews
          </h2>
          <p className="text-neutral-600 font-light text-base max-w-xl mx-auto leading-relaxed">
            See what our community of anime enthusiasts has to say about their experience
          </p>
        </div>

        {/* Featured Review */}
        <div className="mb-20">
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm">
            <div className="max-w-3xl mx-auto">
              {/* Review Content */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  {renderStars(reviews[currentReview].rating)}
                </div>
                <blockquote className="text-lg md:text-xl font-light text-black leading-relaxed mb-8 italic">
                  "{reviews[currentReview].review}"
                </blockquote>
                <div className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
                  {reviews[currentReview].product}
                </div>
              </div>

              {/* Reviewer Info */}
              <div className="flex items-center justify-center gap-4">
                <img
                  src={reviews[currentReview].avatar}
                  alt={reviews[currentReview].name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <h4 className="font-medium text-black text-sm">
                      {reviews[currentReview].name}
                    </h4>
                    {reviews[currentReview].verified && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 font-light">
                    {reviews[currentReview].location} • {reviews[currentReview].date}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Review Navigation */}
          <div className="flex justify-center mt-8 gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => handleReviewChange(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentReview ? 'bg-black w-8' : 'bg-neutral-300 w-1'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {reviews.slice(0, 3).map((review, index) => (
            <div
              key={review.id}
              ref={el => reviewsRef.current[index] = el}
              className="bg-white p-6 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="font-medium text-black text-sm">
                      {review.name}
                    </h4>
                    {review.verified && (
                      <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 font-light">{review.date}</p>
                </div>
              </div>

              <div className="flex mb-3">
                {renderStars(review.rating)}
              </div>

              <p className="text-sm text-neutral-600 font-light leading-relaxed mb-4">
                {review.review.length > 100 ? `${review.review.substring(0, 100)}...` : review.review}
              </p>

              <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                {review.product}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-light text-black mb-2">4.9</div>
            <div className="text-sm text-neutral-500 font-light">Average Rating</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-light text-black mb-2">2.5K+</div>
            <div className="text-sm text-neutral-500 font-light">Happy Customers</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-light text-black mb-2">98%</div>
            <div className="text-sm text-neutral-500 font-light">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-light text-black mb-2">24h</div>
            <div className="text-sm text-neutral-500 font-light">Support Response</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;