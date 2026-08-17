"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Save,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Key,
  Eye,
  EyeOff,
  Phone,
  CreditCard,
  X
} from "lucide-react";

export default function AdminSettings() {
  const [showPassword, setShowPassword] = useState(false);
  
  const [modal, setModal] = useState(false);
  const [cardLast4, setCardLast4] = useState("4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardType, setCardType] = useState("VISA");

  const [inputCardNumber, setInputCardNumber] = useState("");
  const [inputExpiry, setInputExpiry] = useState("");
  const [inputCvc, setInputCvc] = useState("");

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    val = val.replace(/(.{4})/g, "$1 ").trim();
    setInputCardNumber(val);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length >= 2) {
      val = val.substring(0, 2) + "/" + val.substring(2, 4);
    }
    setInputExpiry(val);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setInputCvc(val);
  };

  const handleUpdateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCardNumber || !inputExpiry || !inputCvc) {
      toast.error("Please fill in all card details");
      return;
    }
    
    const cleanedNumber = inputCardNumber.replace(/\D/g, "");
    if (cleanedNumber.length < 4) {
      toast.error("Invalid card number");
      return;
    }
    const last4 = cleanedNumber.slice(-4);
    
    setCardLast4(last4);
    setCardExpiry(inputExpiry);
    
    if (cleanedNumber.startsWith("4")) {
      setCardType("VISA");
    } else if (cleanedNumber.startsWith("5")) {
      setCardType("MASTER");
    } else {
      setCardType("CARD");
    }
    
    setModal(false);
    setInputCardNumber("");
    setInputExpiry("");
    setInputCvc("");
    toast.success("Card updated successfully");
  };

  return (
    <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <header className="bg-[#ECECEA]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 h-auto md:h-20 shrink-0 sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#121415] tracking-tight">Security & Access</h1>
            <p className="text-sm text-[#4A4E51] font-medium mt-1 hidden sm:block">
              Business security, recovery, and authentication settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4a6b53]/10 border border-[#4a6b53]/20 text-[#4a6b53] text-xs font-semibold shadow-sm">
              <ShieldCheck className="w-4 h-4" /> Protected
            </span>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto flex justify-center items-start">
          <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Security Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#DCDCDA] animate-in fade-in duration-300">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-[#121415] tracking-tight">Business Security Info</h2>
                  <p className="text-sm text-[#4A4E51] font-medium mt-1">Primary contact, recovery details, and billing information</p>
                </div>

                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#121415] mb-2">Account Owner</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                      <input
                        type="text"
                        value="Владелец бизнеса"
                        disabled
                        readOnly
                        className="w-full pl-12 pr-4 py-3 bg-[#EAEAEA] border border-[#DCDCDA] rounded-xl text-[#8B9194] font-medium outline-none cursor-not-allowed select-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#121415] mb-2">Email (Google / Recovery)</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                        <input
                          type="email"
                          defaultValue="admin@business.com"
                          className="w-full pl-12 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#121415] mb-2">Recovery Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                        <input
                          type="tel"
                          defaultValue="+998 90 000 00 00"
                          className="w-full pl-12 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#121415] mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        defaultValue="password123"
                        className="w-full pl-12 pr-12 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#8B9194] hover:text-[#121415] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-lg"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end border-t border-[#DCDCDA]">
                    <button
                      type="button"
                      className="w-full sm:w-auto px-8 py-3 bg-[#121415] text-white hover:opacity-90 rounded-xl font-medium text-sm shadow-sm transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      Save Security Info
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: Actions & Danger Zone */}
            <div className="space-y-6">
              
              <div className="bg-white rounded-3xl p-6 border border-[#DCDCDA] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
                <div className="space-y-1 w-full">
                  <span className="text-xs font-semibold text-[#8B9194] uppercase tracking-wider">Payment Method</span>
                  <div className="flex items-center gap-4 mt-3 p-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl w-full">
                    <div className="w-12 h-8 bg-[#121415] rounded flex items-center justify-center text-xs text-white font-semibold shrink-0 shadow-sm">{cardType}</div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-[#121415] tracking-tight">•••• {cardLast4}</span>
                      <span className="text-[10px] text-[#8B9194] font-medium mt-0.5 uppercase">Expires {cardExpiry}</span>
                    </div>
                  </div>
                </div>
                <div className="pt-5">
                  <button type="button" onClick={() => setModal(true)} className="w-full py-2.5 bg-white border border-[#DCDCDA] text-[#121415] font-medium text-sm rounded-xl hover:bg-[#F5F5F4] hover:border-[#121415]/20 transition-colors shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                    Update Card
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#DCDCDA] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F5F5F4] flex items-center justify-center shrink-0 border border-[#DCDCDA]">
                  <Key className="w-5 h-5 text-[#4A4E51]" />
                </div>
                <div>
                  <p className="font-semibold text-[#121415] text-sm">Two-Factor Authentication</p>
                  <button type="button" className="text-xs font-medium text-[#4a6b53] hover:text-[#38513f] mt-0.5 transition-colors focus-visible:outline-none focus-visible:underline">
                    Enable 2FA
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#DCDCDA] flex flex-col gap-3">
                <h3 className="text-xs font-semibold text-[#8B9194] uppercase tracking-wider mb-2">Session Management</h3>
                <button type="button" className="w-full py-3 bg-white text-[#121415] hover:bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95">
                  <LogOut className="w-4 h-4 text-[#4A4E51]" /> Log out of account
                </button>
              </div>

              <div className="bg-white p-6 pl-7 rounded-3xl shadow-sm border border-[#dc2626]/30 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#dc2626]"></div>
                <h3 className="text-xs font-semibold text-[#dc2626] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Danger Zone
                </h3>
                <p className="text-[12px] text-[#4A4E51] font-medium mb-3 leading-relaxed">
                  Account deletion will permanently revoke CRM access and erase all client databases.
                </p>
                <button type="button" className="w-full py-3 bg-white text-[#dc2626] hover:bg-[#dc2626]/10 border border-[#dc2626] rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] active:scale-95">
                  Delete Account
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm" onClick={() => setModal(false)}>
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button type="button" onClick={() => setModal(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F4] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
              <X className="w-4 h-4" />
            </button>
            <div className="p-8 pb-4 text-center shrink-0">
              <div className="w-12 h-12 bg-[#F5F5F4] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#DCDCDA]">
                <Lock className="w-6 h-6 text-[#121415]" />
              </div>
              <h2 className="text-xl font-semibold text-[#121415] tracking-tight">Secure Payment</h2>
              <p className="text-xs text-[#4A4E51] font-medium mt-2">Card details are encrypted via PCI DSS standards. We never store your CVV.</p>
            </div>
            <form className="px-8 pb-8 flex-1 overflow-y-auto" onSubmit={handleUpdateCard}>
              <div className="p-5 bg-[#F5F5F4] border border-[#DCDCDA] rounded-2xl space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4E51] mb-2 uppercase tracking-wider">Card Number</label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="0000 0000 0000 0000" 
                    maxLength={19}
                    value={inputCardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full bg-white border border-[#DCDCDA] px-4 py-3 rounded-xl font-medium text-[#121415] outline-none focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 transition-all text-sm placeholder:text-[#8B9194]" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4E51] mb-2 uppercase tracking-wider">Expiry Date</label>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="MM/YY" 
                      maxLength={5}
                      value={inputExpiry}
                      onChange={handleExpiryChange}
                      className="w-full bg-white border border-[#DCDCDA] px-4 py-3 rounded-xl font-medium text-[#121415] text-center outline-none focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 transition-all text-sm placeholder:text-[#8B9194]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4E51] mb-2 uppercase tracking-wider">CVC/CVV</label>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="123" 
                      maxLength={4}
                      value={inputCvc}
                      onChange={handleCvcChange}
                      className="w-full bg-white border border-[#DCDCDA] px-4 py-3 rounded-xl font-medium text-[#121415] text-center outline-none focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 transition-all text-sm placeholder:text-[#8B9194]" 
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-5 mb-6 text-xs font-medium text-[#4a6b53]">
                <ShieldCheck className="w-3.5 h-3.5" /> Protected by 256-bit SSL encryption
              </div>
              <button type="submit" className="w-full py-3.5 bg-[#121415] text-white rounded-xl font-medium text-sm shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                Link Payment Card
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}