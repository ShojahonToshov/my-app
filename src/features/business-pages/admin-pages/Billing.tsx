"use client";
import React, { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  Download,
  AlertCircle,
  Sliders,
  X,
  ShieldCheck,
  Lock,
  ArrowRight,
  Star,
  Check,
  HelpCircle,
  Users,
  TrendingUp,
  Sparkles
} from "lucide-react";

// --- ВСТРОЕННЫЕ UI-КОМПОНЕНТЫ ---

interface UsageBarProps {
  label: string;
  current: number;
  max: number;
  unit?: string;
}

function UsageBar({ label, current, max, unit = "" }: UsageBarProps) {
  const percentage = Math.min((current / max) * 100, 100);
  
  // Использование цветов дизайн-системы: успех (#4a6b53), внимание (amber) и опасность (#dc2626)
  let colorClass = "bg-[#4a6b53]";
  if (percentage >= 70 && percentage < 90) colorClass = "bg-amber-500";
  if (percentage >= 90) colorClass = "bg-[#dc2626]";

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-[#4A4E51]">{label}</span>
        <span className="font-medium text-[#121415]">
          {current.toLocaleString('ru-RU')} из {max.toLocaleString('ru-RU')} {unit}
        </span>
      </div>
      <div className="w-full h-2.5 bg-[#F5F5F4] rounded-full overflow-hidden border border-[#DCDCDA]/50">
        <div className={`h-full rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

interface FeatureItemProps {
  text: string;
  isDark?: boolean;
}

function FeatureItem({ text, isDark = false }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-white/10' : 'bg-[#e8efe9]'}`}>
        <Check className={`w-3 h-3 ${isDark ? 'text-white' : 'text-[#4a6b53]'}`} />
      </div>
      <span className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-[#121415]'}`}>{text}</span>
    </div>
  );
}

function PricingCards() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#121415] tracking-tight text-center mb-4">
          Выберите подходящий тариф
        </h2>
        <p className="text-[#4A4E51] font-medium text-center max-w-xl text-sm md:text-base">
          Простые и прозрачные цены для любого бизнеса. Экономьте до 20% при оплате за год.
        </p>
      </div>

      <div className="flex items-center gap-1 mb-10 bg-[#F5F5F4] p-1.5 rounded-xl border border-[#DCDCDA]">
        <button
          type="button"
          onClick={() => setIsAnnual(false)}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] ${
            !isAnnual
              ? "bg-white text-[#121415] shadow-sm border border-[#DCDCDA]"
              : "text-[#4A4E51] hover:text-[#121415] border border-transparent"
          }`}
        >
          Ежемесячно
        </button>
        <button
          type="button"
          onClick={() => setIsAnnual(true)}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] ${
            isAnnual
              ? "bg-white text-[#121415] shadow-sm border border-[#DCDCDA]"
              : "text-[#4A4E51] hover:text-[#121415] border border-transparent"
          }`}
        >
          Ежегодно <span className="text-[10px] bg-[#8A2532] text-white px-2 py-0.5 rounded-md uppercase tracking-wider font-semibold">-20%</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto items-stretch">
        {/* Basic Plan */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#DCDCDA] shadow-sm flex flex-col transition-all hover:shadow-md">
          <div className="mb-6">
            <span className="text-xs font-semibold text-[#4A4E51] uppercase tracking-wider bg-[#F5F5F4] px-3 py-1.5 rounded-lg border border-[#DCDCDA]">Starter</span>
            <div className="mt-5 flex items-end gap-1.5">
              <span className="text-4xl font-semibold text-[#121415] tracking-tight">
                {isAnnual ? "350 000" : "420 000"}
              </span>
              <span className="text-sm font-medium text-[#8B9194] mb-1">сум / мес</span>
            </div>
            <p className="text-sm text-[#4A4E51] font-medium mt-3">Идеально для небольших салонов и частных мастеров.</p>
          </div>

          <div className="flex-1 space-y-4 mb-8">
            <FeatureItem text="До 2 активных мастеров" />
            <FeatureItem text="500 записей в месяц" />
            <FeatureItem text="Базовая аналитика" />
            <FeatureItem text="Поддержка в рабочее время" />
          </div>

          <button type="button" className="w-full py-3 bg-white text-[#121415] border border-[#DCDCDA] rounded-xl font-medium text-sm hover:bg-[#F5F5F4] hover:border-[#121415]/20 transition-all shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
            Начать со Starter
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-[#121415] rounded-2xl p-6 md:p-8 shadow-md flex flex-col relative transform md:-translate-y-2 border border-[#121415]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="bg-[#8A2532] text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-md shadow-sm flex items-center gap-1.5 border border-[#8A2532]">
              <Star className="w-3 h-3 fill-current" /> Самый популярный
            </span>
          </div>
          <div className="mb-6 mt-2">
            <span className="text-xs font-semibold text-white uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">Business Pro</span>
            <div className="mt-5 flex items-end gap-1.5">
              <span className="text-4xl font-semibold text-white tracking-tight">
                {isAnnual ? "650 000" : "780 000"}
              </span>
              <span className="text-sm font-medium text-white/60 mb-1">сум / мес</span>
            </div>
            <p className="text-sm text-white/80 font-medium mt-3">Для сетей и локаций с высоким трафиком и запросами.</p>
          </div>

          <div className="flex-1 space-y-4 mb-8">
            <FeatureItem text="До 10 активных мастеров" isDark />
            <FeatureItem text="Неограниченное число записей" isDark />
            <FeatureItem text="Расширенная аналитика и экспорт" isDark />
            <FeatureItem text="Приоритетная поддержка 24/7" isDark />
            <FeatureItem text="Интеграция по API" isDark />
          </div>

          <button type="button" className="w-full py-3 bg-white text-[#121415] rounded-xl font-medium text-sm hover:bg-[#F5F5F4] transition-all shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            Перейти на Business Pro
          </button>
        </div>
      </div>
    </div>
  );
}

function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mt-8 py-6 border-y border-[#DCDCDA] w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-3 text-[#4A4E51]">
        <Lock className="w-5 h-5 text-[#8B9194]" />
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#121415] leading-none mb-1">256-bit Secure</span>
          <span className="text-[10px] font-medium leading-none text-[#8B9194]">SSL Encryption</span>
        </div>
      </div>
      
      <div className="hidden sm:block w-px h-8 bg-[#DCDCDA]"></div>

      <div className="flex items-center gap-3 text-[#4A4E51]">
        <ShieldCheck className="w-5 h-5 text-[#4a6b53]" />
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#121415] leading-none mb-1">14-Day Guarantee</span>
          <span className="text-[10px] font-medium leading-none text-[#8B9194]">Money-back</span>
        </div>
      </div>

      <div className="hidden sm:block w-px h-8 bg-[#DCDCDA]"></div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
          <div className="h-7 w-11 bg-white border border-[#DCDCDA] rounded-md text-[10px] font-bold italic text-[#121415] flex items-center justify-center shadow-sm">
            VISA
          </div>
          <div className="h-7 w-11 bg-white border border-[#DCDCDA] rounded-md flex items-center justify-center shadow-sm">
            <div className="flex">
              <div className="w-3 h-3 rounded-full bg-red-500/80 -mr-1"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: "А если мне не понравится?",
      a: "Мы предлагаем 14-дневную гарантию возврата средств. Если вы поймете, что платформа вам не подходит, мы вернем деньги без лишних вопросов."
    },
    {
      q: "Как отменить подписку?",
      a: "Отменить подписку можно в любой момент в личном кабинете. Списания прекратятся сразу же, а доступ к платформе сохранится до конца оплаченного периода."
    },
    {
      q: "Можно ли поменять тариф позже?",
      a: "Да, вы можете перейти на тариф Business Pro или обратно на Starter в любой момент. Стоимость будет пересчитана автоматически."
    },
    {
      q: "Безопасно ли привязывать карту?",
      a: "Абсолютно. Мы используем защищенные платежные шлюзы, сертифицированные по стандарту PCI DSS. Мы не храним данные вашей карты на своих серверах."
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mt-16">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-10 h-10 bg-white border border-[#DCDCDA] rounded-xl flex items-center justify-center mb-4 shadow-sm text-[#4A4E51]">
          <HelpCircle className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-semibold text-[#121415] tracking-tight mb-2">
          Частые вопросы
        </h2>
        <p className="text-sm text-[#4A4E51] font-medium">
          Всё, что нужно знать перед принятием решения.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 border border-[#DCDCDA] shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-[#121415] mb-2">{faq.q}</h3>
            <p className="text-sm text-[#4A4E51] font-medium leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SalesTriggers() {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-12 px-4">
      <h3 className="text-xs font-semibold text-[#8B9194] uppercase tracking-widest text-center mb-6">
        Нам доверяют 500+ салонов и клиник
      </h3>
      
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
        <div className="text-lg font-bold italic tracking-tighter flex items-center gap-1.5 text-[#121415]">
          <Sparkles className="w-4 h-4 text-[#8A2532]" />
          GlamourLife
        </div>
        <div className="text-lg font-bold tracking-tight flex items-center gap-1.5 text-[#121415]">
          <Users className="w-4 h-4 text-[#4a6b53]" />
          NailBar 24/7
        </div>
        <div className="text-lg font-bold uppercase tracking-widest flex items-center gap-1.5 text-[#121415]">
          <TrendingUp className="w-4 h-4 text-[#121415]" />
          BarberBro
        </div>
        <div className="text-lg font-bold italic tracking-wider flex items-center gap-1.5 text-[#121415]">
          SkinMed Clinic
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------

export default function Billing() {
  const [modal, setModal] = useState(false);

  return (
    <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-[#ECECEA]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 h-auto md:h-20 shrink-0 sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#121415] tracking-tight">Подписка и биллинг</h1>
            <p className="text-sm text-[#4A4E51] font-medium mt-0.5">Управление тарифом и платежами</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#4a6b53] bg-[#e8efe9] border border-[#4a6b53]/30 px-3 py-1.5 rounded-lg shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#4a6b53] animate-pulse"></span>
            <span>Система активна</span>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col">
          {/* SAAS SHOWCASE SECTION */}
          <div className="w-full px-6 md:px-10 py-10 md:py-16 shrink-0">
            <PricingCards />
            <TrustBadges />
            <SalesTriggers />
          </div>

          <div className="w-full h-px bg-[#DCDCDA] shrink-0"></div>

          {/* CURRENT USAGE AND MANAGEMENT */}
          <div className="w-full px-6 md:px-10 py-10 pb-16 flex flex-col gap-6 max-w-full">
            <div className="flex flex-col items-start mb-2">
              <h2 className="text-xl font-semibold text-[#121415] tracking-tight">Текущее использование</h2>
              <p className="text-sm text-[#4A4E51] font-medium mt-0.5">Статистика и управление текущим тарифом</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0">
              {/* ТАРИФ */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-5 md:p-6 border border-[#DCDCDA] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-[#121415] bg-[#F5F5F4] border border-[#DCDCDA] px-2.5 py-1 rounded-md uppercase tracking-wider">Текущий план</span>
                    <h2 className="text-xl font-semibold tracking-tight text-[#121415] mt-3">SuperQueue Business Pro</h2>
                    <p className="text-sm font-medium text-[#4A4E51]">Для сетей и локаций с высоким трафиком</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xl font-semibold text-[#121415] tracking-tight">650 000 <span className="text-sm">сум</span></p>
                    <p className="text-xs font-medium text-[#8B9194] mt-0.5">/ ежемесячно</p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-[#F5F5F4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#4A4E51] bg-[#F5F5F4] px-3 py-1.5 rounded-lg border border-[#DCDCDA]">
                    <CheckCircle2 className="w-4 h-4 text-[#4a6b53]" />
                    <span>Списание: <strong className="text-[#121415]">12 августа 2026 г.</strong></span>
                  </div>
                </div>
              </div>

              {/* МЕТОД ОПЛАТЫ */}
              <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#DCDCDA] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div className="space-y-1 w-full">
                    <span className="text-xs font-semibold text-[#8B9194] uppercase tracking-wider">Метод оплаты</span>
                    <div className="flex items-center gap-4 mt-3 p-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl w-full">
                      <div className="w-12 h-8 bg-[#121415] rounded flex items-center justify-center text-xs text-white font-semibold shrink-0 shadow-sm">VISA</div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#121415] tracking-tight">•••• 4242</span>
                        <span className="text-[10px] text-[#8B9194] font-medium mt-0.5 uppercase">До 12/28</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-auto">
                  <button type="button" onClick={() => setModal(true)} className="w-full py-2.5 bg-white border border-[#DCDCDA] text-[#121415] font-medium text-sm rounded-xl hover:bg-[#F5F5F4] hover:border-[#121415]/20 transition-colors shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                    Изменить карту
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0 items-stretch min-h-[300px]">
              {/* ЛИМИТЫ ТАРИФА */}
              <div className="bg-white rounded-2xl border border-[#DCDCDA] shadow-sm p-5 md:p-6 flex flex-col justify-between transition-all hover:shadow-md">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-[#121415] flex items-center gap-2 uppercase">
                    <Sliders className="w-4 h-4 text-[#8B9194]" /> Использование лимитов
                  </h3>
                </div>

                <div className="space-y-5 my-6">
                  <UsageBar label="Активные мастера" current={4} max={5} />
                  <UsageBar label="Записей в месяц" current={1240} max={5000} />
                  <UsageBar label="SMS-уведомления" current={950} max={1000} />
                </div>

                <div className="pt-4 border-t border-[#F5F5F4] flex items-center gap-2 text-[11px] text-[#dc2626] font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                  <AlertCircle className="w-4 h-4" />
                  <span>Пакет SMS близок к исчерпанию</span>
                </div>
              </div>

              {/* ИСТОРИЯ ПЛАТЕЖЕВ */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#DCDCDA] shadow-sm p-5 md:p-6 flex flex-col transition-all hover:shadow-md">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold tracking-tight text-[#121415] uppercase">История платежей</h3>
                  <p className="text-xs font-medium text-[#4A4E51] mt-0.5">Счета, квитанции и закрывающие документы</p>
                </div>

                <div className="flex-1 overflow-x-auto scrollbar-hide">
                  <div className="min-w-[450px]">
                    <div className="flex items-center px-4 py-2 bg-[#F5F5F4] rounded-lg text-[10px] font-semibold text-[#8B9194] uppercase tracking-wider mb-2 border border-[#DCDCDA]">
                      <div className="w-1/4">Дата</div>
                      <div className="w-2/4">Описание платежа</div>
                      <div className="w-1/4 text-right pr-4">Сумма</div>
                      <div className="w-10"></div>
                    </div>

                    <div className="space-y-1 mt-2">
                      {[
                        { date: "12 июл 2026", desc: "Подписка SuperQueue Business", amount: "650 000 сум" },
                        { date: "12 июн 2026", desc: "Подписка SuperQueue Business", amount: "650 000 сум" },
                        { date: "12 май 2026", desc: "Подписка SuperQueue Business", amount: "650 000 сум" },
                      ].map((invoice, i) => (
                        <div key={i} className="flex items-center px-4 py-2.5 hover:bg-[#F5F5F4] rounded-xl transition-colors group border border-transparent hover:border-[#DCDCDA]/50">
                          <div className="w-1/4 text-xs font-medium text-[#4A4E51]">{invoice.date}</div>
                          <div className="w-2/4 text-xs font-semibold text-[#121415]">{invoice.desc}</div>
                          <div className="w-1/4 text-right pr-4 text-xs font-semibold text-[#121415]">{invoice.amount}</div>
                          <div className="w-10 flex justify-end">
                            <button type="button" className="p-1.5 text-[#4A4E51] bg-white border border-[#DCDCDA] hover:text-[#121415] hover:border-[#121415]/20 rounded-md shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95">
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <FAQSection />
          </div>
        </main>
      </div>

      {/* МОДАЛКА ПРИВЯЗКИ КАРТЫ */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <button type="button" onClick={() => setModal(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F4] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
              <X className="w-4 h-4" />
            </button>

            <div className="p-8 pb-4 text-center shrink-0">
              <div className="w-12 h-12 bg-[#F5F5F4] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#DCDCDA]">
                <Lock className="w-6 h-6 text-[#121415]" />
              </div>
              <h2 className="text-xl font-semibold text-[#121415] tracking-tight">Безопасная оплата</h2>
              <p className="text-xs text-[#4A4E51] font-medium mt-2">Данные карты защищены стандартом PCI DSS. Мы не храним ваш CVV-код.</p>
            </div>

            <form className="px-8 pb-8 flex-1 overflow-y-auto">
              <div className="p-5 bg-[#F5F5F4] border border-[#DCDCDA] rounded-2xl space-y-4">
                <div>
                   <label className="block text-xs font-semibold text-[#4A4E51] mb-2 uppercase tracking-wider">Номер карты</label>
                   <input type="text" placeholder="0000 0000 0000 0000" maxLength={19} className="w-full bg-white border border-[#DCDCDA] px-4 py-3 rounded-xl font-medium text-[#121415] outline-none focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 transition-all text-sm placeholder:text-[#8B9194]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div>
                     <label className="block text-xs font-semibold text-[#4A4E51] mb-2 uppercase tracking-wider">Срок действия</label>
                     <input type="text" placeholder="MM/YY" maxLength={5} className="w-full bg-white border border-[#DCDCDA] px-4 py-3 rounded-xl font-medium text-[#121415] text-center outline-none focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 transition-all text-sm placeholder:text-[#8B9194]" />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-[#4A4E51] mb-2 uppercase tracking-wider">CVC/CVV</label>
                     <input type="password" placeholder="•••" maxLength={4} className="w-full bg-white border border-[#DCDCDA] px-4 py-3 rounded-xl font-medium text-[#121415] text-center outline-none focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 transition-all text-sm placeholder:text-[#8B9194]" />
                   </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 mt-5 mb-6 text-xs font-medium text-[#4a6b53]">
                <ShieldCheck className="w-3.5 h-3.5" /> Защищено 256-bit шифрованием
              </div>

              <button type="button" onClick={() => setModal(false)} className="w-full py-3.5 bg-[#121415] text-white rounded-xl font-medium text-sm shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                Привязать карту
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}