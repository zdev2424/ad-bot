import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'am', label: 'አማርኛ (Amharic)', flag: '🇪🇹' },
  { code: 'sw', label: 'Kiswahili (Swahili)', flag: '🇰🇪' },
  { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' }
];

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    // 1. Check localStorage first
    const savedLang = localStorage.getItem('earncashio_lang');
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
      return;
    }

    // 2. Check Telegram WebApp user language
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code) {
      const tgLang = window.Telegram.WebApp.initDataUnsafe.user.language_code.toLowerCase();
      if (translations[tgLang]) {
        setLang(tgLang);
        return;
      }
    }

    // 3. Fallback to browser language
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language?.substring(0, 2).toLowerCase();
      if (browserLang && translations[browserLang]) {
        setLang(browserLang);
      }
    }
  }, []);

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem('earncashio_lang', newLang);
    }
  };

  /**
   * Helper to look up nested translation keys: e.g. t('dashboard.welcome')
   */
  const t = (path, params = {}) => {
    const keys = path.split('.');
    let current = translations[lang] || translations['en'];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback = translations['en'];
        for (const fKey of keys) {
          if (fallback && fallback[fKey] !== undefined) {
            fallback = fallback[fKey];
          } else {
            return path;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current === 'string') {
      let result = current;
      for (const [pKey, pVal] of Object.entries(params)) {
        result = result.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
      }
      return result;
    }

    return current || path;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
