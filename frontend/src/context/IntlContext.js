import React, { createContext, useContext, useState, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import de from '../locales/de.json';
import en from '../locales/en.json';
import tr from '../locales/tr.json';

const IntlContext = createContext();

const messages = {
  de,
  en,
  tr,
};

export const useIntl = () => {
  const context = useContext(IntlContext);
  if (!context) {
    throw new Error('useIntl must be used within IntlContextProvider');
  }
  return context;
};

export const IntlContextProvider = ({ children }) => {
  // Get saved language from localStorage or default to 'en'
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('locale') || 'en';
  });

  // Save locale to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const switchLanguage = (newLocale) => {
    if (messages[newLocale]) {
      setLocale(newLocale);
    }
  };

  return (
    <IntlContext.Provider value={{ locale, switchLanguage }}>
      <IntlProvider locale={locale} messages={messages[locale]} defaultLocale="en">
        {children}
      </IntlProvider>
    </IntlContext.Provider>
  );
};
