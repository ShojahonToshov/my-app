"use client";
import React, { useState, useRef, useEffect, InputHTMLAttributes } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const COUNTRIES = [
  { code: "+998", flag: "uz", name: "Uzbekistan" },
  { code: "+7", flag: "ru", name: "Russia" },
  { code: "+7", flag: "kz", name: "Kazakhstan" },
  { code: "+996", flag: "kg", name: "Kyrgyzstan" },
  { code: "+992", flag: "tj", name: "Tajikistan" },
  { code: "+1", flag: "us", name: "USA" },
  { code: "+44", flag: "gb", name: "UK" },
  { code: "+971", flag: "ae", name: "UAE" },
  { code: "+90", flag: "tr", name: "Turkey" },
];

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
}

export function PhoneInput({
  label,
  id,
  error,
  className = "",
  value = "",
  onChange,
  name = "phone",
  placeholder = " ",
  ...props
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const match = COUNTRIES.find(c => value.startsWith(c.code));
      if (match && match.code !== selectedCountry.code) {
        setSelectedCountry(match);
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setIsOpen(false);
    
    let currentNumber = value;
    const oldMatch = COUNTRIES.find(c => value.startsWith(c.code));
    if (oldMatch) {
      currentNumber = currentNumber.substring(oldMatch.code.length).trim();
    }
    
    onChange(`${country.code} ${currentNumber}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;
    let sanitized = rawValue.replace(/[^\d+]/g, "");
    
    if (sanitized === "") {
      onChange("");
      return;
    }

    const hasPlus = rawValue.includes('+');
    sanitized = sanitized.replace(/\+/g, "");
    
    if (hasPlus || sanitized.length > 0) {
      sanitized = '+' + sanitized;
    }

    if (sanitized === "+") {
      onChange(selectedCountry.code + " ");
      return;
    }

    const digitsOnly = sanitized.replace(/\D/g, "");
    const match = COUNTRIES.find(c => digitsOnly.startsWith(c.code.replace(/\D/g, "")));
    const currentCountryCode = match ? match.code : null;

    if (!currentCountryCode || !sanitized.startsWith(currentCountryCode)) {
      onChange(sanitized);
      return;
    }

    let localDigits = sanitized.slice(currentCountryCode.length);
    
    // Formatting patterns based on country
    let pattern = null;
    let maxDigits = 0;
    switch (currentCountryCode) {
      case "+998": case "+992": pattern = [2, 3, 2, 2]; break;
      case "+7": case "+90": pattern = [3, 3, 2, 2]; break;
      case "+996": pattern = [3, 3, 3]; break;
      case "+1": case "+44": pattern = [3, 3, 4]; break;
      case "+971": pattern = [2, 3, 4]; break;
    }

    if (pattern) {
      maxDigits = pattern.reduce((acc, val) => acc + val, 0);
      localDigits = localDigits.slice(0, maxDigits);
    }

    if (pattern && localDigits.length > 0) {
      let formattedLocal = "";
      let currentIndex = 0;
      for (let i = 0; i < pattern.length; i++) {
        const chunkLength = pattern[i];
        if (currentIndex >= localDigits.length) break;
        const chunk = localDigits.slice(currentIndex, currentIndex + chunkLength);
        formattedLocal += (formattedLocal ? " " : "") + chunk;
        currentIndex += chunkLength;
      }
      onChange(currentCountryCode + " " + formattedLocal);
    } else {
      onChange(currentCountryCode + (localDigits.length > 0 ? " " + localDigits : " "));
    }
  };

  const displayValue = value === "" ? `${selectedCountry.code} ` : value;

  return (
    <div className={`w-full flex flex-col gap-1.5 shrink-0 ${className}`} ref={dropdownRef}>
      <div className="relative group w-full flex">
        
        {/* Dropdown Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`absolute left-0 top-0 bottom-0 z-20 flex items-center gap-1.5 px-3 rounded-l-xl border-r border-transparent hover:bg-black/5 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] ${error ? "text-brand" : "text-slate-text"}`}
        >
          <img 
            src={`https://flagcdn.com/w20/${selectedCountry.flag}.png`} 
            srcSet={`https://flagcdn.com/w40/${selectedCountry.flag}.png 2x`}
            alt={selectedCountry.name}
            className="w-5 h-auto rounded-[2px]"
          />
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Input Field */}
        <input
          id={id}
          type="tel"
          placeholder={label ? " " : placeholder}
          value={displayValue}
          onChange={handleInputChange}
          className={`peer w-full pl-[4.5rem] pr-4 py-4 rounded-xl outline-none transition-all duration-300 text-sm font-medium border bg-bg-light focus:bg-white focus:ring-4 [&:-webkit-autofill]:shadow-[inset_0_0_0_9999px_var(--color-bg-light)] focus:[&:-webkit-autofill]:shadow-[inset_0_0_0_9999px_#fff] text-slate-dark placeholder-transparent focus:placeholder-slate-muted/50 ${
            error
              ? "border-brand focus:ring-brand/10 shadow-[0_0_8px] shadow-brand/30"
              : "border-border focus:border-slate-dark focus:ring-slate-dark/5"
          }`}
          {...props}
        />
        
        {label && (
          <label
            htmlFor={id}
            className={`absolute left-[4.5rem] top-1/2 -translate-y-1/2 text-sm font-medium transition-all duration-300 pointer-events-none 
            peer-[:not(:placeholder-shown)]:opacity-0
            ${error ? "text-brand" : "text-slate-text"}`}
          >
            {label}
          </label>
        )}

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-[calc(100%+8px)] w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
            >
              <div className="max-h-60 overflow-y-auto">
                {COUNTRIES.map((country) => (
                  <button
                    key={`${country.code}-${country.name}`}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className="w-full flex items-center px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <img 
                      src={`https://flagcdn.com/w20/${country.flag}.png`} 
                      srcSet={`https://flagcdn.com/w40/${country.flag}.png 2x`}
                      alt={country.name}
                      className="w-5 h-auto rounded-[2px] mr-3 shadow-sm"
                    />
                    <span className="text-sm font-medium text-gray-700 flex-1">{country.name}</span>
                    <span className="text-sm font-medium text-gray-500 mr-2">{country.code}</span>
                    {selectedCountry.code === country.code && selectedCountry.name === country.name && (
                      <Check className="w-4 h-4 text-[#121415]" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      {error && (
        <p className="text-xs font-medium text-brand pl-1 mt-0.5">{error}</p>
      )}
    </div>
  );
}
