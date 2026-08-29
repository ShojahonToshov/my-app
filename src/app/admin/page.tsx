"use client";
import { useI18n } from "@/hooks/useI18n";
import { useI18nStore } from "@/stores/i18nStore";


import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getAdminUsers, deleteAdminUser, deleteAllAdminUsers } from "./actions";

export interface AdminUser {
  id: string;
  email?: string;
  phone?: string;
  created_at: string;
  profile?: {
    full_name?: string;
    role?: string;
    [key: string]: unknown;
  };
  business_name?: string;
  [key: string]: unknown;
}

export default function AdminPage() {
  const { t } = useI18n();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean; mode: 'single' | 'all'; targetId?: string}>({ isOpen: false, mode: 'single' });

  useEffect(() => {
    const savedState = localStorage.getItem("admin_logged_in");
    if (savedState === "true") {
      setIsLoggedIn(true);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUsers();
    }
  }, [isLoggedIn]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getAdminUsers();
      setUsers(data || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login === "admin" && password === "0000") {
      setIsLoggedIn(true);
      localStorage.setItem("admin_logged_in", "true");
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  const handleDeleteClick = (id: string) => {
    setModalConfig({ isOpen: true, mode: 'single', targetId: id });
  };

  const handleDeleteAllClick = () => {
    setModalConfig({ isOpen: true, mode: 'all' });
  };

  const confirmDelete = async () => {
    try {
      if (modalConfig.mode === 'single' && modalConfig.targetId) {
        await deleteAdminUser(modalConfig.targetId);
        setUsers(users.filter(u => u.id !== modalConfig.targetId));
      } else if (modalConfig.mode === 'all') {
        await deleteAllAdminUsers();
        setUsers([]);
      }
      setModalConfig({ isOpen: false, mode: 'single' });
    } catch (e: unknown) {
      alert("Failed to delete: " + (e instanceof Error ? e.message : "Unknown error"));
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("admin_logged_in");
    setUsers([]);
  };

  if (!isHydrated) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-sm w-full border border-gray-100">
          <h1 className="text-2xl font-bold text-center mb-8 text-[#121415]">{useI18nStore.getState().t("extra.t238")}</h1>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Input
                label={useI18nStore.getState().t("extra.t177")}
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full"
                id="login"
              />
            </div>
            <div>
              <Input
                type="password"
                label={useI18nStore.getState().t("extra.t113")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                id="password"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
            <Button type="submit" className="w-full mt-2" size="lg">{useI18nStore.getState().t("extra.t177")}</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-[#121415]">{useI18nStore.getState().t("extra.t227")}</h1>
            <p className="text-sm text-gray-500 mt-1">{t("extra.t415")}{users.length}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="danger" onClick={handleDeleteAllClick} disabled={users.length === 0}>
              {t("extra.t416")}</Button>
            <Button variant="outline" onClick={fetchUsers} isLoading={isLoading}>
              {t("extra.t417")}</Button>
            <Button variant="secondary" onClick={handleLogout}>
              {t("extra.t418")}</Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8F9FA] text-[#8B9194] border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">{useI18nStore.getState().t("extra.t298")}</th>
                  <th className="px-6 py-4 font-medium">{useI18nStore.getState().t("extra.t208")}</th>
                  <th className="px-6 py-4 font-medium">{useI18nStore.getState().t("extra.t299")}</th>
                  <th className="px-6 py-4 font-medium text-right">{useI18nStore.getState().t("extra.t332")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#121415]">
                {isLoading && users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                      {t("extra.t419")}</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                      {t("extra.t420")}</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#F8F9FA] transition-colors group">
                      <td className="px-6 py-4 align-top">
                        <div className="space-y-1.5">
                          <div className="text-[14px]">
                            <span className="text-gray-400 mr-2 inline-block w-12">{useI18nStore.getState().t("extra.t135")}</span>
                            <span className="font-semibold text-gray-900">
                              {user.phone ? (user.phone.startsWith('+') ? user.phone : '+' + user.phone) : <span className="italic text-gray-400 font-normal">{useI18nStore.getState().t("extra.t105")}</span>}
                            </span>
                          </div>
                          <div className="text-[14px]">
                            <span className="text-gray-400 mr-2 inline-block w-12">{useI18nStore.getState().t("extra.t145")}</span>
                            <span className="font-semibold text-gray-900">
                              {user.email ? user.email : <span className="italic text-gray-400 font-normal">{useI18nStore.getState().t("extra.t105")}</span>}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-400 mt-2 font-mono flex items-center">
                            <span className="mr-2">{useI18nStore.getState().t("extra.t206")}</span>{user.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="space-y-1 text-[13px]">
                          {user.profile ? (
                            <>
                              {user.profile.full_name && <div><span className="text-gray-400 mr-2">{useI18nStore.getState().t("extra.t195")}</span><span className="font-medium">{user.profile.full_name}</span></div>}
                              {user.profile.role && <div><span className="text-gray-400 mr-2">{useI18nStore.getState().t("extra.t179")}</span><span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[11px] uppercase font-bold tracking-wider">{user.profile.role}</span></div>}
                              {user.business_name && (
                                <div className="mt-2">
                                  <span className="text-gray-400 mr-2">{useI18nStore.getState().t("extra.t286")}</span>
                                  <span className="text-sm font-black text-[#8A2532] uppercase tracking-wide">{user.business_name}</span>
                                </div>
                              )}
                              <details className="mt-3 text-xs text-gray-400 cursor-pointer group-open">
                                <summary className="hover:text-gray-600 outline-none">{useI18nStore.getState().t("extra.t133")}</summary>
                                <pre className="mt-2 p-3 bg-[#F8F9FA] border border-gray-100 rounded-lg whitespace-pre-wrap font-mono text-[11px] text-gray-600 overflow-x-auto">
                                  {JSON.stringify({
                                    id: user.id,
                                    email: user.email,
                                    phone: user.phone,
                                    created_at: user.created_at,
                                    last_sign_in_at: user.last_sign_in_at,
                                    app_metadata: user.app_metadata,
                                    user_metadata: user.user_metadata,
                                    identities: user.identities,
                                    profile: user.profile
                                  }, null, 2)}
                                </pre>
                              </details>
                            </>
                          ) : (
                            <span className="text-gray-400 italic">{useI18nStore.getState().t("extra.t205")}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top text-gray-500 text-[13px]">
                        {new Date(user.created_at).toLocaleDateString()} <br/>
                        <span className="text-gray-400 text-[11px]">{new Date(user.created_at).toLocaleTimeString()}</span>
                      </td>
                      <td className="px-6 py-4 align-top text-right">
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleDeleteClick(user.id)}
                        >{useI18nStore.getState().t("extra.t243")}</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {modalConfig.mode === 'all' ? t("extra.t421") : t("extra.t422")}
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              {modalConfig.mode === 'all' 
                ? t("extra.t423")
                : t("extra.t424")}
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setModalConfig({ isOpen: false, mode: 'single' })}>{useI18nStore.getState().t("extra.t284")}</Button>
              <Button variant="danger" onClick={confirmDelete}>
                {t("extra.t425")}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
