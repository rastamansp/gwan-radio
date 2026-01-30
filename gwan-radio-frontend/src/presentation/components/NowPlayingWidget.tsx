import { Radio } from 'lucide-react';
import { useRadio } from '../contexts/RadioContext';

interface NowPlayingWidgetProps {
  className?: string;
  showListeners?: boolean;
}

export const NowPlayingWidget = ({ className = '', showListeners = false }: NowPlayingWidgetProps) => {
  const { nowPlaying, isPlaying } = useRadio();

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Album Art or Placeholder */}
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        {nowPlaying.albumArt ? (
          <img
            src={nowPlaying.albumArt}
            alt={`${nowPlaying.song} - ${nowPlaying.artist}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-reggae">
            <Radio className="h-6 w-6 text-white" />
          </div>
        )}
        
        {/* Live indicator */}
        {isPlaying && (
          <div className="absolute bottom-1 right-1 flex items-center gap-1 rounded bg-accent px-1.5 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white pulse-live" />
            <span className="text-[10px] font-bold text-white">LIVE</span>
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground truncate">
          {nowPlaying.song}
        </p>
        <p className="text-sm text-muted-foreground truncate">
          {nowPlaying.artist}
        </p>
        {showListeners && nowPlaying.listeners && nowPlaying.listeners > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {nowPlaying.listeners} ouvinte{nowPlaying.listeners !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
};
