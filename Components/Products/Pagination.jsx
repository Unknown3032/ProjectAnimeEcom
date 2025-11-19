'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const paginationRef = useRef(null);

  useEffect(() => {
    if (paginationRef.current) {
      gsap.fromTo(
        paginationRef.current.children,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: 'expo.out',
        }
      );
    }
  }, [currentPage]);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="py-20">
      {/* Decorative top line */}
      <div className="mb-16 flex items-center justify-center">
        <div className="h-px bg-black w-full max-w-md"></div>
      </div>

      <div 
        ref={paginationRef}
        className="flex items-center justify-center gap-3 flex-wrap px-4"
      >
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`group relative w-12 h-12 flex items-center justify-center transition-all duration-500 ${
            currentPage === 1
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:-translate-x-1'
          }`}
        >
          <div className={`absolute inset-0 border border-black transition-all duration-500 ${
            currentPage === 1 ? '' : 'group-hover:bg-black'
          }`}></div>
          <svg 
            className={`w-4 h-4 relative z-10 transition-colors duration-500 ${
              currentPage === 1 ? 'text-black' : 'text-black group-hover:text-white'
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-2">
          {pageNumbers.map((page, index) => (
            page === '...' ? (
              <span 
                key={`ellipsis-${index}`}
                className="w-10 h-12 flex items-center justify-center text-black font-light text-lg"
              >
                ···
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`group relative w-12 h-12 flex items-center justify-center transition-all duration-500 ${
                  currentPage === page
                    ? ''
                    : 'hover:scale-105'
                }`}
              >
                {/* Background */}
                <div className={`absolute inset-0 border border-black transition-all duration-500 ${
                  currentPage === page
                    ? 'bg-black'
                    : 'bg-white group-hover:bg-black'
                }`}></div>
                
                {/* Number */}
                <span className={`relative z-10 font-medium transition-colors duration-500 ${
                  currentPage === page
                    ? 'text-white'
                    : 'text-black group-hover:text-white'
                }`}>
                  {page}
                </span>
              </button>
            )
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`group relative w-12 h-12 flex items-center justify-center transition-all duration-500 ${
            currentPage === totalPages
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:translate-x-1'
          }`}
        >
          <div className={`absolute inset-0 border border-black transition-all duration-500 ${
            currentPage === totalPages ? '' : 'group-hover:bg-black'
          }`}></div>
          <svg 
            className={`w-4 h-4 relative z-10 transition-colors duration-500 ${
              currentPage === totalPages ? 'text-black' : 'text-black group-hover:text-white'
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Page Info */}
      <div className="mt-16 text-center">
        <p className="text-xs tracking-[0.3em] text-gray-500 font-medium">
          {currentPage} / {totalPages}
        </p>
      </div>

      {/* Decorative bottom line */}
      <div className="mt-16 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <div className="h-px bg-black w-20"></div>
          <div className="w-1 h-1 bg-black rotate-45"></div>
          <div className="h-px bg-black w-20"></div>
        </div>
      </div>
    </div>
  );
}