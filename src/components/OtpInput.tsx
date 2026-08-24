"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";

interface OtpInputProps {
  onVerify: (code: string) => void;
  phone: string;
  autoFillCode?: string;
}

export default function OtpInput({ onVerify, phone, autoFillCode }: OtpInputProps) {
  const [code, setCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    if (autoFillCode) {
      setCode(autoFillCode);
    }
  }, [autoFillCode]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResend = async () => {
    // API request would go here
    console.log(`[Dev] Resend OTP requested for ${phone}`);
    setTimeLeft(30);
    setCanResend(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length === 6) {
      onVerify(code);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-lg font-semibold mb-2 text-center text-gray-800">
        Verify your number
      </h3>
      <p className="text-sm text-gray-500 mb-6 text-center">
        We've sent a 6-digit code to <br />
        <span className="font-medium text-gray-700">{phone}</span>
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-6">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter code"
            className="w-full text-center text-2xl tracking-widest p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#121415] focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <Button
          type="submit"
          variant="secondary"
          className="w-full mb-4 py-3"
          disabled={code.length !== 6}
        >
          Verify
        </Button>
      </form>

      <div className="text-sm text-center">
        {canResend ? (
          <button
            onClick={handleResend}
            className="text-[#121415] hover:underline font-semibold transition-colors"
          >
            Resend code
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
