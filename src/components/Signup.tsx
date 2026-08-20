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

export default function Signup() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "customer";
  
  const [step, setStep] = useState<StepType>("form");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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
      
      toast.success("Verification code sent!");
      setStep("otp");
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

      // API verify-phone теперь сам создает пользователя в Supabase через Admin API
      try {

        const loginRes = await AuthService.login(formData.phone, formData.password);
        
        if (loginRes.user) {
          toast.success("Registration successful!");
          loginStore(loginRes.user);
          
          const supabase = createClient();
          await supabase.auth.refreshSession();
          
          setTimeout(() => {
            window.location.href = role === "business" ? "/dashboard" : "/search";
          }, 500);
        }
      } catch (loginErr: any) {
        throw new Error(loginErr.message || "Failed to login after registration");
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
                    label="First Name"
                    type="text"
                    icon={User}
                    placeholder="Jane"
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
                    label="Last Name"
                    type="text"
                    placeholder="Doe"
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
                label="Phone Number"
                placeholder="+998 90 123 45 67"
                value={formData.phone}
                onChange={(val) => setFormData({ ...formData, phone: val })}
                required
                disabled={isSubmitting}
              />

              <Input
                id="password"
                name="password"
                label="Create Password"
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
                variant="primary"
                className="w-full mt-2 bg-[#121415] hover:bg-black text-white"
                icon={!isSubmitting ? ArrowRight : undefined}
                isLoading={isSubmitting}
              >
                Continue
              </Button>

              <p className="text-center text-sm text-[#4A4E51] font-medium mt-4 w-full">
                <span className="mr-1">Already have an account?</span>
                <Link
                  href={`/login${searchParams.get("redirect") ? `?redirect=${encodeURIComponent(searchParams.get("redirect") as string)}` : ""}`}
                  className="text-[#121415] font-semibold hover:underline transition-colors"
                >
                  Log in
                </Link>
              </p>
            </form>
          </>
        ) : (
          <OtpInput phone={formData.phone} onVerify={handleVerifyOtp} />
        )}
      </Card>
    </div>
  );
}
