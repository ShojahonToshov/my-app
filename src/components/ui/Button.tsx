"use client";
import React, { ButtonHTMLAttributes, ElementType, ReactNode } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  shape?: "rounded" | "pill" | "square";
  iconPosition?: "left" | "right";
  className?: string;
  icon?: ElementType;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  shape = "rounded",
  iconPosition = "left",
  className = "",
  icon: Icon,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 shrink-0 disabled:!bg-[#E5E9EA] disabled:!text-[#8B9194] disabled:!border-transparent disabled:!shadow-none disabled:cursor-not-allowed active:scale-95";

  const shapes = {
    rounded: "rounded-xl",
    pill: "rounded-full",
    square: "rounded-md",
  };

  const variants = {
    primary:
      "bg-[#8A2532] hover:bg-[#731E29] text-white border border-transparent shadow-[0_8px_20px_rgba(138,37,50,0.2)] hover:shadow-[0_12px_24px_rgba(138,37,50,0.3)]",
    secondary:
      "bg-[#121415] hover:bg-[#2A2E30] text-white border border-transparent shadow-sm hover:shadow-md",
    danger:
      "bg-[#dc2626] hover:bg-[#b91c1c] text-white border border-transparent shadow-sm hover:shadow-md",
    outline:
      "bg-white hover:bg-[#F5F5F4] text-[#121415] border border-[#DCDCDA] hover:border-[#121415]/20 shadow-sm hover:shadow-md",
    ghost:
      "bg-transparent text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] shadow-none",
  };

  const sizes = {
    sm: "py-2 px-4 text-sm",
    md: "py-3.5 px-6 text-sm",
    lg: "py-4 px-8 text-base",
    icon: "p-2.5",
  };

  return (
    <button
      className={`${baseStyles} ${shapes[shape]} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {!isLoading && Icon && iconPosition === "left" && <Icon className="w-4 h-4 shrink-0" />}
      {children}
      {!isLoading && Icon && iconPosition === "right" && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}