"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const headerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/productspage/all", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initial animation
  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Mobile menu animation
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";

      gsap.to(mobileMenuRef.current, {
        x: 0,
        duration: 0.4,
        ease: "power3.out",
      });

      gsap.fromTo(
        ".mobile-link",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.2,
          ease: "power2.out",
        }
      );
    } else {
      document.body.style.overflow = "";

      if (mobileMenuRef.current) {
        gsap.to(mobileMenuRef.current, {
          x: "-100%",
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-10 sm:top-12 left-0 right-0 z-40"
      >
        <div
          className={`bg-white transition-all duration-300 ${
            isScrolled
              ? "shadow-md border-b border-black/10"
              : "border-b border-black/10"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 sm:gap-3 group z-50"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black flex items-center justify-center group-hover:bg-white group-hover:border-2 group-hover:border-black transition-all duration-300">
                  <span className="text-white text-lg sm:text-xl font-bold group-hover:text-black transition-colors">
                    S
                  </span>
                </div>
                <span className="text-lg sm:text-xl font-light tracking-tight hidden xs:block">
                  STORE
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs lg:text-sm uppercase tracking-wider transition-all duration-300 relative group ${
                      pathname === link.href
                        ? "text-black font-medium"
                        : "text-black/60 hover:text-black"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute left-0 -bottom-1 h-0.5 bg-black transition-all duration-300 ${
                        pathname === link.href
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                ))}
              </nav>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-3 lg:gap-4">
                <button
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                  aria-label="Search"
                >
                  <svg
                    className="w-4 h-4 lg:w-5 lg:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
                <Link
                href={'/cart'}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors relative"
                  aria-label="Shopping cart"
                >
                  <svg
                    className="w-4 h-4 lg:w-5 lg:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-black text-white text-[10px] lg:text-xs flex items-center justify-center rounded-full font-medium">
                    0
                  </span>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-black/5 rounded transition-colors z-50"
                aria-label="Toggle menu"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center items-center gap-1">
                  <span
                    className={`block w-full h-0.5 bg-black transition-all duration-300 ${
                      isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                  />
                  <span
                    className={`block w-full h-0.5 bg-black transition-all duration-300 ${
                      isMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`block w-full h-0.5 bg-black transition-all duration-300 ${
                      isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="fixed top-0 left-0 w-full h-full bg-white z-30 md:hidden"
        style={{ transform: "translateX(-100%)" }}
      >
        <div className="pt-28 sm:pt-32 px-6 h-full overflow-y-auto">
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`mobile-link block text-2xl sm:text-3xl font-light py-3 sm:py-4 border-b border-black/10 transition-colors ${
                  pathname === link.href ? "text-black" : "text-black/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mobile-link mt-8 space-y-3 sm:space-y-4">
            <button className="w-full py-3 sm:py-4 border-2 border-black text-black uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-all duration-300">
              Search Products
            </button>
            <button className="w-full py-3 sm:py-4 bg-black text-white uppercase tracking-wider text-sm hover:bg-white hover:text-black border-2 border-black transition-all duration-300">
              View Cart (0)
            </button>
          </div>

          {/* Mobile Social */}
          <div className="mobile-link mt-12 pt-8 border-t border-black/10">
            <div className="flex justify-center gap-6">
              {["Instagram", "Twitter", "Facebook"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-xs uppercase tracking-wider text-black/40 hover:text-black transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}