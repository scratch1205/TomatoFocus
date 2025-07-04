import React, { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../utils/i18n';

interface WhiteNoisePlayerProps {
  language?: Language;
}

const WhiteNoisePlayer: React.FC<WhiteNoisePlayerProps> = ({ language = 'zh-CN' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState('rain');
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const t = useTranslation(language);

  const sounds = [
    { id: 'rain', name: t.rain, url: 'https://www.soundvery.com/sounds/rain.mp3' },
    { id: 'ocean', name: t.ocean, url: 'https://www.soundvery.com/sounds/ocean.mp3' },
    { id: 'forest', name: t.forest, url: 'https://www.soundvery.com/sounds/forest.mp3' },
    { id: 'fire', name: t.fire, url: 'https://www.soundvery.com/sounds/fire.mp3' }
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSound]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const getCurrentSoundName = () => {
    return sounds.find(sound => sound.id === currentSound)?.name || t.rain;
  };

  return (
    <div className="noise-control">
      {/* Hidden audio element - using placeholder sound since soundvery.com might not have direct MP3 links */}
      <audio
        ref={audioRef}
        src="https://st2.asoftmurmur.com/assets/p/content/rain/main-rain.mp4"
        loop
      />
      
      <div
        className={`noise-toggle ${isPlaying ? 'active' : ''}`}
        onClick={togglePlay}
      >
        {isPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
        <span>{t.whiteNoise}: {getCurrentSoundName()}</span>
      </div>
    </div>
  );
};

export default WhiteNoisePlayer;