import React from "react";
import Link from "next/link";

export interface ElaraLogoProps {
  dark?: boolean;
  disableLink?: boolean;
  showText?: boolean;
}

export default function ElaraLogo({ dark = false, disableLink = false, showText = true }: ElaraLogoProps) {
  const content = (
    <>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 transition-transform duration-500 ${
          disableLink ? "" : "group-hover:scale-105"
        }`}
      >
        {/* Base Clock Ring */}
        <circle cx="16" cy="16" r="13" stroke={dark ? "#FFFFFF" : "#121415"} strokeWidth="1.5" opacity="0.2" />
        
        {/* Active Time Slot (Booked Time) */}
        <circle 
          cx="16" cy="16" r="13" 
          stroke="#8A2532" 
          strokeWidth="1.5" 
          strokeDasharray="20 62" 
          strokeLinecap="round" 
          transform="rotate(-90 16 16)" 
          className={`transition-all duration-700 ${
            disableLink ? "" : "group-hover:strokeDasharray-[40_42]"
          }`} 
        />
        
        {/* The Premium Sparkle */}
        <path 
          d="M16 6C16 11 11 16 6 16C11 16 16 21 16 26C16 21 21 16 26 16C21 16 16 11 16 6Z" 
          fill={dark ? "#FFFFFF" : "#121415"} 
          className={`transition-transform duration-500 origin-center ${
            disableLink ? "" : "group-hover:scale-90"
          }`} 
        />
      </svg>

      {showText && (
        <span className={`font-semibold tracking-[0.2em] text-[18px] uppercase leading-[32px] block m-0 p-0 flex-none select-none transition-colors ${dark ? "text-white" : "text-[#121415]"}`}>
          Elara
        </span>
      )}
    </>
  );

  const className = `flex items-center gap-[10px] w-max shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-lg ${
    disableLink ? "" : "group cursor-pointer"
  }`;

  if (disableLink) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link
      href="/"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={className}
    >
      {content}
    </Link>
  );
}