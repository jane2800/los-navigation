import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './LanguageContext';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import JourneyPlanner from './components/JourneyPlanner';
import SavedJourneys from './components/SavedJourneys';
import Account from './components/Account';
import './App.css';

function AppContent() {
  const { strings } = useLanguage();
  const [view, setView] = useState('search'); // 'search', 'journey', 'saved', 'account'
  const [journeyData, setJourneyData] = useState(null);
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('los-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('los-user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('los-user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('los-user');
    setView('search');
  };

  const handleSearch = (origin, destination, stopovers) => {
    setJourneyData({ origin, destination, stopovers });
    setView('journey');
  };

  const handleBack = () => {
    setView('search');
    setJourneyData(null);
  };

  const handleJourneyComplete = () => {
    setView('search');
    setJourneyData(null);
  };

  const handleSelectSaved = (journey) => {
    setJourneyData({
      origin: { id: journey.origin_id, name: journey.origin_name },
      destination: { id: journey.destination_id, name: journey.destination_name },
      stopovers: journey.stopovers || []
    });
    setView('journey');
  };

  const handleSelectStop = (stop) => {
    // When selecting a saved stop, use it as the origin in search
    setView('search');
    // Could be enhanced to pre-fill the search form
  };

  return (
    <div className="app">
      <Header 
        view={view} 
        onViewChange={setView} 
        onBack={view === 'journey' ? handleBack : null}
      />
      
      <main className="main-content">
        {view === 'search' && (
          <SearchForm onSearch={handleSearch} />
        )}
        
        {view === 'journey' && journeyData && (
          <JourneyPlanner 
            origin={journeyData.origin}
            destination={journeyData.destination}
            stopovers={journeyData.stopovers}
            onComplete={handleJourneyComplete}
            onBack={handleBack}
          />
        )}
        
        {view === 'saved' && (
          <SavedJourneys 
            onSelectJourney={handleSelectSaved}
            onSelectStop={handleSelectStop}
          />
        )}
        
        {view === 'account' && (
          <Account 
            user={user}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
