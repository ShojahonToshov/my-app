import React from "react";

export interface TabOption {
  id: string;
  label: React.ReactNode;
}

interface TabsProps {
  options: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ options, activeId, onChange, className = "" }: TabsProps) {
  return (
    <div className={`flex items-center gap-1 bg-bg-light p-1 rounded-xl border border-border overflow-x-auto scrollbar-hide ${className}`}>
      {options.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-dark ${
              isActive 
                ? "bg-white text-slate-dark shadow-sm border border-border" 
                : "text-slate-muted hover:text-slate-dark hover:bg-white/50 border border-transparent"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
