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

  // Generera slumpmässig koordinat mellan 150-300m från användarens position
  const generateRandomLocation = (centerLat, centerLng) => {
    const minDistance = 150;
    const maxDistance = 300;
    const distance = minDistance + Math.random() * (maxDistance - minDistance);
    
    const radiusInDegrees = distance / 111320;
    const angle = Math.random() * 2 * Math.PI;
    
    const deltaLat = radiusInDegrees * Math.cos(angle);
    const deltaLng = radiusInDegrees * Math.sin(angle) / Math.cos(centerLat * Math.PI / 180);
    
    return {
      lat: centerLat + deltaLat,
      lng: centerLng + deltaLng
    };
  };

  // Hämta GPS och generera spel-plats
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          
          const randomLocation = generateRandomLocation(userPos.lat, userPos.lng);
          setGameLocation(randomLocation);
        },
        (error) => {
          console.error('GPS fel:', error);
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

  // Superenkel approximation för Sverige
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const latDiff = (lat2 - lat1) * 111000; // ~111km per grad latitud
    const lngDiff = (lng2 - lng1) * 61000;  // ~61km per grad longitud i Sverige
    
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
  };

  // Kontrollera om användaren är inom 25 meter från målet och navigera till gameComplete
  const checkIfNearTarget = () => {
    if (!userLocation || !gameLocation) {
      console.log('Saknar position data');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLat = position.coords.latitude;
        const currentLng = position.coords.longitude;
        
        const distance = calculateDistance(
          currentLat, 
          currentLng, 
          gameLocation.lat, 
          gameLocation.lng
        );

        const success = distance <= 25;
        
        console.log(`Avstånd till mål: ${distance.toFixed(1)} meter (noggrannhet: ${position.coords.accuracy.toFixed(1)}m)`);
        console.log(success ? 'OK - Du är inom 25 meter från målet!' : `För långt bort - du behöver komma ${(distance - 25).toFixed(1)} meter närmre`);
        
        // Navigera till gameComplete med resultat OCH koordinater
        const params = new URLSearchParams({
          level: currentLevel.toString(),
          success: success.toString(),
          distance: distance.toFixed(1),
          target: success ? 'reached' : 'missed',
          timeRemaining: timeRemaining.toFixed(0),
          targetLat: gameLocation.lat.toString(),
          targetLng: gameLocation.lng.toString(),
          accuracy: position.coords.accuracy.toFixed(1)
        });
        
        router.push(`/gameComplete?${params.toString()}`);
      },
      (error) => {
        console.error('Kunde inte hämta nuvarande position:', error);
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
        timeout: 10000,
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