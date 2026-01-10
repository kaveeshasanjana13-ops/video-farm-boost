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
      {/* Always-visible YouTube player */}
      <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-card border border-border shadow-2xl shadow-background/50">
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
            <span className="flex items-center gap-3 rounded-full border border-primary/60 bg-background/30 px-6 py-3 text-primary backdrop-blur-sm">
              <Play className="h-5 w-5" />
              <span className="text-sm font-body uppercase tracking-[0.25em]">Play</span>
            </span>
          </button>
        )}
      </div>

      {/* 3D Carousel thumbnails - overlapping the video */}
      <div className="-mt-12 md:-mt-16 relative z-20">
        <div className="relative flex items-center justify-center h-[140px] md:h-[180px]">
          {videos.map((video, index) => {
            const isActive = activeIndex === index;
            const isPrev = (activeIndex - 1 + videos.length) % videos.length === index;
            const isNext = (activeIndex + 1) % videos.length === index;
            const isPrev2 = (activeIndex - 2 + videos.length) % videos.length === index;
            const isNext2 = (activeIndex + 2) % videos.length === index;

            let transform = 'scale(0.5) translateX(0)';
            let zIndex = 1;
            let opacity = 0;

            if (isActive) {
              transform = 'scale(1) translateX(0)';
              zIndex = 10;
              opacity = 1;
            } else if (isPrev) {
              transform = 'scale(0.75) translateX(-85%)';
              zIndex = 5;
              opacity = 0.7;
            } else if (isNext) {
              transform = 'scale(0.75) translateX(85%)';
              zIndex = 5;
              opacity = 0.7;
            } else if (isPrev2) {
              transform = 'scale(0.55) translateX(-160%)';
              zIndex = 2;
              opacity = 0.35;
            } else if (isNext2) {
              transform = 'scale(0.55) translateX(160%)';
              zIndex = 2;
              opacity = 0.35;
            }

            return (
              <button
                key={video.id}
                type="button"
                className={`absolute w-[55%] md:w-[45%] aspect-video cursor-pointer transition-all duration-500 ease-out text-left rounded-lg overflow-hidden ${
                  isActive 
                    ? 'shadow-2xl shadow-primary/30 ring-2 ring-primary/60' 
                    : 'shadow-lg shadow-background/50'
                }`}
                style={{ transform, zIndex, opacity }}
                onClick={() => setActiveIndex(index)}
                aria-label={`Select ${video.title}`}
              >
                <div className="relative h-full w-full overflow-hidden group">
                  <img
                    src={video.thumbnail}
                    alt={`${video.title} thumbnail`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                      <span className="text-primary text-[10px] md:text-xs uppercase tracking-[0.2em] font-body mb-0.5 block">
                        {video.category}
                      </span>
                      <h3 className="text-sm md:text-base font-display text-foreground line-clamp-1">
                        {video.title}
                      </h3>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Premium dots indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {videos.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? 'bg-gradient-to-r from-primary to-primary/70 w-6 h-1.5 shadow-sm shadow-primary/40'
                  : 'bg-muted-foreground/20 hover:bg-muted-foreground/40 w-1.5 h-1.5'
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
