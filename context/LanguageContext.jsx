'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('ammar_lang') || 'en';
    setLang(storedLang);
    document.documentElement.setAttribute('lang', storedLang);
    document.documentElement.setAttribute('dir', storedLang === 'ar' ? 'rtl' : 'ltr');
  }, []);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('ammar_lang', newLang);
    document.documentElement.setAttribute('lang', newLang);
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage }}>
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
