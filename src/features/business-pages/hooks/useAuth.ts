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
      // Simulate authentication through retrieving users
      const users = await AuthService.getUsers();
      const user = users.find((item: { login?: string; password?: string; [key: string]: unknown }) => item.login === login && item.password === password);
      if (!user) throw new Error("User not found");
      return user;
    },
    onSuccess: (user) => {
      toast.success("Successfully signed in");
      loginStore(user);
      if (user.role === "admin" || user.role === "master") {
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
      const usersData = await AuthService.getUsers();
      const userExists = usersData.find((item: { login?: string }) => item.login === newUser.login);
      if (userExists) throw new Error("UserExists");
      
      return await AuthService.register(newUser);
    },
    onSuccess: (user) => {
      toast.success("Registration successful!");
      loginStore(user);
      router.push(redirectPath);
    },
    onError: (error) => {
      if (error.message === "UserExists") {
        setErrors({ auth: "An account with this email/login already exists." });
        toast.error("User already exists.");
      } else {
        toast.error("Error occurred during registration.");
      }
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
