'use client';

import React from 'react';

const SimpleStreetView = () => {
  // ERSÄTT MED DIN API-NYCKEL
  const API_KEY = "AIzaSyC-8O9gK-7jLWE7iorMhwwSb4wTIIQt5ks";
  
  // Koordinater för Göteborg centrum
 const lat = 57.705418;  // 57°42'37.9"N
  const lng = 11.936348;  // 11°56'19.9"E
  
  // Street View URL
  const streetViewURL = `https://maps.googleapis.com/maps/api/streetview?size=640x400&location=${lat},${lng}&key=${API_KEY}`;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Street View Test</h1>
      
      <img 
        src={streetViewURL}
        alt="Street View"
        style={{ 
          width: '100%', 
          maxWidth: '640px',
          border: '1px solid #ccc'
        }}
      />
      
      <p>URL: {streetViewURL}</p>
    </div>
  );
};

export default SimpleStreetView;

