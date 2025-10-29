import { useEffect, useRef, useState } from 'react';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export default function Timer({
  timeRemaining: initialTime,
  totalTime,
  onTimeUp,
  isPaused = false
}: TimerProps) {
  const [currentTime, setCurrentTime] = useState(initialTime);
  const intervalRef = useRef<number | undefined>(undefined);
  const hasTriggeredTimeUp = useRef(false);

  // Reset timer when initialTime changes (new round)
  useEffect(() => {
    setCurrentTime(initialTime);
    hasTriggeredTimeUp.current = false;
  }, [initialTime]);

  // Trigger onTimeUp when time reaches 0
  useEffect(() => {
    if (currentTime === 0 && !hasTriggeredTimeUp.current) {
      hasTriggeredTimeUp.current = true;
      onTimeUp();
    }
  }, [currentTime, onTimeUp]);

  // Timer countdown logic
  useEffect(() => {
    if (isPaused || currentTime === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setCurrentTime(prev => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [isPaused, currentTime]);

  const percentage = (currentTime / totalTime) * 100;
  const isWarning = currentTime <= 10;
  const isCritical = currentTime <= 5;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-sm text-gray-300">Time Remaining</div>
      <div
        className={`text-4xl font-bold ${
          isCritical
            ? 'text-red-500 animate-pulse'
            : isWarning
            ? 'text-halloween-lightOrange'
            : 'text-halloween-orange'
        }`}
      >
        {currentTime}s
      </div>
      <div className="w-32 h-2 bg-halloween-black/50 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            isCritical
              ? 'bg-red-500'
              : isWarning
              ? 'bg-halloween-lightOrange'
              : 'bg-halloween-orange'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}