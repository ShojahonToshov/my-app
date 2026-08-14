"use client";
import { useEffect } from "react";

export function useLockBodyScroll(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    // Сохраняем исходные стили перед блокировкой
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    // Блокируем скролл 
    document.body.style.overflow = "hidden";
    // Фикс для мобильных браузеров (особенно iOS Safari)
    document.body.style.touchAction = "none";

    // Очистка при закрытии меню или размонтировании компонента
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [isLocked]);
}