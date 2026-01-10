import { useEffect, useMemo, useState } from 'react';
import { Play } from 'lucide-react';
import portfolio1 from '@/assets/portfolio-1.jpg';
import portfolio2 from '@/assets/portfolio-2.jpg';
import portfolio3 from '@/assets/portfolio-3.jpg';

interface VideoItem {
  id: number;
  thumbnail: string;
  title: string;
  category: string;
  embedUrl: string;
}

const videos: VideoItem[] = [
  {
    id: 1,
    thumbnail: portfolio1,
    title: 'Cinematography Showreel',
    category: 'Showreel',
    embedUrl: 'https://www.youtube.com/embed/zmIG7JGn4Is',
  },
  {
    id: 2,
    thumbnail: portfolio2,
    title: 'Documentary Collection',
    category: 'Playlist',
    embedUrl: 'https://www.youtube.com/embed/videoseries?list=PLqTHbZFu4wu8LByQ7KBCcabFWYvwhJVcq',
  },
  {
    id: 3,
    thumbnail: portfolio3,
    title: 'Creative Projects',
    category: 'Playlist',
    embedUrl: 'https://www.youtube.com/embed/videoseries?list=PLC-ipeso_IGvtwfIkb5r5nP4MVULcGiCC',
  },
  {
    id: 4,
    thumbnail: portfolio1,
    title: 'Behind The Scenes',
    category: 'Video',
    embedUrl: 'https://www.youtube.com/embed/3BKV9CgzKAE',
  },
  {
    id: 5,
    thumbnail: portfolio2,
    title: 'Cinematic Moments',
    category: 'Video',
    embedUrl: 'https://www.youtube.com/embed/lfIxAWPzYM0',
  },
];

function buildYoutubeEmbedUrl(rawUrl: string, autoplay: boolean) {
  try {
    const url = new URL(rawUrl);
    url.searchParams.set('autoplay', autoplay ? '1' : '0');
    url.searchParams.set('mute', autoplay ? '1' : url.searchParams.get('mute') ?? '0');
    url.searchParams.set('playsinline', '1');
    url.searchParams.set('rel', '0');
    url.searchParams.set('modestbranding', '1');
    return url.toString();
  } catch {
    return rawUrl;
  }
}

const VideoSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    // When switching videos, don't force autoplay.
    setAutoplay(false);
  }, [activeIndex]);

  const activeVideo = videos[activeIndex];
  const iframeSrc = useMemo(
    () => buildYoutubeEmbedUrl(activeVideo.embedUrl, autoplay),
    [activeVideo.embedUrl, autoplay]
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Always-visible YouTube player (no placeholder) */}
      <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-card border border-border">
        <iframe
          key={`${activeVideo.id}-${autoplay ? 'play' : 'pause'}`}
          src={iframeSrc}
          title={activeVideo.title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        {!autoplay && (
          <button
            type="button"
            onClick={() => setAutoplay(true)}
            className="absolute inset-0 z-10 flex items-center justify-center bg-background/20 backdrop-blur-[1px] transition-colors hover:bg-background/10"
            aria-label={`Play ${activeVideo.title}`}
          >
            <span className="flex items-center gap-3 rounded-full border border-primary/60 bg-background/30 px-6 py-3 text-primary">
              <Play className="h-5 w-5" />
              <span className="text-sm font-body uppercase tracking-[0.25em]">Play</span>
            </span>
          </button>
        )}
      </div>

      {/* Compact thumbnail strip */}
      <div className="mt-6">
        <div className="flex items-center justify-center gap-3 md:gap-4 px-4">
          {videos.map((video, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={video.id}
                type="button"
                className={`relative flex-shrink-0 w-[100px] md:w-[140px] aspect-video cursor-pointer transition-all duration-400 ease-out rounded-md overflow-hidden border-2 ${
                  isActive
                    ? 'border-primary scale-105 shadow-lg shadow-primary/20'
                    : 'border-border/50 opacity-60 hover:opacity-90 hover:border-primary/40'
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Select ${video.title}`}
              >
                <img
                  src={video.thumbnail}
                  alt={`${video.title} thumbnail`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-70'
                }`} />
                
                {isActive && (
                  <div className="absolute bottom-1 left-1 right-1">
                    <span className="text-[9px] md:text-[10px] text-primary uppercase tracking-wider font-body line-clamp-1">
                      {video.category}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Minimal dots indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {videos.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? 'bg-primary w-6'
                  : 'bg-muted-foreground/20 hover:bg-muted-foreground/40 w-1.5'
              }`}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoSlider;
