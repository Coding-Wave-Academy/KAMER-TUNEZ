
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Song } from '../types';
import { PreviousIcon, NextIcon, PlayCircleIcon, PauseCircleIcon } from './icons';

interface MiniPlayerProps {
    song: Song;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onClose: () => void;
    onOpenFullScreen: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ song, isPlaying, onTogglePlay, onClose, onOpenFullScreen }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            if (audio.duration > 0) {
                 setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        const handleEnded = () => {
            if (isPlaying) onTogglePlay();
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [isPlaying, onTogglePlay]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play().catch(e => console.error("Playback error:", e));
        } else {
            audioRef.current?.pause();
        }
    }, [isPlaying, song.src]);
    
    const audioKey = song.id;

    return (
        <motion.div 
            className="fixed bottom-[68px] left-0 right-0 p-2 z-40"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <div className="bg-brand-card/90 backdrop-blur-md rounded-lg p-2 flex items-center space-x-3 relative overflow-hidden">
                 <div className="absolute bottom-0 left-0 h-0.5 bg-brand-pink" style={{ width: `${progress}%` }}></div>
                <div className="absolute bottom-0 h-0.5 bg-brand-gray/50" style={{ left: `${progress}%`, right: 0 }}></div>

                <audio ref={audioRef} src={song.src} key={audioKey} preload="auto" />
                
                <div className="flex-grow flex items-center space-x-3 min-w-0" onClick={onOpenFullScreen}>
                    <img src={song.coverArt} alt={song.title} className="w-12 h-12 rounded-md flex-shrink-0" />
                    <div className="flex-grow min-w-0">
                        <p className="text-white font-bold truncate">{song.title}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2 text-white flex-shrink-0">
                    <button onClick={(e) => e.stopPropagation()} className="w-6 h-6 hidden sm:block"><PreviousIcon /></button>
                    <button onClick={(e) => { e.stopPropagation(); onTogglePlay(); }} className="w-10 h-10">
                        {isPlaying ? <PauseCircleIcon className="text-brand-green w-full h-full" /> : <PlayCircleIcon className="text-brand-green w-full h-full" />}
                    </button>
                    <button onClick={(e) => e.stopPropagation()} className="w-6 h-6 hidden sm:block"><NextIcon /></button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onClose(); }} 
                        className="w-8 h-8 flex items-center justify-center text-brand-light-gray hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default MiniPlayer;
