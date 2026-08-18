"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Check, ArrowLeft } from "lucide-react";
import { useLogin } from "@/hooks/useAuth";
import ElaraLogo from "@/components/ElaraLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function Login() {
  const { login, setLogin, password, setPassword, showPassword, setShowPassword, isSubmitting, handleSubmit, errors, rememberMe, setRememberMe } = useLogin("/admin");

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#ECECEA] font-sans selection:bg-[#8A2532] selection:text-white overflow-x-hidden text-[#121415] p-4 sm:p-6 relative">
      <Card className="w-full max-w-[480px] p-6 sm:p-8 md:p-12 flex flex-col">
        <div className="flex justify-center mb-8 shrink-0">
          <ElaraLogo />
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center text-[#121415] tracking-tight w-full">
          Welcome back
        </h1>
        <p className="text-sm text-[#4A4E51] text-center mb-8 font-medium w-full leading-relaxed">
          Sign in to continue booking premium services with Elara.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 flex flex-col w-full">
          <Input
            id="email"
            label="Email or phone"
            type="text"
            icon={Mail}
            placeholder="name@example.com"
            disabled={isSubmitting}
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            error={errors?.login}
          />

          <Input
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            icon={Lock}
            actionIcon={showPassword ? EyeOff : Eye}
            onActionClick={() => setShowPassword(!showPassword)}
            placeholder="••••••••"
            disabled={isSubmitting}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors?.password}
          />

          <div className="flex items-center justify-between pt-1 pb-2 w-full shrink-0 gap-4">
            <label className="flex items-center gap-2.5 cursor-pointer group min-w-0">
              <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isSubmitting}
                  className="peer appearance-none w-5 h-5 border border-[#DCDCDA] rounded-md checked:bg-[#121415] checked:border-[#121415] transition-colors cursor-pointer shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200" />
              </div>
              <span
                className={`text-sm font-medium transition-colors select-none truncate ${isSubmitting ? "text-[#4A4E51]/60" : "text-[#4A4E51] group-hover:text-[#121415]"}`}
              >
                Remember me
              </span>
            </label>

            <button
              type="button"
              disabled={isSubmitting}
              className="text-sm font-medium text-[#4A4E51] hover:text-[#121415] transition-colors outline-none focus-visible:underline truncate shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isSubmitting}
          >
            Log in
          </Button>

          <div className="relative mt-4 w-full shrink-0">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#DCDCDA]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-[#4A4E51] text-xs font-bold uppercase">
                Or
              </span>
            </div>
          </div>

          <div className="relative flex flex-col w-full shrink-0">
            <Button
              type="button"
              variant="outline"
              className="w-full opacity-60 cursor-not-allowed pointer-events-none transition-none shadow-none"
              disabled
              icon={GoogleIcon}
            >
              Continue with Google
            </Button>
            <span className="absolute top-1/2 -translate-y-1/2 right-4 bg-[#F5F5F4] text-[#4A4E51] text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg shrink-0 pointer-events-none">
              Soon
            </span>
          </div>

          <p className="text-center text-sm text-[#4A4E51] font-medium mt-4 w-full">
            <span className="mr-1">New to Elara?</span>
            <Link
              href="/signup"
              className="text-[#121415] font-semibold hover:text-[#8A2532] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
            >
              Create an account
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}