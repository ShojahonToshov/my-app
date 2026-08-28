import { create } from "zustand";
import enTranslations from "../../public/localization/en/en.json";

export type Language = "en" | "ru" | "uz";

type TranslationValue = string | { [key: string]: TranslationValue };

interface I18nState {
  language: Language;
  translations: Record<string, TranslationValue>;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
  init: () => void;
}

export const useI18nStore = create<I18nState>((set, get) => ({
  language: "en",
  translations: enTranslations,
  setLanguage: async (lang: Language) => {
    try {
      const res = await fetch(`/localization/${lang}/${lang}.json`);
      if (!res.ok) throw new Error("Failed to load");
      const translations = await res.json();
      set({ language: lang, translations });
      if (typeof window !== "undefined") {
        localStorage.setItem("language", lang);
      }
    } catch (error) {
      console.error("Failed to load translations:", error);
    }
  },
  t: (key: string) => {
    const { translations } = get();
    if (!translations || Object.keys(translations).length === 0) return key;

    const keys = key.split(".");
    let value: TranslationValue | undefined = translations;
    for (const k of keys) {
      if (value && typeof value === "object" && !Array.isArray(value) && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    return typeof value === "string" ? value : key;
  },
  init: () => {
    if (typeof window !== "undefined") {
      const savedLang = (localStorage.getItem("language") as Language) || "en";
      get().setLanguage(savedLang);
    }
  },
}));
