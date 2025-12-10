import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LanguageCode, LocalizedString } from '../types';

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (obj: LocalizedString | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<LanguageCode>('en');

  // Helper to extract string based on current language
  const t = (obj: LocalizedString | string) => {
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj['en'];
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};