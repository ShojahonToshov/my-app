"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Phone, Lock, Eye, EyeOff, User, ArrowRight } from "lucide-react";
import ElaraLogo from "@/components/ElaraLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Card } from "@/components/ui/Card";
import OtpInput from "./OtpInput";
import AuthService from "@/services/customer/AuthService";
import useUser from "@/hooks/useUser";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

type StepType = "form" | "otp";

import { useI18nStore } from "@/stores/i18nStore";
import { useI18n } from "@/hooks/useI18n";

export default function Signup() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "customer";
  
  const [step, setStep] = useState<StepType>("form");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [autoFillCode, setAutoFillCode] = useState<string>("");
  const { login: loginStore } = useUser();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const sanitized = value.replace(/[^\d\s+()-]/g, "");
      setFormData({ ...formData, [name]: sanitized });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleRegisterRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/auth/register-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to request verification');
      }
      
      toast.success("Verification code sent");
      setStep("otp");

      if (data.code) {
        setTimeout(() => {
          toast("\uD83D\uDCF2 New Message", {
            description: `Your Elara verification code is ${data.code}`,
            position: "top-center",
            duration: 6000,
          });
          setAutoFillCode(data.code);
        }, 1000);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Registration error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, code })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      // API verify-phone now creates the user, logs them in, and sets cookies itself!
      if (data.user) {
        toast.success("Account created successfully");
        loginStore(data.user);
        
        const supabase = createClient();
        await supabase.auth.refreshSession();
        
        setTimeout(() => {
          window.location.href = role === "business" ? "/dashboard" : "/search";
        }, 500);
      } else {
        throw new Error("No user returned from verification");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error during verification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusiness = role === "business";
  const title = isBusiness ? "Create Business Account" : "Create Customer Account";
  const subtitle = isBusiness 
    ? "Join Elara to manage your business" 
    : "Join Elara to book premium services";

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#ECECEA] font-sans overflow-x-hidden text-[#121415] p-4 sm:p-6 relative">
      <Card className="w-full max-w-[480px] p-6 sm:p-8 md:p-12 flex flex-col">
        <div className="flex justify-center mb-8 shrink-0">
          <ElaraLogo />
        </div>

        {step === "form" ? (
          <>
            <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center text-[#121415] tracking-tight w-full">
              {title}
            </h1>
            <p className="text-sm text-[#4A4E51] text-center mb-8 font-medium w-full leading-relaxed">
              {subtitle}
            </p>

            <form onSubmit={handleRegisterRequest} className="space-y-5 flex flex-col w-full">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    id="firstName"
                    name="firstName"
                    label={useI18nStore.getState().t("extra.t289")}
                    type="text"
                    icon={User}
                    placeholder={t("extra.t54")}
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    id="lastName"
                    name="lastName"
                    label={useI18nStore.getState().t("extra.t293")}
                    type="text"
                    placeholder={t("extra.t55")}
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <PhoneInput
                id="phone"
                name="phone"
                label={useI18nStore.getState().t("extra.t297")}
                placeholder="+998 90 123 45 67"
                value={formData.phone}
                onChange={(val) => setFormData({ ...formData, phone: val })}
                required
                disabled={isSubmitting}
              />

              <Input
                id="password"
                name="password"
                label={useI18nStore.getState().t("extra.t288")}
                type={showPassword ? "text" : "password"}
                icon={Lock}
                actionIcon={showPassword ? EyeOff : Eye}
                onActionClick={() => setShowPassword(!showPassword)}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />

              <Button
                type="submit"
                variant="secondary"
                className="w-full mt-2"
                icon={!isSubmitting ? ArrowRight : undefined}
                iconPosition="right"
                isLoading={isSubmitting}
              >
                {t("extra.t401")}</Button>

              <p className="text-center text-sm text-[#4A4E51] font-medium mt-4 w-full">
                <span className="mr-1">{t("auth.hasAccount")}</span>
                <Link
                  href={`/login${searchParams.get("redirect") ? `?redirect=${encodeURIComponent(searchParams.get("redirect") as string)}` : ""}`}
                  className="text-[#121415] font-semibold hover:underline transition-colors"
                >{t("auth.signInBtn")}</Link>
              </p>
            </form>
          </>
        ) : (
          <OtpInput phone={formData.phone} onVerify={handleVerifyOtp} autoFillCode={autoFillCode} />
        )}
      </Card>
    </div>
  );
}
