"use client";
import { useI18n } from "@/hooks/useI18n";
import { useI18nStore } from "@/stores/i18nStore";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/Button";

interface OtpInputProps {
  onVerify: (code: string) => void | Promise<void>;
  phone: string;
  autoFillCode?: string;
}

export default function OtpInput({ onVerify, phone, autoFillCode }: OtpInputProps) {
  const { t } = useI18n();

  const [code, setCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const onVerifyRef = useRef(onVerify);
  const lastVerifiedCodeRef = useRef<string>('');
  const isVerifyingRef = useRef(false);

  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  const formRef = useRef<HTMLFormElement>(null);

  // Автозаполнение кода
  useEffect(() => {
    if (autoFillCode) {
      setCode(String(autoFillCode));
    }
  }, [autoFillCode]);

  // Авто-верификация когда код заполнен (6 цифр)
  useEffect(() => {
    if (code.length === 6 && code !== lastVerifiedCodeRef.current && !isVerifyingRef.current) {
      const timerId = setTimeout(async () => {
        if (isVerifyingRef.current || code !== String(code)) return;
        lastVerifiedCodeRef.current = code;
        isVerifyingRef.current = true;
        setIsVerifying(true);
        try {
          await onVerifyRef.current(code);
        } catch (err) {
          console.error("[OtpInput] Auto-verify error:", err);
        } finally {
          isVerifyingRef.current = false;
          setIsVerifying(false);
        }
      }, 300);
      return () => clearTimeout(timerId);
    }
  }, [code]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResend = async () => {
    console.log(`[Dev] Resend OTP requested for ${phone}`);
    setTimeLeft(30);
    setCanResend(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length === 6 && !isVerifyingRef.current) {
      isVerifyingRef.current = true;
      setIsVerifying(true);
      try {
        await onVerify(code);
      } finally {
        isVerifyingRef.current = false;
        setIsVerifying(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-lg font-semibold mb-2 text-center text-gray-800">
        {t("extra.t398")}</h3>
      <p className="text-sm text-gray-500 mb-6 text-center">
        We've sent a 6-digit code to <br />
        <span className="font-medium text-gray-700">{phone}</span>
      </p>

      <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-6">
          <label htmlFor="otp-code" className="sr-only">Enter code</label>
          <input
            id="otp-code"
            name="otp-code"
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder={useI18nStore.getState().t("extra.t329")}
            className="w-full text-center text-2xl tracking-widest p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#121415] focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            required
            disabled={isVerifying}
          />
        </div>

        <Button
          type="submit"
          variant="secondary"
          className="w-full mb-4 py-3"
          disabled={code.length !== 6 || isVerifying}
          isLoading={isVerifying}
        >
          {isVerifying ? "Verifying..." : t("extra.t399")}
        </Button>
      </form>

      <div className="text-sm text-center">
        {canResend ? (
          <button
            onClick={handleResend}
            className="text-[#121415] hover:underline font-semibold transition-colors"
          >
            {t("extra.t400")}
          </button>
        ) : (
          <span className="text-gray-500 font-medium">
            Resend available in {timeLeft}s
          </span>
        )}
      </div>
    </div>
  );
}
