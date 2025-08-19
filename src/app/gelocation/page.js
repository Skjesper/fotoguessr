'use client';

import React, { useState, useEffect } from 'react';

const RandomLocationStreetView = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [randomLocation, setRandomLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentFOV, setCurrentFOV] = useState(10); // Start med MYCKET inzoomad bild
  

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Timer-effekt som kör när spelet startar
  useEffect(() => {
    let interval;
    
    if (gameStarted) {
      interval = setInterval(() => {
        setTimeElapsed(prevTime => {
          const newTime = prevTime + 1;
          
          // Beräkna ny FOV baserat på tid
          let newFOV;
          if (newTime <= 60) {
            // Första minuten: 10° FOV (MYCKET inzoomad)
            newFOV = 10;
          } else if (newTime <= 120) {
            // Andra minuten: 45° FOV (medium zoom)
            newFOV = 45;
          } else {
            // Efter 2 minuter: 90° FOV (utzoomad)
            newFOV = 90;
          }
          
          setCurrentFOV(newFOV);
          return newTime;
        });
      }, 1000); // Uppdatera varje sekund
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted]);

  // Starta spelet
  const startGame = () => {
    setGameStarted(true);
    setTimeElapsed(0);
    setCurrentFOV(10); // Börja MYCKET inzoomad
    getRandomNearbyLocation();
  };

  // Stoppa spelet
  const stopGame = () => {
    setGameStarted(false);
    setTimeElapsed(0);
    setCurrentFOV(10);
  };
  const getUserLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation stöds inte');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setLoading(false);
        console.log('📍 Din position:', location);
      },
      (error) => {
        setError('Kunde inte hämta din position');
        setLoading(false);
        console.error('GPS fel:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Generera slumpmässig koordinat på EXAKT avstånd (inte inom radie)
  const generateRandomLocation = (centerLat, centerLng, exactDistanceMeters) => {
    // Konvertera meter till grader (ungefär)
    const radiusInDegrees = exactDistanceMeters / 111320;
    
    // Slumpmässig vinkel (0-360 grader)
    const angle = Math.random() * 2 * Math.PI;
    
    // Använd EXAKT avstånd (inte slumpmässigt)
    const distance = radiusInDegrees;
    
    // Beräkna nya koordinater
    const deltaLat = distance * Math.cos(angle);
    const deltaLng = distance * Math.sin(angle) / Math.cos(centerLat * Math.PI / 180);
    
    return {
      lat: centerLat + deltaLat,
      lng: centerLng + deltaLng
    };
  };

  // Slumpa en plats på exakt 250 meter från din position
  const getRandomNearbyLocation = () => {
    if (!userLocation) {
      setError('Hämta din position först!');
      return;
    }

    const exactDistance = 250; // Alltid 250 meter
    const randomCoord = generateRandomLocation(
      userLocation.lat,
      userLocation.lng,
      exactDistance
    );

    setRandomLocation({
      ...randomCoord,
      distance: exactDistance
    });

    console.log(`🎯 Slumpad plats exakt ${exactDistance}m bort:`, randomCoord);
  };

  // Generera Street View URL med dynamisk FOV
  const getStreetViewURL = (lat, lng) => {
    return `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${lat},${lng}&heading=0&pitch=0&fov=${currentFOV}&key=${API_KEY}`;
  };

  // Formatera tid som MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Få zoom-beskrivning baserat på FOV
  const getZoomDescription = (fov) => {
    if (fov <= 15) return "🔍 EXTREM zoom (mycket svår!)";
    if (fov <= 50) return "👁️ Medium zoom";
    return "🌐 Utzoomad (lätt)";
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🎯 GPS + Slumpad Street View</h1>

      {/* Hämta GPS-position */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Steg 1: Hämta din position</h3>
        <button
          onClick={getUserLocation}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? '📡 Hämtar...' : '📍 Hitta min position'}
        </button>

        {userLocation && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
            ✅ <strong>Din position:</strong> {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
          </div>
        )}
      </div>

      {/* Spel-kontroller */}
      {userLocation && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
          <h3>🎮 Spel-kontroller</h3>
          
          {!gameStarted ? (
            <button
              onClick={startGame}
              style={{ 
                padding: '12px 24px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              🚀 Starta spel (250m challenge)
            </button>
          ) : (
            <div>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ 
                  padding: '10px 15px', 
                  backgroundColor: '#17a2b8', 
                  color: 'white', 
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  ⏱️ {formatTime(timeElapsed)}
                </div>
                
                <div style={{ 
                  padding: '10px 15px', 
                  backgroundColor: '#6f42c1', 
                  color: 'white', 
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }}>
                  {getZoomDescription(currentFOV)}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={startGame}
                  style={{ 
                    padding: '8px 16px', 
                    backgroundColor: '#fd7e14', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  🎯 Ny plats
                </button>
                
                <button
                  onClick={stopGame}
                  style={{ 
                    padding: '8px 16px', 
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ⏹️ Stoppa
                </button>
              </div>
            </div>
          )}

          {randomLocation && gameStarted && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#d1ecf1', borderRadius: '4px' }}>
              🎲 <strong>Hemlig plats (exakt {randomLocation.distance}m bort)</strong><br />
              <small>Koordinater: {randomLocation.lat.toFixed(6)}, {randomLocation.lng.toFixed(6)}</small>
            </div>
          )}
        </div>
      )}

      {/* Street View bild med dynamisk zoom */}
      {randomLocation && gameStarted && (
        <div style={{ marginBottom: '20px' }}>
          <h3>🔍 Street View - Var är du?</h3>
          <img
            key={`${randomLocation.lat}-${randomLocation.lng}-${currentFOV}`} // Force re-render när FOV ändras
            src={getStreetViewURL(randomLocation.lat, randomLocation.lng)}
            alt="Gissa platsen!"
            style={{
              width: '100%',
              maxWidth: '600px',
              border: '3px solid #007bff',
              borderRadius: '8px',
              transition: 'border-color 0.3s ease'
            }}
            onError={() => setError('Street View inte tillgänglig för denna plats')}
          />
          
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            backgroundColor: '#e7f3ff', 
            borderRadius: '6px',
            border: '1px solid #007bff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span><strong>Zoom-progression:</strong></span>
              <span><strong>FOV: {currentFOV}°</strong></span>
            </div>
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <div style={{ 
                  width: '60px', 
                  height: '8px', 
                  backgroundColor: timeElapsed <= 60 ? '#28a745' : '#e9ecef',
                  borderRadius: '4px'
                }}></div>
                <span style={{ fontSize: '12px' }}>0-1min: EXTREM zoom (10°)</span>
              </div>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginTop: '4px' }}>
                <div style={{ 
                  width: '60px', 
                  height: '8px', 
                  backgroundColor: timeElapsed > 60 && timeElapsed <= 120 ? '#ffc107' : '#e9ecef',
                  borderRadius: '4px'
                }}></div>
                <span style={{ fontSize: '12px' }}>1-2min: Medium (45°)</span>
              </div>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginTop: '4px' }}>
                <div style={{ 
                  width: '60px', 
                  height: '8px', 
                  backgroundColor: timeElapsed > 120 ? '#dc3545' : '#e9ecef',
                  borderRadius: '4px'
                }}></div>
                <span style={{ fontSize: '12px' }}>2min+: Utzoomad (90°)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Felmeddelanden */}
      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '6px',
          marginTop: '10px'
        }}>
          ❌ {error}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e2e3e5', borderRadius: '8px' }}>
        <h4>🎮 Spelregler:</h4>
        <ol>
          <li><strong>Starta spel:</strong> Få din position och slumpa en plats 250m bort</li>
          <li><strong>Första minuten:</strong> EXTREM zoom (FOV 10°) - nästan omöjligt att gissa!</li>
          <li><strong>Andra minuten:</strong> Medium zoom (FOV 45°) - börjar bli synligt</li>
          <li><strong>Efter 2 minuter:</strong> Utzoomad (FOV 90°) - lättast att gissa</li>
          <li><strong>Mål:</strong> Gissa var bilden är tagen och gå dit!</li>
        </ol>
        
        <p><strong>🔍 FOV (Field of View) förklaring:</strong></p>
        <ul>
          <li><strong>10°:</strong> Som att titta genom en kikare - ser bara en liten detalj!</li>
          <li><strong>45°:</strong> Något inzoomad - ser lite mer</li>
          <li><strong>90°:</strong> Bred vy - ser hela omgivningen</li>
        </ul>
      </div>
    </div>
  );
};

export default RandomLocationStreetView;