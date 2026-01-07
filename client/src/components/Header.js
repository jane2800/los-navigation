import React, { useState } from 'react';
import { useLanguage, LANGUAGES } from '../LanguageContext';
import './Header.css';

function Header({ view, onViewChange, onBack }) {
  const { strings, language, setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setShowLangMenu(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          {onBack ? (
            <button className="back-button" onClick={onBack}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          ) : (
            <button 
              className={`nav-button ${view === 'saved' ? 'active' : ''}`}
              onClick={() => onViewChange('saved')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              {strings.header.saved}
            </button>
          )}
        </div>
        
        <div className="header-center" onClick={() => onViewChange('search')}>
          <span className="logo">{strings.app.name}</span>
          <span className="logo-subtitle">{strings.app.subtitle}</span>
        </div>
        
        <div className="header-right">
          {/* Language Selector */}
          <div className="language-selector">
            <button 
              className="lang-button"
              onClick={() => setShowLangMenu(!showLangMenu)}
            >
              <span className="lang-flag">{LANGUAGES[language].flag}</span>
              <span className="lang-code">{language.toUpperCase()}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            
            {showLangMenu && (
              <div className="lang-dropdown">
                {Object.values(LANGUAGES).map((lang) => (
                  <button
                    key={lang.code}
                    className={`lang-option ${language === lang.code ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    <span className="lang-flag">{lang.flag}</span>
                    <span className="lang-name">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            className={`nav-button ${view === 'account' ? 'active' : ''}`}
            onClick={() => onViewChange('account')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {strings.header.account}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
