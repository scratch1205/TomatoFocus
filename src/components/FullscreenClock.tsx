import React, { useState, useEffect } from 'react';
import { X, Minimize2, Settings as SettingsIcon } from 'lucide-react';

interface FullscreenClockProps {
  show: boolean;
  onClose: () => void;
  isTimerRunning: boolean;
  timerTime: string;
  timerStatus: string;
  clockStyle: 'digital' | 'flip' | 'analog';
  enableAnimations: boolean;
}

const FullscreenClock: React.FC<FullscreenClockProps> = ({
  show,
  onClose,
  isTimerRunning,
  timerTime,
  timerStatus,
  clockStyle,
  enableAnimations
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMiniTimer, setShowMiniTimer] = useState(false);
  const [miniTimerSize, setMiniTimerSize] = useState({ width: 250, height: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [miniTimerPos, setMiniTimerPos] = useState({ x: 30, y: 30 });
  const [showPomodoroMode, setShowPomodoroMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setShowMiniTimer(isTimerRunning);
    setShowPomodoroMode(isTimerRunning);
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

  // 解析番茄钟时间，显示分钟和秒数
  const parsePomodoroTime = (timeStr: string) => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      totalMinutes: minutes,
      totalSeconds: seconds
    };
  };

  const { hours, minutes, seconds } = formatTime(currentTime);
  const pomodoroData = parsePomodoroTime(timerTime);

  // Handle mini timer dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('mini-timer-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - miniTimerPos.x,
        y: e.clientY - miniTimerPos.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setMiniTimerPos({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart]);

  const renderClock = () => {
    switch (clockStyle) {
      case 'digital':
        return (
          <div className="digital-clock">
            <div className="digital-time">
              {hours}:{minutes}:{seconds}
            </div>
            <div className="digital-date">
              {formatDate(currentTime)}
            </div>
          </div>
        );

      case 'analog':
        return (
          <div className="analog-clock">
            <div className="analog-face">
              <div className="analog-numbers">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`analog-number analog-number-${i + 1}`}>
                    {i + 1}
                  </div>
                ))}
              </div>
              <div 
                className="analog-hand analog-hour-hand"
                style={{ 
                  transform: `rotate(${(currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5}deg)` 
                }}
              />
              <div 
                className="analog-hand analog-minute-hand"
                style={{ 
                  transform: `rotate(${currentTime.getMinutes() * 6}deg)` 
                }}
              />
              <div 
                className="analog-hand analog-second-hand"
                style={{ 
                  transform: `rotate(${currentTime.getSeconds() * 6}deg)` 
                }}
              />
              <div className="analog-center" />
            </div>
            <div className="analog-date">
              {formatDate(currentTime)}
            </div>
          </div>
        );

      case 'flip':
      default:
        // 如果番茄钟正在运行，显示番茄钟倒计时
        if (showPomodoroMode && isTimerRunning) {
          return (
            <div className="flip-clock-container pomodoro-mode">
              <div className="pomodoro-status-indicator">
                <div className={`status-badge ${timerStatus === '工作中' ? 'work-mode' : 'break-mode'}`}>
                  {timerStatus}
                </div>
              </div>
              
              <div className="flip-time pomodoro-timer">
                {/* 分钟显示 - 超大字体 */}
                <div className="flip-digit-group pomodoro-minutes">
                  <div className="flip-digit pomodoro-digit">
                    <div className="flip-card">
                      <div className="flip-card-inner">
                        <div className="flip-card-front pomodoro-card">{pomodoroData.minutes[0]}</div>
                        <div className="flip-card-back pomodoro-card">{pomodoroData.minutes[0]}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flip-digit pomodoro-digit">
                    <div className="flip-card">
                      <div className="flip-card-inner">
                        <div className="flip-card-front pomodoro-card">{pomodoroData.minutes[1]}</div>
                        <div className="flip-card-back pomodoro-card">{pomodoroData.minutes[1]}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pomodoro-unit-label">分钟</div>

                {/* 秒数显示 - 中等字体 */}
                <div className="flip-digit-group pomodoro-seconds">
                  <div className="flip-digit pomodoro-second-digit">
                    <div className="flip-card">
                      <div className="flip-card-inner">
                        <div className="flip-card-front pomodoro-second-card">{pomodoroData.seconds[0]}</div>
                        <div className="flip-card-back pomodoro-second-card">{pomodoroData.seconds[0]}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flip-digit pomodoro-second-digit">
                    <div className="flip-card">
                      <div className="flip-card-inner">
                        <div className="flip-card-front pomodoro-second-card">{pomodoroData.seconds[1]}</div>
                        <div className="flip-card-back pomodoro-second-card">{pomodoroData.seconds[1]}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pomodoro-second-label">秒</div>
              </div>

              <div className="pomodoro-description">
                <div className="description-text">
                  {timerStatus === '工作中' ? '专注时间，保持高效！' : '休息时间，放松一下！'}
                </div>
                <div className="time-detail">
                  剩余 {pomodoroData.totalMinutes} 分 {pomodoroData.totalSeconds} 秒
                </div>
              </div>

              {/* 切换回普通时钟的按钮 */}
              <button 
                className="mode-switch-btn"
                onClick={() => setShowPomodoroMode(false)}
              >
                查看当前时间
              </button>
            </div>
          );
        }

        // 普通翻页时钟
        return (
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

              <div className={`flip-separator ${enableAnimations ? 'animated-separator' : ''}`}>:</div>

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

              <div className={`flip-separator ${enableAnimations ? 'animated-separator' : ''}`}>:</div>

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

            {/* 如果番茄钟正在运行，显示切换按钮 */}
            {isTimerRunning && (
              <button 
                className="mode-switch-btn"
                onClick={() => setShowPomodoroMode(true)}
              >
                查看番茄钟倒计时
              </button>
            )}
          </div>
        );
    }
  };

  if (!show) return null;

  return (
    <div className={`fullscreen-clock ${show ? 'active' : ''}`}>
      {/* 关闭按钮 */}
      <button className={`close-clock-btn ${enableAnimations ? 'animated-btn' : ''}`} onClick={onClose}>
        <X size={24} />
      </button>

      {/* 主时钟显示 */}
      {renderClock()}

      {/* 可调整大小的番茄计时器小窗 */}
      {showMiniTimer && !showPomodoroMode && (
        <div 
          className="mini-timer resizable-mini-timer"
          style={{
            left: miniTimerPos.x,
            top: miniTimerPos.y,
            width: miniTimerSize.width,
            height: miniTimerSize.height,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMouseDown}
        >
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
          
          {/* 调整大小手柄 */}
          <div 
            className="resize-handle"
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsResizing(true);
              setDragStart({
                x: e.clientX - miniTimerSize.width,
                y: e.clientY - miniTimerSize.height
              });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FullscreenClock;