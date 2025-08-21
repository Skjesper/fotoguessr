'use client';
import { useState } from 'react';
import Timer from '@/components/Timer/Timer';
import StreetViewDisplay from '@/components/StreetViewDisplay/StreetViewDisplay';
import Button from '@/components/Button';
import styles from '@/app/gamePage/page.module.css';
import UnlockTime from '@/components/UnlockTime/UnlockTime';
import Minilevel from '@/components/MiniLevel/MiniLevel';
import FotoguesserHeader from '@/components/FotoguesserHeader/FotoguesserHeader';


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
        <FotoguesserHeader></FotoguesserHeader>
     <section className={styles.gameSection}>
        <div className={styles.gameUi}>
         <Minilevel level={1} />
      <Timer 
        duration={1000}
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