import React, { useState, useEffect } from 'react';
import { X, Minimize2 } from 'lucide-react';

interface FullscreenClockProps {
  show: boolean;
  onClose: () => void;
  isTimerRunning: boolean;
  timerTime: string;
  timerStatus: string;
}

const FullscreenClock: React.FC<FullscreenClockProps> = ({
  show,
  onClose,
  isTimerRunning,
  timerTime,
  timerStatus
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMiniTimer, setShowMiniTimer] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setShowMiniTimer(isTimerRunning);
  }, [isTimerRunning]);

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

  const { hours, minutes, seconds } = formatTime(currentTime);

  if (!show) return null;

  return (
    <div className="fullscreen-clock">
      {/* 关闭按钮 */}
      <button className="close-clock-btn" onClick={onClose}>
        <X size={24} />
      </button>

      {/* 翻页时钟 */}
      <div className="flip-clock-container">
        <div className="flip-time">
          <div className="flip-digit-group">
            <div className="flip-digit">
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">{hours[0]}</div>
                  <div className="flip-card-back">{hours[0]}</div>
                </div>
              </div>
            </div>
            <div className="flip-digit">
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">{hours[1]}</div>
                  <div className="flip-card-back">{hours[1]}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flip-separator">:</div>

          <div className="flip-digit-group">
            <div className="flip-digit">
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">{minutes[0]}</div>
                  <div className="flip-card-back">{minutes[0]}</div>
                </div>
              </div>
            </div>
            <div className="flip-digit">
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">{minutes[1]}</div>
                  <div className="flip-card-back">{minutes[1]}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flip-separator">:</div>

          <div className="flip-digit-group">
            <div className="flip-digit">
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">{seconds[0]}</div>
                  <div className="flip-card-back">{seconds[0]}</div>
                </div>
              </div>
            </div>
            <div className="flip-digit">
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">{seconds[1]}</div>
                  <div className="flip-card-back">{seconds[1]}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flip-date">
          {formatDate(currentTime)}
        </div>
      </div>

      {/* 小窗番茄计时器 */}
      {showMiniTimer && (
        <div className="mini-timer">
          <div className="mini-timer-header">
            <span className="mini-timer-title">番茄计时器</span>
            <button 
              className="mini-timer-close"
              onClick={() => setShowMiniTimer(false)}
            >
              <Minimize2 size={16} />
            </button>
          </div>
          <div className="mini-timer-content">
            <div className="mini-timer-time">{timerTime}</div>
            <div className="mini-timer-status">{timerStatus}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullscreenClock;