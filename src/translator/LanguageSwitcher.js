// LanguageSwitcher.js
import React from 'react';
import { useLanguage } from './Languagecontext';

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <label htmlFor="language">
            <span className="visually-hidden">Language</span>
            <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="es">Español</option>
            </select>
        </label>
    );
};

export default LanguageSwitcher;
