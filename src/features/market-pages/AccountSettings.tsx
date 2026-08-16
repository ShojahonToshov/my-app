"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ArrowLeft,
  Save,
  LogOut,
  ShieldAlert,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Dices
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import AuthService from "@/features/market-pages/api/services/AuthService";
import useAuthStore from "@/features/market-pages/stores/authStore";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// Predefined professional, "expensive-looking" matte color combinations
// Each palette is: [Background, Text, Border]
const PREMIUM_PALETTES = [
  ["#F8F9FA", "#0F172A", "#E2E8F0"], // Light Grey / Navy Text / Soft Silver
  ["#E2E8F0", "#1E293B", "#CBD5E1"], // Slate / Dark Slate / Slate Border
  ["#F5F5F0", "#1A1A1A", "#DCDCDA"], // Ivory / Charcoal / Muted Grey
  ["#E3E8E4", "#1A4D2E", "#C5D1C9"], // Soft Sage / Deep Forest / Sage Border
  ["#FCEAEA", "#781D42", "#E8C5C5"], // Muted Blush / Burgundy / Blush Border
  ["#E0F2FE", "#0369A1", "#BAE6FD"], // Ice Blue / Deep Ocean / Sky Border
  ["#F3EFE0", "#432C0A", "#D5CABD"], // Sand / Espresso / Sand Border
  ["#F3E8FF", "#4C1D95", "#D8B4FE"], // Matte Lavender / Plum / Violet Border
  ["#EAE6E1", "#363636", "#D1CCC5"], // Warm Stone / Dark Grey / Greige Border
  ["#EDF2F7", "#2A4365", "#CBD5E0"], // Cool White / Night Blue / Cool Grey
  ["#FAF5FF", "#553C9A", "#E9D8FD"], // Pearl Violet / Deep Royal / Muted Purple
  ["#F0FFF4", "#22543D", "#C6F6D5"], // Mint White / Dark Moss / Pale Green
];

function generateAvatarColors(): string {
  const randomIndex = Math.floor(Math.random() * PREMIUM_PALETTES.length);
  const [bgHex, fgHex, borderHex] = PREMIUM_PALETTES[randomIndex];
  return `colors:${bgHex},${fgHex},${borderHex}`;
}

export default function AccountSettings() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuthStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setName((user.profile?.full_name as string) || user.name || "");
      setEmail(user.email || "");
      setAvatarUrl((user.profile?.avatar_url as string) || "");
    }
  }, [user]);

  const handleGenerateAvatar = () => {
    setAvatarUrl(generateAvatarColors());
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const currentName = (user.profile?.full_name as string) || user.name || "";
      const currentAvatar = (user.profile?.avatar_url as string) || "";
      
      const updates: any = {};
      if (name !== currentName) updates.full_name = name;
      if (avatarUrl !== currentAvatar) updates.avatar_url = avatarUrl;
      
      if (Object.keys(updates).length > 0) {
        await AuthService.updateProfile(user.id, updates);
        updateUser({ 
          name, 
          profile: { ...(user.profile || {}), ...updates } 
        });
      }
      
      setSuccess("Account settings updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error(err);
    } finally {
      logout();
      router.push("/login");
    }
  };
  
  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setIsDeleting(true);
      setTimeout(() => {
        setIsDeleting(false);
        logout();
        router.push("/");
      }, 1500);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-[100dvh] bg-[#ECECEA] flex items-center justify-center font-sans selection:bg-[#8A2532] selection:text-white p-4 sm:p-6 relative text-[#121415] pb-24">
      <Link
        href="/account"
        className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-[#4A4E51] hover:text-[#121415] font-medium text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-lg p-1 z-20"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" />
        <span className="truncate">Back to profile</span>
      </Link>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="w-full max-w-[540px] flex flex-col shrink-0 mt-12 md:mt-0"
      >
        <Card className="p-8 md:p-12 relative overflow-hidden">
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-0 left-0 right-0 bg-[#4A6B53] text-white px-6 py-3 flex items-center gap-2 text-sm font-medium z-10"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <p>{success}</p>
              </motion.div>
            )}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-0 left-0 right-0 bg-[#8A2532] text-white px-6 py-3 flex items-center gap-2 text-sm font-medium z-10"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-8 w-full mt-2">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-[#121415] tracking-tight">
              Account Settings
            </h1>
            <p className="text-sm text-[#4A4E51] font-medium leading-relaxed">
              Manage your personal data and security
            </p>
          </div>
          
          <div className="flex items-center gap-6 mb-8 p-5 bg-[#F5F5F4] border border-[#DCDCDA] rounded-2xl">
            <Avatar 
              name={name || "Guest"} 
              src={avatarUrl || null} 
              size="xl" 
              ring={true}
            />
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-[#121415]">Avatar Style</h3>
              <p className="text-xs text-[#4A4E51] font-medium mb-1 max-w-[200px]">
                Customize your appearance with a unique matte color palette.
              </p>
              <Button 
                type="button" 
                variant="secondary" 
                size="sm"
                icon={Dices}
                onClick={handleGenerateAvatar}
                className="w-max shadow-sm active:scale-95"
              >
                Generate Colors
              </Button>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5 flex flex-col w-full mb-10">
            <Input
              id="account_name"
              label="Your name"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
            />

            <Input
              id="account_email"
              label="Email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
              className="opacity-70 cursor-not-allowed"
            />

            <Input
              id="account_password"
              label="New Password"
              type={showPassword ? "text" : "password"}
              icon={Lock}
              actionIcon={showPassword ? EyeOff : Eye}
              onActionClick={() => setShowPassword(!showPassword)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
            />

            <Button 
              type="submit" 
              variant="secondary" 
              className="w-full mt-2 active:scale-95 disabled:opacity-70" 
              icon={loading ? Loader2 : Save}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </form>

          <div className="border-t border-[#DCDCDA] pt-8 flex flex-col sm:flex-row gap-3 w-full">
            <button 
              onClick={handleLogout}
              type="button"
              className="flex-1 h-12 px-6 bg-white border border-[#DCDCDA] text-[#121415] hover:bg-[#F5F5F4] rounded-full font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
            >
              <LogOut className="w-4 h-4 text-[#4A4E51] shrink-0" />
              <span>Log out</span>
            </button>

            <Button 
              type="button"
              variant="danger" 
              className="flex-1 active:scale-95" 
              icon={isDeleting ? Loader2 : ShieldAlert}
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete account"}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
