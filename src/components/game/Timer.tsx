import { useEffect, useRef } from 'react';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
  onTimeUp: () => void;
  isPaused?: boolean;
  onTick?: (time: number) => void;
}

export default function Timer({
  timeRemaining,
  totalTime,
  onTimeUp,
  isPaused = false,
  onTick
}: TimerProps) {
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      const newTime = timeRemaining - 1;
      
      if (newTime <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        onTimeUp();
      } else if (onTick) {
        onTick(newTime);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeRemaining, isPaused, onTimeUp, onTick]);

  const percentage = (timeRemaining / totalTime) * 100;
  const isWarning = timeRemaining <= 10;
  const isCritical = timeRemaining <= 5;

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
        {timeRemaining}s
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