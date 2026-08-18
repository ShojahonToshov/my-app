"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import AuthService from "../api/services/AuthService";
import { toast } from "sonner";
import useUser from "@/hooks/useUser";

export function useLogin(redirectPath = "/account") {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(false);

  const { login: loginStore } = useUser();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!login || login.trim().length === 0) newErrors.login = "Please enter a valid email address.";
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
      toast.success("Signed in successfully");
            loginStore(user);
      const route = user.profile?.role === 'business' ? '/admin' : redirectPath;
      router.push(route);
    },
    onError: (error: Error) => {
      setErrors({ auth: "Invalid login credentials." });
      toast.error(error?.message || "Authentication error.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    loginMutation.mutate({ login, password });
  };

  return {
    login, setLogin,
    password, setPassword,
    showPassword, setShowPassword,
    isSubmitting: loginMutation.isPending,
    errors, setErrors,
    rememberMe, setRememberMe,
    handleSubmit
  };
}

export function useSignup(role = "user", redirectPath = "/account") {
  const router = useRouter();

  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login: loginStore } = useUser();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name || name.trim().length === 0) newErrors.name = "Please enter your name.";
    if (!login || login.trim().length === 0) newErrors.login = "Please enter a valid email address.";
    if (!password || password.trim().length < 6) newErrors.password = "Password must be at least 6 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const signupMutation = useMutation({
    mutationFn: async ({ name, login, password, role }: Record<string, string>) => {
      const data = await AuthService.signup(login, password, {
        data: {
          full_name: name,
          role: role,
        }
      });
      if (!data.user) throw new Error("User not created");
      return data.user;
    },
    onSuccess: (user) => {
      toast.success("Registration completed successfully!");
            loginStore(user);
      const route = user.profile?.role === 'business' ? '/admin' : redirectPath;
      router.push(route);
    },
    onError: (error) => {
      toast.error(error?.message || "An error occurred during registration.");
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
