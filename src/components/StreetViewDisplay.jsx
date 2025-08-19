'use client';
import React from 'react';

const StreetViewDisplay = ({ location, progress = 0 }) => {
 const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
 
const getCurrentFOV = (progressValue) => {
  if (progressValue < 0.2) return 5;  
  if (progressValue < 0.4) return 35;  
  if (progressValue < 0.6) return 60;  
  if (progressValue < 1.0) return 80;  
  return 90;                           
};

 const currentFOV = getCurrentFOV(progress);
 
 if (!location) return null;

 const streetViewURL = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${location.lat},${location.lng}&heading=0&pitch=0&fov=${currentFOV}&key=${API_KEY}`;

 return (
   <div>
     <img src={streetViewURL} alt="Street View" />
     <p>FOV: {currentFOV}°</p>
   </div>
 );
};

export default StreetViewDisplay;