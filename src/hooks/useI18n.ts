"use client";
import { useState, useEffect } from "react";
import { useI18nStore } from "@/stores/i18nStore";
import enTranslations from "../../public/localization/en/en.json";

export function useI18n() {
  const store = useI18nStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return {
      ...store,
      t: (key: string) => {
        const keys = key.split(".");
        let value: any = enTranslations;
        for (const k of keys) {
          if (value && typeof value === "object" && k in value) {
            value = value[k];
          } else {
            return key;
          }
        }
        return typeof value === "string" ? value : key;
      },
      language: "en" as const,
      translations: enTranslations
    };
  }

  return store;
}
