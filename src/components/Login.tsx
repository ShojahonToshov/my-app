"use client";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff, Check, Phone, User as UserIcon } from "lucide-react";
import { useLogin } from "@/hooks/useAuth";
import ElaraLogo from "@/components/ElaraLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Card } from "@/components/ui/Card";
import SignupRoleModal from "@/components/SignupRoleModal";

type LoginType = "phone" | "email" | "name";

import { useI18nStore } from "@/stores/i18nStore";
import { useI18n } from "@/hooks/useI18n";

export default function Login() {
  const { t } = useI18n();
  const { form, showPassword, setShowPassword, isSubmitting, handleSubmit } = useLogin("/search");
  const { register, formState: { errors }, setValue } = form;
  
  const [loginType, setLoginType] = useState<LoginType>("phone");
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const handleTypeChange = (type: LoginType) => {
    setLoginType(type);
    setValue("loginType", type);
    setValue("login", ""); // Clear input when switching
  };

  const getLoginProps = () => {
    switch(loginType) {
      case "phone":
        return { icon: Phone, placeholder: "+998 90 123 45 67", label: t("auth.phoneNumber") };
      case "email":
        return { icon: Mail, placeholder: "name@example.com", label: t("auth.emailAddress") };
      case "name":
        return { icon: UserIcon, placeholder: "Username", label: t("auth.username") };
      default:
        return { icon: Phone, placeholder: "+998...", label: t("auth.phoneNumber") };
    }
  };

  const loginProps = getLoginProps();

  return (
    <>
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#ECECEA] font-sans overflow-x-hidden text-[#121415] p-4 sm:p-6 relative">
        <Card className="w-full max-w-[480px] p-6 sm:p-8 md:p-12 flex flex-col">
          <div className="flex justify-center mb-8 shrink-0">
            <ElaraLogo />
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center text-[#121415] tracking-tight w-full">{t("auth.welcomeBack")}</h1>
          <p className="text-sm text-[#4A4E51] text-center mb-6 font-medium w-full leading-relaxed">{t("auth.chooseLogin")}</p>

          {/* Login Type Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-lg mb-6 w-full">
            <button
              type="button"
              onClick={() => handleTypeChange("phone")}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${loginType === "phone" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"}`}
            >{t("auth.phone")}</button>
            <button
              type="button"
              onClick={() => handleTypeChange("email")}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${loginType === "email" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"}`}
            >{t("auth.email")}</button>
            <button
              type="button"
              onClick={() => handleTypeChange("name")}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${loginType === "name" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"}`}
            >{t("auth.name")}</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 flex flex-col w-full">
            {loginType === "phone" ? (
              <Controller
                name="login"
                control={form.control}
                render={({ field }) => (
                  <PhoneInput
                    id="login"
                    label={loginProps.label}
                    placeholder={loginProps.placeholder}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    error={errors?.login?.message}
                  />
                )}
              />
            ) : (
              <Input
                id="login"
                label={loginProps.label}
                type="text"
                icon={loginProps.icon}
                placeholder={loginProps.placeholder}
                disabled={isSubmitting}
                error={errors?.login?.message}
                {...register("login")}
              />
            )}

            <Input
              id="password"
              label={t("auth.password")}
              type={showPassword ? "text" : "password"}
              icon={Lock}
              actionIcon={showPassword ? EyeOff : Eye}
              onActionClick={() => setShowPassword(!showPassword)}
              placeholder="••••••••"
              disabled={isSubmitting}
              error={errors?.password?.message}
              {...register("password")}
            />

            <div className="flex items-center justify-between pt-1 pb-2 w-full shrink-0 gap-4">
              <label className="flex items-center gap-2.5 cursor-pointer group min-w-0">
                <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                  <input
                    type="checkbox"
                    disabled={isSubmitting}
                    className="peer appearance-none w-5 h-5 border border-[#DCDCDA] rounded-md checked:bg-[#121415] checked:border-[#121415] transition-colors cursor-pointer shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
                    {...register("rememberMe")}
                  />
                  <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200" />
                </div>
                <span className={`text-sm font-medium transition-colors select-none ${isSubmitting ? "text-[#4A4E51]/60" : "text-[#4A4E51] group-hover:text-[#121415]"}`}>
                  {t("extra.t393")}</span>
              </label>

              <button
                type="button"
                disabled={isSubmitting}
                className="text-sm font-medium text-[#4A4E51] hover:text-[#121415] transition-colors outline-none focus-visible:underline shrink-0"
              >
                {t("extra.t394")}</button>
            </div>

            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              isLoading={isSubmitting}
            >{useI18nStore.getState().t("extra.t106")}</Button>

            <p className="text-center text-sm text-[#4A4E51] font-medium mt-4 w-full">
              <span className="mr-1">{t("extra.t53")}</span>
              <button
                type="button"
                onClick={() => setIsRoleModalOpen(true)}
                className="text-[#121415] font-semibold hover:underline transition-colors outline-none"
              >
                {t("extra.t395")}</button>
            </p>
          </form>
        </Card>
      </div>

      <SignupRoleModal 
        isOpen={isRoleModalOpen} 
        onClose={() => setIsRoleModalOpen(false)} 
      />
    </>
  );
}
