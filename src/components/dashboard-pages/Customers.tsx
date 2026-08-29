"use client";
import { useI18nStore } from "@/stores/i18nStore";
import { useI18n } from "@/hooks/useI18n";
import React, { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { CustomerService } from "@/services/CustomerService";
import { queryKeys } from "@/lib/queryKeys";

import type { Customer, CustomerData } from "@/types";
import {
  Search,
  Plus,
  Phone,
  User,
  X,
  Trash2,
  Users,
  MessageCircle,
  PhoneCall
} from "lucide-react";
import { PhoneInput } from "@/components/ui/PhoneInput";

// --- Built-in components ---
interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
}

const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    {Icon && <Icon className="w-12 h-12 text-[#8B9194] mx-auto mb-4" />}
    <h3 className="text-lg font-medium text-[#121415] mb-2">{title}</h3>
    {description && <p className="text-sm text-[#4A4E51] max-w-sm mx-auto">{description}</p>}
  </div>
);

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, description }: ConfirmModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-[400px] max-w-full rounded-2xl p-8 shadow-2xl flex flex-col text-center animate-in fade-in zoom-in-95 duration-200" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#dc2626]/10 text-[#dc2626]">
          <X className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-semibold text-[#121415] tracking-tight mb-2">{title}</h2>
        <p className="text-sm text-[#4A4E51] font-medium mb-6">{description}</p>
        <div className="flex gap-3 w-full mt-2">
          <button type="button" onClick={onClose} className="flex-1 py-3 bg-white text-[#121415] border border-[#DCDCDA] rounded-xl font-medium text-sm hover:bg-[#F5F5F4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95">{useI18n().t("app.t16")}</button>
          <button type="button" onClick={onConfirm} className="flex-1 py-3 rounded-xl font-medium text-sm text-white transition-all shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] bg-[#dc2626] hover:opacity-90">{useI18nStore.getState().t("extra.t243")}</button>
        </div>
      </div>
    </div>
  );
};
// -------------------------------------------------------------

const TABS = [
  { id: "all", label: "All" },
  { id: "regular", label: "Regulars" },
  { id: "new", label: "New" }
];

export default function Customers() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const customerService = new CustomerService(supabase);

  const { data: customersData = [], isLoading } = useQuery({
    queryKey: queryKeys.customers.all,
    queryFn: async () => {
      const res = await customerService.getCustomers();
      return res || [];
    }
  });

  const formattedCustomers = (customersData as CustomerData[]).map((c) => {
    if (typeof c.id === "number") return c;
    const words = (c.name || "Unknown").trim().split(/\s+/);
    const initials = words.length >= 2 
      ? (words[0][0] + words[1][0]).toUpperCase() 
      : words[0].substring(0, 2).toUpperCase();

    return {
      id: c.id,
      name: c.name || "Unknown",
      initials,
      avatarColor: "bg-[#F5F5F4] text-[#121415] border border-[#DCDCDA]",
      phone: c.phone || "No phone",
      status: c.status || "new",
      statusColor: c.status === "regular" ? "bg-[#8A2532]/10 text-[#8A2532] border-[#8A2532]/20" : "bg-[#e8efe9] text-[#4a6b53] border-[#4a6b53]/30",
      visits: c.visits || 0,
      ltv: c.ltv || "0 UZS",
      lastVisit: c.lastVisit || "Never"
    } as CustomerData;
  });

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [modal, setModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | number | null>(null);

  const [newCustomerName, setNewClientName] = useState("");
  const [newCustomerPhone, setNewClientPhone] = useState("");

  const createCustomerMutation = useMutation({
    mutationFn: async (newCustomer: Partial<Customer>) => {
      return await customerService.createClient(newCustomer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      toast.success("Customer added successfully");
      setModal(false);
      setNewClientName("");
      setNewClientPhone("");
    },
    onError: (error) => {
      toast.error("Failed to add customer");
      console.error(error);
    }
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: async (id: string | number) => {
      return await customerService.deleteCustomer(id.toString());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      toast.success("Customer deleted successfully");
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== customerToDelete));
    },
    onError: (error) => {
      toast.error("Failed to delete customer");
      console.error(error);
    }
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) {
      toast.error("Please enter name and phone number");
      return;
    }

    createCustomerMutation.mutate({
      name: newCustomerName,
      phone: newCustomerPhone,
      status: "new"
    });
  };

  const filteredCustomers = formattedCustomers.filter((customer: CustomerData) => {
    const matchesTab = activeTab === "all" || customer.status === activeTab;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = q === "" || 
      customer.name.toLowerCase().includes(q) || 
      customer.phone.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const allFilteredSelected = filteredCustomers.length > 0 && filteredCustomers.every((c: CustomerData) => selectedIds.includes(c.id));
  const someSelected = filteredCustomers.some((c: CustomerData) => selectedIds.includes(c.id)) && !allFilteredSelected;

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds(prev => prev.filter(id => !filteredCustomers.find((c: CustomerData) => c.id === id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...filteredCustomers.map((c: CustomerData) => c.id)])]);
    }
  };

  const toggleSelect = (id: string | number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white relative">
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="bg-[#F5F5F4]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 h-auto md:h-20 shrink-0 sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#121415] tracking-tight">{useI18nStore.getState().t("extra.t226")}</h1>
            <p className="text-sm text-[#4A4E51] font-medium mt-0.5">{useI18nStore.getState().t("extra.t246")}</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setModal(true)} className="bg-[#121415] text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">{t("extra.t1")}</span>
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 p-6 md:p-10 overflow-hidden flex flex-col gap-6 relative">
          
          {/* SEARCH & TABS */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
            <div className="w-full sm:w-96 relative group">
              <Search className="w-5 h-5 text-[#8B9194] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#121415] transition-colors pointer-events-none" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={useI18nStore.getState().t("extra.t172")} 
                className="w-full pl-12 pr-10 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium placeholder:text-[#8B9194] focus:outline-none focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 shadow-sm transition-all" 
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-[#DCDCDA] hover:bg-[#121415] text-[#4A4E51] hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 bg-[#F5F5F4] p-1.5 rounded-xl border border-[#DCDCDA] w-full sm:w-auto overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => (
                <button 
                  key={tab.id} 
                  type="button"
                  onClick={() => setActiveTab(tab.id)} 
                  className={`shrink-0 px-5 py-1.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] whitespace-nowrap ${activeTab === tab.id ? "bg-white text-[#121415] shadow-sm border border-[#DCDCDA]" : "text-[#4A4E51] hover:text-[#121415] border border-transparent"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-[#DCDCDA] overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto relative scrollbar-hide">
              
              {/* DESKTOP TABLE */}
              <table className="hidden lg:table w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F4]/80 border-b border-[#DCDCDA] text-[10px] font-medium text-[#8B9194] uppercase tracking-wider sticky top-0 z-10 backdrop-blur-sm">
                    <th className="py-3 pl-6 pr-2 w-10">
                      <input 
                        type="checkbox" 
                        ref={el => { if (el) el.indeterminate = someSelected; }}
                        checked={allFilteredSelected}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-[#121415] bg-white border-[#DCDCDA] rounded focus:ring-[#121415] cursor-pointer accent-[#121415]" 
                      />
                    </th>
                    <th className="py-3 px-6">{t("app.t43")}</th>
                    <th className="py-3 px-6">{t("app.t44")}</th>
                    <th className="py-3 px-6">{useI18nStore.getState().t("extra.t311")}</th>
                    <th className="py-3 px-6">{useI18nStore.getState().t("extra.t127")}</th>
                    <th className="py-3 px-6 text-right">{t("app.t45")}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F5F5F4] text-sm">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="py-3 pl-6 pr-2">
                          <div className="w-4 h-4 bg-[#DCDCDA] rounded" />
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#DCDCDA]" />
                            <div className="flex flex-col gap-1.5">
                              <div className="w-32 h-4 bg-[#DCDCDA] rounded" />
                              <div className="w-24 h-3 bg-[#DCDCDA] rounded" />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="w-16 h-6 bg-[#DCDCDA] rounded-md" />
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex flex-col gap-1.5">
                            <div className="w-16 h-4 bg-[#DCDCDA] rounded" />
                            <div className="w-12 h-3 bg-[#DCDCDA] rounded" />
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="w-20 h-4 bg-[#DCDCDA] rounded" />
                        </td>
                        <td className="py-3 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#DCDCDA]" />
                            <div className="w-8 h-8 rounded-lg bg-[#DCDCDA]" />
                            <div className="w-px h-4 bg-[#DCDCDA] mx-1" />
                            <div className="w-8 h-8 rounded-lg bg-[#DCDCDA]" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8">
                        <EmptyState 
                          title={searchQuery ? "No results found" : "No customers found"} 
                          description={searchQuery ? `No customers match "${searchQuery}". Try a different name or phone number.` : `There are no ${activeTab === "regular" ? "regular" : activeTab === "new" ? "new" : ""} customers.`} 
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer: any) => (
                    <tr key={customer.id} className={`transition-colors group ${selectedIds.includes(customer.id) ? "bg-[#F5F5F4]" : "hover:bg-[#F5F5F4]/50"}`}>
                      <td className="py-3 pl-6 pr-2">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(customer.id)}
                          onChange={() => toggleSelect(customer.id)}
                          className="w-4 h-4 text-[#121415] bg-white border-[#DCDCDA] rounded focus:ring-[#121415] cursor-pointer accent-[#121415]" 
                        />
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl font-medium text-sm flex items-center justify-center shrink-0 ${customer.avatarColor}`}>
                            {customer.initials}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-[#121415] text-sm">{customer.name}</span>
                            <span className="text-xs text-[#4A4E51] mt-0.5">{customer.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider border ${customer.statusColor}`}>
                          {customer.status === "regular" ? "Regular" : "New"}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex flex-col">
                          <span className="text-[#121415] font-medium">{customer.visits} visits</span>
                          <span className="text-xs font-medium text-[#8B9194] mt-0.5">{customer.ltv}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-[#4A4E51] font-medium">{customer.lastVisit}</td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-1 transition-opacity">
                          <button type="button" onClick={() => toast.info("Feature coming soon")} className="p-2 text-[#4A4E51] hover:text-[#4a6b53] hover:bg-[#e8efe9] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6b53]" title={useI18nStore.getState().t("extra.t169")}>
                            <PhoneCall className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => toast.info("Feature coming soon")} className="p-2 text-[#4A4E51] hover:text-[#121415] hover:bg-[#F5F5F4] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]" title={useI18nStore.getState().t("extra.t181")}>
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <div className="w-px h-4 bg-[#DCDCDA] mx-1"></div>
                          <button type="button" onClick={() => {
                            setCustomerToDelete(customer.id);
                            setDeleteModalOpen(true);
                          }} className="p-2 text-[#4A4E51] hover:text-[#dc2626] hover:bg-[#dc2626]/10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]" title={useI18nStore.getState().t("extra.t243")}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>

              {/* MOBILE VIEW */}
              <div className="lg:hidden flex flex-col divide-y divide-[#F5F5F4]">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-5 bg-white animate-pulse">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#DCDCDA]" />
                          <div className="flex flex-col gap-2">
                            <div className="w-32 h-4 bg-[#DCDCDA] rounded" />
                            <div className="w-24 h-3 bg-[#DCDCDA] rounded" />
                          </div>
                        </div>
                        <div className="w-16 h-6 bg-[#DCDCDA] rounded-md" />
                      </div>
                      <div className="flex items-center justify-between bg-[#F5F5F4] p-3 rounded-xl border border-[#DCDCDA] mb-4">
                        <div className="flex flex-col gap-2">
                          <div className="w-12 h-3 bg-[#DCDCDA] rounded" />
                          <div className="w-8 h-4 bg-[#DCDCDA] rounded" />
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <div className="w-20 h-3 bg-[#DCDCDA] rounded" />
                          <div className="w-16 h-4 bg-[#DCDCDA] rounded" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 h-10 bg-[#DCDCDA] rounded-xl" />
                        <div className="flex-1 h-10 bg-[#DCDCDA] rounded-xl" />
                      </div>
                    </div>
                  ))
                ) : filteredCustomers.length === 0 ? (
                  <div className="p-8">
                    <EmptyState 
                      title={searchQuery ? "No results found" : "No customers found"} 
                      description={searchQuery ? `No customers match "${searchQuery}". Try a different name or phone number.` : `There are no ${activeTab === "regular" ? "regular" : activeTab === "new" ? "new" : ""} customers.`} 
                    />
                  </div>
                ) : (
                  filteredCustomers.map((customer: any) => (
                    <div key={customer.id} className="p-5 bg-white hover:bg-[#F5F5F4] transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl font-medium flex items-center justify-center shrink-0 ${customer.avatarColor}`}>
                            {customer.initials}
                          </div>
                          <div>
                            <p className="font-semibold text-[#121415] text-base tracking-tight leading-tight">{customer.name}</p>
                            <p className="text-sm text-[#4A4E51] mt-0.5">{customer.phone}</p>
                          </div>
                        </div>
                        <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider border ${customer.statusColor}`}>
                          {customer.status === "regular" ? "Regular" : "New"}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between bg-[#F5F5F4] p-3 rounded-xl border border-[#DCDCDA] mb-4">
                        <div>
                          <p className="text-[10px] font-medium text-[#8B9194] uppercase tracking-widest">{t("app.t42")}</p>
                          <p className="font-semibold text-[#121415]">{customer.visits}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-medium text-[#8B9194] uppercase tracking-widest">{useI18nStore.getState().t("extra.t221")}</p>
                          <p className="font-semibold text-[#121415]">{customer.ltv}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button type="button" onClick={() => toast.info("Feature coming soon")} className="flex-1 py-2.5 bg-[#e8efe9] hover:opacity-90 text-[#4a6b53] border border-[#4a6b53]/30 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6b53]">
                          <PhoneCall className="w-4 h-4" />{useI18nStore.getState().t("extra.t169")}</button>
                        <button type="button" onClick={() => toast.info("Feature coming soon")} className="flex-1 py-2.5 bg-[#F5F5F4] hover:bg-[#DCDCDA] text-[#121415] border border-[#DCDCDA] rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                          <MessageCircle className="w-4 h-4" />{useI18nStore.getState().t("extra.t181")}</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* ADD CLIENT MODAL */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm" onClick={() => setModal(false)}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button type="button" onClick={() => setModal(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F4] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
              <X className="w-4 h-4" />
            </button>
            <div className="p-8 pb-4 shrink-0">
              <h2 className="text-2xl font-semibold text-[#121415] tracking-tight">{useI18nStore.getState().t("extra.t103")}</h2>
            </div>
            <form className="px-8 pb-8 space-y-5" onSubmit={handleAddCustomer}>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                <input 
                  autoFocus 
                  type="text" 
                  value={newCustomerName}
                  onChange={e => setNewClientName(e.target.value)}
                  placeholder={useI18nStore.getState().t("extra.t170")} 
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" 
                />
              </div>
              <PhoneInput 
                id="customer_phone"
                name="customer_phone"
                value={newCustomerPhone}
                onChange={(val) => setNewClientPhone(val)}
                placeholder="+998 90 000 00 00" 
                inputClassName="!bg-[#F5F5F4] !py-3 !border-[#DCDCDA] text-[#121415] focus:!bg-white focus:!border-[#121415]" 
              />
              <button disabled={createCustomerMutation.isPending} type="submit" className="w-full mt-4 py-3 bg-[#121415] text-white rounded-xl font-medium text-sm shadow-sm hover:opacity-90 transition-all flex justify-center items-center active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] disabled:opacity-70">
                {createCustomerMutation.isPending ? "Adding..." : "Add to Directory"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal 
        isOpen={deleteModalOpen} 
        onClose={() => {
          setDeleteModalOpen(false);
          setCustomerToDelete(null);
        }} 
        onConfirm={() => {
          if (customerToDelete !== null) {
            deleteCustomerMutation.mutate(customerToDelete);
          }
        }} 
        title={useI18nStore.getState().t("extra.t272")} 
        description="Are you sure you want to remove this customer from the directory?" 
      />
    </div>
  );
}


