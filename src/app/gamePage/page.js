'use client';
import { useState } from 'react';
import Timer from '@/components/Timer/Timer';
import StreetViewDisplay from '@/components/StreetViewDisplay/StreetViewDisplay';
import Button from '@/components/Button';
import styles from '@/app/gamePage/page.module.css';
import UnlockTime from '@/components/UnlockTime/UnlockTime';


export default function Page() {
  const [progress, setProgress] = useState(0);
  const [timerFinished, setTimerFinished] = useState(false);
 
  const testLocation = {
    lat: 57.7068,
    lng: 11.9373
  };

  const handleProgress = (progressValue) => {
    setProgress(progressValue);
  };

  const handleComplete = () => {
    setTimerFinished(true);
  };

  return (
    <div>
      <h1>Lindholmen Guesser</h1>
     <section className={styles.gameSection}>
        <div className={styles.gameUi}>
           <UnlockTime>
            11:00
            </UnlockTime>
      <Timer 
        duration={40}
        onProgress={setProgress}
        onComplete={handleComplete}
      />
        

        <UnlockTime>
            11:00
            </UnlockTime>
            </div>
      
     <div className={styles.streetViewSection}>
        <div className={styles.imgDisplay}>
        <StreetViewDisplay 
          location={testLocation}
          progress={progress}
        />
        </div>
      </div>
      <div className= {styles.buttomUi}>
      <Button 
        variant="primary"
        onClick={() => console.log('Button clicked')}
      >
       Tagga plats
      </Button>
      </div>
      </section>

    </div>
  );
}