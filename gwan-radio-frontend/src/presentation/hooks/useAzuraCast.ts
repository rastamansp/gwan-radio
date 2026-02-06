import { useState, useEffect, useCallback } from "react";

const POLL_INTERVAL_MS = 15000;
const STATION_SHORTCODE = "gwan_radio";

export interface AzuraCastSong {
  id: string;
  art: string | null;
  artist: string;
  title: string;
  album: string;
  genre: string;
}

export interface AzuraCastNowPlaying {
  sh_id: number;
  played_at: number;
  duration: number;
  playlist: string;
  streamer: string;
  is_request: boolean;
  song: AzuraCastSong;
  elapsed: number;
  remaining: number;
}

export interface AzuraCastPlayingNext {
  cued_at: number;
  played_at: number;
  duration: number;
  playlist: string;
  is_request: boolean;
  song: AzuraCastSong;
}

export interface AzuraCastSongHistoryItem {
  sh_id: number;
  played_at: number;
  duration: number;
  playlist: string;
  streamer: string;
  is_request: boolean;
  song: AzuraCastSong;
}

export interface AzuraCastStation {
  id: number;
  name: string;
  shortcode: string;
  description: string;
  listen_url: string;
  public_player_url: string;
}

export interface AzuraCastListeners {
  total: number;
  unique: number;
  current: number;
}

export interface AzuraCastNowPlayingResponse {
  station: AzuraCastStation;
  listeners: AzuraCastListeners;
  live: {
    is_live: boolean;
    streamer_name: string;
    broadcast_start: number | null;
    art: string | null;
  };
  now_playing: AzuraCastNowPlaying | null;
  playing_next: AzuraCastPlayingNext | null;
  song_history: AzuraCastSongHistoryItem[];
  is_online: boolean;
  cache: unknown;
}

export interface UseAzuraCastResult {
  data: AzuraCastNowPlayingResponse | null;
  loading: boolean;
  error: string | null;
  isOnline: boolean;
  refetch: () => Promise<void>;
}

function getApiBaseUrl(): string {
  return import.meta.env.VITE_AZURACAST_API_URL || "https://cast.gwan.com.br";
}

export function useAzuraCast(): UseAzuraCastResult {
  const [data, setData] = useState<AzuraCastNowPlayingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNowPlaying = useCallback(async () => {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/nowplaying/${STATION_SHORTCODE}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.status}`);
      }
      const json: AzuraCastNowPlayingResponse = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Falha ao conectar com a rádio";
      setError(message);
      setData((prev) => (prev ? prev : null));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNowPlaying();

    const interval = setInterval(fetchNowPlaying, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchNowPlaying]);

  return {
    data,
    loading,
    error,
    isOnline: data?.is_online ?? false,
    refetch: fetchNowPlaying,
  };
}
