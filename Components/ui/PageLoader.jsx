"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PageLoader() {
  const loaderRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    gsap.to(progressRef.current, {
      width: "100%",
      duration: 2,
      ease: "power2.inOut",
    });
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 bg-white z-[9999] flex items-center justify-center"
    >
      <div className="w-64 space-y-4">
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 bg-black flex items-center justify-center">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
        </div>
        <div className="h-0.5 bg-black/10 overflow-hidden">
          <div ref={progressRef} className="h-full bg-black w-0" />
        </div>
        <p className="text-center text-xs uppercase tracking-wider text-black/40">
          Loading...
        </p>
      </div>
    </div>
  );
}