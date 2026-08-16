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
      <div className="bg-white w-[400px] max-w-full rounded-[2rem] p-8 shadow-2xl flex flex-col text-center animate-in fade-in zoom-in-95 duration-200" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#dc2626]/10 text-[#dc2626]">
          <X className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-semibold text-[#121415] tracking-tight mb-2">{title}</h2>
        <p className="text-sm text-[#4A4E51] font-medium mb-6">{description}</p>
        <div className="flex gap-3 w-full mt-2">
          <button type="button" onClick={onClose} className="flex-1 py-3 bg-white text-[#121415] border border-[#DCDCDA] rounded-xl font-medium text-sm hover:bg-[#F5F5F4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="flex-1 py-3 rounded-xl font-medium text-sm text-white transition-all shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] bg-[#dc2626] hover:opacity-90">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
// -------------------------------------------------------------

// Static mock data
const INITIAL_CUSTOMERS = [
  { id: 1, name: "Azamat Umarov", initials: "AU", avatarColor: "bg-[#F5F5F4] text-[#121415] border border-[#DCDCDA]", phone: "+998 90 123 45 67", status: "regular", statusColor: "bg-[#8A2532]/10 text-[#8A2532] border-[#8A2532]/20", visits: 24, ltv: "2,450,000 UZS", lastVisit: "Yesterday, 18:20" },
  { id: 2, name: "Dilshod K.", initials: "DK", avatarColor: "bg-[#F5F5F4] text-[#121415] border border-[#DCDCDA]", phone: "+998 93 987 65 43", status: "new", statusColor: "bg-[#e8efe9] text-[#4a6b53] border-[#4a6b53]/30", visits: 1, ltv: "80,000 UZS", lastVisit: "04 July, 12:00" },
  { id: 3, name: "Malika Kh.", initials: "MK", avatarColor: "bg-[#F5F5F4] text-[#121415] border border-[#DCDCDA]", phone: "+998 99 444 55 66", status: "regular", statusColor: "bg-[#8A2532]/10 text-[#8A2532] border-[#8A2532]/20", visits: 12, ltv: "1,120,000 UZS", lastVisit: "28 June, 15:45" },
];

const TABS = [
  { id: "all", label: "All" },
  { id: "regular", label: "Regulars" },
  { id: "new", label: "New" }
];

export default function Customers() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [modal, setModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const filteredCustomers = INITIAL_CUSTOMERS.filter((customer) => {
    const matchesTab = activeTab === "all" || customer.status === activeTab;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = q === "" || 
      customer.name.toLowerCase().includes(q) || 
      customer.phone.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const allFilteredSelected = filteredCustomers.length > 0 && filteredCustomers.every(c => selectedIds.includes(c.id));
  const someSelected = filteredCustomers.some(c => selectedIds.includes(c.id)) && !allFilteredSelected;

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds(prev => prev.filter(id => !filteredCustomers.find(c => c.id === id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...filteredCustomers.map(c => c.id)])]);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white relative">
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="bg-[#ECECEA]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 h-auto md:h-20 shrink-0 sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#121415] tracking-tight">Clients Directory</h1>
            <p className="text-sm text-[#4A4E51] font-medium mt-0.5">Guest history & loyalty analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="hidden sm:flex p-2.5 bg-white border border-[#DCDCDA] text-[#4A4E51] hover:text-[#121415] hover:bg-[#F5F5F4] rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 shadow-sm">
              <Download className="w-5 h-5" />
            </button>
            <button type="button" onClick={() => setModal(true)} className="bg-[#121415] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Client</span>
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
                placeholder="Search by name or phone..." 
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

          <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-[#DCDCDA] overflow-hidden flex flex-col">
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
                    <th className="py-3 px-6">Client</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Visits / LTV</th>
                    <th className="py-3 px-6">Last Visit</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F5F5F4] text-sm">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8">
                        <EmptyState 
                          title={searchQuery ? "No results found" : "No clients found"} 
                          description={searchQuery ? `No clients match "${searchQuery}". Try a different name or phone number.` : `There are no ${activeTab === "regular" ? "regular" : activeTab === "new" ? "new" : ""} clients.`} 
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
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
                          <button type="button" className="p-2 text-[#4A4E51] hover:text-[#4a6b53] hover:bg-[#e8efe9] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6b53]" title="Call">
                            <PhoneCall className="w-4 h-4" />
                          </button>
                          <button type="button" className="p-2 text-[#4A4E51] hover:text-[#121415] hover:bg-[#F5F5F4] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]" title="Message">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <div className="w-px h-4 bg-[#DCDCDA] mx-1"></div>
                          <button type="button" onClick={() => setDeleteModalOpen(true)} className="p-2 text-[#4A4E51] hover:text-[#dc2626] hover:bg-[#dc2626]/10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]" title="Delete">
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
                {filteredCustomers.length === 0 ? (
                  <div className="p-8">
                    <EmptyState 
                      title={searchQuery ? "No results found" : "No clients found"} 
                      description={searchQuery ? `No clients match "${searchQuery}". Try a different name or phone number.` : `There are no ${activeTab === "regular" ? "regular" : activeTab === "new" ? "new" : ""} clients.`} 
                    />
                  </div>
                ) : (
                  filteredCustomers.map((customer) => (
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
                          <p className="text-[10px] font-medium text-[#8B9194] uppercase tracking-widest">Visits</p>
                          <p className="font-semibold text-[#121415]">{customer.visits}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-medium text-[#8B9194] uppercase tracking-widest">Revenue (LTV)</p>
                          <p className="font-semibold text-[#121415]">{customer.ltv}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button type="button" className="flex-1 py-2.5 bg-[#e8efe9] hover:opacity-90 text-[#4a6b53] border border-[#4a6b53]/30 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6b53]">
                          <PhoneCall className="w-4 h-4" /> Call
                        </button>
                        <button type="button" className="flex-1 py-2.5 bg-[#F5F5F4] hover:bg-[#DCDCDA] text-[#121415] border border-[#DCDCDA] rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                          <MessageCircle className="w-4 h-4" /> Message
                        </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button type="button" onClick={() => setModal(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F4] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
              <X className="w-4 h-4" />
            </button>
            <div className="p-8 pb-4 shrink-0">
              <h2 className="text-2xl font-semibold text-[#121415] tracking-tight">New Guest</h2>
            </div>
            <form className="px-8 pb-8 space-y-5">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                <input autoFocus type="text" placeholder="Client name" className="w-full pl-12 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                <input type="tel" placeholder="+998 90 000 00 00" className="w-full pl-12 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
              </div>
              <button type="button" onClick={() => setModal(false)} className="w-full mt-4 py-3 bg-[#121415] text-white rounded-xl font-medium text-sm shadow-sm hover:opacity-90 transition-all flex justify-center items-center active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                Add to Directory
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={() => setDeleteModalOpen(false)} 
        title="Delete Client?" 
        description="Are you sure you want to remove this client from the directory?" 
      />
    </div>
  );
}