"use client";
import React, { useState } from "react";
import Link from "next/link";
import ElaraLogo from "@/components/ElaraLogo";
import SignupRoleModal from "@/components/SignupRoleModal";

export default function Footer() {
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  return (
    <footer className="bg-[#121415] text-[#8B9194] py-20 px-6 mt-auto border-t border-[#24282B]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-2 flex flex-col items-start gap-6">
          <ElaraLogo dark={true} />
          <p className="max-w-sm text-sm font-medium leading-relaxed text-[#9CA3AF] m-0">
            The premium destination for discovering and booking top-tier
            services in your city. Elevating the standard of appointment
            management.
          </p>
        </div>

        {/* Platform Column */}
        <div>
          <h4 className="text-white font-medium text-sm tracking-tight mb-6">
            Platform
          </h4>
          <ul className="space-y-4 text-sm font-medium">
            <li>
              <Link
                href="/search"
                className="hover:text-white transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
              >
                Search
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="hover:text-white transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
              >
                Log in
              </Link>
            </li>
            <li>
              <button
                onClick={() => setSignupModalOpen(true)}
                className="hover:text-white transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white rounded text-left"
              >
                Sign up
              </button>
            </li>
          </ul>
        </div>



        {/* Connect Column */}
        <div>
          <h4 className="text-white font-medium text-sm tracking-tight mb-6">
            Connect
          </h4>
          <ul className="space-y-4 text-sm font-medium">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-[#24282B] flex flex-col md:flex-row items-center justify-between text-xs font-medium text-[#9CA3AF] gap-4">
        <p>© {new Date().getFullYear()} Elara. All rights reserved.</p>

        <div className="flex gap-6">
          <Link
            href="/privacy"
            className="hover:text-white transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="hover:text-white transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
          >
            Terms of Service
          </Link>
        </div>
      </div>
      <React.Suspense fallback={null}>
        <SignupRoleModal isOpen={signupModalOpen} onClose={() => setSignupModalOpen(false)} />
      </React.Suspense>
    </footer>
  );
}
