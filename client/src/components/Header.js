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
              </svg>
            </button>
          ) : (
            <button 
              className={`nav-button ${view === 'saved' ? 'active' : ''}`}
              onClick={() => onViewChange('saved')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={strings.productIcons.saved}/> 
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
                <polyline points={strings.productIcons.downArrow}/> // Down arrow
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
              <path d={strings.productIcons.account}/> // User icon
            </svg>
            {strings.header.account}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
