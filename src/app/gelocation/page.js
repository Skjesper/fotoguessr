'use client';

import React, { useState } from 'react';

const GeolocationExample = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Funktion för att hämta användarens position
  const getUserLocation = () => {
    setLoading(true);
    setError(null);

    // Kontrollera om Geolocation API stöds
    if (!navigator.geolocation) {
      setError('Geolocation stöds inte av din webbläsare');
      setLoading(false);
      return;
    }

    // Hämta position
    navigator.geolocation.getCurrentPosition(
      // Framgång - position hämtad
      (position) => {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp)
        };
        
        setLocation(userLocation);
        setLoading(false);
        console.log('📍 Position hämtad:', userLocation);
      },
      
      // Fel - kunde inte hämta position
      (error) => {
        let errorMessage = 'Okänt fel';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Användaren nekade tillåtelse till platsdata';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Platsdata är inte tillgänglig';
            break;
          case error.TIMEOUT:
            errorMessage = 'Timeout - tog för lång tid att hämta position';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
        console.error('❌ Geolocation fel:', errorMessage);
      },
      
      // Inställningar för geolocation
      {
        enableHighAccuracy: true,  // Använd GPS för högre precision
        timeout: 10000,           // Max 10 sekunder timeout
        maximumAge: 60000         // Använd cachad position i max 1 minut
      }
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>📍 Geolocation API Tutorial</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={getUserLocation}
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '📡 Hämtar position...' : '📍 Hämta min position'}
        </button>
      </div>

      {/* Fel-meddelande */}
      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          ❌ <strong>Fel:</strong> {error}
        </div>
      )}

      {/* Position-information */}
      {location && (
        <div style={{
          padding: '15px',
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <h3>✅ Position hämtad!</h3>
          <p><strong>Latitud:</strong> {location.latitude.toFixed(6)}</p>
          <p><strong>Longitud:</strong> {location.longitude.toFixed(6)}</p>
          <p><strong>Noggrannhet:</strong> ±{Math.round(location.accuracy)} meter</p>
          <p><strong>Tid:</strong> {location.timestamp.toLocaleString('sv-SE')}</p>
        </div>
      )}

      {/* Förklaring */}
      <div style={{
        padding: '15px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '6px'
      }}>
        <h3>🔍 Hur Geolocation API fungerar:</h3>
        
        <h4>1. Kontrollera stöd:</h4>
        <code style={{ backgroundColor: '#e9ecef', padding: '2px 4px' }}>
          if (!navigator.geolocation)
        </code>
        
        <h4>2. Hämta position:</h4>
        <code style={{ backgroundColor: '#e9ecef', padding: '2px 4px' }}>
          navigator.geolocation.getCurrentPosition()
        </code>
        
        <h4>3. Hantera resultat:</h4>
        <ul>
          <li><strong>Framgång:</strong> position.coords.latitude/longitude</li>
          <li><strong>Fel:</strong> error.code och error.message</li>
        </ul>
        
        <h4>4. Vanliga fel:</h4>
        <ul>
          <li><strong>PERMISSION_DENIED:</strong> Användaren sa nej</li>
          <li><strong>POSITION_UNAVAILABLE:</strong> GPS fungerar inte</li>
          <li><strong>TIMEOUT:</strong> Tog för lång tid</li>
        </ul>
      </div>
    </div>
  );
};

export default GeolocationExample;