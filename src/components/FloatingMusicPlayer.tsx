import React, { useState, useEffect } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, X, Maximize2, Volume2, VolumeX } from 'lucide-react';
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

interface FloatingMusicPlayerProps {
  show: boolean;
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  onExpand: () => void;
  language: Language;
  glassEffect: boolean;
  animations: boolean;
}

const FloatingMusicPlayer: React.FC<FloatingMusicPlayerProps> = ({
  show,
  currentSong,
  isPlaying,
  onTogglePlay,
  onPrevious,
  onNext,
  onClose,
  onExpand,
  language,
  glassEffect,
  animations
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 120 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const t = useTranslation(language);

  // 处理拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('floating-player-drag-area')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragStart.y));
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  // 响应窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 320),
        y: Math.min(prev.y, window.innerHeight - 100)
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!show || !currentSong) return null;

  return (
    <div 
      className={`floating-music-player ${glassEffect ? 'glass-floating' : 'solid-floating'} ${animations ? 'animated-floating' : ''} ${isMinimized ? 'minimized' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* 拖拽区域 */}
      <div className="floating-player-drag-area" />
      
      {/* 播放器内容 */}
      <div className="floating-player-content">
        {/* 歌曲封面 */}
        <div className="floating-cover-container">
          <img 
            src={currentSong.cover || 'https://p4.music.126.net/NmeYMyXytmcAWGO3RBJtlA==/109951169676463967.jpg'} 
            alt={currentSong.song}
            className={`floating-cover ${isPlaying ? 'rotating' : ''}`}
          />
          <div className="floating-play-overlay" onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}>
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </div>
        </div>

        {/* 歌曲信息 */}
        <div className="floating-song-info">
          <div className="floating-song-name" title={currentSong.song}>
            {currentSong.song}
          </div>
          <div className="floating-artist-name" title={currentSong.singer}>
            {currentSong.singer}
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="floating-controls">
          <button 
            className="floating-control-btn"
            onClick={(e) => { e.stopPropagation(); onPrevious(); }}
            title={language === 'en' ? 'Previous' : '上一首'}
          >
            <SkipBack size={16} />
          </button>
          
          <button 
            className="floating-control-btn floating-play-btn"
            onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
            title={isPlaying ? (language === 'en' ? 'Pause' : '暂停') : (language === 'en' ? 'Play' : '播放')}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          
          <button 
            className="floating-control-btn"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            title={language === 'en' ? 'Next' : '下一首'}
          >
            <SkipForward size={16} />
          </button>
        </div>

        {/* 操作按钮 */}
        <div className="floating-actions">
          <button 
            className="floating-action-btn"
            onClick={(e) => { e.stopPropagation(); onExpand(); }}
            title={language === 'en' ? 'Expand' : '展开'}
          >
            <Maximize2 size={14} />
          </button>
          
          <button 
            className="floating-action-btn floating-close-btn"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            title={language === 'en' ? 'Close' : '关闭'}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* 进度条 */}
      <div className="floating-progress-bar">
        <div className="floating-progress-fill" style={{ width: '45%' }} />
      </div>
    </div>
  );
};

export default FloatingMusicPlayer;