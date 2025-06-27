import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface FullscreenClockProps {
  show: boolean;
  onClose: () => void;
}

const FullscreenClock: React.FC<FullscreenClockProps> = ({ show, onClose }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return { hours, minutes, seconds };
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    return date.toLocaleDateString('zh-CN', options);
  };

  const { hours, minutes, seconds } = formatTime(time);

  if (!show) return null;

  return (
    <div className="fullscreen-clock">
      <button className="close-clock" onClick={onClose}>
        <X size={24} />
      </button>
      
      <div className="flip-clock-container">
        <div className="flip-time">
          <div className="flip-digit-group">
            <div className="flip-digit">
              <div className="flip-digit-top">
                <span>{hours[0]}</span>
              </div>
              <div className="flip-digit-bottom">
                <span>{hours[0]}</span>
              </div>
            </div>
            <div className="flip-digit">
              <div className="flip-digit-top">
                <span>{hours[1]}</span>
              </div>
              <div className="flip-digit-bottom">
                <span>{hours[1]}</span>
              </div>
            </div>
          </div>
          
          <div className="flip-separator">:</div>
          
          <div className="flip-digit-group">
            <div className="flip-digit">
              <div className="flip-digit-top">
                <span>{minutes[0]}</span>
              </div>
              <div className="flip-digit-bottom">
                <span>{minutes[0]}</span>
              </div>
            </div>
            <div className="flip-digit">
              <div className="flip-digit-top">
                <span>{minutes[1]}</span>
              </div>
              <div className="flip-digit-bottom">
                <span>{minutes[1]}</span>
              </div>
            </div>
          </div>
          
          <div className="flip-separator">:</div>
          
          <div className="flip-digit-group">
            <div className="flip-digit">
              <div className="flip-digit-top">
                <span>{seconds[0]}</span>
              </div>
              <div className="flip-digit-bottom">
                <span>{seconds[0]}</span>
              </div>
            </div>
            <div className="flip-digit">
              <div className="flip-digit-top">
                <span>{seconds[1]}</span>
              </div>
              <div className="flip-digit-bottom">
                <span>{seconds[1]}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flip-date">
          {formatDate(time)}
        </div>
      </div>
    </div>
  );
};

export default FullscreenClock;