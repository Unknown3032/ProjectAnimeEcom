"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const footerRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    // Footer entrance animation
    gsap.fromTo(
      ".footer-section",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    // Animated line
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: lineRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }
    );

    // Bottom bar animation
    gsap.fromTo(
      ".footer-bottom",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        delay: 0.5,
        scrollTrigger: {
          trigger: ".footer-bottom",
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      style={{
        background: "black",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Elements */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "-5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "-3%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          pointerEvents: "none",
        }}
      />

      {/* Main Footer Content */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "clamp(4rem, 10vw, 6rem) clamp(1.5rem, 5vw, 3rem) 0",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Top Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(3rem, 8vw, 4rem)",
            marginBottom: "clamp(3rem, 8vw, 5rem)",
          }}
        >
          {/* Brand Section */}
          <div className="footer-section">
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
              }}
            >
              <span
                style={{
                  color: "black",
                  fontSize: "2rem",
                  fontWeight: 700,
                }}
              >
                S
              </span>
            </div>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 1.7,
                fontSize: "0.95rem",
                maxWidth: "320px",
                marginBottom: "2rem",
              }}
            >
              Bringing the best of anime culture to fans worldwide. Quality
              products, authentic merchandise, global community.
            </p>

            {/* Social Links */}
            <div style={{ display: "flex", gap: "1rem" }}>
              {[
                { name: "Instagram", icon: "IG" },
                { name: "Twitter", icon: "X" },
                { name: "Discord", icon: "DC" },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  aria-label={social.name}
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    transition: "all 300ms ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "black";
                    e.currentTarget.style.borderColor = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.2)";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                marginBottom: "1.5rem",
                color: "rgba(255, 255, 255, 0.5)",
                fontWeight: 500,
              }}
            >
              Shop
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                "New Arrivals",
                "Best Sellers",
                "Collections",
                "Gift Cards",
                "Sale",
              ].map((item) => (
                <li key={item} style={{ marginBottom: "0.75rem" }}>
                  <Link
                    href="/products"
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      textDecoration: "none",
                      fontSize: "0.95rem",
                      transition: "all 300ms ease",
                      display: "inline-block",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.transform = "translateX(5px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="footer-section">
            <h3
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                marginBottom: "1.5rem",
                color: "rgba(255, 255, 255, 0.5)",
                fontWeight: 500,
              }}
            >
              Support
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                "Contact Us",
                "Shipping Info",
                "Returns",
                "FAQ",
                "Size Guide",
              ].map((item) => (
                <li key={item} style={{ marginBottom: "0.75rem" }}>
                  <Link
                    href="/contact"
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      textDecoration: "none",
                      fontSize: "0.95rem",
                      transition: "all 300ms ease",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.transform = "translateX(5px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h3
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                marginBottom: "1.5rem",
                color: "rgba(255, 255, 255, 0.5)",
                fontWeight: 500,
              }}
            >
              Newsletter
            </h3>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.95rem",
                marginBottom: "1.5rem",
                lineHeight: 1.6,
              }}
            >
              Get exclusive drops, deals, and anime news straight to your inbox.
            </p>
            <form
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email address"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                  padding: "0.875rem 1rem",
                  fontSize: "0.875rem",
                  outline: "none",
                  transition: "all 300ms ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.borderColor = "white";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor =
                    "rgba(255, 255, 255, 0.2)";
                }}
              />
              <button
                type="submit"
                style={{
                  background: "white",
                  color: "black",
                  border: "2px solid white",
                  padding: "0.875rem 1.5rem",
                  fontSize: "0.875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 300ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = "black";
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider Line */}
        <div
          ref={lineRef}
          style={{
            height: "1px",
            background: "rgba(255, 255, 255, 0.1)",
            transformOrigin: "left",
            marginBottom: "2rem",
          }}
        />

        {/* Bottom Section */}
        <div
          className="footer-bottom"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            paddingBottom: "2rem",
          }}
        >
          {/* Payment & Trust Badges */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.5rem",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: "1.5rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {["Visa", "Mastercard", "PayPal", "Apple Pay"].map((payment) => (
              <div
                key={payment}
                style={{
                  padding: "0.5rem 1rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  fontSize: "0.75rem",
                  color: "rgba(255, 255, 255, 0.5)",
                  letterSpacing: "0.05em",
                }}
              >
                {payment}
              </div>
            ))}
          </div>

          {/* Legal Links & Copyright */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "clamp(1rem, 3vw, 2rem)",
                justifyContent: "center",
              }}
            >
              {["Privacy Policy", "Terms of Service", "Cookies", "Accessibility"].map(
                (item, index, array) => (
                  <span key={item} style={{ display: "flex", alignItems: "center", gap: "clamp(1rem, 3vw, 2rem)" }}>
                    <Link
                      href="#"
                      style={{
                        color: "rgba(255, 255, 255, 0.5)",
                        textDecoration: "none",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        transition: "color 300ms ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)";
                      }}
                    >
                      {item}
                    </Link>
                    {index < array.length - 1 && (
                      <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>•</span>
                    )}
                  </span>
                )
              )}
            </div>

            <p
              style={{
                color: "rgba(255, 255, 255, 0.4)",
                fontSize: "0.75rem",
                margin: 0,
              }}
            >
              © {currentYear} Anime Store. All rights reserved. Made with ❤️ for otaku
            </p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "2rem",
          width: "50px",
          height: "50px",
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 300ms ease",
          zIndex: 2,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.color = "black";
          e.currentTarget.style.transform = "translateY(-5px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          e.currentTarget.style.color = "white";
          e.currentTarget.style.transform = "translateY(0)";
        }}
        aria-label="Back to top"
      >
        <svg
          style={{ width: "20px", height: "20px" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </footer>
  );
}