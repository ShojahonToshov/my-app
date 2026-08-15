"use client";
import React, { ElementType, ReactNode } from "react";

export interface BadgeProps {
  children: ReactNode;
  variant?: "neutral" | "brand" | "success" | "dark";
  className?: string;
  icon?: ElementType;
}

export function Badge({ children, variant = "neutral", className = "", icon: Icon }: BadgeProps) {
  const variants = {
    neutral: "bg-bg-light border border-border text-slate-text",
    brand: "bg-brand/10 border border-transparent text-brand",
    success: "bg-success-bg border border-success/20 text-success",
    dark: "bg-slate-dark/90 border border-transparent text-white backdrop-blur-md"
  };

  return (
    <div className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm w-max max-w-full ${variants[variant]} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span className="text-xs font-bold uppercase truncate">
        {children}
      </span>
    </div>
  );
}