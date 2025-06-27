import React, { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';

const WhiteNoisePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState('rain');
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sounds = [
    { id: 'rain', name: '雨声', url: 'https://www.soundvery.com/sounds/rain.mp3' },
    { id: 'ocean', name: '海浪', url: 'https://www.soundvery.com/sounds/ocean.mp3' },
    { id: 'forest', name: '森林', url: 'https://www.soundvery.com/sounds/forest.mp3' },
    { id: 'fire', name: '火焰', url: 'https://www.soundvery.com/sounds/fire.mp3' }
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
    return sounds.find(sound => sound.id === currentSound)?.name || '雨声';
  };

  return (
    <div className="noise-control">
      {/* Hidden audio element - using placeholder sound since soundvery.com might not have direct MP3 links */}
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBzWOzvLJe"
        loop
      />
      
      <div
        className={`noise-toggle ${isPlaying ? 'active' : ''}`}
        onClick={togglePlay}
      >
        {isPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
        <span>白噪音: {getCurrentSoundName()}</span>
      </div>
    </div>
  );
};

export default WhiteNoisePlayer;