"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;

    if (isFirstRender.current) {
      // Initial page load animation
      gsap.set(overlay, { scaleY: 1, transformOrigin: "top" });
      gsap.set(content, { opacity: 0, y: 20 });

      const tl = gsap.timeline();
      tl.to(overlay, {
        scaleY: 0,
        duration: 0.8,
        ease: "power4.inOut",
        transformOrigin: "bottom",
      }).to(
        content,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.3"
      );

      isFirstRender.current = false;
    } else {
      // Route change animation
      const tl = gsap.timeline();

      // Fade out current content
      tl.to(content, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in",
      })
        // Slide overlay down
        .to(overlay, {
          scaleY: 1,
          duration: 0.5,
          ease: "power4.inOut",
          transformOrigin: "top",
        })
        // Slide overlay up
        .to(overlay, {
          scaleY: 0,
          duration: 0.5,
          ease: "power4.inOut",
          transformOrigin: "bottom",
        })
        // Fade in new content
        .to(
          content,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.3"
        );

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [pathname]);

  return (
    <>
      <div ref={overlayRef} className="page-transition-overlay" />
      <div ref={contentRef}>{children}</div>
    </>
  );
}