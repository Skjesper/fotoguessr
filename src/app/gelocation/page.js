'use client';

import React, { useState } from 'react';

const RandomLocationStreetView = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [randomLocation, setRandomLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // ERSÄTT MED DIN API-NYCKEL
  const API_KEY = "AIzaSyC-8O9gK-7jLWE7iorMhwwSb4wTIIQt5ks";

  // Hämta användarens GPS-position
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

  // Generera Street View URL
  const getStreetViewURL = (lat, lng) => {
    return `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${lat},${lng}&heading=0&pitch=0&fov=90&key=${API_KEY}`;
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

      {/* Slumpa plats på exakt 250m avstånd */}
      {userLocation && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
          <h3>Steg 2: Slumpa plats exakt 250m bort</h3>
          <button
            onClick={getRandomNearbyLocation}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#fd7e14', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            🎯 Slumpa plats (250m)
          </button>

          {randomLocation && (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#d1ecf1', borderRadius: '4px' }}>
              🎲 <strong>Slumpad plats (exakt {randomLocation.distance}m bort):</strong><br />
              {randomLocation.lat.toFixed(6)}, {randomLocation.lng.toFixed(6)}
            </div>
          )}
        </div>
      )}

      {/* Street View bild */}
      {randomLocation && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Steg 3: Street View av slumpad plats</h3>
          <img
            src={getStreetViewURL(randomLocation.lat, randomLocation.lng)}
            alt="Slumpad Street View"
            style={{
              width: '100%',
              maxWidth: '600px',
              border: '2px solid #ccc',
              borderRadius: '8px'
            }}
            onError={() => setError('Street View inte tillgänglig för denna plats')}
          />
          
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            <strong>Street View URL:</strong><br />
            {getStreetViewURL(randomLocation.lat, randomLocation.lng)}
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

      {/* Förklaring */}
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e2e3e5', borderRadius: '8px' }}>
        <h4>🔍 Hur det fungerar:</h4>
        <ol>
          <li><strong>GPS:</strong> Hämtar din exakta position med Geolocation API</li>
          <li><strong>Matematik:</strong> Genererar slumpmässiga koordinater inom angiven radie</li>
          <li><strong>Street View:</strong> Skickar koordinaterna till Google Street View API</li>
          <li><strong>Resultat:</strong> Visar en bild från den slumpade platsen</li>
        </ol>
        
        <p><strong>Formeln för slumpmässiga koordinater:</strong></p>
        <ul>
          <li>Konvertera meter → grader (1 grad ≈ 111,320 meter)</li>
          <li>Slumpmässig vinkel (0-360°) och avstånd</li>
          <li>Beräkna nya lat/lng med trigonometri</li>
        </ul>
      </div>
    </div>
  );
};

export default RandomLocationStreetView;