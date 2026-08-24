"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import {
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
  X,
  Loader2
} from "lucide-react";

export default function DashboardSettings() {
  const [email, setEmail] = useState("Loading...");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        setPhone(user.phone || "");
        if (user.user_metadata?.password || user.user_metadata?.visible_password) {
          setPassword(user.user_metadata?.password || user.user_metadata?.visible_password);
        }
      }
    }
    loadUser();
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [activeModal, setActiveModal] = useState<"payment" | "2fa" | "logout" | "delete" | null>(null);
  
  const [cardLast4, setCardLast4] = useState("4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardType, setCardType] = useState("VISA");

  const [inputCardNumber, setInputCardNumber] = useState("");
  const [inputExpiry, setInputExpiry] = useState("");
  const [inputCvc, setInputCvc] = useState("");
  
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [code2FA, setCode2FA] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

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
    
    setCardLast4(cleanedNumber.slice(-4));
    setCardExpiry(inputExpiry);
    
    if (inputCardNumber.startsWith("4")) {
      setCardType("VISA");
    } else if (inputCardNumber.startsWith("5")) {
      setCardType("MASTERCARD");
    } else {
      setCardType("CARD");
    }
    
    setActiveModal(null);
    toast.success("Card updated");
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const supabase = createClient();
    const updates: any = {};
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (password) {
      updates.password = password;
      updates.data = { visible_password: password }; // Store in metadata for demo
    }

    const { error } = await supabase.auth.updateUser(updates);
    setIsSaving(false);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Security info updated");
    }
  };

  const handleEnable2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (code2FA.length < 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }
    setIs2FAEnabled(true);
    setActiveModal(null);
    setCode2FA("");
    toast.success("2FA enabled (Demo)");
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }
    toast.success("Account deletion requested");
    setActiveModal(null);
    setDeleteConfirmText("");
  };

  return (
    <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <header className="bg-[#F5F5F4]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 h-auto md:h-20 shrink-0 sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
          <div className="w-full max-w-3xl flex flex-col gap-6">
            
            <div className="bg-white rounded-3xl shadow-sm border border-[#DCDCDA] flex flex-col animate-in fade-in duration-300">
              
              {/* 1. Subscription & Plan */}
              <div className="p-6 sm:p-8 border-b border-[#DCDCDA] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#121415] tracking-tight mb-1">Current Plan</h3>
                  <p className="text-sm text-[#4A4E51] font-medium">Manage your subscription and upgrade options.</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 p-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl">
                    <div className="w-10 h-10 bg-[#E5E9EA] border border-[#DCDCDA] rounded-lg flex items-center justify-center text-[#121415] shrink-0 shadow-sm">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    </div>
                    <div className="flex flex-col pr-4">
                      <span className="text-sm font-semibold text-[#121415] tracking-tight">Free Plan</span>
                      <span className="text-[10px] text-[#8A2532] font-bold mt-0.5 uppercase">Basic Features</span>
                    </div>
                  </div>
                  <Link href="/pricing" className="px-5 py-2.5 bg-[#8A2532] text-white font-semibold text-sm rounded-xl hover:bg-[#6b1c26] transition-colors shadow-sm active:scale-95 shrink-0 inline-flex items-center justify-center">
                    Upgrade Plan
                  </Link>
                </div>
              </div>

              {/* 2. Business Security Info */}
              <div className="p-6 sm:p-8 border-b border-[#DCDCDA]">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-[#121415] tracking-tight">Business Security Info</h2>
                  <p className="text-sm text-[#4A4E51] font-medium mt-1">Primary contact, recovery details, and authentication settings</p>
                </div>

                <form className="space-y-6" onSubmit={handleSaveSecurity}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#121415] mb-2">Email (Google / Recovery)</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
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
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+998"
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
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

                  <div className="pt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full sm:w-auto px-8 py-3 bg-[#121415] text-white hover:bg-[#2A2E30] rounded-xl font-medium text-sm shadow-sm transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95 disabled:!bg-[#E5E9EA] disabled:!text-[#8B9194] disabled:!shadow-none disabled:pointer-events-none"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {isSaving ? "Saving..." : "Save Security Info"}
                    </button>
                  </div>
                </form>
              </div>

              {/* 2. Payment Method */}
              <div className="p-6 sm:p-8 border-b border-[#DCDCDA] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#121415] tracking-tight mb-1">Payment Method</h3>
                  <p className="text-sm text-[#4A4E51] font-medium">Manage your billing and payment details.</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 p-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl">
                    <div className="w-12 h-8 bg-[#121415] rounded flex items-center justify-center text-xs text-white font-semibold shrink-0 shadow-sm">{cardType}</div>
                    <div className="flex flex-col pr-2">
                      <span className="text-sm font-semibold text-[#121415] tracking-tight">•••• {cardLast4}</span>
                      <span className="text-[10px] text-[#8B9194] font-medium mt-0.5 uppercase">Expires {cardExpiry}</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => setActiveModal("payment")} className="px-5 py-2.5 bg-white border border-[#DCDCDA] text-[#121415] font-medium text-sm rounded-xl hover:bg-[#F5F5F4] hover:border-[#121415]/20 transition-colors shadow-sm active:scale-95 shrink-0">
                    Update
                  </button>
                </div>
              </div>

              {/* 3. Security (2FA) */}
              <div className="p-6 sm:p-8 border-b border-[#DCDCDA] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#121415] tracking-tight mb-1">Two-Factor Authentication</h3>
                  <p className="text-sm text-[#4A4E51] font-medium">Add an extra layer of security to your account.</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 p-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl min-w-[140px]">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm ${is2FAEnabled ? 'bg-[#4a6b53]/10 border-[#4a6b53]/20' : 'bg-white border-[#DCDCDA]'}`}>
                      <Key className={`w-4 h-4 ${is2FAEnabled ? 'text-[#4a6b53]' : 'text-[#4A4E51]'}`} />
                    </div>
                    <div className="flex flex-col pr-4">
                      <span className="text-sm font-semibold text-[#121415] tracking-tight">Status</span>
                      <span className={`text-[10px] font-medium mt-0.5 uppercase ${is2FAEnabled ? 'text-[#4a6b53]' : 'text-[#8B9194]'}`}>
                        {is2FAEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  {!is2FAEnabled && (
                    <button type="button" onClick={() => setActiveModal("2fa")} className="px-5 py-2.5 bg-white border border-[#DCDCDA] text-[#121415] font-medium text-sm rounded-xl hover:bg-[#F5F5F4] hover:border-[#121415]/20 transition-colors shadow-sm active:scale-95 shrink-0">
                      Enable 2FA
                    </button>
                  )}
                </div>
              </div>

              {/* 4. Session Management */}
              <div className="p-6 sm:p-8 border-b border-[#DCDCDA] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#121415] tracking-tight mb-1">Session Management</h3>
                  <p className="text-sm text-[#4A4E51] font-medium">Manage your active sessions and devices.</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 p-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl min-w-[140px]">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 border border-[#DCDCDA] shadow-sm">
                      <ShieldCheck className="w-4 h-4 text-[#4a6b53]" />
                    </div>
                    <div className="flex flex-col pr-4">
                      <span className="text-sm font-semibold text-[#121415] tracking-tight">Current Device</span>
                      <span className="text-[10px] text-[#4a6b53] font-medium mt-0.5 uppercase">Active</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => setActiveModal("logout")} className="px-5 py-2.5 bg-white border border-[#DCDCDA] text-[#121415] font-medium text-sm rounded-xl hover:bg-[#F5F5F4] hover:border-[#121415]/20 transition-colors shadow-sm flex items-center justify-center gap-2 active:scale-95 shrink-0">
                    <LogOut className="w-4 h-4 text-[#4A4E51]" /> Log out
                  </button>
                </div>
              </div>

              {/* 5. Danger Zone */}
              <div className="p-6 sm:p-8 bg-[#fef2f2]/50 rounded-b-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#dc2626] tracking-tight mb-1 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5" /> Danger Zone
                  </h3>
                  <p className="text-sm text-[#991b1b] font-medium">Account deletion will permanently revoke CRM access and erase all data.</p>
                </div>
                <button type="button" onClick={() => setActiveModal("delete")} className="w-full sm:w-auto px-5 py-2.5 bg-white text-[#dc2626] hover:bg-[#dc2626]/10 border border-[#dc2626] rounded-xl font-medium text-sm transition-colors shadow-sm active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]">
                  Delete Account
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button type="button" onClick={() => setActiveModal(null)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-xl bg-[#F5F5F4] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
              <X className="w-4 h-4" />
            </button>

            {activeModal === "payment" && (
              <>
                <div className="p-8 pb-4 text-center shrink-0">
                  <div className="w-12 h-12 bg-[#F5F5F4] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#DCDCDA]">
                    <CreditCard className="w-6 h-6 text-[#121415]" />
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
                  <button type="submit" className="w-full py-3.5 bg-[#121415] text-white rounded-xl font-medium text-sm shadow-sm hover:bg-[#2A2E30] transition-all flex items-center justify-center gap-2 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                    Link Payment Card
                  </button>
                </form>
              </>
            )}

            {activeModal === "2fa" && (
              <>
                <div className="p-8 pb-4 text-center shrink-0">
                  <div className="w-12 h-12 bg-[#F5F5F4] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#DCDCDA]">
                    <Key className="w-6 h-6 text-[#121415]" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#121415] tracking-tight">Enable 2FA</h2>
                  <p className="text-xs text-[#4A4E51] font-medium mt-2">Enter the 6-digit code from your authenticator app to enable Two-Factor Authentication.</p>
                </div>
                <form className="px-8 pb-8 flex-1 overflow-y-auto" onSubmit={handleEnable2FA}>
                  <div className="p-5 bg-[#F5F5F4] border border-[#DCDCDA] rounded-2xl space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#4A4E51] mb-2 uppercase tracking-wider text-center">Authentication Code</label>
                      <input 
                        type="text" 
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="000000" 
                        maxLength={6}
                        value={code2FA}
                        onChange={(e) => setCode2FA(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-white border border-[#DCDCDA] px-4 py-4 rounded-xl font-bold text-[#121415] text-center text-xl tracking-[0.2em] outline-none focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 transition-all placeholder:text-[#8B9194]" 
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full mt-6 py-3.5 bg-[#121415] text-white rounded-xl font-medium text-sm shadow-sm hover:bg-[#2A2E30] transition-all flex items-center justify-center gap-2 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                    Enable Authentication
                  </button>
                </form>
              </>
            )}

            {activeModal === "logout" && (
              <>
                <div className="p-8 pb-4 text-center shrink-0">
                  <div className="w-12 h-12 bg-[#F5F5F4] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#DCDCDA]">
                    <LogOut className="w-6 h-6 text-[#121415]" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#121415] tracking-tight">Log Out</h2>
                  <p className="text-xs text-[#4A4E51] font-medium mt-2">Are you sure you want to log out of your current session?</p>
                </div>
                <div className="px-8 pb-8 flex items-center gap-3">
                  <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-3.5 bg-white border border-[#DCDCDA] text-[#121415] rounded-xl font-medium text-sm shadow-sm hover:bg-[#F5F5F4] hover:border-[#121415]/20 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                    Cancel
                  </button>
                  <button type="button" onClick={handleLogout} className="flex-1 py-3.5 bg-[#121415] text-white rounded-xl font-medium text-sm shadow-sm hover:bg-[#2A2E30] transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                    Log Out
                  </button>
                </div>
              </>
            )}

            {activeModal === "delete" && (
              <>
                <div className="p-8 pb-4 text-center shrink-0">
                  <div className="w-12 h-12 bg-[#fef2f2] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#fca5a5]">
                    <ShieldAlert className="w-6 h-6 text-[#dc2626]" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#121415] tracking-tight">Delete Account</h2>
                  <p className="text-xs text-[#991b1b] font-medium mt-2">This action is permanent and irreversible. All your data will be permanently erased.</p>
                </div>
                <form className="px-8 pb-8 flex-1 overflow-y-auto" onSubmit={handleDeleteAccount}>
                  <div className="p-5 bg-[#fef2f2] border border-[#fca5a5] rounded-2xl space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#991b1b] mb-2 uppercase tracking-wider">Type DELETE to confirm</label>
                      <input 
                        type="text" 
                        autoComplete="off"
                        placeholder="DELETE" 
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        className="w-full bg-white border border-[#fca5a5] px-4 py-3 rounded-xl font-medium text-[#121415] outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition-all text-sm placeholder:text-[#fca5a5]" 
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={deleteConfirmText !== "DELETE"}
                    className="w-full mt-6 py-3.5 bg-[#dc2626] text-white rounded-xl font-medium text-sm shadow-sm hover:bg-[#b91c1c] transition-all flex items-center justify-center gap-2 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] disabled:!bg-[#E5E9EA] disabled:!text-[#8B9194] disabled:!shadow-none disabled:pointer-events-none"
                  >
                    Permanently Delete
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}