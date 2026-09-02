import React from "react";

export function AdaptedLogo() {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <svg
        width="34"
        height="34"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-700 group-hover:rotate-[360deg] will-change-transform"
      >
        <circle cx="16" cy="16" r="13" stroke="#0B0C0D" strokeWidth="1.5" opacity="0.15" />
        <circle 
          cx="16" cy="16" r="13" 
          stroke="#151719" 
          strokeWidth="2" 
          strokeDasharray="20 62" 
          strokeLinecap="round" 
          transform="rotate(-90 16 16)" 
          className="transition-all duration-700 group-hover:strokeDasharray-[30_52]" 
        />
        <path 
          d="M16 6C16 11 11 16 6 16C11 16 16 21 16 26C16 21 21 16 26 16C21 16 16 11 16 6Z" 
          fill="#151719" 
          className="transition-transform duration-500 origin-center group-hover:scale-75" 
        />
      </svg>
      <span className="font-bold tracking-[0.15em] text-[18px] uppercase bg-gradient-to-b from-black to-black/40 bg-clip-text text-transparent pb-[2px]">
        Elara
      </span>
    </div>
  );
}
