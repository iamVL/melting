// MyComponent.js
import React from 'react';
import { useLanguage } from './Languagecontext';

const MyComponent = () => {
    const { t } = useLanguage();

    return (
        <div>
            <h1>{t('discoverNewRecipes')}</h1>
            <p>{t('learnCookShare')}</p>
        </div>
    );
};

export default MyComponent;
