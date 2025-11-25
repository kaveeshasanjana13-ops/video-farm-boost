import { Skeleton } from "@/components/ui/skeleton";

export const ImageSkeleton = ({ aspectRatio = "16/9" }: { aspectRatio?: string }) => (
  <div className="relative w-full" style={{ aspectRatio }}>
    <Skeleton className="absolute inset-0 rounded-lg animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%]" />
  </div>
);

export const CardSkeleton = () => (
  <div className="space-y-4 p-6 border border-border rounded-xl">
    <Skeleton className="h-8 w-3/4 animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%]" />
    <Skeleton className="h-4 w-full animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%]" />
    <Skeleton className="h-4 w-5/6 animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%]" />
  </div>
);

export const TabsSkeleton = () => (
  <div className="space-y-6">
    <div className="flex gap-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-12 w-24 rounded-lg animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%]" />
      ))}
    </div>
    <ImageSkeleton />
  </div>
);
