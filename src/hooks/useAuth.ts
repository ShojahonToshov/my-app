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
  login: z.string().min(1, "Please enter your email or phone number."),
  password: z.string().min(1, "Please enter your password."),
  rememberMe: z.boolean().optional(),
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
      toast.success("Successfully signed in");
      loginStore(user);
      
      const supabase = createClient();
      await supabase.auth.refreshSession();
      
      const role = user.profile?.role;
      if (role === "admin" || role === "staff" || role === "business") {
        router.push("/dashboard");
      } else {
        const redirectParam = searchParams.get("redirect");
        router.push(redirectParam || defaultRedirectPath);
      }
    },
    onError: () => {
      form.setError("root", { type: "manual", message: "Invalid credentials or account not found." });
      toast.error("Sign in failed.");
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
      toast.success("Registration successful!");
      loginStore(user);
      
      const supabase = createClient();
      await supabase.auth.refreshSession();
      
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
      toast.error(error?.message || "Error occurred during registration.");
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
