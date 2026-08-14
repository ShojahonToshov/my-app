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
    if (!login || login.trim().length === 0) newErrors.login = "Введите email или телефон.";
    if (!password || password.trim().length === 0) newErrors.password = "Введите пароль.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginMutation = useMutation({
    mutationFn: async ({ login, password }: Record<string, string>) => {
      // Имитация аутентификации через получение всех пользователей (ограничение json-server)
      const users = await AuthService.getUsers();
      const user = users.find((item: { login?: string; password?: string; [key: string]: unknown }) => item.login === login && item.password === password);
      if (!user) throw new Error("User not found");
      return user;
    },
    onSuccess: (user) => {
      toast.success("Успешный вход");
      loginStore(user);
      if (user.role === "admin" || user.role === "master") {
        router.push("/portal");
      } else {
        router.push("/account");
      }
    },
    onError: () => {
      setErrors({ auth: "Аккаунт не найден." });
      toast.error("Ошибка входа.");
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

export function useSignup(role = "admin", redirectPath = "/onboarding") {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login: loginStore } = useAuthStore();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name || name.trim().length === 0) newErrors.name = "Введите ваше имя.";
    if (!login || login.trim().length === 0) newErrors.login = "Введите email или телефон.";
    if (!password || password.trim().length === 0) newErrors.password = "Введите пароль.";
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
      toast.success("Р В Р ВµР С–Р С‘РЎРѓРЎвЂљРЎР‚Р В°РЎвЂ Р С‘РЎРЏ РЎС“РЎРѓР С—Р ВµРЎв‚¬Р Р…Р В°!");
      loginStore(user);
      router.push(redirectPath);
    },
    onError: (error) => {
      if (error.message === "UserExists") {
        setErrors({ auth: "Р С’Р С”Р С”Р В°РЎС“Р Р…РЎвЂљ РЎРѓ РЎвЂљР В°Р С”Р С‘Р С  email РЎС“Р В¶Р Вµ РЎРѓРЎС“РЎвЂ°Р ВµРЎРѓРЎвЂљР Р†РЎС“Р ВµРЎвЂљ." });
        toast.error("Р СџР С•Р В»РЎРЉР В·Р С•Р Р†Р В°РЎвЂљР ВµР В»РЎРЉ РЎС“Р В¶Р Вµ РЎРѓРЎС“РЎвЂ°Р ВµРЎРѓРЎвЂљР Р†РЎС“Р ВµРЎвЂљ.");
      } else {
        toast.error("Р СџРЎР‚Р С•Р С‘Р В·Р С•РЎв‚¬Р В»Р В° Р С•РЎв‚¬Р С‘Р В±Р С”Р В° Р С—РЎР‚Р С‘ РЎР‚Р ВµР С–Р С‘РЎРѓРЎвЂљРЎР‚Р В°РЎвЂ Р С‘Р С‘.");
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
