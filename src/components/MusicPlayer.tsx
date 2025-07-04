import React, { useState, useRef, useEffect } from 'react';
import { Music, Search, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, X, Heart, Download } from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../utils/i18n';

interface Song {
  id: number;
  name: string;
  artist: string;
  album: string;
  duration: number;
  picUrl: string;
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
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const t = useTranslation(language);

  // 模拟网易云音乐API数据
  const mockSongs: Song[] = [
    {
      id: 1,
      name: "夜曲",
      artist: "周杰伦",
      album: "十一月的萧邦",
      duration: 233,
      picUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300",
      url: "https://music.163.com/song/media/outer/url?id=25906124.mp3"
    },
    {
      id: 2,
      name: "稻香",
      artist: "周杰伦",
      album: "魔杰座",
      duration: 223,
      picUrl: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300",
      url: "https://music.163.com/song/media/outer/url?id=25906124.mp3"
    },
    {
      id: 3,
      name: "青花瓷",
      artist: "周杰伦",
      album: "我很忙",
      duration: 228,
      picUrl: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300",
      url: "https://music.163.com/song/media/outer/url?id=25906124.mp3"
    },
    {
      id: 4,
      name: "告白气球",
      artist: "周杰伦",
      album: "周杰伦的床边故事",
      duration: 207,
      picUrl: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300",
      url: "https://music.163.com/song/media/outer/url?id=25906124.mp3"
    },
    {
      id: 5,
      name: "晴天",
      artist: "周杰伦",
      album: "叶惠美",
      duration: 269,
      picUrl: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300",
      url: "https://music.163.com/song/media/outer/url?id=25906124.mp3"
    },
    {
      id: 6,
      name: "Lofi Hip Hop",
      artist: "ChillHop Music",
      album: "Study Beats",
      duration: 180,
      picUrl: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300",
      url: "https://music.163.com/song/media/outer/url?id=25906124.mp3"
    },
    {
      id: 7,
      name: "Peaceful Piano",
      artist: "Relaxing Music",
      album: "Focus & Study",
      duration: 240,
      picUrl: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300",
      url: "https://music.163.com/song/media/outer/url?id=25906124.mp3"
    },
    {
      id: 8,
      name: "Nature Sounds",
      artist: "Ambient Music",
      album: "Concentration",
      duration: 300,
      picUrl: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300",
      url: "https://music.163.com/song/media/outer/url?id=25906124.mp3"
    }
  ];

  // 搜索音乐
  const searchMusic = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // 模拟API延迟
    setTimeout(() => {
      const results = mockSongs.filter(song => 
        song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setIsLoading(false);
    }, 500);
  };

  // 播放歌曲
  const playSong = (song: Song) => {
    setCurrentSong(song);
    setPlaylist(searchResults.length > 0 ? searchResults : mockSongs);
    const index = (searchResults.length > 0 ? searchResults : mockSongs).findIndex(s => s.id === song.id);
    setCurrentIndex(index);
    setIsPlaying(true);
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
      setCurrentSong(playlist[newIndex]);
      setIsPlaying(true);
    }
  };

  // 下一首
  const playNext = () => {
    if (playlist.length > 0) {
      const newIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0;
      setCurrentIndex(newIndex);
      setCurrentSong(playlist[newIndex]);
      setIsPlaying(true);
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

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong]);

  // 初始化搜索结果
  useEffect(() => {
    if (show && searchResults.length === 0) {
      setSearchResults(mockSongs.slice(0, 6));
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className={`music-player-modal ${show ? 'active' : ''}`}>
      <div className={`music-player-container ${glassEffect ? 'glass-panel' : 'solid-panel'}`}>
        {/* 头部 */}
        <div className="music-player-header">
          <h2 className="music-player-title">
            <Music size={24} />
            <span>{language === 'en' ? 'Music Player' : '音乐播放器'}</span>
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
        </div>

        {/* 当前播放 */}
        {currentSong && (
          <div className="current-playing-section">
            <div className="current-song-info">
              <img 
                src={currentSong.picUrl} 
                alt={currentSong.name}
                className="current-song-cover"
              />
              <div className="current-song-details">
                <h3 className="current-song-name">{currentSong.name}</h3>
                <p className="current-song-artist">{currentSong.artist}</p>
              </div>
            </div>

            {/* 播放控制 */}
            <div className="music-controls">
              <button className="control-btn" onClick={playPrevious}>
                <SkipBack size={20} />
              </button>
              <button className="control-btn play-btn" onClick={togglePlayPause}>
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
          
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>{language === 'en' ? 'Searching...' : '搜索中...'}</span>
            </div>
          ) : (
            <div className="music-list">
              <div className="music-list-scroll">
                {searchResults.map((song) => (
                  <div
                    key={song.id}
                    className={`music-item ${currentSong?.id === song.id ? 'active' : ''} ${animations ? 'animated-card' : ''}`}
                    onClick={() => playSong(song)}
                  >
                    <img 
                      src={song.picUrl} 
                      alt={song.name}
                      className="song-cover"
                    />
                    <div className="song-info">
                      <h4 className="song-name">{song.name}</h4>
                      <p className="song-artist">{song.artist}</p>
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

        {/* 隐藏的音频元素 */}
        {currentSong && (
          <audio
            ref={audioRef}
            src={currentSong.url}
            autoPlay={isPlaying}
            volume={volume}
            muted={isMuted}
          />
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;