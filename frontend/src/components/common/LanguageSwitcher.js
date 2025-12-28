import React from 'react';
import { useIntl } from '../context/IntlContext';
import { MdLanguage } from 'react-icons/md';

const LanguageSwitcher = () => {
  const { locale, switchLanguage } = useIntl();

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  ];

  return (
    <div className="relative group">
      <button className="transition-all duration-500 active:scale-125 p-2 lg:p-3">
        <MdLanguage className="w-6 h-6 lg:w-7 lg:h-7 text-gray-700 hover:text-darkBlue transition-colors" />
      </button>
      
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 lg:left-full lg:bottom-1/2 lg:translate-y-1/2 lg:ml-3 lg:mb-0 w-40 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[10000]">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className={`w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition-colors flex items-center gap-2 ${
              locale === lang.code ? 'bg-blue-50 text-darkBlue font-semibold' : 'text-gray-700'
            }`}
          >
            <span className="text-xl">{lang.flag}</span>
            <span className="text-sm">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
