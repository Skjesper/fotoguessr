'use client';
import { useState } from 'react';
import Timer from '@/components/Timer';
import StreetViewDisplay from '@/components/StreetViewDisplay';
import Button from '@/components/Button';

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
     
      <Timer 
        duration={40}
        onProgress={setProgress}
        onComplete={handleComplete}
      />
     
      <StreetViewDisplay 
        location={testLocation}
        progress={progress}
      />

      <Button 
        variant="primary"
        onClick={() => console.log('Button clicked')}
      >
        Submit Guess
      </Button>
    </div>
  );
}