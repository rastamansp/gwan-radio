/**
 * Entidade que representa uma estação de rádio do AzuraCast
 * Baseada na estrutura da API pública do AzuraCast
 */

export interface Station {
  id: number;
  name: string;
  shortcode: string;
  description?: string;
  frontend: string;
  backend: string;
  listen_url: string;
  url?: string;
  public_player_url?: string;
  playlist_pls_url?: string;
  playlist_m3u_url?: string;
  is_public: boolean;
  mounts?: Mount[];
  remotes?: Remote[];
  hls_enabled: boolean;
  hls_url?: string;
  hls_listeners?: number;
  logo?: string;
  logo_url?: string;
  genres?: string[];
  social_links?: SocialLink[];
}

export interface Mount {
  id: number;
  name: string;
  path: string;
  is_default: boolean;
  format: string;
  bitrate: number;
  listeners?: Listeners;
}

export interface Remote {
  id: number;
  name: string;
  url: string;
  bitrate: number;
  format: string;
  listeners?: Listeners;
}

export interface Listeners {
  total: number;
  unique: number;
  current: number;
}

export interface SocialLink {
  type: string;
  url: string;
  name?: string;
}

export interface StationStats {
  listeners: Listeners;
  song_history: SongHistoryItem[];
  current_song?: NowPlayingSong;
  live?: LiveInfo;
  playing_next?: SongHistoryItem;
}

export interface SongHistoryItem {
  sh_id: number;
  played_at: number;
  duration: number;
  playlist?: string;
  streamer?: string;
  is_request: boolean;
  song: Song;
}

export interface NowPlayingSong {
  sh_id: number;
  played_at: number;
  duration: number;
  playlist?: string;
  streamer?: string;
  is_request: boolean;
  elapsed: number;
  remaining: number;
  song: Song;
}

export interface Song {
  id: string;
  text: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  art?: string;
  custom_fields?: Record<string, string>;
}

export interface LiveInfo {
  is_live: boolean;
  streamer_name?: string;
  broadcast_start?: number;
}

export interface StreamInfo {
  url: string;
  format: string;
  bitrate: number;
  listeners?: number;
}

/**
 * Resposta completa da API pública do AzuraCast
 * Endpoint: /public/{station_shortcode}
 */
export interface StationPublicResponse {
  station: Station;
  now_playing: NowPlayingSong;
  playing_next?: SongHistoryItem;
  song_history: SongHistoryItem[];
  listeners: Listeners;
  live: LiveInfo;
  is_online: boolean;
  cache?: string;
}
