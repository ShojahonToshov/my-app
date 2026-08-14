"use client";
import React from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  User,
  Trash2,
  Loader2,
  X,
  Users
} from "lucide-react";

// --- Встроенный компонент ConfirmModal для предотвращения ошибок Vite ---
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, description, confirmText, cancelText, isDestructive }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-[400px] max-w-full rounded-[2rem] p-8 shadow-2xl flex flex-col text-center animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isDestructive ? 'bg-[#dc2626]/10 text-[#dc2626]' : 'bg-[#F5F5F4] text-[#4A4E51]'}`}>
          <X className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-semibold text-[#121415] tracking-tight mb-2">{title}</h2>
        <p className="text-sm text-[#4A4E51] font-medium mb-6">{description}</p>
        <div className="flex gap-3 w-full mt-2">
          <button type="button" onClick={onClose} className="flex-1 py-3 bg-white text-[#121415] border border-[#DCDCDA] rounded-xl font-medium text-sm hover:bg-[#F5F5F4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95">
            {cancelText}
          </button>
          <button type="button" onClick={onConfirm} className={`flex-1 py-3 rounded-xl font-medium text-sm text-white transition-all shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] ${isDestructive ? 'bg-[#dc2626] hover:opacity-90' : 'bg-[#121415] hover:opacity-90'}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
// -----------------------------------------------------------------

export default function Schedule() {
  // Статические мок-данные для визуализации
  const selectedDate = "24.07";
  const currentTimeTop = 270; // 12:15 в пикселях от 10:00 (135 минут * 2px)
  const showTimeLine = true;

  const masters = [
    { id: "1", name: "Али Ахмедов", initials: "АА" },
    { id: "2", name: "Санжар И.", initials: "СИ" },
    { id: "3", name: "Марат В.", initials: "МВ" },
    { id: "4", name: "Денис К.", initials: "ДК" },
    { id: "5", name: "Тимур Б.", initials: "ТБ" },
  ];

  return (
    <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <header className="bg-[#ECECEA]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 h-auto md:h-20 shrink-0 sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#121415] tracking-tight">Расписание</h1>
            <p className="text-sm text-[#4A4E51] font-medium mt-0.5">Управление записями и мастерами</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-[#F5F5F4] p-1.5 rounded-xl border border-[#DCDCDA]">
              <button type="button" className="p-1.5 hover:bg-white rounded-lg transition-colors text-[#4A4E51] hover:text-[#121415] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-4 py-1 font-medium text-sm text-[#121415] bg-white rounded-lg shadow-sm border border-[#DCDCDA]">
                {selectedDate}
              </div>
              <button type="button" className="p-1.5 hover:bg-white rounded-lg transition-colors text-[#4A4E51] hover:text-[#121415] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button type="button" className="bg-[#121415] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Новая запись</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-hidden flex flex-col pt-6">
          <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-[#DCDCDA] flex flex-col overflow-hidden">
            
            {/* Горизонтально скроллируемый контейнер */}
            <div className="flex-1 overflow-auto flex flex-col relative scrollbar-hide">
              
              {/* ШАПКА МАСТЕРОВ (Sticky Top) */}
              <div className="flex border-b border-[#DCDCDA] bg-white/90 backdrop-blur-md shrink-0 sticky top-0 z-40 min-w-max">
                <div className="w-16 md:w-20 border-r border-[#DCDCDA] shrink-0 bg-white sticky left-0 z-50"></div>
                {masters.map((master) => (
                  <div key={master.id} className="min-w-[240px] flex-1 py-4 flex flex-col items-center justify-center border-r border-[#DCDCDA]">
                    <div className="w-9 h-9 rounded-full bg-[#121415] text-white flex items-center justify-center text-xs font-medium mb-1.5">
                      {master.initials}
                    </div>
                    <span className="font-semibold text-[#121415] text-sm">{master.name}</span>
                  </div>
                ))}
              </div>

              {/* СЕТКА */}
              <div className="flex-1 flex relative min-w-max pb-10">
                
                {/* Линия текущего времени */}
                {showTimeLine && (
                  <div className="absolute left-16 md:left-20 right-0 z-20 pointer-events-none" style={{ top: `${currentTimeTop}px` }}>
                    <div className="relative border-t-2 border-[#8A2532] shadow-[0_2px_4px_rgba(138,37,50,0.3)]">
                      <div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-[#8A2532] rounded-full"></div>
                    </div>
                  </div>
                )}

                {/* ШКАЛА ВРЕМЕНИ (Sticky Left) */}
                <div className="w-16 md:w-20 bg-white/90 border-r border-[#DCDCDA] shrink-0 text-center select-none pt-2 z-30 sticky left-0 backdrop-blur-md shadow-[2px_0_5px_-2px_rgba(0,0,0,0.02)]">
                  {[...Array(11)].map((_, i) => (
                    <div key={i} className="h-[120px] flex justify-center text-xs font-medium text-[#8B9194]">
                      {10 + i}:00
                    </div>
                  ))}
                </div>

                {/* Фоновая сетка линий */}
                <div className="absolute inset-0 left-16 md:left-20 pointer-events-none flex flex-col z-0">
                  {[...Array(11)].map((_, i) => (
                    <div key={i} className="h-[120px] border-b border-[#F5F5F4] w-full"></div>
                  ))}
                </div>

                {/* ДИНАМИЧЕСКИЕ КОЛОНКИ МАСТЕРОВ С КАРТОЧКАМИ */}
                
                {/* Колонка 1: Али Ахмедов */}
                <div className="min-w-[240px] flex-1 border-r border-[#DCDCDA] relative group cursor-pointer hover:bg-[#F5F5F4]/50 transition-colors z-10">
                  <div className="appointment-card absolute bg-white border border-[#DCDCDA] rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-[#4A4E51] transition-all duration-200 z-20 overflow-hidden flex flex-col group/card" 
                       style={{ top: "0px", height: "88px", left: "calc(0% + 6px)", width: "calc(100% - 12px)" }}>
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#8A2532] rounded-l-2xl"></div>
                    <div className="flex justify-between items-start mb-1 pl-2">
                      <span className="font-semibold text-[#121415] text-sm truncate pr-4">Гость</span>
                      <span className="text-[10px] font-medium bg-[#F5F5F4] px-1.5 py-0.5 rounded-md text-[#4A4E51] border border-[#DCDCDA]">10:00</span>
                    </div>
                    <p className="text-xs text-[#4A4E51] truncate pl-2 mt-0.5">Мужская стрижка</p>
                    <div className="mt-auto flex items-center justify-between pl-2">
                       <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F5F5F4] text-[#4A4E51] border border-[#DCDCDA]">Ожидает</span>
                       <button type="button" className="text-[#8B9194] hover:text-[#dc2626] transition-colors opacity-0 group-hover/card:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>

                {/* Колонка 2: Санжар И. */}
                <div className="min-w-[240px] flex-1 border-r border-[#DCDCDA] relative group cursor-pointer hover:bg-[#F5F5F4]/50 transition-colors z-10">
                  <div className="appointment-card absolute bg-white border border-[#4a6b53]/30 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-[#4a6b53] transition-all duration-200 z-20 overflow-hidden flex flex-col group/card" 
                       style={{ top: "180px", height: "88px", left: "calc(0% + 6px)", width: "calc(100% - 12px)" }}>
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#4a6b53] rounded-l-2xl"></div>
                    <div className="flex justify-between items-start mb-1 pl-2">
                      <span className="font-semibold text-[#121415] text-sm truncate pr-4">Алексей</span>
                      <span className="text-[10px] font-medium bg-[#F5F5F4] px-1.5 py-0.5 rounded-md text-[#4A4E51] border border-[#DCDCDA]">11:30</span>
                    </div>
                    <p className="text-xs text-[#4A4E51] truncate pl-2 mt-0.5">Стрижка + Борода</p>
                    <div className="mt-auto flex items-center justify-between pl-2">
                       <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#e8efe9] text-[#4a6b53] border border-[#4a6b53]/30">В кресле</span>
                       <button type="button" className="text-[#8B9194] hover:text-[#dc2626] transition-colors opacity-0 group-hover/card:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>

                {/* Колонка 3: Марат В. */}
                <div className="min-w-[240px] flex-1 border-r border-[#DCDCDA] relative group cursor-pointer hover:bg-[#F5F5F4]/50 transition-colors z-10">
                  {/* Пустая колонка */}
                </div>

                {/* Колонка 4: Денис К. */}
                <div className="min-w-[240px] flex-1 border-r border-[#DCDCDA] relative group cursor-pointer hover:bg-[#F5F5F4]/50 transition-colors z-10">
                  <div className="appointment-card absolute bg-white border border-[#DCDCDA] rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-[#4A4E51] transition-all duration-200 z-20 overflow-hidden flex flex-col group/card" 
                       style={{ top: "480px", height: "88px", left: "calc(0% + 6px)", width: "calc(100% - 12px)" }}>
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#121415] rounded-l-2xl"></div>
                    <div className="flex justify-between items-start mb-1 pl-2">
                      <span className="font-semibold text-[#121415] text-sm truncate pr-4">Новый Клиент</span>
                      <span className="text-[10px] font-medium bg-[#F5F5F4] px-1.5 py-0.5 rounded-md text-[#4A4E51] border border-[#DCDCDA]">14:00</span>
                    </div>
                    <p className="text-xs text-[#4A4E51] truncate pl-2 mt-0.5">Услуга</p>
                    <div className="mt-auto flex items-center justify-between pl-2">
                       <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F5F5F4] text-[#4A4E51] border border-[#DCDCDA]">Ожидает</span>
                       <button type="button" className="text-[#8B9194] hover:text-[#dc2626] transition-colors opacity-0 group-hover/card:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>

                {/* Колонка 5: Тимур Б. */}
                <div className="min-w-[240px] flex-1 border-r border-[#DCDCDA] relative group cursor-pointer hover:bg-[#F5F5F4]/50 transition-colors z-10">
                  {/* Пустая колонка */}
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Модалка: Быстрая запись (скрыта классом hidden) */}
      <div className="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm">
        <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
          <button type="button" className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F4] hover:bg-[#ECECEA] text-[#4A4E51] hover:text-[#121415] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"><X className="w-4 h-4" /></button>
          <div className="p-8 pb-6 shrink-0 border-b border-[#DCDCDA]">
            <h2 className="text-2xl font-semibold text-[#121415] tracking-tight">Быстрая запись</h2>
          </div>
          <form className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#121415] mb-2">Клиент</label>
              <input autoFocus required name="clientName" type="text" placeholder="Имя клиента" className="w-full px-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                 <label className="block text-sm font-medium text-[#121415] mb-2">Время</label>
                 <input required name="time" type="time" defaultValue="12:00" className="w-full px-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-[#121415] mb-2">Мастер</label>
                 <select 
                   className="w-full px-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all appearance-none"
                 >
                   <option value="1">Али Ахмедов</option>
                   <option value="2">Санжар И.</option>
                 </select>
              </div>
            </div>
            <button type="button" className="w-full mt-6 py-3 bg-[#121415] text-white rounded-xl font-medium text-sm hover:opacity-90 transition-all flex justify-center items-center shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
              Сохранить
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}