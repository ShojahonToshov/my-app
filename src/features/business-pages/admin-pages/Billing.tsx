"use client";
import React from "react";
import {
  CheckCircle2,
  Download,
  AlertCircle,
  Sliders,
} from "lucide-react";

interface UsageBarProps {
  label: string;
  current: number;
  max: number;
  unit?: string;
}

function UsageBar({ label, current, max, unit = "" }: UsageBarProps) {
  const percentage = Math.min((current / max) * 100, 100);
  let colorClass = "bg-[#4a6b53]";
  if (percentage >= 70 && percentage < 90) colorClass = "bg-amber-500";
  if (percentage >= 90) colorClass = "bg-[#dc2626]";

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-[#4A4E51]">{label}</span>
        <span className="font-medium text-[#121415]">
          {current.toLocaleString("en-US")} of {max.toLocaleString("en-US")} {unit}
        </span>
      </div>
      <div className="w-full h-2.5 bg-[#F5F5F4] rounded-full overflow-hidden border border-[#DCDCDA]/50">
        <div className={`h-full rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

export default function Billing() {
  return (
    <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-[#ECECEA]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 h-auto md:h-20 shrink-0 sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#121415] tracking-tight">Subscription & Billing</h1>
            <p className="text-sm text-[#4A4E51] font-medium mt-0.5">Manage plan, limits, and payment methods</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#4a6b53] bg-[#e8efe9] border border-[#4a6b53]/30 px-3 py-1.5 rounded-lg shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#4a6b53] animate-pulse"></span>
            <span>System Active</span>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="w-full px-6 md:px-10 py-10 pb-16 flex flex-col gap-6">

            <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#DCDCDA] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#121415] bg-[#F5F5F4] border border-[#DCDCDA] px-2.5 py-1 rounded-md uppercase tracking-wider">Current Plan</span>
                  <h2 className="text-xl font-semibold tracking-tight text-[#121415] mt-3">SuperQueue Business Pro</h2>
                  <p className="text-sm font-medium text-[#4A4E51]">For busy salons, multi-seat barbershops, and expanding teams</p>
                </div>
                <div className="sm:text-right shrink-0">
                  <p className="text-xl font-semibold text-[#121415] tracking-tight">650,000 <span className="text-sm">UZS</span></p>
                  <p className="text-xs font-medium text-[#8B9194] mt-0.5">/ monthly</p>
                </div>
              </div>
              <div className="pt-5 mt-5 border-t border-[#F5F5F4]">
                <div className="flex items-center gap-2 text-xs font-medium text-[#4A4E51] bg-[#F5F5F4] px-3 py-1.5 rounded-lg border border-[#DCDCDA] w-fit">
                  <CheckCircle2 className="w-4 h-4 text-[#4a6b53]" />
                  <span>Next billing: <strong className="text-[#121415]">August 12, 2026</strong></span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch min-h-[300px]">
              <div className="bg-white rounded-2xl border border-[#DCDCDA] shadow-sm p-5 md:p-6 flex flex-col justify-between transition-all hover:shadow-md">
                <h3 className="text-sm font-semibold tracking-tight text-[#121415] flex items-center gap-2 uppercase">
                  <Sliders className="w-4 h-4 text-[#8B9194]" /> Resource Usage
                </h3>
                <div className="space-y-5 my-6">
                  <UsageBar label="Active Specialists" current={4} max={5} />
                  <UsageBar label="Monthly Appointments" current={1240} max={5000} />
                  <UsageBar label="SMS Notifications" current={950} max={1000} />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#dc2626] font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>SMS notification bundle is almost depleted</span>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#DCDCDA] shadow-sm p-5 md:p-6 flex flex-col transition-all hover:shadow-md">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold tracking-tight text-[#121415] uppercase">Payment History</h3>
                  <p className="text-xs font-medium text-[#4A4E51] mt-0.5">Invoices, receipts, and billing statements</p>
                </div>
                <div className="flex-1 overflow-x-auto scrollbar-hide">
                  <div className="min-w-[450px]">
                    <div className="flex items-center px-4 py-2 bg-[#F5F5F4] rounded-lg text-[10px] font-semibold text-[#8B9194] uppercase tracking-wider mb-2 border border-[#DCDCDA]">
                      <div className="w-1/4">Date</div>
                      <div className="w-2/4">Description</div>
                      <div className="w-1/4 text-right pr-4">Amount</div>
                      <div className="w-10"></div>
                    </div>
                    <div className="space-y-1 mt-2">
                      {[
                        { date: "12 Jul 2026", desc: "SuperQueue Business Pro Subscription", amount: "650,000 UZS" },
                        { date: "12 Jun 2026", desc: "SuperQueue Business Pro Subscription", amount: "650,000 UZS" },
                        { date: "12 May 2026", desc: "SuperQueue Business Pro Subscription", amount: "650,000 UZS" },
                      ].map((invoice, i) => (
                        <div key={i} className="flex items-center px-4 py-2.5 hover:bg-[#F5F5F4] rounded-xl transition-colors border border-transparent hover:border-[#DCDCDA]/50">
                          <div className="w-1/4 text-xs font-medium text-[#4A4E51]">{invoice.date}</div>
                          <div className="w-2/4 text-xs font-semibold text-[#121415]">{invoice.desc}</div>
                          <div className="w-1/4 text-right pr-4 text-xs font-semibold text-[#121415]">{invoice.amount}</div>
                          <div className="w-10 flex justify-end">
                            <button type="button" className="p-1.5 text-[#4A4E51] bg-white border border-[#DCDCDA] hover:text-[#121415] hover:border-[#121415]/20 rounded-md shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95">
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
