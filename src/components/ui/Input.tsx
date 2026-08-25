"use client";
import React, { InputHTMLAttributes, ElementType } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ElementType;
  error?: string;
  className?: string;
  actionIcon?: ElementType;
  onActionClick?: () => void;
}

export function Input({
  label,
  id,
  icon: Icon,
  type = "text",
  error,
  className = "",
  actionIcon: ActionIcon,
  onActionClick,
  placeholder = " ",
  ...props
}: InputProps) {
  return (
    <div className={`w-full flex flex-col gap-1.5 shrink-0 ${className}`}>
      <div className="relative group w-full">
        {Icon && (
          <Icon
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 z-10 ${
              error
                ? "text-brand"
                : "text-slate-text group-focus-within:text-slate-dark"
            }`}
          />
        )}
        
        <input
          id={id}
          type={type}
          placeholder={label ? " " : placeholder}
          className={`peer w-full ${Icon ? "pl-12" : "pl-4"} ${
            ActionIcon ? "pr-12" : "pr-4"
          } py-4 rounded-xl outline-none transition-all duration-300 text-sm font-medium border bg-bg-light focus:bg-white focus:ring-4 [&:-webkit-autofill]:shadow-[inset_0_0_0_9999px_var(--color-bg-light)] focus:[&:-webkit-autofill]:shadow-[inset_0_0_0_9999px_#fff] text-slate-dark placeholder-transparent focus:placeholder-slate-muted/50 ${
            error
              ? "border-brand focus:ring-brand/10 shadow-[0_0_8px] shadow-brand/30"
              : "border-border focus:border-slate-dark focus:ring-slate-dark/5"
          }`}
          {...props}
        />
        
        {label && (
          <label
            htmlFor={id}
            className={`absolute ${Icon ? "left-12" : "left-4"} top-1/2 -translate-y-1/2 text-sm font-medium transition-all duration-300 pointer-events-none 
            peer-[:not(:placeholder-shown)]:opacity-0
            ${error ? "text-brand" : "text-slate-text"}`}
          >
            {label}
          </label>
        )}

        {ActionIcon && (
          <button
            type="button"
            onClick={onActionClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-text hover:text-slate-dark transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-slate-dark rounded-lg shrink-0 z-10"
          >
            <ActionIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs font-medium text-brand pl-1 mt-0.5">{error}</p>
      )}
    </div>
  );
}