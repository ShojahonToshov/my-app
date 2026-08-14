"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";;
import { useMutation } from "@tanstack/react-query";
import AuthService from "../api/services/AuthService";
import { toast } from "sonner";
import useAuthStore from "../stores/authStore";

export function useLogin(redirectPath = "/account") {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(false);

  const { login: loginStore } = useAuthStore();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!login || login.trim().length === 0) newErrors.login = "Р вЂ™Р Р†Р ВµР Т‘Р С‘РЎвЂљР Вµ email Р С‘Р В»Р С‘ РЎвЂљР ВµР В»Р ВµРЎвЂћР С•Р Р….";
    if (!password || password.trim().length === 0) newErrors.password = "Р вЂ™Р Р†Р ВµР Т‘Р С‘РЎвЂљР Вµ Р С—Р В°РЎР‚Р С•Р В»РЎРЉ.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginMutation = useMutation({
    mutationFn: async ({ login, password }: Record<string, string>) => {
      // Р В Р С Р С‘РЎвЂљР В°РЎвЂ Р С‘РЎРЏ Р В°РЎС“РЎвЂљР ВµР Р…РЎвЂљР С‘РЎвЂћР С‘Р С”Р В°РЎвЂ Р С‘Р С‘ РЎвЂЎР ВµРЎР‚Р ВµР В· Р С—Р С•Р В»РЎС“РЎвЂЎР ВµР Р…Р С‘Р Вµ Р Р†РЎРѓР ВµРЎвЂ¦ Р С—Р С•Р В»РЎРЉР В·Р С•Р Р†Р В°РЎвЂљР ВµР В»Р ВµР в„– (Р С•Р С–РЎР‚Р В°Р Р…Р С‘РЎвЂЎР ВµР Р…Р С‘Р Вµ json-server)
      const users = await AuthService.getUsers();
      const user = ((users as unknown) as { id: string; login?: string; password?: string; name: string }[]).find((item) => item.login === login && item.password === password);
      if (!user) throw new Error("User not found");
      return user;
    },
    onSuccess: (user) => {
      toast.success("Р Р€РЎРѓР С—Р ВµРЎв‚¬Р Р…РЎвЂ№Р в„– Р Р†РЎвЂ¦Р С•Р Т‘");
      loginStore(user);
      router.push(redirectPath);
    },
    onError: () => {
      setErrors({ auth: "Р С’Р С”Р С”Р В°РЎС“Р Р…РЎвЂљ Р Р…Р Вµ Р Р…Р В°Р в„–Р Т‘Р ВµР Р…." });
      toast.error("Р С›РЎв‚¬Р С‘Р В±Р С”Р В° Р Р†РЎвЂ¦Р С•Р Т‘Р В°.");
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

  const { login: loginStore } = useAuthStore();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name || name.trim().length === 0) newErrors.name = "Р вЂ™Р Р†Р ВµР Т‘Р С‘РЎвЂљР Вµ Р Р†Р В°РЎв‚¬Р Вµ Р С‘Р С РЎРЏ.";
    if (!login || login.trim().length === 0) newErrors.login = "Р вЂ™Р Р†Р ВµР Т‘Р С‘РЎвЂљР Вµ email Р С‘Р В»Р С‘ РЎвЂљР ВµР В»Р ВµРЎвЂћР С•Р Р….";
    if (!password || password.trim().length === 0) newErrors.password = "Р вЂ™Р Р†Р ВµР Т‘Р С‘РЎвЂљР Вµ Р С—Р В°РЎР‚Р С•Р В»РЎРЉ.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const signupMutation = useMutation({
    mutationFn: async (newUser: Record<string, unknown>) => {
      const usersData = await AuthService.getUsers();
      const userExists = ((usersData as unknown) as { login?: string }[]).find((item) => item.login === newUser.login);
      if (userExists) throw new Error("UserExists");
      
      return (await AuthService.register(newUser)) as unknown as { id: string; name: string; login?: string; password?: string };
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
