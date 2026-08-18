import type { MouseEvent } from "react";

export const handleQuickCall = (e: MouseEvent<HTMLButtonElement>, phone: string) => {
  e.stopPropagation();
  window.location.href = `tel:${phone.replace(/\D/g, '')}`;
};

export const handleQuickMessage = (e: MouseEvent<HTMLButtonElement>, phone: string) => {
  e.stopPropagation();
  window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
};
