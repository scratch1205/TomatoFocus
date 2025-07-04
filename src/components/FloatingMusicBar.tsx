import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Maximize2 } from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../utils/i18n';

interface Song {
  id: string;
  song: string;
  singer: string;
  album: string;
  cover: string;
  url: string;
  quality: string;
  interval: string;
}

interface FloatingMusicBarProps {
  show: boolean;
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onProgressChange: (time: number) => void;
  onExpand: () => void;
  onClose: () => void;
  glassEffect: boolean;
  animations: boolean;
  language: Language;
}

const FloatingMusicBar: React.FC<FloatingMusicBarProps> = ({
  show,
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onTogglePlay,
  onPrevious,
  onNext,
  onVolumeChange,
  onToggleMute,
  onProgressChange,
  onExpand,
  onClose,
  glassEffect,
  animations,
  language
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const t = useTranslation(language);

  // 格式化时间
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 处理进度条点击
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    onProgressChange(newTime);
  };

  // 处理进度条拖拽
  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleProgressMouseMove = (e: MouseEvent) => {
    if (!isDragging || !progressRef.current || !duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = Math.max(0, Math.min(duration, (clickX / width) * duration));
    
    onProgressChange(newTime);
  };

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleProgressMouseMove);
      document.addEventListener('mouseup', handleProgressMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleProgressMouseMove);
        document.removeEventListener('mouseup', handleProgressMouseUp);
      };
    }
  }, [isDragging, duration]);

  if (!show || !currentSong) return null;

  return (
    <div className={`floating-music-bar ${glassEffect ? 'glass-effect' : 'solid-bg'} ${animations ? 'animated' : ''}`}>
      {/* 进度条 - 在顶部 */}
      <div 
        ref={progressRef}
        className="floating-progress-bar"
        onClick={handleProgressClick}
        onMouseDown={handleProgressMouseDown}
      >
        <div 
          className="floating-progress-fill"
          style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
        />
      </div>

      <div className="floating-music-content">
        {/* 歌曲信息 */}
        <div className="floating-song-info">
          <img 
            src={currentSong.cover || 'https://p4.music.126.net/NmeYMyXytmcAWGO3RBJtlA==/109951169676463967.jpg'} 
            alt={currentSong.song}
            className={`floating-song-cover ${isPlaying ? 'rotating' : ''}`}
          />
          <div className="floating-song-details">
            <div className="floating-song-name">{currentSong.song}</div>
            <div className="floating-song-artist">{currentSong.singer}</div>
          </div>
        </div>

        {/* 播放控制 */}
        <div className="floating-controls">
          <button 
            className={`floating-control-btn ${animations ? 'animated-btn' : ''}`}
            onClick={onPrevious}
            title={language === 'en' ? 'Previous' : '上一首'}
          >
            <SkipBack size={18} />
          </button>
          
          <button 
            className={`floating-control-btn floating-play-btn ${animations ? 'animated-btn' : ''}`}
            onClick={onTogglePlay}
            title={isPlaying ? (language === 'en' ? 'Pause' : '暂停') : (language === 'en' ? 'Play' : '播放')}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <button 
            className={`floating-control-btn ${animations ? 'animated-btn' : ''}`}
            onClick={onNext}
            title={language === 'en' ? 'Next' : '下一首'}
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* 时间显示 */}
        <div className="floating-time-display">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* 音量控制 */}
        <div className="floating-volume-section">
          <button 
            className={`floating-control-btn ${animations ? 'animated-btn' : ''}`}
            onClick={onToggleMute}
            onMouseEnter={() => setShowVolumeSlider(true)}
            title={isMuted ? (language === 'en' ? 'Unmute' : '取消静音') : (language === 'en' ? 'Mute' : '静音')}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          
          {showVolumeSlider && (
            <div 
              className="floating-volume-slider-container"
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="floating-volume-slider"
                orient="vertical"
              />
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="floating-actions">
          <button 
            className={`floating-control-btn ${animations ? 'animated-btn' : ''}`}
            onClick={onExpand}
            title={language === 'en' ? 'Expand player' : '展开播放器'}
          >
            <Maximize2 size={18} />
          </button>
          
          <button 
            className={`floating-control-btn ${animations ? 'animated-btn' : ''}`}
            onClick={onClose}
            title={language === 'en' ? 'Close' : '关闭'}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingMusicBar;