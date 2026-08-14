"use client";
import React, { useState } from "react";
import {
  Search,
  Download,
  Plus,
  Phone,
  User,
  X,
  Trash2,
  Users,
  MessageCircle,
  PhoneCall
} from "lucide-react";

// --- Встроенные компоненты для предотвращения ошибок Vite ---
const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    {Icon && <Icon className="w-12 h-12 text-[#8B9194] mx-auto mb-4" />}
    <h3 className="text-lg font-medium text-[#121415] mb-2">{title}</h3>
    {description && <p className="text-sm text-[#4A4E51] max-w-sm mx-auto">{description}</p>}
  </div>
);

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, description }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-[400px] max-w-full rounded-[2rem] p-8 shadow-2xl flex flex-col text-center animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#dc2626]/10 text-[#dc2626]">
          <X className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-semibold text-[#121415] tracking-tight mb-2">{title}</h2>
        <p className="text-sm text-[#4A4E51] font-medium mb-6">{description}</p>
        <div className="flex gap-3 w-full mt-2">
          <button type="button" onClick={onClose} className="flex-1 py-3 bg-white text-[#121415] border border-[#DCDCDA] rounded-xl font-medium text-sm hover:bg-[#F5F5F4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95">
            Отмена
          </button>
          <button type="button" onClick={onConfirm} className="flex-1 py-3 rounded-xl font-medium text-sm text-white transition-all shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] bg-[#dc2626] hover:opacity-90">
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};
// -------------------------------------------------------------

// Статические мок-данные
const INITIAL_CUSTOMERS = [
  { id: 1, name: "Азамат Умаров", initials: "АУ", avatarColor: "bg-[#F5F5F4] text-[#121415] border border-[#DCDCDA]", phone: "+998 90 123 45 67", status: "regular", statusColor: "bg-[#8A2532]/10 text-[#8A2532] border-[#8A2532]/20", visits: 24, ltv: "2 450 000 сум", lastVisit: "Вчера, 18:20" },
  { id: 2, name: "Дилшод К.", initials: "ДК", avatarColor: "bg-[#F5F5F4] text-[#121415] border border-[#DCDCDA]", phone: "+998 93 987 65 43", status: "new", statusColor: "bg-[#e8efe9] text-[#4a6b53] border-[#4a6b53]/30", visits: 1, ltv: "80 000 сум", lastVisit: "04 июля, 12:00" },
  { id: 3, name: "Малика Х.", initials: "МХ", avatarColor: "bg-[#F5F5F4] text-[#121415] border border-[#DCDCDA]", phone: "+998 99 444 55 66", status: "regular", statusColor: "bg-[#8A2532]/10 text-[#8A2532] border-[#8A2532]/20", visits: 12, ltv: "1 120 000 сум", lastVisit: "28 июня, 15:45" },
];

const TABS = [
  { id: "all", label: "Все" },
  { id: "regular", label: "Постоянные" },
  { id: "new", label: "Новые" }
];

export default function Customers() {
  const [activeTab, setActiveTab] = useState("all");
  const [modal, setModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white relative">
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="bg-[#ECECEA]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 h-auto md:h-20 shrink-0 sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#121415] tracking-tight">База клиентов</h1>
            <p className="text-sm text-[#4A4E51] font-medium mt-0.5">История гостей и аналитика</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="hidden sm:flex p-2.5 bg-white border border-[#DCDCDA] text-[#4A4E51] hover:text-[#121415] hover:bg-[#F5F5F4] rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 shadow-sm">
              <Download className="w-5 h-5" />
            </button>
            <button type="button" onClick={() => setModal(true)} className="bg-[#121415] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Добавить</span>
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 p-6 md:p-10 overflow-hidden flex flex-col gap-6 relative">
          
          {/* SEARCH & TABS */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
            <div className="w-full sm:w-96 relative group">
              <Search className="w-5 h-5 text-[#8B9194] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#121415] transition-colors" />
              <input 
                type="text" 
                placeholder="Поиск по имени или телефону..." 
                className="w-full pl-12 pr-10 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium placeholder:text-[#8B9194] focus:outline-none focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 shadow-sm transition-all" 
              />
            </div>

            <div className="flex items-center gap-1 bg-[#F5F5F4] p-1.5 rounded-xl border border-[#DCDCDA] w-full sm:w-auto overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => (
                <button 
                  key={tab.id} 
                  type="button"
                  onClick={() => setActiveTab(tab.id)} 
                  className={`shrink-0 px-5 py-1.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] whitespace-nowrap ${activeTab === tab.id ? "bg-white text-[#121415] shadow-sm border border-[#DCDCDA]" : "text-[#4A4E51] hover:text-[#121415] border border-transparent"}`}
                >
                  {tab.label} {tab.id === "all" && `(${INITIAL_CUSTOMERS.length})`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-[#DCDCDA] overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto relative scrollbar-hide">
              
              {/* DESKTOP TABLE */}
              <table className="hidden lg:table w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F4]/80 border-b border-[#DCDCDA] text-[10px] font-medium text-[#8B9194] uppercase tracking-wider sticky top-0 z-10 backdrop-blur-sm">
                    <th className="py-3 pl-6 pr-2 w-10">
                      <input type="checkbox" className="w-4 h-4 text-[#121415] bg-white border-[#DCDCDA] rounded focus:ring-[#121415] cursor-pointer accent-[#121415]" />
                    </th>
                    <th className="py-3 px-6">Клиент</th>
                    <th className="py-3 px-6">Статус</th>
                    <th className="py-3 px-6">Визиты / LTV</th>
                    <th className="py-3 px-6">Последний визит</th>
                    <th className="py-3 px-6 text-right">Действия</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F5F5F4] text-sm">
                  {INITIAL_CUSTOMERS.map((customer) => (
                    <tr key={customer.id} className="transition-colors group hover:bg-[#F5F5F4]/50">
                      <td className="py-3 pl-6 pr-2">
                        <input type="checkbox" className="w-4 h-4 text-[#121415] bg-white border-[#DCDCDA] rounded focus:ring-[#121415] cursor-pointer accent-[#121415]" />
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
                          {customer.status === "regular" ? "Постоянный" : "Новый"}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex flex-col">
                          <span className="text-[#121415] font-medium">{customer.visits} визитов</span>
                          <span className="text-xs font-medium text-[#8B9194] mt-0.5">{customer.ltv}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-[#4A4E51] font-medium">{customer.lastVisit}</td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" className="p-2 text-[#8B9194] hover:text-[#4a6b53] hover:bg-[#e8efe9] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6b53]" title="Позвонить">
                            <PhoneCall className="w-4 h-4" />
                          </button>
                          <button type="button" className="p-2 text-[#8B9194] hover:text-[#121415] hover:bg-[#F5F5F4] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]" title="Написать">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <div className="w-px h-4 bg-[#DCDCDA] mx-1"></div>
                          <button type="button" onClick={() => setDeleteModalOpen(true)} className="p-2 text-[#8B9194] hover:text-[#dc2626] hover:bg-[#dc2626]/10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]" title="Удалить">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* MOBILE VIEW */}
              <div className="lg:hidden flex flex-col divide-y divide-[#F5F5F4]">
                {INITIAL_CUSTOMERS.map((customer) => (
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
                        {customer.status === "regular" ? "Пост." : "Новый"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#F5F5F4] p-3 rounded-xl border border-[#DCDCDA] mb-4">
                      <div>
                        <p className="text-[10px] font-medium text-[#8B9194] uppercase tracking-widest">Визиты</p>
                        <p className="font-semibold text-[#121415]">{customer.visits}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-medium text-[#8B9194] uppercase tracking-widest">Выручка (LTV)</p>
                        <p className="font-semibold text-[#121415]">{customer.ltv}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button type="button" className="flex-1 py-2.5 bg-[#e8efe9] hover:opacity-90 text-[#4a6b53] border border-[#4a6b53]/30 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6b53]">
                        <PhoneCall className="w-4 h-4" /> Позвонить
                      </button>
                      <button type="button" className="flex-1 py-2.5 bg-[#F5F5F4] hover:bg-[#DCDCDA] text-[#121415] border border-[#DCDCDA] rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                        <MessageCircle className="w-4 h-4" /> Написать
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* МОДАЛКА: ДОБАВИТЬ КЛИЕНТА */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button type="button" onClick={() => setModal(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F4] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
              <X className="w-4 h-4" />
            </button>
            <div className="p-8 pb-4 shrink-0">
              <h2 className="text-2xl font-semibold text-[#121415] tracking-tight">Новый гость</h2>
            </div>
            <form className="px-8 pb-8 space-y-5">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                <input autoFocus type="text" placeholder="Имя клиента" className="w-full pl-12 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                <input type="tel" placeholder="+998 90 000 00 00" className="w-full pl-12 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
              </div>
              <button type="button" onClick={() => setModal(false)} className="w-full mt-4 py-3 bg-[#121415] text-white rounded-xl font-medium text-sm shadow-sm hover:opacity-90 transition-all flex justify-center items-center active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                Добавить в базу
              </button>
            </form>
          </div>
        </div>
      )}

      {/* МОДАЛКА: ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ */}
      <ConfirmModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={() => setDeleteModalOpen(false)} 
        title="Удалить клиента?" 
        description="Удалить данные клиента из базы?" 
      />
    </div>
  );
}