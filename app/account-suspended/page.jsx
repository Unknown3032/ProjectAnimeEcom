'use client';

import { adminLogout } from '@/lib/adminAuth';

export default function AccountSuspended() {
  const handleLogout = () => {
    adminLogout();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto border-2 border-black flex items-center justify-center mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h1 className="text-4xl font-extralight mb-4">Account Suspended</h1>
          <p className="text-base text-black/60 mb-8">
            Your account has been temporarily suspended. Please contact support for more information.
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="/contact"
            className="block w-full py-4 bg-black text-white text-sm tracking-wider uppercase hover:bg-black/90 transition-colors"
          >
            Contact Support
          </a>
          <button
            onClick={handleLogout}
            className="w-full py-4 border border-black text-black text-sm tracking-wider uppercase hover:bg-black hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}