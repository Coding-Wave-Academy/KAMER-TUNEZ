import { Song, SongOrigin } from '../types';

// This is a mock Firestore service that uses localStorage for persistence.
// It mimics the async nature of real Firestore calls.

const SONGS_KEY = 'suno_ai_songs';

const initialSongs: Song[] = [
    { id: '1', title: 'Life in the Ghetto', description: 'Describe the style of your song', coverArt: 'https://picsum.photos/seed/song1/100/100', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', origin: 'upload' },
    { id: '2', title: 'Makossa Feelings', description: 'Upbeat and vibrant track', coverArt: 'https://picsum.photos/seed/song2/100/100', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', origin: 'ai' },
    { id: '3', title: 'Bikutsi Night', description: 'Energetic dance rhythm', coverArt: 'https://picsum.photos/seed/song3/100/100', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', origin: 'ai' },
];

const getStoredSongs = (): Song[] => {
    try {
        const stored = localStorage.getItem(SONGS_KEY);
        if (stored) {
            return JSON.parse(stored);
        } else {
            // If no songs are stored, initialize with default songs
            localStorage.setItem(SONGS_KEY, JSON.stringify(initialSongs));
            return initialSongs;
        }
    } catch (error) {
        console.error("Could not read songs from localStorage", error);
        return initialSongs;
    }
};

const saveSongs = (songs: Song[]) => {
    try {
        localStorage.setItem(SONGS_KEY, JSON.stringify(songs));
    } catch (error) {
        console.error("Could not save songs to localStorage", error);
    }
};

export const getSongs = async (): Promise<Song[]> => {
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
    return getStoredSongs();
};

export const addSong = async (songData: Omit<Song, 'id'>): Promise<Song> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const songs = getStoredSongs();
    const newSong: Song = {
        id: Date.now().toString(),
        ...songData,
    };
    const updatedSongs = [newSong, ...songs];
    saveSongs(updatedSongs);
    return newSong;
};

export const deleteSong = async (songId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    let songs = getStoredSongs();
    songs = songs.filter(song => song.id !== songId);
    saveSongs(songs);
};
