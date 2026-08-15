"use client";
import React, { ButtonHTMLAttributes, ElementType, ReactNode } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
  icon?: ElementType;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon: Icon,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-slate-dark focus-visible:ring-offset-2 shrink-0 w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none active:scale-95";

  const variants = {
    primary:
      "bg-brand hover:bg-brand-hover text-white border border-transparent shadow-[0_8px_20px] shadow-brand/20 hover:shadow-[0_12px_24px] hover:shadow-brand/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm",
    secondary:
      "bg-slate-dark hover:bg-slate-dark-hover text-white border border-transparent shadow-[0_8px_20px] shadow-black/8 hover:shadow-[0_12px_24px] hover:shadow-black/15 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm",
    danger:
      "bg-bg-light border border-border text-danger hover:bg-danger hover:text-white hover:border-transparent hover:shadow-[0_12px_24px] hover:shadow-danger/20 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm",
    outline:
      "bg-white hover:bg-bg-light text-slate-dark border border-border hover:border-slate-dark shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm",
    ghost:
      "bg-transparent text-slate-text hover:text-slate-dark hover:bg-bg-light shadow-none hover:shadow-none",
  };

  const sizes = {
    sm: "py-2 px-4 text-sm",
    md: "py-3.5 px-6 text-sm",
    lg: "py-4 px-8 text-base",
    icon: "p-2.5",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {!isLoading && Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children && <span>{children}</span>}
    </button>
  );
}