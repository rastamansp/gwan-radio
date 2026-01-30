import { Play, Pause, Volume2, VolumeX, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { useRadio } from '../contexts/RadioContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { NowPlayingWidget } from './NowPlayingWidget';

export const RadioPlayer = () => {
  const {
    isPlaying,
    isLoading,
    volume,
    isExpanded,
    nowPlaying,
    error,
    toggle,
    setVolume,
    toggleExpanded,
  } = useRadio();

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-player-border bg-player-bg transition-all duration-300 ${
        isExpanded ? 'h-32' : 'h-16'
      }`}
    >
      <div className="container h-full">
        {/* Compact View */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Play Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            disabled={isLoading}
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>

          {/* Now Playing Info (Compact) */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              {/* Live Badge */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent/20 flex-shrink-0">
                <span className="h-2 w-2 rounded-full bg-accent pulse-live" />
                <span className="text-xs font-semibold text-accent">AO VIVO</span>
              </div>
              
              {/* Song Info */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {nowPlaying.song}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {nowPlaying.artist}
                </p>
              </div>
            </div>
            
            {error && (
              <p className="text-xs text-destructive mt-1">{error}</p>
            )}
          </div>

          {/* Volume Control (Desktop) */}
          <div className="hidden md:flex items-center gap-2 w-32">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
              className="h-8 w-8 flex-shrink-0"
            >
              {volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[volume * 100]}
              onValueChange={([value]) => setVolume(value / 100)}
              max={100}
              step={1}
              className="w-20"
            />
          </div>

          {/* Expand Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpanded}
            className="h-8 w-8 flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="flex items-center justify-between h-16 border-t border-border animate-fade-in">
            <NowPlayingWidget showListeners />
            
            {/* Mobile Volume */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
                className="h-8 w-8"
              >
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                onValueChange={([value]) => setVolume(value / 100)}
                max={100}
                step={1}
                className="w-24"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
