import React, { useState, useRef, useEffect } from 'react';
import { Music, Search, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, X, Heart, Download, Loader } from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../utils/i18n';

interface Song {
  id: string;
  mid: string;
  name: string;
  singer: string;
  album: string;
  duration: number;
  pic: string;
  url?: string;
}

interface MusicPlayerProps {
  show: boolean;
  onClose: () => void;
  glassEffect: boolean;
  animations: boolean;
  language: Language;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  show,
  onClose,
  glassEffect,
  animations,
  language
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const t = useTranslation(language);

  // QQ音乐API基础URL
  const API_BASE = 'https://api.vkeys.cn/api/music/tencent';

  // 搜索音乐
  const searchMusic = async (query: string, page: number = 1, append: boolean = false) => {
    if (!query.trim()) return;
    
    if (!append) {
      setIsLoading(true);
      setSearchResults([]);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const response = await fetch(`${API_BASE}?word=${encodeURIComponent(query)}&page=${page}&num=20`);
      const data = await response.json();
      
      if (data.code === 200 && data.data && data.data.list) {
        const songs: Song[] = data.data.list.map((item: any) => ({
          id: item.id || item.songid,
          mid: item.mid || item.songmid,
          name: item.name || item.songname,
          singer: Array.isArray(item.singer) ? item.singer.map((s: any) => s.name).join(', ') : (item.singer || '未知歌手'),
          album: item.album?.name || item.albumname || '未知专辑',
          duration: item.interval || item.duration || 0,
          pic: item.pic || item.albumpic || `https://y.qq.com/music/photo_new/T002R300x300M000${item.albummid}.jpg`
        }));
        
        if (append) {
          setSearchResults(prev => [...prev, ...songs]);
        } else {
          setSearchResults(songs);
        }
        
        setHasMore(songs.length === 20);
      } else {
        console.error('API返回错误:', data);
        if (!append) {
          setSearchResults([]);
        }
      }
    } catch (error) {
      console.error('搜索音乐失败:', error);
      if (!append) {
        setSearchResults([]);
      }
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  // 获取音乐播放链接
  const getMusicUrl = async (song: Song): Promise<string | null> => {
    try {
      const response = await fetch(`${API_BASE}?id=${song.id}&quality=14`);
      const data = await response.json();
      
      if (data.code === 200 && data.data && data.data.url) {
        return data.data.url;
      }
      
      // 如果id获取失败，尝试使用mid
      if (song.mid) {
        const midResponse = await fetch(`${API_BASE}?mid=${song.mid}&quality=14`);
        const midData = await midResponse.json();
        
        if (midData.code === 200 && midData.data && midData.data.url) {
          return midData.data.url;
        }
      }
      
      return null;
    } catch (error) {
      console.error('获取音乐链接失败:', error);
      return null;
    }
  };

  // 播放歌曲
  const playSong = async (song: Song) => {
    setIsLoading(true);
    
    try {
      const url = await getMusicUrl(song);
      if (url) {
        const songWithUrl = { ...song, url };
        setCurrentSong(songWithUrl);
        setPlaylist(searchResults.length > 0 ? searchResults : [songWithUrl]);
        const index = searchResults.findIndex(s => s.id === song.id);
        setCurrentIndex(index >= 0 ? index : 0);
        setIsPlaying(true);
      } else {
        console.error('无法获取音乐播放链接');
      }
    } catch (error) {
      console.error('播放歌曲失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 切换播放/暂停
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 上一首
  const playPrevious = () => {
    if (playlist.length > 0) {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
      setCurrentIndex(newIndex);
      playSong(playlist[newIndex]);
    }
  };

  // 下一首
  const playNext = () => {
    if (playlist.length > 0) {
      const newIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0;
      setCurrentIndex(newIndex);
      playSong(playlist[newIndex]);
    }
  };

  // 加载更多
  const loadMore = () => {
    if (searchQuery.trim() && hasMore && !loadingMore) {
      searchMusic(searchQuery, currentPage + 1, true);
      setCurrentPage(prev => prev + 1);
    }
  };

  // 音量控制
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // 静音切换
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  // 进度条控制
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 音频事件处理
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      playNext();
    };
    const handleError = () => {
      console.error('音频播放错误');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentSong]);

  // 处理搜索
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setCurrentPage(1);
      searchMusic(searchQuery, 1, false);
    }
  };

  // 处理回车搜索
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
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
            <span>{language === 'en' ? 'QQ Music Player' : 'QQ音乐播放器'}</span>
          </h2>
          <button className="music-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* 搜索栏 */}
        <div className="music-search-section">
          <div className="music-search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'en' ? 'Search songs, artists, albums...' : '搜索歌曲、歌手、专辑...'}
              className="music-search-input"
            />
            <button 
              className={`music-search-btn ${animations ? 'animated-btn' : ''}`}
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? <Loader size={18} className="animate-spin" /> : <Search size={18} />}
            </button>
          </div>
        </div>

        {/* 当前播放 */}
        {currentSong && (
          <div className="current-playing-section">
            <div className="current-song-info">
              <img 
                src={currentSong.pic} 
                alt={currentSong.name}
                className="current-song-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300';
                }}
              />
              <div className="current-song-details">
                <h3 className="current-song-name">{currentSong.name}</h3>
                <p className="current-song-artist">{currentSong.singer}</p>
                <p className="current-song-album">{currentSong.album}</p>
              </div>
            </div>

            {/* 播放控制 */}
            <div className="music-controls">
              <button className="control-btn" onClick={playPrevious}>
                <SkipBack size={20} />
              </button>
              <button className="control-btn play-btn" onClick={togglePlayPause} disabled={!currentSong.url}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button className="control-btn" onClick={playNext}>
                <SkipForward size={20} />
              </button>
            </div>

            {/* 进度条 */}
            <div className="progress-section">
              <span className="time-display">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleProgressChange}
                className="progress-slider"
              />
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
          
          {isLoading && searchResults.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>{language === 'en' ? 'Searching...' : '搜索中...'}</span>
            </div>
          ) : (
            <div className="music-list">
              <div className="music-list-scroll">
                {searchResults.map((song) => (
                  <div
                    key={`${song.id}-${song.mid}`}
                    className={`music-item ${currentSong?.id === song.id ? 'active' : ''} ${animations ? 'animated-card' : ''}`}
                    onClick={() => playSong(song)}
                  >
                    <img 
                      src={song.pic} 
                      alt={song.name}
                      className="song-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300';
                      }}
                    />
                    <div className="song-info">
                      <h4 className="song-name">{song.name}</h4>
                      <p className="song-artist">{song.singer}</p>
                      <p className="song-album">{song.album}</p>
                    </div>
                    <div className="song-duration">
                      {formatTime(song.duration)}
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
                
                {/* 加载更多按钮 */}
                {hasMore && searchResults.length > 0 && (
                  <div className="load-more-section">
                    <button 
                      className={`btn btn-outline ${animations ? 'animated-btn' : ''}`}
                      onClick={loadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? (
                        <>
                          <Loader size={16} className="animate-spin" />
                          <span>{language === 'en' ? 'Loading...' : '加载中...'}</span>
                        </>
                      ) : (
                        <span>{language === 'en' ? 'Load More' : '加载更多'}</span>
                      )}
                    </button>
                  </div>
                )}
                
                {searchResults.length === 0 && !isLoading && searchQuery && (
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

                {searchResults.length === 0 && !isLoading && !searchQuery && (
                  <div className="empty-state">
                    <Music size={48} />
                    <div className="empty-title">
                      {language === 'en' ? 'Start searching for music' : '开始搜索音乐'}
                    </div>
                    <div className="empty-desc">
                      {language === 'en' ? 'Enter keywords to find your favorite songs' : '输入关键词找到你喜欢的歌曲'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 隐藏的音频元素 */}
        {currentSong && currentSong.url && (
          <audio
            ref={audioRef}
            src={currentSong.url}
            autoPlay={isPlaying}
            volume={volume}
            muted={isMuted}
            crossOrigin="anonymous"
          />
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;