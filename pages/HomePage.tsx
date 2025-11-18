
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Song } from '../types';
import { BellIcon, FilterIcon, UploadIcon, CreateWithAIIcon, MoreIcon } from '../components/icons';
import UploadSongModal from '../components/UploadSongModal';


const mockSongs: Song[] = [
  { id: '1', title: 'Life in the Ghetto', description: 'Describe the style of your song', coverArt: 'https://picsum.photos/seed/song1/100/100', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '2', title: 'Makossa Feelings', description: 'Upbeat and vibrant track', coverArt: 'https://picsum.photos/seed/song2/100/100', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: '3', title: 'Bikutsi Night', description: 'Energetic dance rhythm', coverArt: 'https://picsum.photos/seed/song3/100/100', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: '4', title: 'Douala Dream', description: 'Chill afrobeat vibe', coverArt: 'https://picsum.photos/seed/song4/100/100', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
];

interface HomePageProps {
  playSong: (song: Song) => void;
}

const Header: React.FC = () => (
    <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-3">
            <img src="https://picsum.photos/seed/avatar/40/40" alt="User Avatar" className="w-10 h-10 rounded-full"/>
        </div>
        <button className="relative text-brand-light-gray">
            <BellIcon className="h-6 w-6"/>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-brand-green ring-2 ring-brand-dark"></span>
        </button>
    </div>
);

const SongItem: React.FC<{ song: Song; onPlay: (song: Song) => void }> = ({ song, onPlay }) => (
    <button onClick={() => onPlay(song)} className="w-full flex items-center space-x-4 p-2 rounded-lg hover:bg-brand-card/50 text-left">
        <img src={song.coverArt} alt={song.title} className="w-14 h-14 rounded-md flex-shrink-0" />
        <div className="flex-grow min-w-0">
            <h3 className="font-bold text-white truncate">{song.title}</h3>
            <p className="text-sm text-brand-light-gray truncate">{song.description}</p>
        </div>
        <div className="text-brand-light-gray">
            <MoreIcon className="h-6 w-6"/>
        </div>
    </button>
);

const HomePage: React.FC<HomePageProps> = ({ playSong }) => {
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);

    return (
        <div className="min-h-screen" style={{ background: 'radial-gradient(circle at top, #1DB95430, #0A0F0D 50%)' }}>
            <Header />
            <div className="p-4">
                <h1 className="text-4xl font-extrabold text-white mb-6">Create your masterpiece</h1>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button onClick={() => setUploadModalOpen(true)} className="bg-brand-card p-4 rounded-xl flex flex-col items-start space-y-4 hover:bg-brand-card/70 transition-colors duration-200">
                        <div className="p-2 bg-brand-green rounded-full">
                            <UploadIcon className="h-6 w-6 text-brand-dark" />
                        </div>
                        <div className="text-left">
                            <h2 className="font-bold text-white">Upload Song</h2>
                            <p className="text-xs text-brand-light-gray">Publish your existing or new sound to the people who care</p>
                        </div>
                    </button>
                    <div className="bg-brand-pink/20 p-4 rounded-xl flex flex-col items-start space-y-4 border border-brand-pink">
                        <div className="p-2 bg-brand-pink rounded-full">
                            <CreateWithAIIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                            <h2 className="font-bold text-white">Create with AI</h2>
                            <p className="text-xs text-brand-light-gray">Publish your existing or new sound to the people who care</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">My Songs</h2>
                    <button className="flex items-center space-x-2 text-brand-light-gray hover:text-white">
                        <span>Filter</span>
                        <FilterIcon className="h-5 w-5"/>
                    </button>
                </div>

                <div className="space-y-2">
                    {mockSongs.map(song => <SongItem key={song.id} song={song} onPlay={playSong} />)}
                </div>
            </div>
            <AnimatePresence>
                {isUploadModalOpen && <UploadSongModal onClose={() => setUploadModalOpen(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default HomePage;
