import { Scissors, CalendarClock, Users, Store, ShieldAlert } from "lucide-react";

export const TABS = [
  { id: "profile", label: "Р СџРЎР‚Р С•РЎвЂћР С‘Р В»РЎРЉ", icon: Store },
  { id: "schedule", label: "Р вЂњРЎР‚Р В°РЎвЂћР С‘Р С” РЎР‚Р В°Р В±Р С•РЎвЂљРЎвЂ№", icon: CalendarClock },
  { id: "services", label: "Р Р€РЎРѓР В»РЎС“Р С–Р С‘", icon: Scissors },
  { id: "team", label: "Р С™Р С•Р С Р В°Р Р…Р Т‘Р В°", icon: Users },
  { id: "policies", label: "Р вЂ”Р В°РЎвЂ°Р С‘РЎвЂљР В° (No-show)", icon: ShieldAlert },
];

export const TIME_OPTIONS = Array.from({ length: 36 }).map((_, i) => {
  const t = (i + 12) * 30; 
  return `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`;
});

export const ROLE_OPTIONS = ["Р вЂ Р В°РЎР‚Р В±Р ВµРЎР‚", "Р РЋРЎвЂљР В°РЎР‚РЎв‚¬Р С‘Р в„– Р В±Р В°РЎР‚Р В±Р ВµРЎР‚", "Р СћР С•Р С—-Р С Р В°РЎРѓРЎвЂљР ВµРЎР‚"];
export const CANCEL_WINDOWS = ["Р вЂ”Р В° 2 РЎвЂЎР В°РЎРѓР В°", "Р вЂ”Р В° 12 РЎвЂЎР В°РЎРѓР С•Р Р†", "Р вЂ”Р В° 24 РЎвЂЎР В°РЎРѓР В°", "Р В Р В°Р В·РЎР‚Р ВµРЎв‚¬Р С‘РЎвЂљРЎРЉ Р Р† Р В»РЎР‹Р В±Р С•Р Вµ Р Р†РЎР‚Р ВµР С РЎРЏ"];
