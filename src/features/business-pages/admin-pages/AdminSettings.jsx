"use client";
import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Save,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Key,
  Eye,
  EyeOff
} from "lucide-react";

export default function AdminSettings() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <header className="bg-[#ECECEA]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 h-auto md:h-20 shrink-0 sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#121415] tracking-tight">Профиль администратора</h1>
            <p className="text-sm text-[#4A4E51] font-medium mt-1 hidden sm:block">
              Управление учетной записью и безопасностью
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4a6b53]/10 border border-[#4a6b53]/20 text-[#4a6b53] text-xs font-semibold shadow-sm">
              <ShieldCheck className="w-4 h-4" /> Владелец
            </span>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto flex justify-center items-start">
          <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Личные данные */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#DCDCDA] animate-in fade-in duration-300">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-[#121415] tracking-tight">Личные данные</h2>
                  <p className="text-sm text-[#4A4E51] font-medium mt-1">Они используются для входа в систему</p>
                </div>

                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#121415] mb-2">Имя</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                      <input
                        type="text"
                        defaultValue="Иван Иванов"
                        className="w-full pl-12 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#121415] mb-2">Email / Логин</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                      <input
                        type="text"
                        defaultValue="admin@superqueue.com"
                        className="w-full pl-12 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#121415] mb-2">Пароль</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        defaultValue="password123"
                        className="w-full pl-12 pr-12 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#8B9194] hover:text-[#121415] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-lg"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end border-t border-[#DCDCDA]">
                    <button
                      type="button"
                      className="w-full sm:w-auto px-8 py-3 bg-[#121415] text-white hover:opacity-90 rounded-xl font-medium text-sm shadow-sm transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      Сохранить изменения
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: Действия и Опасная зона */}
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#DCDCDA] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F5F5F4] flex items-center justify-center shrink-0 border border-[#DCDCDA]">
                  <Key className="w-5 h-5 text-[#4A4E51]" />
                </div>
                <div>
                  <p className="font-semibold text-[#121415] text-sm">Двухфакторная защита</p>
                  <button type="button" className="text-xs font-medium text-[#4a6b53] hover:text-[#38513f] mt-0.5 transition-colors focus-visible:outline-none focus-visible:underline">
                    Включить 2FA
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#DCDCDA] flex flex-col gap-3">
                <h3 className="text-xs font-semibold text-[#8B9194] uppercase tracking-wider mb-2">Управление сессией</h3>
                <button type="button" className="w-full py-3 bg-white text-[#121415] hover:bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95">
                  <LogOut className="w-4 h-4 text-[#4A4E51]" /> Выйти из аккаунта
                </button>
              </div>

              <div className="bg-white p-6 pl-7 rounded-3xl shadow-sm border border-[#dc2626]/30 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#dc2626]"></div>
                <h3 className="text-xs font-semibold text-[#dc2626] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Опасная зона
                </h3>
                <p className="text-[12px] text-[#4A4E51] font-medium mb-3 leading-relaxed">
                  Удаление аккаунта приведет к потере доступа к CRM и всем клиентским базам.
                </p>
                <button type="button" className="w-full py-3 bg-white text-[#dc2626] hover:bg-[#dc2626]/10 border border-[#dc2626] rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] active:scale-95">
                  Удалить аккаунт
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}