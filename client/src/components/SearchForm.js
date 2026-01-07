import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import './SearchForm.css';

function SearchForm({ onSearch, user, savedStops = [] }) {
  const { strings } = useLanguage();
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [stopovers, setStopovers] = useState([]); // [{ stop: {id, name}, duration: 15 }, ...]
  const [activeInput, setActiveInput] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedStopId, setSavedStopId] = useState(null); // Track which stop was just saved
  const searchTimeout = useRef(null);

  // Filter saved stops based on search query
  const filteredSavedStops = searchQuery.length >= 1 
    ? savedStops.filter(s => 
        s.stop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.custom_name && s.custom_name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : savedStops;

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/stops/search?query=${encodeURIComponent(searchQuery)}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      }
      setLoading(false);
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

  const handleInputFocus = (inputType, index = null) => {
    setActiveInput({ type: inputType, index });
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleInputChange = (value) => {
    setSearchQuery(value);
  };

  const handleSelectStop = (stop) => {
    if (activeInput.type === 'origin') {
      setOrigin(stop);
    } else if (activeInput.type === 'destination') {
      setDestination(stop);
    } else if (activeInput.type === 'stopover') {
      const newStopovers = [...stopovers];
      // Initialize stopover with stop and default duration of 15 minutes
      newStopovers[activeInput.index] = { 
        stop, 
        duration: newStopovers[activeInput.index]?.duration || 15 
      };
      setStopovers(newStopovers);
    }
    setActiveInput(null);
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleAddStopover = () => {
    // Add new stopover with null stop and default 15 min duration
    setStopovers([...stopovers, { stop: null, duration: 15 }]);
  };

  const handleRemoveStopover = (index) => {
    const newStopovers = stopovers.filter((_, i) => i !== index);
    setStopovers(newStopovers);
  };

  const handleDurationChange = (index, duration) => {
    const newStopovers = [...stopovers];
    newStopovers[index] = { ...newStopovers[index], duration };
    setStopovers(newStopovers);
  };

  const handleSearch = () => {
    if (origin && destination) {
      // Filter out stopovers with no stop selected and pass the full stopover objects
      const validStopovers = stopovers.filter(s => s.stop !== null);
      onSearch(origin, destination, validStopovers);
    }
  };

  const handleSaveStop = async (e, stop) => {
    e.stopPropagation(); // Prevent selecting the stop
    if (!user) return;

    try {
      await axios.post('/api/saved/stops', {
        stop_id: stop.id,
        stop_name: stop.name,
        userId: user.id
      });
      setSavedStopId(stop.id);
      // Reset after 2 seconds
      setTimeout(() => setSavedStopId(null), 2000);
    } catch (err) {
      console.error('Failed to save stop:', err);
    }
  };

  const swapOriginDestination = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  // Duration options in minutes
  const durationOptions = [5, 10, 15, 30, 45, 60, 90, 120];

  const formatDuration = (mins) => {
    if (mins >= 60) {
      const hours = mins / 60;
      return strings.search.durationHour(hours);
    }
    return strings.search.durationMin(mins);
  };

  return (
    <div className="search-form animate-fadeIn">
      <div className="search-card">
        <div className="search-inputs">
          {/* Origin Input */}
          <div className="input-row">
            <div className="input-marker origin-marker">A</div>
            <div 
              className={`input-field ${activeInput?.type === 'origin' ? 'active' : ''}`}
              onClick={() => handleInputFocus('origin')}
            >
              {activeInput?.type === 'origin' ? (
                <input
                  type="text"
                  placeholder={strings.search.enterStartPlaceholder}
                  value={searchQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                  autoFocus
                />
              ) : (
                <span className={origin ? 'selected' : 'placeholder'}>
                  {origin ? origin.name : strings.search.enterStart}
                </span>
              )}
            </div>
          </div>

          {/* Stopovers */}
          {stopovers.map((stopover, index) => (
            <div className="input-row stopover-row" key={index}>
              <div className="input-marker stopover-marker">{index + 1}</div>
              <div 
                className={`input-field stopover-field ${activeInput?.type === 'stopover' && activeInput?.index === index ? 'active' : ''}`}
                onClick={() => handleInputFocus('stopover', index)}
              >
                {activeInput?.type === 'stopover' && activeInput?.index === index ? (
                  <input
                    type="text"
                    placeholder={strings.search.enterStopoverPlaceholder}
                    value={searchQuery}
                    onChange={(e) => handleInputChange(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <span className={stopover.stop ? 'selected' : 'placeholder'}>
                    {stopover.stop ? stopover.stop.name : strings.search.enterStopover}
                  </span>
                )}
              </div>
              
              {/* Duration Selector */}
              <div className="stopover-duration-wrapper">
                <select
                  className="stopover-duration"
                  value={stopover.duration}
                  onChange={(e) => handleDurationChange(index, parseInt(e.target.value))}
                  onClick={(e) => e.stopPropagation()}
                  title={strings.search.stopoverDuration}
                >
                  {durationOptions.map((mins) => (
                    <option key={mins} value={mins}>
                      {formatDuration(mins)}
                    </option>
                  ))}
                </select>
              </div>

              <button 
                className="remove-stopover"
                onClick={() => handleRemoveStopover(index)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))}

          {/* Add Stopover Button */}
          <div className="input-row add-stopover-row">
            <div className="input-marker add-marker">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <button className="add-stopover-btn" onClick={handleAddStopover}>
              {strings.search.addStopover}
            </button>
          </div>

          {/* Destination Input */}
          <div className="input-row">
            <div className="input-marker destination-marker">B</div>
            <div 
              className={`input-field ${activeInput?.type === 'destination' ? 'active' : ''}`}
              onClick={() => handleInputFocus('destination')}
            >
              {activeInput?.type === 'destination' ? (
                <input
                  type="text"
                  placeholder={strings.search.enterDestinationPlaceholder}
                  value={searchQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                  autoFocus
                />
              ) : (
                <span className={destination ? 'selected' : 'placeholder'}>
                  {destination ? destination.name : strings.search.enterDestination}
                </span>
              )}
            </div>
          </div>

          {/* Swap Button */}
          {origin && destination && (
            <button className="swap-button" onClick={swapOriginDestination}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12M17 20l4-4M17 20l-4-4"/>
              </svg>
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {activeInput && (
          <div className="suggestions-container">
            {/* Saved Stops Section */}
            {filteredSavedStops.length > 0 && (
              <div className="saved-stops-section">
                <div className="saved-stops-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                  {strings.search.savedStops}
                </div>
                <ul className="suggestions-list saved">
                  {filteredSavedStops.map((savedStop) => (
                    <li 
                      key={`saved-${savedStop.id}`} 
                      className="suggestion-item saved-suggestion"
                      onClick={() => handleSelectStop({ id: savedStop.stop_id, name: savedStop.stop_name })}
                    >
                      <span className="suggestion-name">
                        {savedStop.custom_name || savedStop.stop_name}
                        {savedStop.custom_name && (
                          <span className="original-name"> ({savedStop.stop_name})</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {loading && (
              <div className="suggestions-loading">
                <div className="loading-spinner"></div>
                {strings.search.searching}
              </div>
            )}
            {!loading && suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((stop) => (
                  <li 
                    key={stop.id} 
                    className="suggestion-item"
                    onClick={() => handleSelectStop(stop)}
                  >
                    <span className="suggestion-name">{stop.name}</span>
                    {user && (
                      <button
                        className={`save-stop-btn ${savedStopId === stop.id ? 'saved' : ''}`}
                        onClick={(e) => handleSaveStop(e, stop)}
                        title={savedStopId === stop.id ? strings.search.stopSaved : strings.search.saveStop}
                      >
                        {savedStopId === stop.id ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                          </svg>
                        )}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {!loading && searchQuery.length >= 2 && suggestions.length === 0 && filteredSavedStops.length === 0 && (
              <div className="no-suggestions">{strings.search.noStationsFound}</div>
            )}
          </div>
        )}

        {/* Search Button */}
        <button 
          className={`search-button ${origin && destination ? 'active' : ''}`}
          onClick={handleSearch}
          disabled={!origin || !destination}
        >
          <span>{strings.search.search}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SearchForm;
