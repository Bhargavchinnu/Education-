import React, { createContext, useState, useContext, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
};

export const AccessibilityProvider = ({ children }) => {
    const [fontSize, setFontSize] = useState(() => {
        return localStorage.getItem('fontSize') || 'medium';
    });

    const [contrast, setContrast] = useState(() => {
        return localStorage.getItem('contrast') || 'normal';
    });

    const [textToSpeech, setTextToSpeech] = useState(() => {
        return localStorage.getItem('textToSpeech') === 'true';
    });

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    const [keyboardNav, setKeyboardNav] = useState(() => {
        return localStorage.getItem('keyboardNav') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('fontSize', fontSize);
    }, [fontSize]);

    useEffect(() => {
        localStorage.setItem('contrast', contrast);
    }, [contrast]);

    useEffect(() => {
        localStorage.setItem('textToSpeech', textToSpeech.toString());
    }, [textToSpeech]);

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('keyboardNav', keyboardNav.toString());
    }, [keyboardNav]);

    const speak = (text) => {
        if (textToSpeech && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        }
    };

    const getFontSizeClass = () => {
        switch (fontSize) {
            case 'small': return 'font-small';
            case 'large': return 'font-large';
            case 'extra-large': return 'font-extra-large';
            default: return 'font-medium';
        }
    };

    const getContrastClass = () => {
        switch (contrast) {
            case 'high': return 'high-contrast';
            case 'inverted': return 'inverted-contrast';
            default: return '';
        }
    };

    const value = {
        fontSize,
        setFontSize,
        contrast,
        setContrast,
        textToSpeech,
        setTextToSpeech,
        darkMode,
        setDarkMode,
        keyboardNav,
        setKeyboardNav,
        speak,
        getFontSizeClass,
        getContrastClass
    };

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
};
