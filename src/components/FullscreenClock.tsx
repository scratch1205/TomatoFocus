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
  const [flipAnimations, setFlipAnimations] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = new Date();
      const oldTime = currentTime;
      
      // 检测时间变化并触发翻页动画
      if (clockStyle === 'flip') {
        const newTimeStr = formatTime(newTime);
        const oldTimeStr = formatTime(oldTime);
        
        const newFlipAnimations: {[key: string]: boolean} = {};
        
        if (newTimeStr.hours !== oldTimeStr.hours) {
          newFlipAnimations['hours0'] = true;
          newFlipAnimations['hours1'] = true;
        } else {
          if (newTimeStr.hours[0] !== oldTimeStr.hours[0]) {
            newFlipAnimations['hours0'] = true;
          }
          if (newTimeStr.hours[1] !== oldTimeStr.hours[1]) {
            newFlipAnimations['hours1'] = true;
          }
        }
        
        if (newTimeStr.minutes !== oldTimeStr.minutes) {
          newFlipAnimations['minutes0'] = true;
          newFlipAnimations['minutes1'] = true;
        } else {
          if (newTimeStr.minutes[0] !== oldTimeStr.minutes[0]) {
            newFlipAnimations['minutes0'] = true;
          }
          if (newTimeStr.minutes[1] !== oldTimeStr.minutes[1]) {
            newFlipAnimations['minutes1'] = true;
          }
        }
        
        if (newTimeStr.seconds !== oldTimeStr.seconds) {
          newFlipAnimations['seconds0'] = true;
          newFlipAnimations['seconds1'] = true;
        } else {
          if (newTimeStr.seconds[0] !== oldTimeStr.seconds[0]) {
            newFlipAnimations['seconds0'] = true;
          }
          if (newTimeStr.seconds[1] !== oldTimeStr.seconds[1]) {
            newFlipAnimations['seconds1'] = true;
          }
        }
        
        setFlipAnimations(newFlipAnimations);
        
        // 清除动画状态
        setTimeout(() => {
          setFlipAnimations({});
        }, 600);
      }
      
      setCurrentTime(newTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTime, clockStyle]);

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

  const renderFlipDigit = (digit: string, position: string, isLarge: boolean = false) => {
    const isAnimating = flipAnimations[position];
    const digitClass = isLarge ? 'flip-digit-large' : 'flip-digit';
    const cardClass = isLarge ? 'flip-card-large' : 'flip-card';
    
    return (
      <div className={digitClass}>
        <div className={`flip-card ${cardClass} ${isAnimating ? 'flipping' : ''}`}>
          <div className="flip-card-inner">
            <div className="flip-card-front">{digit}</div>
            <div className="flip-card-back">{digit}</div>
          </div>
        </div>
      </div>
    );
  };

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
                  {renderFlipDigit(pomodoroData.minutes[0], 'pomodoro-minutes0', true)}
                  {renderFlipDigit(pomodoroData.minutes[1], 'pomodoro-minutes1', true)}
                </div>

                <div className="pomodoro-unit-label">分钟</div>

                {/* 秒数显示 - 中等字体 */}
                <div className="flip-digit-group pomodoro-seconds">
                  {renderFlipDigit(pomodoroData.seconds[0], 'pomodoro-seconds0')}
                  {renderFlipDigit(pomodoroData.seconds[1], 'pomodoro-seconds1')}
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

        // 纯翻页时钟 - 模仿FlipFlow样式
        return (
          <div className="pure-flip-clock">
            <div className="flip-clock-main">
              {/* 时 */}
              <div className="flip-time-group">
                <div className="flip-time-section">
                  <div className="flip-digits-row">
                    {renderFlipDigit(hours[0], 'hours0', true)}
                    {renderFlipDigit(hours[1], 'hours1', true)}
                  </div>
                  <div className="flip-label">时</div>
                </div>

                <div className="flip-separator-large">:</div>

                {/* 分 */}
                <div className="flip-time-section">
                  <div className="flip-digits-row">
                    {renderFlipDigit(minutes[0], 'minutes0', true)}
                    {renderFlipDigit(minutes[1], 'minutes1', true)}
                  </div>
                  <div className="flip-label">分</div>
                </div>

                <div className="flip-separator-large">:</div>

                {/* 秒 */}
                <div className="flip-time-section">
                  <div className="flip-digits-row">
                    {renderFlipDigit(seconds[0], 'seconds0', true)}
                    {renderFlipDigit(seconds[1], 'seconds1', true)}
                  </div>
                  <div className="flip-label">秒</div>
                </div>
              </div>
            </div>

            <div className="flip-date-display">
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