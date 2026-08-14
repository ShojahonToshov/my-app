"use client";
import React from "react";

export function Card({ children, className = "", ...props }) {
  return (
    <div 
      className={`bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden shrink-0 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}