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

      {/* Slider thumbnails */}
      <div className="mt-10">
        <div className="relative flex items-center justify-center h-[260px] md:h-[320px]">
          {videos.map((video, index) => {
            const isActive = activeIndex === index;
            const isPrev = (activeIndex - 1 + videos.length) % videos.length === index;
            const isNext = (activeIndex + 1) % videos.length === index;

            let transform = 'scale(0.6) translateX(0)';
            let zIndex = 1;
            let opacity = 0;

            if (isActive) {
              transform = 'scale(1) translateX(0)';
              zIndex = 10;
              opacity = 1;
            } else if (isPrev) {
              transform = 'scale(0.78) translateX(-120%)';
              zIndex = 5;
              opacity = 0.55;
            } else if (isNext) {
              transform = 'scale(0.78) translateX(120%)';
              zIndex = 5;
              opacity = 0.55;
            }

            return (
              <button
                key={video.id}
                type="button"
                className="absolute w-[70%] md:w-[58%] aspect-video cursor-pointer transition-all duration-500 ease-out text-left"
                style={{ transform, zIndex, opacity }}
                onClick={() => setActiveIndex(index)}
                aria-label={`Select ${video.title}`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-lg border border-border group">
                  <img
                    src={video.thumbnail}
                    alt={`${video.title} thumbnail`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <span className="text-primary text-xs uppercase tracking-[0.2em] font-body mb-1 block">
                      {video.category}
                    </span>
                    <h3 className="text-lg md:text-xl font-display text-foreground">
                      {video.title}
                    </h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-6">
          {videos.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? 'bg-primary w-8'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2'
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
