import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TransportOptions from './TransportOptions';
import JourneyProgress from './JourneyProgress';
import { useLanguage } from '../LanguageContext';
import './JourneyPlanner.css';

function JourneyPlanner({ origin, destination, stopovers, onComplete, onBack }) {
  const { strings } = useLanguage();
  const [currentLegIndex, setCurrentLegIndex] = useState(0);
  const [selectedLegs, setSelectedLegs] = useState([]);
  const [transportOptions, setTransportOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFrom, setCurrentFrom] = useState(origin);
  const [currentTo, setCurrentTo] = useState(null);
  const [intermediateStops, setIntermediateStops] = useState([]);
  const [journeyComplete, setJourneyComplete] = useState(false);
  const [lastArrivalTime, setLastArrivalTime] = useState(null);

  // Build the route including stopovers
  // Stopovers now have structure: [{ stop: {id, name}, duration: 15 }, ...]
  const buildRoute = useCallback(() => {
    const route = [{ stop: origin, duration: 0 }]; // Origin has no wait duration
    if (stopovers && stopovers.length > 0) {
      // Stopovers already have the correct structure
      route.push(...stopovers);
    }
    route.push({ stop: destination, duration: 0 }); // Destination has no wait duration
    return route;
  }, [origin, destination, stopovers]);

  // Get the stop object from a route point (handles both old and new structure)
  const getStopFromRoutePoint = (routePoint) => {
    if (routePoint.stop) {
      return routePoint.stop;
    }
    // Fallback for old structure (just the stop object)
    return routePoint;
  };

  // Get the duration from a route point
  const getDurationFromRoutePoint = (routePoint) => {
    return routePoint.duration || 0;
  };

  const fetchLegOptions = useCallback(async (from, to, arrivalTime = null) => {
    setLoading(true);
    setError(null);

    try {
      let url;
      
      if (arrivalTime) {
        url = `/api/journeys/next-leg?from=${encodeURIComponent(from.id)}&to=${encodeURIComponent(to.id)}&arrival=${encodeURIComponent(arrivalTime)}`;
      } else {
        url = `/api/journeys/leg?from=${encodeURIComponent(from.id)}&to=${encodeURIComponent(to.id)}`;
      }

      const response = await axios.get(url);
      const data = response.data;

      if (data.hasDirectConnection) {
        setTransportOptions(data.transportOptions || []);
        setCurrentTo(to);
      } else if (data.intermediateStop) {
        setIntermediateStops(prev => [...prev, data.intermediateStop]);
        setCurrentTo(data.intermediateStop);
        
        let intermediateUrl;
        if (arrivalTime) {
          intermediateUrl = `/api/journeys/next-leg?from=${encodeURIComponent(from.id)}&to=${encodeURIComponent(data.intermediateStop.id)}&arrival=${encodeURIComponent(arrivalTime)}`;
        } else {
          intermediateUrl = `/api/journeys/leg?from=${encodeURIComponent(from.id)}&to=${encodeURIComponent(data.intermediateStop.id)}`;
        }
        
        const intermediateResponse = await axios.get(intermediateUrl);
        setTransportOptions(intermediateResponse.data.transportOptions || []);
      } else {
        setError(strings.journey.noConnections);
        setTransportOptions([]);
      }
    } catch (err) {
      console.error('Failed to fetch leg options:', err);
      setError(strings.journey.failedToLoad);
      setTransportOptions([]);
    }

    setLoading(false);
  }, [strings.journey.noConnections, strings.journey.failedToLoad]);

  useEffect(() => {
    const route = buildRoute();
    if (route.length >= 2) {
      const fromStop = getStopFromRoutePoint(route[0]);
      const toStop = getStopFromRoutePoint(route[1]);
      setCurrentFrom(fromStop);
      fetchLegOptions(fromStop, toStop, null);
    }
  }, [buildRoute, fetchLegOptions]);

  const handleSelectTime = (option, time) => {
    const newLeg = {
      from: currentFrom,
      to: currentTo,
      line: option.line,
      product: option.product,
      productName: option.productName,
      direction: option.direction,
      departure: time.departure,
      arrival: time.arrival,
      departureFormatted: time.departureFormatted,
      arrivalFormatted: time.arrivalFormatted,
      duration: time.duration
    };

    const newSelectedLegs = [...selectedLegs, newLeg];
    setSelectedLegs(newSelectedLegs);

    const route = buildRoute();
    
    // Find the current destination in the route to get its duration
    let stopoverDuration = 0;
    let nextIndex = -1;
    
    for (let i = 0; i < route.length; i++) {
      const routeStop = getStopFromRoutePoint(route[i]);
      if (routeStop.id === currentTo.id) {
        nextIndex = i;
        // Get the stopover duration for this stop (how long to wait)
        stopoverDuration = getDurationFromRoutePoint(route[i]);
        break;
      }
    }
    
    if (nextIndex === -1) {
      if (currentTo.id === destination.id) {
        setJourneyComplete(true);
        return;
      }
      nextIndex = currentLegIndex;
    }

    if (currentTo.id === destination.id) {
      setJourneyComplete(true);
      return;
    }

    // Calculate the adjusted arrival time including stopover duration
    const arrivalDate = new Date(time.arrival);
    if (stopoverDuration > 0) {
      arrivalDate.setMinutes(arrivalDate.getMinutes() + stopoverDuration);
    }
    const adjustedArrivalTime = arrivalDate.toISOString();
    
    setLastArrivalTime(adjustedArrivalTime);

    const nextFrom = currentTo;
    let nextTo = null;

    for (let i = nextIndex + 1; i < route.length; i++) {
      nextTo = getStopFromRoutePoint(route[i]);
      break;
    }

    if (!nextTo) {
      nextTo = destination;
    }

    setCurrentLegIndex(currentLegIndex + 1);
    setCurrentFrom(nextFrom);
    // Pass the adjusted arrival time (includes stopover wait time)
    fetchLegOptions(nextFrom, nextTo, adjustedArrivalTime);
  };

  const handleEditLeg = (legIndex) => {
    if (legIndex === 0) {
      handleRestart();
      return;
    }

    const legsToKeep = selectedLegs.slice(0, legIndex);
    setSelectedLegs(legsToKeep);
    
    const lastKeptLeg = legsToKeep[legsToKeep.length - 1];
    let arrivalTime = lastKeptLeg ? lastKeptLeg.arrival : null;
    
    // Add stopover duration if the last kept leg ends at a stopover
    if (lastKeptLeg) {
      const route = buildRoute();
      for (let i = 0; i < route.length; i++) {
        const routeStop = getStopFromRoutePoint(route[i]);
        if (routeStop.id === lastKeptLeg.to.id) {
          const stopoverDuration = getDurationFromRoutePoint(route[i]);
          if (stopoverDuration > 0) {
            const arrivalDate = new Date(arrivalTime);
            arrivalDate.setMinutes(arrivalDate.getMinutes() + stopoverDuration);
            arrivalTime = arrivalDate.toISOString();
          }
          break;
        }
      }
    }
    
    setLastArrivalTime(arrivalTime);
    
    const editFrom = lastKeptLeg ? lastKeptLeg.to : origin;
    setCurrentFrom(editFrom);
    setCurrentLegIndex(legIndex);
    
    const route = buildRoute();
    let nextTo = destination;
    
    for (let i = 0; i < route.length; i++) {
      const routeStop = getStopFromRoutePoint(route[i]);
      if (routeStop.id === editFrom.id && i < route.length - 1) {
        nextTo = getStopFromRoutePoint(route[i + 1]);
        break;
      }
    }
    
    fetchLegOptions(editFrom, nextTo, arrivalTime);
  };

  const handleRestart = () => {
    setCurrentLegIndex(0);
    setSelectedLegs([]);
    setIntermediateStops([]);
    setJourneyComplete(false);
    setLastArrivalTime(null);
    const route = buildRoute();
    const fromStop = getStopFromRoutePoint(route[0]);
    const toStop = getStopFromRoutePoint(route[1]);
    setCurrentFrom(fromStop);
    fetchLegOptions(fromStop, toStop, null);
  };

  const handleDone = async () => {
    try {
      await axios.post('/api/saved/history', {
        origin_id: origin.id,
        origin_name: origin.name,
        destination_id: destination.id,
        destination_name: destination.name,
        legs: selectedLegs
      });
    } catch (err) {
      console.error('Failed to save history:', err);
    }
    onComplete();
  };

  if (journeyComplete) {
    return (
      <div className="journey-planner animate-fadeIn">
        <JourneyProgress 
          legs={selectedLegs} 
          isComplete={true}
          origin={origin}
          destination={destination}
        />
        
        <div className="journey-complete-actions">
          <button className="restart-btn" onClick={handleRestart}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 4v6h6M23 20v-6h-6"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
            </svg>
            {strings.journey.planAgain}
          </button>
          <button className="done-btn" onClick={handleDone}>
            {strings.journey.done}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="journey-planner animate-fadeIn">
      {/* Journey Progress */}
      {selectedLegs.length > 0 && (
        <JourneyProgress 
          legs={selectedLegs} 
          isComplete={false}
          origin={origin}
          destination={destination}
          onEditLeg={handleEditLeg}
        />
      )}

      {/* Current Leg Selection */}
      <div className="current-leg-card">
        <div className="leg-header">
          <div className="leg-number">{currentLegIndex + 1}</div>
          <div className="leg-route">
            <span className="leg-from">{currentFrom?.name}</span>
            <svg className="leg-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
            <span className="leg-to">{currentTo?.name || strings.journey.loading}</span>
          </div>
        </div>

        {loading && (
          <div className="transport-loading">
            <div className="loading-spinner-large"></div>
            <span>{strings.journey.findingOptions}</span>
          </div>
        )}

        {error && (
          <div className="transport-error">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
            <button onClick={() => fetchLegOptions(currentFrom, currentTo, lastArrivalTime)}>
              {strings.journey.retry}
            </button>
          </div>
        )}

        {!loading && !error && transportOptions.length > 0 && (
          <TransportOptions 
            options={transportOptions}
            onSelectTime={handleSelectTime}
          />
        )}
      </div>

      {/* Footer Actions */}
      <div className="journey-actions">
        <button className="back-journey-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {strings.journey.newSearch}
        </button>
        
        {selectedLegs.length > 0 && (
          <button className="restart-journey-btn" onClick={handleRestart}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 4v6h6"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            {strings.journey.startOver}
          </button>
        )}
      </div>
    </div>
  );
}

export default JourneyPlanner;
