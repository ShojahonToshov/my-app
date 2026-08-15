import { Scissors, CalendarClock, Users, Store, ShieldAlert } from "lucide-react";

export const TABS = [
  { id: "profile", label: "Profile", icon: Store },
  { id: "schedule", label: "Working Hours", icon: CalendarClock },
  { id: "services", label: "Services", icon: Scissors },
  { id: "team", label: "Team", icon: Users },
  { id: "policies", label: "Policies (No-Show)", icon: ShieldAlert },
];

export const TIME_OPTIONS = Array.from({ length: 36 }).map((_, i) => {
  const t = (i + 12) * 30; 
  return `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`;
});

export const ROLE_OPTIONS = ["Barber", "Senior Barber", "Top Stylist"];
export const CANCEL_WINDOWS = ["2 hours before", "12 hours before", "24 hours before", "Anytime"];
