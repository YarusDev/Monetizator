const SOURCE_KEY = 'm_source_id';

export const trackingService = {
  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const sourceId = urlParams.get('s') || urlParams.get('source_id');
    
    if (sourceId) {
      sessionStorage.setItem(SOURCE_KEY, sourceId);
    }
  },

  getSourceId(): string | undefined {
    return sessionStorage.getItem(SOURCE_KEY) || undefined;
  },

  getAnalyticsMetadata() {
    return {
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      platform: navigator.platform
    };
  }
};
