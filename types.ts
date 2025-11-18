
export enum Page {
  Home = 'Home',
  Create = 'Create',
  Stats = 'Stats',
  Profile = 'Profile',
  Campaign = 'Campaign',
}

export interface Song {
  id: string;
  title: string;
  description: string;
  coverArt: string;
  src: string;
}

export interface ChartData {
  name: string;
  value: number;
}
