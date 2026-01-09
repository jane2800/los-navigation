import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import './SavedJourneys.css';

function SavedJourneys({ onSelectJourney, onSelectStop, user, onStopsChange }) {
  const { strings } = useLanguage();
  const [savedJourneys, setSavedJourneys] = useState([]);
  const [savedStops, setSavedStops] = useState([]);
  const [activeTab, setActiveTab] = useState('journeys');
  const [loading, setLoading] = useState(true);
  const [selectedJourney, setSelectedJourney] = useState(null); // For viewing journey details
  
  // Add stop state
  const [showAddStop, setShowAddStop] = useState(false);
  const [stopSearchQuery, setStopSearchQuery] = useState('');
  const [stopSuggestions, setStopSuggestions] = useState([]);
  const [searchingStops, setSearchingStops] = useState(false);
  const [selectedStop, setSelectedStop] = useState(null);
  const [customStopName, setCustomStopName] = useState('');
  
  // Edit stop name state
  const [editingStopId, setEditingStopId] = useState(null);
  const [editStopName, setEditStopName] = useState('');

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setSavedJourneys([]);
      setSavedStops([]);
      setLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [journeysRes, stopsRes] = await Promise.all([
        axios.get(`/api/saved/journeys?userId=${user.id}`),
        axios.get(`/api/saved/stops?userId=${user.id}`)
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
      if (onStopsChange) onStopsChange(); // Refresh saved stops in App
    } catch (error) {
      console.error('Failed to delete stop:', error);
    }
  };

  // Search for stops to add
  useEffect(() => {
    if (stopSearchQuery.length < 2) {
      setStopSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSearchingStops(true);
      try {
        const response = await axios.get(`/api/stops/search?query=${encodeURIComponent(stopSearchQuery)}`);
        setStopSuggestions(response.data);
      } catch (error) {
        console.error('Search stops error:', error);
        setStopSuggestions([]);
      }
      setSearchingStops(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [stopSearchQuery]);

  const handleSelectStopToAdd = (stop) => {
    setSelectedStop(stop);
    setCustomStopName('');
    setStopSearchQuery('');
    setStopSuggestions([]);
  };

  const handleSaveNewStop = async () => {
    if (!selectedStop || !user) return;

    try {
      const response = await axios.post('/api/saved/stops', {
        stop_id: selectedStop.id,
        stop_name: selectedStop.name,
        custom_name: customStopName || null,
        userId: user.id
      });
      setSavedStops([response.data, ...savedStops]);
      setSelectedStop(null);
      setCustomStopName('');
      setShowAddStop(false);
      if (onStopsChange) onStopsChange(); // Refresh saved stops in App
    } catch (error) {
      console.error('Failed to save stop:', error);
    }
  };

  const handleCancelAddStop = () => {
    setShowAddStop(false);
    setSelectedStop(null);
    setCustomStopName('');
    setStopSearchQuery('');
    setStopSuggestions([]);
  };

  const handleStartEditStop = (stop) => {
    setEditingStopId(stop.id);
    setEditStopName(stop.custom_name || '');
  };

  const handleSaveEditStop = async (stopId) => {
    try {
      const response = await axios.put(`/api/saved/stops/${stopId}`, {
        custom_name: editStopName || null
      });
      setSavedStops(savedStops.map(s => s.id === stopId ? response.data : s));
      setEditingStopId(null);
      setEditStopName('');
    } catch (error) {
      console.error('Failed to update stop:', error);
    }
  };

  const handleCancelEditStop = () => {
    setEditingStopId(null);
    setEditStopName('');
  };

  const handleJourneyClick = (journey) => {
    // If journey has legs (saved with details), show details view
    if (journey.legs && journey.legs.length > 0) {
      setSelectedJourney(journey);
    } else {
      // Old journeys without legs - redirect to planner
      onSelectJourney(journey);
    }
  };

  const getTransportColor = (product) => {
    return strings.transportColors[product] || strings.transportColors.default;
  };

  const getTransportEmoji = (product) => {
    return strings.transportEmojis[product] || strings.transportEmojis.default;
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
              <path d={strings.productIcons.saved}/>
            </svg>
            {strings.saved.journeysTab}
          </button>
          <button 
            className={`tab ${activeTab === 'stops' ? 'active' : ''}`}
            onClick={() => setActiveTab('stops')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={strings.productIcons.pin}/> 
            </svg>
            {strings.saved.stopsTab}
          </button>
        </div>
      </div>

      {!user ? (
        <div className="empty-state login-required">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d={strings.productIcons.account}/>
          </svg>
          <h3>{strings.saved.loginRequired}</h3>
        </div>
      ) : loading ? (
        <div className="loading-state">
          <div className="loading-spinner-large"></div>
          <span>{strings.saved.loadingData}</span>
        </div>
      ) : (
        <>
          {activeTab === 'journeys' && (
            <div className="journeys-list">
              {/* Journey Detail View */}
              {selectedJourney ? (
                <div className="journey-detail-view">
                  <button className="back-to-list" onClick={() => setSelectedJourney(null)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={strings.productIcons.backArrow}/>
                    </svg>
                    {strings.saved.backToList}
                  </button>
                  
                  <div className="journey-detail-header">
                    <div className="journey-route-detail">
                      <span className="route-origin">{selectedJourney.origin_name}</span>
                      <svg className="route-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                      <span className="route-destination">{selectedJourney.destination_name}</span>
                    </div>
                  </div>

                  <div className="journey-legs-detail">
                    {selectedJourney.legs.map((leg, index) => (
                      <div key={index} className="leg-detail-card">
                        <div className="leg-detail-number">{index + 1}</div>
                        <div className="leg-detail-content">
                          <div className="leg-detail-line" style={{ borderLeftColor: getTransportColor(leg.product) }}>
                            <span className="leg-emoji">{getTransportEmoji(leg.product)}</span>
                            <span className="leg-line-name">{leg.line}</span>
                            <span className="leg-direction">→ {leg.direction}</span>
                          </div>
                          <div className="leg-detail-stops">
                            <div className="leg-stop from">
                              <span className="stop-time">{leg.departureFormatted}</span>
                              <span className="stop-name">{leg.from.name}</span>
                            </div>
                            <div className="leg-stop to">
                              <span className="stop-time">{leg.arrivalFormatted}</span>
                              <span className="stop-name">{leg.to.name}</span>
                            </div>
                          </div>
                          <div className="leg-detail-duration">
                            {leg.duration} {strings.progress.minUnit}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="journey-detail-actions">
                    <button 
                      className="replan-btn"
                      onClick={() => {
                        setSelectedJourney(null);
                        onSelectJourney(selectedJourney);
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 4v6h6"/>
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                      </svg>
                      {strings.saved.replanJourney}
                    </button>
                    <button 
                      className="delete-detail-btn"
                      onClick={() => {
                        handleDeleteJourney(selectedJourney.id);
                        setSelectedJourney(null);
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                      {strings.saved.deleteJourney}
                    </button>
                  </div>
                </div>
              ) : savedJourneys.length === 0 ? (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d={strings.productIcons.saved}/>
                  </svg>
                  <h3>{strings.saved.noSavedJourneys}</h3>
                  <p>{strings.saved.saveRoutesHint}</p>
                </div>
              ) : (
                savedJourneys.map((journey) => (
                  <div key={journey.id} className="journey-card">
                    <div className="journey-card-content" onClick={() => handleJourneyClick(journey)}>
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
                      {journey.legs && journey.legs.length > 0 && (
                        <span className="journey-legs-count">
                          {journey.legs.length} {journey.legs.length === 1 ? strings.progress.leg : strings.progress.legs}
                        </span>
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
              {/* Add Stop Button/Form */}
              {!showAddStop ? (
                <button className="add-stop-btn" onClick={() => setShowAddStop(true)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  {strings.saved.addStop}
                </button>
              ) : (
                <div className="add-stop-form">
                  {!selectedStop ? (
                    <>
                      <div className="stop-search-input">
                        <input
                          type="text"
                          placeholder={strings.saved.searchStopPlaceholder}
                          value={stopSearchQuery}
                          onChange={(e) => setStopSearchQuery(e.target.value)}
                          autoFocus
                        />
                        <button className="cancel-search-btn" onClick={handleCancelAddStop}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                      {searchingStops && (
                        <div className="stop-search-loading">
                          <div className="loading-spinner"></div>
                          {strings.search.searching}
                        </div>
                      )}
                      {!searchingStops && stopSuggestions.length > 0 && (
                        <ul className="stop-suggestions">
                          {stopSuggestions.map((stop) => (
                            <li key={stop.id} onClick={() => handleSelectStopToAdd(stop)}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d={strings.productIcons.pin}/>
                                <circle cx="12" cy="10" r="3"/>
                              </svg>
                              {stop.name}
                            </li>
                          ))}
                        </ul>
                      )}
                      {!searchingStops && stopSearchQuery.length >= 2 && stopSuggestions.length === 0 && (
                        <div className="no-stop-results">{strings.search.noStationsFound}</div>
                      )}
                    </>
                  ) : (
                    <div className="stop-name-form">
                      <div className="selected-stop-info">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d={strings.productIcons.pin}/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>{selectedStop.name}</span>
                      </div>
                      <input
                        type="text"
                        placeholder={strings.saved.customNamePlaceholder}
                        value={customStopName}
                        onChange={(e) => setCustomStopName(e.target.value)}
                      />
                      <div className="stop-form-actions">
                        <button className="cancel-btn" onClick={handleCancelAddStop}>
                          {strings.saved.cancel}
                        </button>
                        <button className="save-btn" onClick={handleSaveNewStop}>
                          {strings.saved.save}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {savedStops.length === 0 && !showAddStop ? (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d={strings.productIcons.pin}/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <h3>{strings.saved.noSavedStops}</h3>
                  <p>{strings.saved.saveStopsHint}</p>
                </div>
              ) : (
                savedStops.map((stop) => (
                  <div key={stop.id} className="stop-card">
                    {editingStopId === stop.id ? (
                      <div className="stop-edit-form">
                        <input
                          type="text"
                          placeholder={strings.saved.customNamePlaceholder}
                          value={editStopName}
                          onChange={(e) => setEditStopName(e.target.value)}
                          autoFocus
                        />
                        <div className="stop-edit-actions">
                          <button className="cancel-edit-btn" onClick={handleCancelEditStop}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18"/>
                              <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                          <button className="save-edit-btn" onClick={() => handleSaveEditStop(stop.id)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="stop-card-content">
                          <div className="stop-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d={strings.productIcons.pin}/>
                              <circle cx="12" cy="10" r="3"/>
                            </svg>
                          </div>
                          <div className="stop-info">
                            {stop.custom_name && (
                              <span className="stop-custom-name">{stop.custom_name}</span>
                            )}
                            <span className={`stop-name ${stop.custom_name ? 'has-custom' : ''}`}>
                              {stop.stop_name}
                            </span>
                          </div>
                        </div>
                        <button 
                          className="edit-btn"
                          onClick={() => handleStartEditStop(stop)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteStop(stop.id)}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </>
                    )}
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
