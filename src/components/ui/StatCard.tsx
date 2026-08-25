import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ElementType;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  suffix?: string;
  className?: string;
  highlight?: "danger" | "success" | "none";
}

export function StatCard({ title, value, icon: Icon, trend, suffix, className = "", highlight = "none" }: StatCardProps) {
  let highlightClasses = "";
  if (highlight === "danger") {
    highlightClasses = "bg-danger/5 border-danger/20";
  } else if (highlight === "success") {
    highlightClasses = "bg-success-bg/50 border-success/20";
  }

  return (
    <div className={`bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 min-w-0 ${highlightClasses} ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-slate-text">
          {Icon && <Icon className="w-4 h-4" />}
          <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold">
            {trend.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.value}
          </span>
        )}
      </div>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-semibold tracking-tight truncate">
          {value}
        </span>
        {suffix && (
          <span className="text-sm font-medium mb-1">{suffix}</span>
        )}
      </div>
    </div>
  );
}
