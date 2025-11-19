'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function LoadingSpinner() {
  const spinner1Ref = useRef(null);
  const spinner2Ref = useRef(null);
  const spinner3Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(spinner1Ref.current, {
        rotation: 360,
        duration: 2,
        repeat: -1,
        ease: 'linear',
      });

      gsap.to(spinner2Ref.current, {
        rotation: -360,
        duration: 3,
        repeat: -1,
        ease: 'linear',
      });

      gsap.to(spinner3Ref.current, {
        scale: 1.2,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center py-20">
      <div className="relative w-24 h-24">
        <div
          ref={spinner1Ref}
          className="absolute inset-0 border-2 border-white/20 border-t-white rounded-full"
        ></div>
        <div
          ref={spinner2Ref}
          className="absolute inset-3 border-2 border-white/20 border-t-white rounded-full"
        ></div>
        <div
          ref={spinner3Ref}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      </div>
      <p className="mt-6 text-gray-500 tracking-widest text-sm font-light">
        LOADING...
      </p>
    </div>
  );
}