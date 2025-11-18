
import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Song, Page } from '../types';
import { BellIcon, FilterIcon, MoreIcon } from '../components/icons';

const mockSongs: Song[] = [
  { id: '1', title: 'Life in the Ghetto', description: 'Describe the style of your song', coverArt: 'https://picsum.photos/seed/song1/100/100', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '2', title: 'Makossa Feelings', description: 'Upbeat and vibrant track', coverArt: 'https://picsum.photos/seed/song2/100/100', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: '3', title: 'Bikutsi Night', description: 'Energetic dance rhythm', coverArt: 'https://picsum.photos/seed/song3/100/100', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: '4', title: 'Douala Dream', description: 'Chill afrobeat vibe', coverArt: 'https://picsum.photos/seed/song4/100/100', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
];

const promoSlides = [
    {
        id: 'promo',
        title: 'PROMO POOL',
        subtitle: 'Create a Campaign',
        description: 'Promote your new songs and get quality insights from your listeners',
        bgColor: 'bg-brand-green',
        textColor: 'text-black',
        img: 'https://i.imgur.com/gAY931j.png', // Placeholder image URL
    },
    {
        id: 'creator',
        title: 'SONG MAKER',
        subtitle: 'Create a Song With AI',
        description: 'Promote your new songs and get quality insights from your listeners',
        bgColor: 'bg-brand-pink',
        textColor: 'text-white',
        img: 'https://i.imgur.com/gAY931j.png', // Placeholder image URL
    }
];

interface HomePageProps {
  playSong: (song: Song) => void;
  setActivePage: (page: Page) => void;
}

const Header: React.FC = () => (
    <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-3">
            <img src="https://picsum.photos/seed/avatar/40/40" alt="User Avatar" className="w-10 h-10 rounded-full"/>
            <div>
                <p className="text-sm text-brand-light-gray">Hello, Ribert Kandi Junior ✨</p>
                <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            </div>
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

const PromoCarousel: React.FC<{ setActivePage: (page: Page) => void }> = ({ setActivePage }) => {
    const [index, setIndex] = useState(0);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const dragThreshold = 50;
        if (info.offset.x > dragThreshold) {
            setIndex(prev => Math.max(0, prev - 1));
        } else if (info.offset.x < -dragThreshold) {
            setIndex(prev => Math.min(promoSlides.length - 1, prev + 1));
        }
    };
    
    const handleClick = (slideId: string) => {
        if(slideId === 'creator') {
            setActivePage(Page.Create);
        }
        // Can add logic for 'promo' later
    }

    return (
        <div className="mb-8">
            <div className="relative w-full h-48 overflow-hidden">
                {promoSlides.map((slide, i) => (
                    <motion.div
                        key={slide.id}
                        className={`absolute w-full h-full p-4 rounded-2xl flex flex-col justify-between ${slide.bgColor}`}
                        initial={{ x: '100%', opacity: 0, scale: 0.8 }}
                        animate={{
                            x: `${(i - index) * 100}%`,
                            opacity: i === index ? 1 : 0.5,
                            scale: i === index ? 1 : 0.8,
                        }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleClick(slide.id)}
                    >
                        <div className="z-10">
                            <p className={`text-xs font-bold ${slide.textColor}`}>{slide.title}</p>
                            <h2 className={`text-2xl font-extrabold ${slide.textColor}`}>{slide.subtitle}</h2>
                        </div>
                        <p className={`text-xs w-2/3 z-10 ${slide.textColor}`}>{slide.description}</p>
                        <img src={slide.img} alt={slide.subtitle} className="absolute right-0 bottom-0 w-3/5 h-full object-cover" style={{ objectPosition: '0% 100%'}}/>
                    </motion.div>
                ))}
            </div>
            <div className="flex justify-center space-x-2 mt-3">
                {promoSlides.map((_, i) => (
                    <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full ${i === index ? 'bg-brand-green' : 'bg-brand-gray'}`}></button>
                ))}
            </div>
        </div>
    );
}


const HomePage: React.FC<HomePageProps> = ({ playSong, setActivePage }) => {
    return (
        <div className="min-h-screen" style={{ background: 'radial-gradient(circle at top, #1DB95430, #0A0F0D 50%)' }}>
            <Header />
            <div className="p-4">
                <PromoCarousel setActivePage={setActivePage} />
                
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
        </div>
    );
};

export default HomePage;
