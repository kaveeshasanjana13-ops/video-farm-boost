// Global type declaration for wistia-player element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': {
        'media-id': string;
        seo: string;
        aspect: string;
        className?: string;
      };
    }
  }
}

export {};