'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Timer from '@/components/Timer/Timer';
import StreetViewDisplay from '@/components/StreetViewDisplay/StreetViewDisplay';
import Button from '@/components/Button';
import styles from '@/app/gamePage/page.module.css';
import UnlockTime from '@/components/UnlockTime/UnlockTime';
import Minilevel from '@/components/MiniLevel/MiniLevel';
import FotoguesserHeader from '@/components/FotoguesserHeader/FotoguesserHeader';

function GamePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [timerFinished, setTimerFinished] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameLocation, setGameLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  // Läs level från URL parametrar
  useEffect(() => {
    const level = searchParams.get('level');
    if (level) {
      setCurrentLevel(parseInt(level));
    }
  }, [searchParams]);

  // Generera slumpmässig koordinat mellan 30-50m från användarens position (för testing)
  const generateRandomLocation = (centerLat, centerLng) => {
    const minDistance = 30;
    const maxDistance = 50;
    const distance = minDistance + Math.random() * (maxDistance - minDistance);
    
    // Korrekt konvertering till grader (1 grad ≈ 111,320 meter vid ekvatorn)
    const radiusInDegrees = distance / 111320;
    const angle = Math.random() * 2 * Math.PI;
    
    const deltaLat = radiusInDegrees * Math.cos(angle);
    // Justera för latitud (längdgrader blir kortare när man går norrut)
    const deltaLng = radiusInDegrees * Math.sin(angle) / Math.cos(centerLat * Math.PI / 180);
    
    const newLocation = {
      lat: centerLat + deltaLat,
      lng: centerLng + deltaLng
    };
    
    // Verifiera avståndet med Vincenty för att säkerställa korrekthet
    const actualDistance = calculateDistance(centerLat, centerLng, newLocation.lat, newLocation.lng);
    console.log(`Genererat mål på ${actualDistance.toFixed(1)} meter avstånd (target: ${distance.toFixed(1)}m)`);
    
    return newLocation;
  };

  // Hämta GPS och generera spel-plats
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          
          const randomLocation = generateRandomLocation(userPos.lat, userPos.lng);
          setGameLocation(randomLocation);
        },
        (error) => {
          console.warn('GPS fel:', error);
          // Ingen fallback - låt gameLocation vara null
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      // Ingen fallback - låt gameLocation vara null
      console.log('GPS inte tillgängligt');
    }
  }, []);

  // Level-specific data
  const levelData = {
    1: {
      timeSlot: "08:00-11:00",
      unlockTime: "11:00",
      duration: 1800
    },
    2: {
      timeSlot: "11:00-13:00", 
      unlockTime: "13:00",
      duration: 1800
    },
    3: {
      timeSlot: "13:00-17:00",
      unlockTime: "17:00", 
      duration: 1800
    }
  };

  const currentLevelData = levelData[currentLevel] || levelData[1];

  // Vincenty formula för exakt cirkel-avstånd (fågelvägen) - perfekt för area-kontroll
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const a = 6378137; // WGS-84 major axis (meter)
    const b = 6356752.314245; // WGS-84 minor axis (meter)  
    const f = 1/298.257223563; // WGS-84 flattening
    
    const L = (lng2 - lng1) * Math.PI / 180;
    const U1 = Math.atan((1 - f) * Math.tan(lat1 * Math.PI / 180));
    const U2 = Math.atan((1 - f) * Math.tan(lat2 * Math.PI / 180));
    const sinU1 = Math.sin(U1);
    const cosU1 = Math.cos(U1);
    const sinU2 = Math.sin(U2);
    const cosU2 = Math.cos(U2);
    
    let lambda = L;
    let lambdaP;
    let iterLimit = 100;
    let cosSqAlpha, sinSigma, cos2SigmaM, cosSigma, sigma;
    
    do {
      const sinLambda = Math.sin(lambda);
      const cosLambda = Math.cos(lambda);
      sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) + 
        (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
      
      if (sinSigma === 0) return 0; // Samma punkt
      
      cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
      sigma = Math.atan2(sinSigma, cosSigma);
      const sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
      cosSqAlpha = 1 - sinAlpha * sinAlpha;
      cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
      
      if (isNaN(cos2SigmaM)) cos2SigmaM = 0; // Ekvatorial linje
      
      const C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
      lambdaP = lambda;
      lambda = L + (1 - C) * f * sinAlpha * (sigma + C * sinSigma * 
        (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);
    
    if (iterLimit === 0) {
      console.warn('Vincenty formula konvergerade inte');
      return NaN;
    }
    
    const uSq = cosSqAlpha * (a * a - b * b) / (b * b);
    const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    const deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * 
      (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * 
      (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
    
    const distance = b * A * (sigma - deltaSigma);
    
    return distance; // Exakt cirkel-avstånd i meter
  };

  // Kontrollera om användaren är inom 25 meter från målet och navigera till gameComplete
  const checkIfNearTarget = () => {
    if (!gameLocation) {
      console.log('Saknar spel-plats data');
      return;
    }

    console.log('Hämtar aktuell GPS-position...');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const currentLat = position.coords.latitude;
        const currentLng = position.coords.longitude;
        
        console.log(`Nuvarande position: ${currentLat}, ${currentLng}`);
        console.log(`Målposition: ${gameLocation.lat}, ${gameLocation.lng}`);
        
        // Använd Vincenty för exakt cirkel-avstånd med dynamisk radie
        const distance = calculateDistance(
          currentLat, 
          currentLng, 
          gameLocation.lat, 
          gameLocation.lng
        );

        // Dynamisk radie baserat på GPS-noggrannhet
        const gpsAccuracy = position.coords.accuracy;
        const baseRadius = 25; // Grundradie
        const accuracyBuffer = Math.max(0, gpsAccuracy - 10); // Extra buffert om GPS är sämre än 10m
        const dynamicRadius = baseRadius + accuracyBuffer;
        
        const success = distance <= dynamicRadius;
        
        console.log(`Cirkel-avstånd till mål: ${distance.toFixed(1)} meter`);
        console.log(`GPS-noggrannhet: ${gpsAccuracy.toFixed(1)}m`);
        console.log(`Dynamisk acceptans-radie: ${dynamicRadius.toFixed(1)}m`);
        console.log(`Resultat: ${success ? 'GODKÄNT' : 'FÖR LÅNGT BORT'} (inom ${dynamicRadius.toFixed(1)}m radie: ${success})`);
        
        // Uppdatera användarens position med den senaste
        setUserLocation({
          lat: currentLat,
          lng: currentLng
        });
        
        // Navigera till gameComplete med resultat OCH koordinater
        const params = new URLSearchParams({
          level: currentLevel.toString(),
          success: success.toString(),
          distance: distance.toFixed(1),
          target: success ? 'reached' : 'missed',
          timeRemaining: timeRemaining.toFixed(0),
          targetLat: gameLocation.lat.toString(),
          targetLng: gameLocation.lng.toString(),
          userLat: currentLat.toString(),
          userLng: currentLng.toString(),
          accuracy: position.coords.accuracy.toFixed(1)
        });
        
        router.push(`/gameComplete?${params.toString()}`);
      },
      (error) => {
        console.warn('Kunde inte hämta nuvarande position:', error);
        // Navigera till gameComplete med fel
        const params = new URLSearchParams({
          level: currentLevel.toString(),
          success: 'false',
          distance: 'unknown',
          target: 'error',
          error: 'GPS fel',
          timeRemaining: timeRemaining.toFixed(0),
          targetLat: gameLocation.lat.toString(),
          targetLng: gameLocation.lng.toString()
        });
        
        router.push(`/gameComplete?${params.toString()}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const handleProgress = (progressValue) => {
    setProgress(progressValue);
    // Beräkna tid kvar baserat på progress och total duration
    const totalTime = currentLevelData.duration;
    const elapsed = (progressValue / 100) * totalTime;
    const remaining = totalTime - elapsed;
    setTimeRemaining(Math.max(0, remaining));
  };

  const handleComplete = () => {
    setTimerFinished(true);
  };

  return (
    <div>
      <FotoguesserHeader />
      <section className={styles.gameSection}>
        <div className={styles.gameUi}>
          <Minilevel level={currentLevel} />
          <Timer 
            duration={currentLevelData.duration}
            onProgress={handleProgress}
            onComplete={handleComplete}
          />
          <UnlockTime>
            {currentLevelData.unlockTime}
          </UnlockTime>
        </div>
        
        <div className={styles.streetViewSection}>
          <div className={styles.imgDisplay}>
            {gameLocation ? (
              <StreetViewDisplay 
                location={gameLocation}
                progress={progress}
              />
            ) : (
              <div className={styles.infoMessage}>Om du ser det här meddelandet. Se till så att du har godkänt att dela din plats.</div>
            )}
          </div>
        </div>
        
        <div className={styles.buttomUi}>
          <Button 
            variant="primary"
            onClick={checkIfNearTarget}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="23" viewBox="0 0 18 23" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M9 0C4.02975 0 0 4.60355 0 9.77522C0 14.9066 2.87212 20.4843 7.35412 22.6256C7.86928 22.8722 8.43116 23 9 23C9.56884 23 10.1307 22.8722 10.6459 22.6256C15.1279 20.4843 18 14.9066 18 9.77522C18 4.60355 13.9703 0 9 0ZM9 11.5003C9.59674 11.5003 10.169 11.2579 10.591 10.8266C11.0129 10.3952 11.25 9.81021 11.25 9.2002C11.25 8.59019 11.0129 8.00517 10.591 7.57382C10.169 7.14248 9.59674 6.90015 9 6.90015C8.40326 6.90015 7.83097 7.14248 7.40901 7.57382C6.98705 8.00517 6.75 8.59019 6.75 9.2002C6.75 9.81021 6.98705 10.3952 7.40901 10.8266C7.83097 11.2579 8.40326 11.5003 9 11.5003Z" fill="#CBD9F4"/>
            </svg>
            Tagga plats
          </Button>
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Laddar...</div>}>
      <GamePageContent />
    </Suspense>
  );
}