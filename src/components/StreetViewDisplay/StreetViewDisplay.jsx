'use client';
import React from 'react';

const StreetViewDisplay = ({ location, progress = 0 }) => {
 const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
 
const getCurrentFOV = (progressValue) => {
  if (progressValue < 0.05) return 20;  
  if (progressValue < 0.10) return 25;  
  if (progressValue < 0.15) return 30;  
  if (progressValue < 0.20) return 35;  
  if (progressValue < 0.25) return 40;  
  if (progressValue < 0.30) return 45;  
  if (progressValue < 0.35) return 50;  
  if (progressValue < 0.40) return 55;  
  if (progressValue < 0.45) return 60;  
  if (progressValue < 0.50) return 65;  
  if (progressValue < 0.55) return 70;  
  if (progressValue < 0.60) return 75;  
  if (progressValue < 0.65) return 80;  
  if (progressValue < 0.70) return 85;  
  if (progressValue < 0.75) return 90;  
  if (progressValue < 0.80) return 95;  
  if (progressValue < 0.85) return 100;  
  if (progressValue < 0.90) return 105;  
  if (progressValue < 0.95) return 110;  
  return 115;                           
};

 const currentFOV = getCurrentFOV(progress);
 
 if (!location) return null;

 const streetViewURL = `https://maps.googleapis.com/maps/api/streetview?size=400x484&location=${location.lat},${location.lng}&heading=0&pitch=0&fov=${currentFOV}&key=${API_KEY}`;

 return (
   <div>
     <img  src={streetViewURL} alt="Street View" />
   </div>
 );
};

export default StreetViewDisplay;