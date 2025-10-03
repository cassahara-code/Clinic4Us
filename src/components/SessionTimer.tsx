import React, { useState, useEffect } from 'react';
import { WatchLater } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface SessionTimerProps {
  onSessionExpired?: () => void;
}

const SessionTimer: React.FC<SessionTimerProps> = ({ onSessionExpired }) => {
  const { getTimeRemaining, isAuthenticated } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());

  useEffect(() => {
    if (!isAuthenticated) return;

    // Atualizar timer a cada segundo
    const timerId = setInterval(() => {
      const remaining = getTimeRemaining();
      setTimeRemaining(remaining);

      // Se o tempo acabou, chamar callback
      if (remaining <= 0 && onSessionExpired) {
        clearInterval(timerId);
        onSessionExpired();
      }
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(timerId);
    };
  }, [isAuthenticated, getTimeRemaining, onSessionExpired]);

  const formatTime = (seconds: number): string => {
    const safeSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const secs = safeSeconds % 60;

    const padZero = (num: number): string => {
      return num < 10 ? '0' + num : num.toString();
    };

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(secs)}`;
  };

  if (!isAuthenticated) return null;

  return (
    <span
      className="timer-text"
      style={{
        color: timeRemaining < 600 ? '#dc3545' : 'inherit',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        paddingTop: '6px'
      }}
    >
      <WatchLater className="timer-icon" />
      {formatTime(timeRemaining)}
    </span>
  );
};

export default SessionTimer;
