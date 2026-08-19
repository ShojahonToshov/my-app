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

type StepType = "form" | "otp";

export default function Signup() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "customer";
  
  const [step, setStep] = useState<StepType>("form");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Если это поле телефона, разрешаем только плюс, цифры, пробелы и скобки
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
      console.log(`[Dev API] POST /api/auth/register-request`, { ...formData, role });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`[SMS DEV] Code 583214 sent to ${formData.phone}`);
      
      setStep("otp");
    } catch (error) {
      console.error(error);
      alert("Registration error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    setIsSubmitting(true);
    try {
      console.log(`[Dev API] POST /api/auth/verify-phone`, { phone: formData.phone, code });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (code === "583214") {
        alert("Registration successful! (Redirecting...)");
        // window.location.href = role === "business" ? "/admin" : "/search";
      } else {
        alert("Invalid code. Enter 583214 for testing.");
      }
    } catch (error) {
      console.error(error);
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
                  href="/login"
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
