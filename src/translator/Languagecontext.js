
import React, { createContext, useContext, useState } from 'react';
import { translations } from './languages';

const Languagecontext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    const t = (key) => translations[language][key] || key;

    return (
        <Languagecontext.Provider value={{ language, setLanguage, t }}>
            {children}
        </Languagecontext.Provider>
    );
};

export const useLanguage = () => useContext(Languagecontext);
