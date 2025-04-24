// LanguageSwitcher.js
import React from 'react';
import { useLanguage } from './Languagecontext';

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
        </select>
    );
};

export default LanguageSwitcher;
