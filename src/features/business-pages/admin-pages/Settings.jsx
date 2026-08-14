"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Plus, Scissors, Edit2, UserPlus, X, Clock, Banknote, ImagePlus,
  CalendarClock, Users, Store, Phone, MapPin, Trash2, Loader2,
  ChevronDown, CheckCircle2, ShieldAlert, Save, ShieldCheck
} from "lucide-react";

// --- ВСТРОЕННЫЕ UI-КОМПОНЕНТЫ ---
const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    {Icon && <Icon className="w-12 h-12 text-[#DCDCDA] mx-auto mb-4" />}
    <h3 className="text-lg font-semibold text-[#121415] mb-2">{title}</h3>
    {description && <p className="text-sm text-[#4A4E51] max-w-sm mx-auto">{description}</p>}
  </div>
);

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, description }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-[400px] max-w-full rounded-[2rem] p-8 shadow-2xl flex flex-col text-center" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#dc2626]/10 text-[#dc2626]">
          <X className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-semibold text-[#121415] mb-2">{title}</h2>
        <p className="text-sm text-[#4A4E51] font-medium mb-6">{description}</p>
        <div className="flex gap-3 w-full">
          <button type="button" onClick={onClose} className="flex-1 py-3 bg-[#F5F5F4] text-[#121415] border border-[#DCDCDA] rounded-xl font-medium text-sm transition-colors hover:bg-[#ECECEA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
            Отмена
          </button>
          <button type="button" onClick={onConfirm} className="flex-1 py-3 rounded-xl font-medium text-sm shadow-sm transition-all bg-[#dc2626] text-white hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]">
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

function CustomSelect({ value, options, onChange, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    const handleEscape = (e) => { if (e.key === "Escape") setIsOpen(false); };
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        className={`w-full flex items-center justify-between px-4 py-3 bg-[#F5F5F4] border rounded-xl text-sm font-medium text-[#121415] outline-none transition-all focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-1 active:scale-95 ${
          isOpen ? "border-[#121415] bg-white ring-2 ring-[#121415]/10 shadow-sm" : "border-[#DCDCDA] hover:border-[#121415]"
        }`}
      >
        <span className="truncate">{value}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "text-[#121415] rotate-180" : "text-[#8B9194]"}`} />
      </button>
      
      {isOpen && (
        <div role="listbox" className="absolute z-50 w-full min-w-[140px] mt-2 bg-white border border-[#DCDCDA] rounded-2xl shadow-lg max-h-56 overflow-y-auto py-1.5 animate-in fade-in zoom-in-95 duration-200">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              role="option"
              aria-selected={value === opt}
              onClick={(e) => {
                e.preventDefault();
                onChange(opt);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group focus-visible:outline-none focus-visible:bg-[#F5F5F4] ${
                value === opt ? "bg-[#F5F5F4]" : "hover:bg-[#F5F5F4]"
              }`}
            >
              <span className={value === opt ? "font-medium text-[#121415]" : "font-medium text-[#4A4E51] group-hover:text-[#121415]"}>
                {opt}
              </span>
              {value === opt && <CheckCircle2 className="w-4 h-4 text-[#121415] shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
// ---------------------------------------------

const TABS = [
  { id: "profile", label: "Профиль", icon: Store },
  { id: "schedule", label: "График работы", icon: CalendarClock },
  { id: "services", label: "Услуги", icon: Scissors },
  { id: "team", label: "Команда", icon: Users },
  { id: "policies", label: "Защита (No-show)", icon: ShieldAlert },
];

const TIME_OPTIONS = Array.from({ length: 36 }).map((_, i) => {
  const t = (i + 12) * 30; 
  return `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`;
});

const ROLE_OPTIONS = ["Барбер", "Старший барбер", "Топ-мастер"];
const CANCEL_WINDOWS = ["За 2 часа", "За 12 часов", "За 24 часа", "Разрешить в любое время"];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  // Статические данные для отображения вкладок
  const [venueProfile, setVenueProfile] = useState({ 
    name: 'Chop-Chop Barbershop', 
    phone: '+998 90 123 45 67', 
    address: 'ул. Амира Темура, 42' 
  });
  
  const [policies, setPolicies] = useState({
    cancelWindow: "За 12 часов",
    requireCardForLowKarma: true,
    autoBlacklist: false
  });
  
  const [services, setServices] = useState([
    { id: "1", name: "Мужская стрижка", duration: "45 мин", price: "80 000 сум", isActive: true },
    { id: "2", name: "Стрижка + Борода", duration: "1 ч 15 мин", price: "120 000 сум", isActive: true },
  ]);
  
  const [team, setTeam] = useState([
    { id: "1", name: "Али Ахмедов", role: "Топ-мастер", initials: "АА", isActive: true },
    { id: "2", name: "Санжар И.", role: "Барбер", initials: "СИ", isActive: true },
  ]);

  const [schedule, setSchedule] = useState([
    { day: "Понедельник", isActive: true, start: "10:00", end: "20:00" },
    { day: "Вторник", isActive: true, start: "10:00", end: "20:00" },
    { day: "Среда", isActive: true, start: "10:00", end: "20:00" },
    { day: "Четверг", isActive: true, start: "10:00", end: "20:00" },
    { day: "Пятница", isActive: true, start: "10:00", end: "20:00" },
    { day: "Суббота", isActive: true, start: "10:00", end: "18:00" },
    { day: "Воскресенье", isActive: false, start: "10:00", end: "18:00" },
  ]);

  // Состояния модалок
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [newMasterRole, setNewMasterRole] = useState(ROLE_OPTIONS[0]); 
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Визуальные функции переключения
  const toggleDay = (index) => {
    const newSchedule = [...schedule];
    newSchedule[index].isActive = !newSchedule[index].isActive;
    setSchedule(newSchedule);
  };

  const updateScheduleTime = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  const handleToggleService = (id) => {
    setServices(services.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const handleToggleMaster = (id) => {
    setTeam(team.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m));
  };

  const preventDefaultSubmit = (e) => e.preventDefault();

  return (
    <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-[#ECECEA]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 h-auto md:h-20 shrink-0 sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#121415] tracking-tight">Настройки</h1>
          </div>
        </header>

        <div className="px-6 md:px-10 pt-4 shrink-0 bg-[#ECECEA] border-b border-[#DCDCDA]">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)} 
                  className={`flex items-center gap-2 pb-3 font-medium text-sm transition-all border-b-2 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-4 rounded-t-md ${isActive ? "border-[#121415] text-[#121415]" : "border-transparent text-[#4A4E51] hover:text-[#121415]"}`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            
            {/* ПРОФИЛЬ */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#DCDCDA] animate-in fade-in duration-300">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-[#121415] tracking-tight">О компании</h2>
                  <p className="text-sm text-[#4A4E51] font-medium mt-1">Эти данные будут видны клиентам на странице записи</p>
                </div>

                <form onSubmit={preventDefaultSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#121415] mb-3">Логотип заведения</label>
                    <div className="flex items-center gap-6">
                      <button type="button" className="w-24 h-24 rounded-2xl bg-[#F5F5F4] border border-dashed border-[#DCDCDA] flex flex-col items-center justify-center text-[#8B9194] hover:bg-[#ECECEA] hover:border-[#121415] transition-colors cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95">
                        <ImagePlus className="w-6 h-6 mb-1 group-hover:text-[#121415] transition-colors" />
                        <span className="text-xs font-medium">Загрузить</span>
                      </button>
                      <div className="text-sm text-[#4A4E51] font-medium max-w-xs leading-relaxed">
                        Рекомендуемый размер 512x512px. Форматы: JPG, PNG. Не более 2MB.
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#121415] mb-2">Название</label>
                      <div className="relative">
                        <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                        <input required type="text" value={venueProfile.name} onChange={(e) => setVenueProfile({...venueProfile, name: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#121415] mb-2">Телефон для клиентов</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                        <input required type="text" value={venueProfile.phone} onChange={(e) => setVenueProfile({...venueProfile, phone: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#121415] mb-2">Адрес</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-[#8B9194]" />
                      <textarea rows={2} value={venueProfile.address} onChange={(e) => setVenueProfile({...venueProfile, address: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all resize-none placeholder:text-[#8B9194]"></textarea>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#DCDCDA] flex justify-end">
                    <button type="submit" className="px-8 py-3 bg-[#121415] text-white hover:opacity-90 rounded-xl font-medium text-sm shadow-sm transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95 w-full sm:w-auto">
                      Сохранить профиль
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ГРАФИК РАБОТЫ */}
            {activeTab === "schedule" && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#DCDCDA] animate-in fade-in duration-300">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-[#121415] tracking-tight">График работы</h2>
                  <p className="text-sm text-[#4A4E51] font-medium mt-1">Настройте дни и часы, доступные для онлайн-записи</p>
                </div>

                <div className="space-y-3 mb-8">
                  {schedule.map((day, idx) => (
                    <div key={day.day} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-colors ${day.isActive ? "bg-white border-[#DCDCDA] shadow-sm" : "bg-[#F5F5F4] border-[#DCDCDA] opacity-70"}`}>
                      <div className="flex items-center gap-4 w-full sm:w-1/3 mb-4 sm:mb-0">
                        <button type="button" onClick={() => toggleDay(idx)} aria-label={`Переключить ${day.day}`} className={`relative w-10 h-6 rounded-full transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 ${day.isActive ? "bg-[#4a6b53]" : "bg-[#DCDCDA]"}`}>
                          <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${day.isActive ? "translate-x-4" : "translate-x-0"}`}></span>
                        </button>
                        <span className={`font-medium text-sm ${day.isActive ? "text-[#121415]" : "text-[#4A4E51]"}`}>{day.day}</span>
                      </div>

                      {day.isActive ? (
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <CustomSelect 
                            value={day.start} 
                            options={TIME_OPTIONS} 
                            onChange={(val) => updateScheduleTime(idx, "start", val)} 
                            className="w-full sm:w-[120px]"
                          />
                          <span className="text-[#8B9194] font-medium">—</span>
                          <CustomSelect 
                            value={day.end} 
                            options={TIME_OPTIONS} 
                            onChange={(val) => updateScheduleTime(idx, "end", val)} 
                            className="w-full sm:w-[120px]"
                          />
                        </div>
                      ) : (
                        <div className="text-xs font-medium text-[#8B9194] px-4 w-full sm:w-auto text-left sm:text-right">
                          Выходной
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-[#DCDCDA] flex justify-end">
                  <button type="button" className="px-8 py-3 bg-[#121415] text-white hover:opacity-90 rounded-xl font-medium text-sm shadow-sm transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95 w-full sm:w-auto">
                    Применить график
                  </button>
                </div>
              </div>
            )}

            {/* УСЛУГИ */}
            {activeTab === "services" && (
              <div className="animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[#121415] tracking-tight">Услуги и цены</h2>
                    <p className="text-sm text-[#4A4E51] font-medium mt-1">Определите, что клиенты увидят в онлайн-записи</p>
                  </div>
                  <button type="button" onClick={() => setIsServiceModalOpen(true)} className="bg-[#121415] text-white px-5 py-3 rounded-xl text-sm font-medium shadow-sm hover:opacity-90 transition-all flex justify-center items-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95">
                    <Plus className="w-4 h-4" /> Добавить услугу
                  </button>
                </div>

                <div className="space-y-3">
                  {services.length === 0 ? (
                    <EmptyState icon={Scissors} title="Прайс-лист пуст" description="Добавьте свою первую услугу для клиентов." />
                  ) : (
                    services.map((service) => (
                      <div key={service.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border transition-all ${service.isActive ? "bg-white border-[#DCDCDA] shadow-sm" : "bg-[#F5F5F4] border-[#DCDCDA] opacity-60"}`}>
                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                          <button type="button" onClick={() => handleToggleService(service.id)} aria-label="Переключить статус услуги" className={`relative w-11 h-6 rounded-full transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 shrink-0 ${service.isActive ? "bg-[#4a6b53]" : "bg-[#DCDCDA]"}`}>
                            <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${service.isActive ? "translate-x-5" : "translate-x-0"}`}></span>
                          </button>
                          <div>
                            <p className="font-semibold text-[#121415] text-base">{service.name}</p>
                            <p className="text-xs text-[#4A4E51] font-medium flex items-center gap-1 mt-1"><Clock className="w-3.5 h-3.5" /> {service.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                          <span className="font-semibold text-[#121415] text-lg whitespace-nowrap">{service.price}</span>
                          <div className="flex gap-2 shrink-0">
                            <button type="button" className="p-2.5 text-[#8B9194] hover:text-[#121415] hover:bg-[#F5F5F4] rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"><Edit2 className="w-4 h-4" /></button>
                            <button type="button" onClick={() => { setItemToDelete({type: 'service', id: service.id, name: service.name}); setDeleteModalOpen(true); }} className="p-2.5 text-[#8B9194] hover:text-[#dc2626] hover:bg-[#dc2626]/10 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* КОМАНДА */}
            {activeTab === "team" && (
              <div className="animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[#121415] tracking-tight">Команда</h2>
                    <p className="text-sm text-[#4A4E51] font-medium mt-1">Управление мастерами и их доступностью</p>
                  </div>
                  <button type="button" onClick={() => setIsMasterModalOpen(true)} className="bg-white text-[#121415] border border-[#DCDCDA] px-5 py-3 rounded-xl text-sm font-medium hover:bg-[#F5F5F4] hover:border-[#121415] hover:shadow-sm transition-all flex justify-center items-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95">
                    <UserPlus className="w-4 h-4" /> Добавить мастера
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {team.length === 0 ? (
                     <div className="sm:col-span-2"><EmptyState icon={Users} title="Нет сотрудников" description="Добавьте специалистов для начала работы." /></div>
                  ) : (
                    team.map((member) => (
                      <div key={member.id} className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${member.isActive ? "bg-white border-[#DCDCDA] shadow-sm hover:shadow-md" : "bg-[#F5F5F4] border-[#DCDCDA] opacity-60"}`}>
                        <div className="flex justify-between items-start mb-5">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-semibold text-white text-lg shadow-sm shrink-0 ${member.isActive ? "bg-[#121415]" : "bg-[#8B9194]"}`}>{member.initials}</div>
                            <div>
                              <p className="font-semibold text-[#121415] text-lg leading-tight mb-1">{member.name}</p>
                              <span className="inline-flex px-2 py-0.5 rounded-md bg-[#ECECEA] text-[#4A4E51] border border-[#DCDCDA] text-xs font-medium">{member.role}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button type="button" onClick={() => { setItemToDelete({type: 'master', id: member.id, name: member.name}); setDeleteModalOpen(true); }} className="p-2 text-[#8B9194] hover:text-[#dc2626] hover:bg-[#dc2626]/10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-[#DCDCDA]">
                          <span className="text-xs font-medium text-[#4A4E51]">Доступен для записи</span>
                          <button type="button" onClick={() => handleToggleMaster(member.id)} aria-label="Переключить статус мастера" className={`relative w-10 h-6 rounded-full transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 ${member.isActive ? "bg-[#4a6b53]" : "bg-[#DCDCDA]"}`}>
                            <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${member.isActive ? "translate-x-4" : "translate-x-0"}`}></span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            {/* ПОЛИТИКИ (NO-SHOW ЗАЩИТА) */}
            {activeTab === "policies" && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#DCDCDA] animate-in fade-in duration-300">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-[#121415] flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-[#8A2532]" /> Защита от неявок (No-Show)</h2>
                  <p className="text-sm text-[#4A4E51] font-medium mt-1">Настройте правила бронирования, чтобы минимизировать потери от пустых окон.</p>
                </div>

                <div className="space-y-6">
                  <div className="p-5 rounded-2xl border border-[#DCDCDA] bg-[#F5F5F4]/50">
                    <label className="block text-sm font-semibold text-[#121415] mb-1">Окно бесплатной отмены</label>
                    <p className="text-xs text-[#4A4E51] font-medium mb-4">Если клиент отменяет запись позже этого времени, его Рейтинг Надежности будет снижен.</p>
                    <CustomSelect 
                      value={policies.cancelWindow} 
                      options={CANCEL_WINDOWS} 
                      onChange={(val) => setPolicies({...policies, cancelWindow: val})} 
                      className="w-full sm:w-64"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-[#DCDCDA] bg-[#F5F5F4]/50 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#121415] text-sm">Smart Karma Protection</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#4a6b53]/10 text-[#4a6b53] text-xs font-semibold">Рекомендуется</span>
                      </div>
                      <p className="text-xs text-[#4A4E51] font-medium max-w-lg leading-relaxed">
                        Требовать холдирование карты (задаток) только у новых клиентов или тех, чей рейтинг надежности ниже 80%. Постоянные клиенты записываются в 1 клик.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPolicies({...policies, requireCardForLowKarma: !policies.requireCardForLowKarma})} 
                      aria-label="Включить Smart Karma Protection"
                      className={`relative w-11 h-6 rounded-full transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#8A2532] focus-visible:ring-offset-2 shrink-0 ${policies.requireCardForLowKarma ? "bg-[#8A2532]" : "bg-[#DCDCDA]"}`}
                    >
                      <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${policies.requireCardForLowKarma ? "translate-x-5" : "translate-x-0"}`}></span>
                    </button>
                  </div>
                </div>

                <div className="pt-8 mt-6 border-t border-[#DCDCDA] flex justify-end">
                  <button type="button" className="px-8 py-3 bg-[#121415] text-white hover:opacity-90 rounded-xl font-medium text-sm shadow-sm transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95 w-full sm:w-auto">
                    <Save className="w-4 h-4" /> Применить правила
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </main>
      </div>

      {/* МОДАЛКА: НОВАЯ УСЛУГА */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button type="button" aria-label="Закрыть" onClick={() => setIsServiceModalOpen(false)} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F5F4] hover:bg-[#ECECEA] flex items-center justify-center text-[#4A4E51] hover:text-[#121415] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95"><X className="w-4 h-4" /></button>
            <div className="p-6 border-b border-[#DCDCDA]">
              <h2 className="text-xl font-semibold text-[#121415] tracking-tight">Новая услуга</h2>
            </div>
            <form onSubmit={preventDefaultSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#4A4E51] mb-2 uppercase tracking-wider">Название</label>
                <div className="relative">
                  <Scissors className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9194]" />
                  <input autoFocus required name="name" type="text" placeholder="Стрижка" className="w-full pl-10 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl font-medium text-[#121415] focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A4E51] mb-2 uppercase tracking-wider">Минут</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9194]" />
                    <input required name="time" type="number" placeholder="45" defaultValue="45" className="w-full pl-10 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl font-medium text-[#121415] focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A4E51] mb-2 uppercase tracking-wider">Цена (сум)</label>
                  <div className="relative">
                    <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9194]" />
                    <input required name="price" type="number" placeholder="80000" className="w-full pl-10 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl font-medium text-[#121415] focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
                  </div>
                </div>
              </div>
              <button type="submit" onClick={() => setIsServiceModalOpen(false)} className="w-full mt-4 py-3.5 bg-[#121415] text-white rounded-xl font-medium text-sm hover:opacity-90 transition-all flex justify-center items-center shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95">
                Сохранить
              </button>
            </form>
          </div>
        </div>
      )}

      {/* МОДАЛКА: НОВЫЙ МАСТЕР */}
      {isMasterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button type="button" aria-label="Закрыть" onClick={() => setIsMasterModalOpen(false)} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F5F4] hover:bg-[#ECECEA] flex items-center justify-center text-[#4A4E51] hover:text-[#121415] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95"><X className="w-4 h-4" /></button>
            <div className="p-6 border-b border-[#DCDCDA]">
              <h2 className="text-xl font-semibold text-[#121415] tracking-tight">Сотрудник</h2>
            </div>
            <form onSubmit={preventDefaultSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#4A4E51] mb-2 uppercase tracking-wider">Имя и фамилия</label>
                <div className="relative">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9194]" />
                  <input autoFocus required name="name" type="text" placeholder="Алексей К." className="w-full pl-10 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl font-medium text-[#121415] focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#4A4E51] mb-2 uppercase tracking-wider">Должность</label>
                <CustomSelect 
                  value={newMasterRole} 
                  options={ROLE_OPTIONS} 
                  onChange={setNewMasterRole} 
                  className="w-full"
                />
              </div>
              <button type="submit" onClick={() => setIsMasterModalOpen(false)} className="w-full mt-4 py-3.5 bg-[#121415] text-white rounded-xl font-medium text-sm hover:opacity-90 transition-all shadow-sm flex justify-center items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95">
                Сохранить
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ОБЩАЯ МОДАЛКА УДАЛЕНИЯ */}
      <ConfirmModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={() => setDeleteModalOpen(false)} 
        title="Подтвердите удаление" 
        description={`Вы действительно хотите удалить "${itemToDelete?.name}"? Это действие необратимо.`} 
      />
    </div>
  );
}