import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import type { Station } from '@/domain/entities/Station.entity';
import { useAzuraCast } from '@/presentation/hooks/useAzuraCast';

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
  stationInfo: Station | null;
  isLoadingStation: boolean;
  error: string | null;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
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

// Fallback stream URL if API doesn't provide listen_url
const getDefaultStreamUrl = () => {
  const baseUrl = import.meta.env.VITE_AZURACAST_API_URL || 'https://cast.gwan.com.br';
  return `${baseUrl}/listen/gwan_radio/radio.mp3`;
};

export const RadioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [isExpanded, setIsExpanded] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData>(defaultNowPlaying);
  const [stationInfo, setStationInfo] = useState<Station | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Use AzuraCast hook to fetch data (avoids CORS issues with /public endpoint)
  const { data: azuraCastData, loading: isLoadingStation, error: azuraCastError } = useAzuraCast();

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Setup audio event listeners (only for loading and error states)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setError('Erro ao conectar com a rádio');
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Map AzuraCast data to Station and NowPlaying formats
  useEffect(() => {
    if (azuraCastData) {
      // Map station info
      if (azuraCastData.station) {
        const station: Station = {
          id: azuraCastData.station.id,
          name: azuraCastData.station.name,
          shortcode: azuraCastData.station.shortcode,
          description: azuraCastData.station.description,
          frontend: 'default', // Not available in API response
          backend: 'default', // Not available in API response
          listen_url: azuraCastData.station.listen_url,
          public_player_url: azuraCastData.station.public_player_url,
          is_public: true,
          hls_enabled: false,
        };
        setStationInfo(station);
      }

      // Map now playing data
      if (azuraCastData.now_playing?.song) {
        setNowPlaying({
          song: azuraCastData.now_playing.song.title || 'Música desconhecida',
          artist: azuraCastData.now_playing.song.artist || 'Artista desconhecido',
          album: azuraCastData.now_playing.song.album || '',
          albumArt: azuraCastData.now_playing.song.art || '',
          listeners: azuraCastData.listeners?.current || 0,
        });
      }

      // Clear error on successful data fetch
      if (!azuraCastError) {
        setError(null);
      }
    }
  }, [azuraCastData, azuraCastError]);

  // Set error from AzuraCast hook
  useEffect(() => {
    if (azuraCastError) {
      setError(azuraCastError);
    }
  }, [azuraCastError]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Use listen_url from station info (most reliable, works in dev and prod)
    // Fallback to constructing URL if listen_url not available yet
    let listenUrl = stationInfo?.listen_url;
    
    // If listen_url not available, use default fallback
    if (!listenUrl) {
      console.log('listen_url not available, using fallback');
      listenUrl = getDefaultStreamUrl();
      console.log('Using fallback URL:', listenUrl);
    }
    
    setIsLoading(true);
    setError(null);
    
    console.log('Attempting to play stream:', listenUrl);
    
    // Set source and play - exactly like the working example
    audio.src = listenUrl;
    
    try {
      await audio.play();
      // Success - update state manually (like the working example)
      setIsPlaying(true);
      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error('Play error:', err);
      setIsPlaying(false);
      setIsLoading(false);
      
      // Determine error message
      let errorMessage = 'Não foi possível iniciar a reprodução';
      if (err instanceof Error) {
        if (err.message.includes('ERR_NAME_NOT_RESOLVED') || err.name === 'NotSupportedError') {
          errorMessage = 'Não foi possível conectar à rádio. Verifique sua conexão.';
        } else if (err.message.includes('Failed to load')) {
          errorMessage = 'Erro ao carregar o stream. Verifique a URL da rádio.';
        } else if (err.message.includes('ERR_SSL')) {
          errorMessage = 'Erro de SSL. Verifique o certificado da rádio.';
        } else if (err.message.includes('play()')) {
          errorMessage = 'Não foi possível iniciar a reprodução. Tente novamente.';
        }
      }
      
      setError(errorMessage);
    }
  }, [stationInfo]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }
    
    // Resolve stream URL from station info or use fallback
    let listenUrl = stationInfo?.listen_url || azuraCastData?.station?.listen_url;
    
    // If listen_url not available, use default fallback
    if (!listenUrl) {
      listenUrl = getDefaultStreamUrl();
    }
    
    if (!listenUrl) {
      setError('URL do stream não disponível');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    audio.src = listenUrl;
    
    try {
      await audio.play();
      setIsPlaying(true); // Update manually (like the working example)
      setIsLoading(false);
    } catch (err) {
      console.error('play() error:', err);
      setIsPlaying(false); // Update manually (like the working example)
      setIsLoading(false);
      
      // Determine error message
      let errorMessage = 'Não foi possível iniciar a reprodução';
      if (err instanceof Error) {
        if (err.message.includes('ERR_NAME_NOT_RESOLVED') || err.name === 'NotSupportedError') {
          errorMessage = 'Não foi possível conectar à rádio. Verifique sua conexão.';
        } else if (err.message.includes('Failed to load')) {
          errorMessage = 'Erro ao carregar o stream. Verifique a URL da rádio.';
        } else if (err.message.includes('ERR_SSL')) {
          errorMessage = 'Erro de SSL. Verifique o certificado da rádio.';
        } else if (err.message.includes('play()')) {
          errorMessage = 'Não foi possível iniciar a reprodução. Tente novamente.';
        }
      }
      
      setError(errorMessage);
    }
  }, [isPlaying, stationInfo, azuraCastData]);

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
        stationInfo,
        isLoadingStation,
        error,
        play,
        pause,
        toggle,
        setVolume,
        toggleExpanded,
      }}
    >
      {/* Audio element in JSX - like the working example */}
      <audio ref={audioRef} preload="none" crossOrigin="anonymous" />
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
