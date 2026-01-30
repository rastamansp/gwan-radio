import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

interface NowPlayingData {
  song: string;
  artist: string;
  album?: string;
  albumArt?: string;
  listeners?: number;
}

interface RadioContextType {
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  isExpanded: boolean;
  nowPlaying: NowPlayingData;
  error: string | null;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setVolume: (volume: number) => void;
  toggleExpanded: () => void;
}

const defaultNowPlaying: NowPlayingData = {
  song: 'GWAN Radio',
  artist: 'Ao Vivo',
  album: '',
  albumArt: '',
};

const RadioContext = createContext<RadioContextType | undefined>(undefined);

const STREAM_URL = import.meta.env.VITE_STREAM_URL || 'https://stream.gwan.com.br/listen/gwan_radio/stream';
const NOW_PLAYING_URL = import.meta.env.VITE_NOW_PLAYING_URL || 'https://cast.gwan.com.br/api/nowplaying/gwan_radio';
const POLLING_INTERVAL = 15000; // 15 seconds

export const RadioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [isExpanded, setIsExpanded] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData>(defaultNowPlaying);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.volume = volume;
    audioRef.current = audio;

    audio.addEventListener('playing', () => {
      setIsPlaying(true);
      setIsLoading(false);
      setError(null);
    });

    audio.addEventListener('pause', () => {
      setIsPlaying(false);
      setIsLoading(false);
    });

    audio.addEventListener('waiting', () => {
      setIsLoading(true);
    });

    audio.addEventListener('error', () => {
      setError('Erro ao conectar com a rádio');
      setIsLoading(false);
      setIsPlaying(false);
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Fetch now playing data
  const fetchNowPlaying = useCallback(async () => {
    try {
      const response = await fetch(NOW_PLAYING_URL);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      
      if (data?.now_playing?.song) {
        setNowPlaying({
          song: data.now_playing.song.title || 'Música desconhecida',
          artist: data.now_playing.song.artist || 'Artista desconhecido',
          album: data.now_playing.song.album || '',
          albumArt: data.now_playing.song.art || '',
          listeners: data.listeners?.current || 0,
        });
      }
    } catch (err) {
      // Keep playing even if fetch fails, just use default/last data
      console.log('Now playing fetch failed, using fallback');
    }
  }, []);

  // Polling for now playing
  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNowPlaying]);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    // Set source only when playing to avoid unnecessary connections
    if (!audioRef.current.src) {
      audioRef.current.src = STREAM_URL;
    }
    
    audioRef.current.play().catch((err) => {
      console.error('Play error:', err);
      setError('Não foi possível iniciar a reprodução');
      setIsLoading(false);
    });
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <RadioContext.Provider
      value={{
        isPlaying,
        isLoading,
        volume,
        isExpanded,
        nowPlaying,
        error,
        play,
        pause,
        toggle,
        setVolume,
        toggleExpanded,
      }}
    >
      {children}
    </RadioContext.Provider>
  );
};

export const useRadio = (): RadioContextType => {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error('useRadio must be used within a RadioProvider');
  }
  return context;
};
