'use client';

import React, { useState } from 'react';

const StreetViewDisplay = () => {
  const API_KEY = "AIzaSyC-8O9gK-7jLWE7iorMhwwSb4wTIIQt5ks";
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const location = {
    lat: 57.7068,
    lng: 11.9373
  };

  const fov = 10;
  const streetViewURL = `https://maps.googleapis.com/maps/api/streetview?size=400x600&location=${location.lat},${location.lng}&heading=0&pitch=0&fov=${fov}&key=${API_KEY}`;

  return (
    <div>    
      <div>
        <img 
          src={streetViewURL} 
          alt="Street View"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{ 
            maxWidth: '100%',
            border: '2px solid white'
          }}
        />
      </div>
    </div>
  );
};

export default StreetViewDisplay;