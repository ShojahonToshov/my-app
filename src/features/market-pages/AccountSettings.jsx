"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ArrowLeft,
  Save,
  LogOut,
  ShieldAlert,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function AccountSettings() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-[#ECECEA] flex items-center justify-center font-sans selection:bg-[#8A2532] selection:text-white p-4 sm:p-6 relative text-[#121415]">
      <Link
        href="/account"
        className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-[#4A4E51] hover:text-[#121415] font-medium text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-lg p-1"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" />
        <span className="truncate">Back to profile</span>
      </Link>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="w-full max-w-[540px] flex flex-col shrink-0"
      >
        <Card className="p-8 md:p-12">
          <div className="mb-8 w-full">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-[#121415] tracking-tight">
              Account Settings
            </h1>
            <p className="text-sm text-[#4A4E51] font-medium leading-relaxed">
              Manage your personal data and security
            </p>
          </div>

          <form className="space-y-5 flex flex-col w-full mb-10">
            <Input
              id="account_name"
              label="Your name"
              icon={User}
              defaultValue="Guest"
            />

            <Input
              id="account_email"
              label="Email or phone"
              icon={Mail}
              defaultValue="guest@elara.com"
            />

            <Input
              id="account_password"
              label="Password"
              type={showPassword ? "text" : "password"}
              icon={Lock}
              actionIcon={showPassword ? EyeOff : Eye}
              onActionClick={() => setShowPassword(!showPassword)}
              defaultValue="password123"
            />

            <Button variant="secondary" className="w-full mt-2 active:scale-95" icon={Save}>
              Save changes
            </Button>
          </form>

          <div className="border-t border-[#DCDCDA] pt-8 flex flex-col sm:flex-row gap-3 w-full">
            <button className="flex-1 h-12 px-6 bg-white border border-[#DCDCDA] text-[#121415] hover:bg-[#F5F5F4] rounded-full font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
              <LogOut className="w-4 h-4 text-[#4A4E51] shrink-0" />
              <span>Log out</span>
            </button>

            <Button variant="danger" className="flex-1 active:scale-95" icon={ShieldAlert}>
              Delete account
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}