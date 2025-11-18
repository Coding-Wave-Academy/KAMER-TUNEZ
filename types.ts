export enum Page {
  Home = 'Home',
  Create = 'Create',
  Stats = 'Stats',
  Profile = 'Profile',
  Campaign = 'Campaign',
}

export type SongOrigin = 'ai' | 'upload' | 'mixed';
export type FilterType = 'all' | SongOrigin;

export interface Song {
  id: string;
  title: string;
  description: string;
  coverArt: string;
  src: string; // Instrumental source
  vocalsSrc?: string; // Optional vocals source
  origin: SongOrigin;
  layoutId?: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface CampaignData {
  songTitle: string;
  goal: string;
  budget: number;
  duration: number;
  regions: string[];
}
