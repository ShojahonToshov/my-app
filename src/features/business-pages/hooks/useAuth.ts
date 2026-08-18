"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";;
import { useMutation } from "@tanstack/react-query";
import AuthService from "../api/services/AuthService";
import useAuthStore from "../stores/authStore";
import { toast } from "sonner";

export function useLogin() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(false);

  const { login: loginStore } = useAuthStore();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!login || login.trim().length === 0) newErrors.login = "Please enter your email or phone number.";
    if (!password || password.trim().length === 0) newErrors.password = "Please enter your password.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginMutation = useMutation({
    mutationFn: async ({ login, password }: Record<string, string>) => {
      const data = await AuthService.login(login, password);
      if (!data.user) throw new Error("User not found");
      return data.user;
    },
    onSuccess: (user) => {
      toast.success("Successfully signed in");
      // @ts-expect-error user properties might slightly differ from StoreUser but it's safe here
      loginStore(user);
      if (user.profile?.role === "admin" || user.profile?.role === "master") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    },
    onError: () => {
      setErrors({ auth: "Invalid credentials or account not found." });
      toast.error("Sign in failed.");
    }
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    loginMutation.mutate({ login, password });
  };

  return {
    login, setLogin,
    password, setPassword,
    showPassword, setShowPassword,
    rememberMe, setRememberMe,
    isSubmitting: loginMutation.isPending, 
    errors, setErrors,
    handleSubmit
  };
}

export function useSignup(role = "admin", redirectPath = "/admin") {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login: loginStore } = useAuthStore();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name || name.trim().length === 0) newErrors.name = "Please enter your name.";
    if (!login || login.trim().length === 0) newErrors.login = "Please enter your email or phone number.";
    if (!password || password.trim().length === 0) newErrors.password = "Please enter your password.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const signupMutation = useMutation({
    mutationFn: async (newUser: Record<string, string>) => {
      const data = await AuthService.signup(newUser.login, newUser.password, {
        data: {
          full_name: newUser.name,
          role: newUser.role || role,
        }
      });
      if (!data.user) throw new Error("User not created");
      return data.user;
    },
    onSuccess: (user) => {
      toast.success("Registration successful!");
      // @ts-expect-error user properties might slightly differ from StoreUser but it's safe here
      loginStore(user);
      router.push(redirectPath);
    },
    onError: (error: Error) => {
      setErrors({ auth: "An error occurred during registration." });
      toast.error(error?.message || "Error occurred during registration.");
    }
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    signupMutation.mutate({ name, login, password, role });
  };

  return {
    name, setName,
    login, setLogin,
    password, setPassword,
    showPassword, setShowPassword,
    isSubmitting: signupMutation.isPending, 
    errors, setErrors,
    handleSubmit
  };
}
