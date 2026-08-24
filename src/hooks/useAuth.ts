"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import AuthService from "@/services/customer/AuthService";
import useUser from "@/hooks/useUser";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";

const loginSchema = z.object({
  loginType: z.enum(["phone", "email", "name"]).optional(),
  login: z.string().min(1, "Please enter your email, phone or username."),
  password: z.string().min(1, "Please enter your password."),
  rememberMe: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.loginType === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.login && !emailRegex.test(data.login)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a valid email address.",
        path: ["login"],
      });
    }
  }
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function useLogin(defaultRedirectPath = "/account") {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const { login: loginStore } = useUser();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginType: "phone",
      login: "",
      password: "",
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const data = await AuthService.login(values.login, values.password);
      if (!data.user) throw new Error("User not found");
      return data.user;
    },
    onSuccess: async (user) => {
      toast.success("Signed in successfully");
      loginStore(user);
      
      const role = user.profile?.role;
      if (role === "admin" || role === "staff" || role === "business") {
        router.push("/dashboard");
      } else {
        const redirectParam = searchParams.get("redirect");
        router.push(redirectParam || defaultRedirectPath);
      }
    },
    onError: () => {
      form.setError("login", { type: "manual", message: "Invalid login or password." });
      form.setError("password", { type: "manual", message: "Invalid login or password." });
    }
  });

  const handleSubmit = form.handleSubmit((values) => {
    loginMutation.mutate(values);
  });

  return {
    form,
    showPassword,
    setShowPassword,
    isSubmitting: loginMutation.isPending,
    handleSubmit,
  };
}

const signupSchema = z.object({
  name: z.string().min(1, "Please enter your name."),
  login: z.string().min(1, "Please enter your email or phone number."),
  password: z.string().min(1, "Please enter your password."),
});
export type SignupFormValues = z.infer<typeof signupSchema>;

export function useSignup(defaultRole = "user", defaultRedirectPath = "/account") {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const { login: loginStore } = useUser();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      login: "",
      password: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (values: SignupFormValues) => {
      const data = await AuthService.signup(values.login, values.password, {
        data: {
          full_name: values.name,
          role: defaultRole,
        }
      });
      if (!data.user) throw new Error("User not created");
      return data.user;
    },
    onSuccess: async (user) => {
      toast.success("Account created successfully");
      loginStore(user);
      
      const role = user.profile?.role;
      if (role === "admin" || role === "staff" || role === "business") {
        router.push("/dashboard");
      } else {
        const redirectParam = searchParams.get("redirect");
        router.push(redirectParam || defaultRedirectPath);
      }
    },
    onError: (error: Error) => {
      form.setError("root", { type: "manual", message: "An error occurred during registration." });
      toast.error(error?.message || "Failed to create account");
    }
  });

  const handleSubmit = form.handleSubmit((values) => {
    signupMutation.mutate(values);
  });

  return {
    form,
    showPassword,
    setShowPassword,
    isSubmitting: signupMutation.isPending,
    handleSubmit,
  };
}
