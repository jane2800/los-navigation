import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import './SavedJourneys.css';

function SavedJourneys({ onSelectJourney, onSelectStop }) {
  const { strings } = useLanguage();
  const [savedJourneys, setSavedJourneys] = useState([]);
  const [savedStops, setSavedStops] = useState([]);
  const [activeTab, setActiveTab] = useState('journeys');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [journeysRes, stopsRes] = await Promise.all([
        axios.get('/api/saved/journeys'),
        axios.get('/api/saved/stops')
      ]);
      setSavedJourneys(journeysRes.data);
      setSavedStops(stopsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setLoading(false);
  };

  const handleDeleteJourney = async (id) => {
    try {
      await axios.delete(`/api/saved/journeys/${id}`);
      setSavedJourneys(savedJourneys.filter(j => j.id !== id));
    } catch (error) {
      console.error('Failed to delete journey:', error);
    }
  };

  const handleDeleteStop = async (id) => {
    try {
      await axios.delete(`/api/saved/stops/${id}`);
      setSavedStops(savedStops.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete stop:', error);
    }
  };

  const handleStopClick = (stop) => {
    if (onSelectStop) {
      onSelectStop({ id: stop.stop_id, name: stop.stop_name });
    }
  };

  return (
    <div className="saved-journeys animate-fadeIn">
      <div className="saved-header">
        <h2>{strings.saved.mySaved}</h2>
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'journeys' ? 'active' : ''}`}
            onClick={() => setActiveTab('journeys')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            {strings.saved.journeysTab}
          </button>
          <button 
            className={`tab ${activeTab === 'stops' ? 'active' : ''}`}
            onClick={() => setActiveTab('stops')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {strings.saved.stopsTab}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner-large"></div>
          <span>{strings.saved.loadingData}</span>
        </div>
      ) : (
        <>
          {activeTab === 'journeys' && (
            <div className="journeys-list">
              {savedJourneys.length === 0 ? (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                  <h3>{strings.saved.noSavedJourneys}</h3>
                  <p>{strings.saved.saveRoutesHint}</p>
                </div>
              ) : (
                savedJourneys.map((journey) => (
                  <div key={journey.id} className="journey-card">
                    <div className="journey-card-content" onClick={() => onSelectJourney(journey)}>
                      <div className="journey-route">
                        <span className="route-origin">{journey.origin_name}</span>
                        <svg className="route-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                          <polyline points="12 5 19 12 12 19"/>
                        </svg>
                        <span className="route-destination">{journey.destination_name}</span>
                      </div>
                      {journey.name && (
                        <span className="journey-name">{journey.name}</span>
                      )}
                      {journey.stopovers && journey.stopovers.length > 0 && (
                        <span className="journey-stopovers">
                          {strings.saved.via} {journey.stopovers.map(s => s.name || s.stop?.name).join(', ')}
                        </span>
                      )}
                    </div>
                    <button 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteJourney(journey.id);
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'stops' && (
            <div className="stops-list">
              {savedStops.length === 0 ? (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <h3>{strings.saved.noSavedStops}</h3>
                  <p>{strings.saved.saveStopsHint}</p>
                </div>
              ) : (
                savedStops.map((stop) => (
                  <div key={stop.id} className="stop-card">
                    <div 
                      className="stop-card-content"
                      onClick={() => handleStopClick(stop)}
                    >
                      <div className="stop-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      </div>
                      <span className="stop-name">{stop.stop_name}</span>
                    </div>
                    <button 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStop(stop.id);
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SavedJourneys;
