import React, { useState, useEffect } from 'react';
import { Music, Search, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, X, Heart, Download, Repeat, Repeat1, Shuffle } from 'lucide-react';
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

interface MusicPlayerProps {
  show: boolean;
  onClose: () => void;
  glassEffect: boolean;
  animations: boolean;
  language: Language;
  onMinimize?: () => void;
  // 新增的回调函数，用于与悬浮播放器通信
  onSongChange?: (song: Song | null) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onPlaylistChange?: (playlist: Song[], currentIndex: number) => void;
  // 从父组件传递的音频引用和控制方法
  audioRef?: React.RefObject<HTMLAudioElement>;
  loadSong?: (songId: string, index: number) => void;
  togglePlay?: () => void;
  playPrevious?: () => void;
  playNext?: () => void;
  currentSong?: Song | null;
  isPlaying?: boolean;
  playlist?: Song[];
  currentIndex?: number;
  volume?: number;
  setVolume?: (volume: number) => void;
  isMuted?: boolean;
  setIsMuted?: (muted: boolean) => void;
  currentTime?: number;
  duration?: number;
  repeatMode?: 'none' | 'one' | 'all';
  setRepeatMode?: (mode: 'none' | 'one' | 'all') => void;
  isShuffled?: boolean;
  setIsShuffled?: (shuffled: boolean) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  show,
  onClose,
  glassEffect,
  animations,
  language,
  onMinimize,
  onSongChange,
  onPlayStateChange,
  onPlaylistChange,
  audioRef,
  loadSong,
  togglePlay,
  playPrevious,
  playNext,
  currentSong,
  isPlaying = false,
  playlist = [],
  currentIndex = -1,
  volume = 0.7,
  setVolume,
  isMuted = false,
  setIsMuted,
  currentTime = 0,
  duration = 0,
  repeatMode = 'none',
  setRepeatMode,
  isShuffled = false,
  setIsShuffled
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quality, setQuality] = useState('4'); // 默认HQ极高(320k)
  const t = useTranslation(language);

  // 音质选项
  const qualityOptions = [
    { value: '9', label: language === 'en' ? 'Master (Lossless)' : '超清母带' },
    { value: '6', label: language === 'en' ? 'Hi-Res (Lossless)' : 'Hi-Res无损' },
    { value: '5', label: language === 'en' ? 'SQ (Lossless)' : 'SQ无损' },
    { value: '4', label: language === 'en' ? 'HQ (320k)' : 'HQ极高(320k)' },
    { value: '2', label: language === 'en' ? 'Standard (128k)' : '标准(128k)' }
  ];

  // 搜索音乐
  const searchMusic = async () => {
    if (!searchQuery.trim()) {
      showNotification(language === 'en' ? 'Please enter search keywords' : '请输入搜索关键词');
      return;
    }
    
    setIsLoading(true);
    showNotification(language === 'en' ? 'Searching songs...' : '正在搜索歌曲...');
    
    try {
      const response = await fetch(`https://api.vkeys.cn/v2/music/netease?word=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        const songs = Array.isArray(data.data) ? data.data : [data.data];
        setSearchResults(songs);
        // 通知父组件播放列表变化
        if (onPlaylistChange) {
          onPlaylistChange(songs, -1);
        }
        showNotification(`${language === 'en' ? 'Found' : '找到'} ${songs.length} ${language === 'en' ? 'songs' : '首歌曲'}`);
      } else {
        setSearchResults([]);
        showNotification(language === 'en' ? 'No songs found' : '未找到相关歌曲');
      }
    } catch (error) {
      console.error('搜索失败:', error);
      setSearchResults([]);
      showNotification(`${language === 'en' ? 'Search failed' : '搜索失败'}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 播放歌曲
  const playSong = (song: Song, index: number) => {
    if (loadSong) {
      loadSong(song.id, index);
    }
  };

  // 切换播放/暂停
  const togglePlayPause = () => {
    if (togglePlay) {
      togglePlay();
    }
  };

  // 上一首
  const playPreviousSong = () => {
    if (playPrevious) {
      playPrevious();
    }
  };

  // 下一首
  const playNextSong = () => {
    if (playNext) {
      playNext();
    }
  };

  // 切换循环模式
  const toggleRepeatMode = () => {
    if (setRepeatMode) {
      const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
      const currentModeIndex = modes.indexOf(repeatMode);
      const nextMode = modes[(currentModeIndex + 1) % modes.length];
      setRepeatMode(nextMode);
      
      const modeNames = {
        none: language === 'en' ? 'No repeat' : '不循环',
        one: language === 'en' ? 'Repeat one' : '单曲循环',
        all: language === 'en' ? 'Repeat all' : '列表循环'
      };
      showNotification(modeNames[nextMode]);
    }
  };

  // 切换随机播放
  const toggleShuffle = () => {
    if (setIsShuffled) {
      setIsShuffled(!isShuffled);
      showNotification(isShuffled 
        ? (language === 'en' ? 'Shuffle off' : '关闭随机播放')
        : (language === 'en' ? 'Shuffle on' : '开启随机播放')
      );
    }
  };

  // 音量控制
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (setVolume) {
      setVolume(newVolume);
    }
  };

  // 静音切换
  const toggleMute = () => {
    if (setIsMuted) {
      setIsMuted(!isMuted);
    }
  };

  // 进度条控制
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef?.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // 进度条点击
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef?.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    audioRef.current.currentTime = newTime;
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 显示通知
  const showNotification = (message: string) => {
    // 这里可以集成到主应用的通知系统
    console.log(message);
  };

  // 最小化到悬浮栏
  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    }
    onClose();
  };

  // 获取循环模式图标
  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return <Repeat1 size={18} />;
      case 'all':
        return <Repeat size={18} />;
      default:
        return <Repeat size={18} />;
    }
  };

  if (!show) return null;

  return (
    <div className={`music-player-modal ${show ? 'active' : ''}`}>
      <div className={`music-player-container ${glassEffect ? 'glass-panel' : 'solid-panel'}`}>
        {/* 头部 */}
        <div className="music-player-header">
          <h2 className="music-player-title">
            <Music size={24} />
            <span>{language === 'en' ? 'NetEase Music Player' : '网易云音乐播放器'}</span>
          </h2>
          <div className="music-header-actions">
            <button className="music-action-btn" onClick={handleMinimize} title={language === 'en' ? 'Minimize' : '最小化'}>
              <Music size={18} />
            </button>
            <button className="music-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="music-search-section">
          <div className="music-search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchMusic()}
              placeholder={language === 'en' ? 'Search songs, artists, albums...' : '搜索歌曲、歌手、专辑...'}
              className="music-search-input"
            />
            <button 
              className={`music-search-btn ${animations ? 'animated-btn' : ''}`}
              onClick={searchMusic}
              disabled={isLoading}
            >
              <Search size={18} />
            </button>
          </div>
          
          {/* 音质选择 */}
          <div className="quality-selector">
            <label className="quality-label">
              {language === 'en' ? 'Quality:' : '音质:'}
            </label>
            <select 
              value={quality} 
              onChange={(e) => setQuality(e.target.value)}
              className="quality-select"
            >
              {qualityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 当前播放 */}
        {currentSong && (
          <div className="current-playing-section">
            <div className="current-song-info">
              <img 
                src={currentSong.cover || 'https://p4.music.126.net/NmeYMyXytmcAWGO3RBJtlA==/109951169676463967.jpg'} 
                alt={currentSong.song}
                className={`current-song-cover ${isPlaying ? 'rotating' : ''}`}
              />
              <div className="current-song-details">
                <h3 className="current-song-name">{currentSong.song}</h3>
                <p className="current-song-artist">{currentSong.singer}</p>
                <p className="current-song-album">{currentSong.album}</p>
                <div className="current-song-meta">
                  <span>{language === 'en' ? 'Quality' : '音质'}: {currentSong.quality}</span>
                  <span>{language === 'en' ? 'Duration' : '时长'}: {currentSong.interval}</span>
                </div>
              </div>
            </div>

            {/* 播放控制 */}
            <div className="music-controls">
              <button 
                className={`control-btn ${isShuffled ? 'active' : ''}`} 
                onClick={toggleShuffle}
                title={language === 'en' ? 'Shuffle' : '随机播放'}
              >
                <Shuffle size={18} />
              </button>
              <button className="control-btn" onClick={playPreviousSong} disabled={playlist.length === 0}>
                <SkipBack size={20} />
              </button>
              <button className="control-btn play-btn" onClick={togglePlayPause}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button className="control-btn" onClick={playNextSong} disabled={playlist.length === 0}>
                <SkipForward size={20} />
              </button>
              <button 
                className={`control-btn ${repeatMode !== 'none' ? 'active' : ''}`} 
                onClick={toggleRepeatMode}
                title={language === 'en' ? 'Repeat mode' : '循环模式'}
              >
                {getRepeatIcon()}
              </button>
            </div>

            {/* 进度条 */}
            <div className="progress-section">
              <span className="time-display">{formatTime(currentTime)}</span>
              <div className="progress-container" onClick={handleProgressClick}>
                <div className="progress-track">
                  <div 
                    className="progress-fill" 
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                  />
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleProgressChange}
                    className="progress-slider"
                  />
                </div>
              </div>
              <span className="time-display">{formatTime(duration)}</span>
            </div>

            {/* 音量控制 */}
            <div className="volume-section">
              <button className="volume-btn" onClick={toggleMute}>
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
          </div>
        )}

        {/* 搜索结果 */}
        <div className="music-results-section">
          <h3 className="results-title">
            {language === 'en' ? 'Search Results' : '搜索结果'}
            {searchResults.length > 0 && (
              <span className="results-count">({searchResults.length})</span>
            )}
          </h3>
          
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>{language === 'en' ? 'Searching...' : '搜索中...'}</span>
            </div>
          ) : (
            <div className="music-list">
              <div className="music-list-scroll">
                {searchResults.map((song, index) => (
                  <div
                    key={song.id}
                    className={`music-item ${currentSong?.id === song.id ? 'active' : ''} ${animations ? 'animated-card' : ''}`}
                    onClick={() => playSong(song, index)}
                  >
                    <img 
                      src={song.cover || 'https://p4.music.126.net/NmeYMyXytmcAWGO3RBJtlA==/109951169676463967.jpg'} 
                      alt={song.song}
                      className="song-cover"
                    />
                    <div className="song-info">
                      <h4 className="song-name">{song.song}</h4>
                      <p className="song-artist">{song.singer}</p>
                      <p className="song-album">{song.album}</p>
                    </div>
                    <div className="song-duration">
                      {song.interval}
                    </div>
                    <div className="song-actions">
                      <button className="action-btn" title={language === 'en' ? 'Like' : '喜欢'}>
                        <Heart size={16} />
                      </button>
                      <button className="action-btn" title={language === 'en' ? 'Download' : '下载'}>
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {searchResults.length === 0 && !isLoading && (
                  <div className="empty-state">
                    <Music size={48} />
                    <div className="empty-title">
                      {language === 'en' ? 'No songs found' : '未找到歌曲'}
                    </div>
                    <div className="empty-desc">
                      {language === 'en' ? 'Try searching for different keywords' : '尝试搜索其他关键词'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;