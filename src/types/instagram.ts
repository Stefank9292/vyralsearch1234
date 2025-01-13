export interface InstagramPost {
  ownerUsername: string;
  caption: string;
  date: string;
  playsCount: number;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount?: number;  // Added for TikTok
  duration: string;
  engagement: string;
  url: string;
  videoUrl?: string;
  timestamp?: string;
  productType?: string;
  type?: string;  // Added to support different post types
  hashtags?: string[];  // Added to match transformer
  mentions?: string[];  // Added to match transformer
  ownerId?: string;    // Added to match transformer
  locationName?: string; // Added to match transformer
}

export interface SearchResultItem {
  id: string;
  search_history_id: string;
  results: InstagramPost[];
  created_at: string;
}

export interface SupabaseSearchResult {
  id: string;
  search_history_id: string;
  results: unknown;
  created_at: string;
}

export interface FilterState {
  postsNewerThan: string;
  minViews: string;
  minPlays: string;
  minLikes: string;
  minComments: string;
  minEngagement: string;
  minShares: string;
}