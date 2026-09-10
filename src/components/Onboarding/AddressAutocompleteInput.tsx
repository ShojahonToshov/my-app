"use client";
import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/hooks/useI18n";

export interface AddressResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface AddressAutocompleteInputProps {
  value: string;
  onChange: (value: string, lat: number | null, lng: number | null) => void;
  placeholder: string;
  icon: any;
}

export default function AddressAutocompleteInput({ value, onChange, placeholder, icon: Icon }: AddressAutocompleteInputProps) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [options, setOptions] = useState<AddressResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If external value changes and doesn't match query (e.g. initial load), update it
    if (value && value !== query) {
      setQuery(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchAddress = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 3) {
      setOptions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&addressdetails=1&limit=5`,
        {
          headers: {
            "Accept-Language": "ru,en",
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setOptions(data);
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    // When typing, we haven't selected a valid address yet.
    // Reset lat/lng until they select from dropdown
    onChange(val, null, null);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchAddress(val);
    }, 500);
  };

  const handleSelect = (option: AddressResult) => {
    setQuery(option.display_name);
    setIsOpen(false);
    onChange(option.display_name, parseFloat(option.lat), parseFloat(option.lon));
  };

  return (
    <div className={`relative w-full group ${isOpen ? 'z-[99999]' : ''}`} ref={dropdownRef}>
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194] group-focus-within:text-[#121415] z-10 transition-colors pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => {
          if (options.length > 0) setIsOpen(true);
        }}
        placeholder={placeholder}
        className={`w-full flex items-center justify-between pl-12 pr-10 py-4 rounded-xl outline-none transition-all duration-300 text-sm font-medium border text-[#121415] bg-[#F5F5F4] border-[#DCDCDA] focus:bg-white focus:ring-4 focus:ring-[#121415]/5 focus:border-[#121415] placeholder:text-[#8B9194]`}
      />
      {isLoading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-[#8A2532] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {isOpen && options.length > 0 && (
        <div className="absolute z-[99999] w-full mt-2 bg-white border border-[#DCDCDA] rounded-xl shadow-lg max-h-56 overflow-y-auto py-1.5 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-4 py-2 text-xs font-semibold text-[#8B9194] uppercase tracking-wider">{t("extra.t56")}</div>
          {options.map((opt, i) => (
            <button
              key={`${opt.lat}-${opt.lon}-${i}`}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleSelect(opt);
              }}
              className="w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between group hover:bg-[#F5F5F4]"
            >
              <span className="font-medium text-[#4A4E51] group-hover:text-[#121415] line-clamp-2">
                {opt.display_name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
