
import React, { useState, useRef, useEffect } from 'react';
import { Song } from '../types';
import { PreviousIcon, NextIcon, PlayCircleIcon, PauseCircleIcon } from './icons';

interface MiniPlayerProps {
    song: Song;
    isPlaying: boolean;
    onTogglePlay: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ song, isPlaying, onTogglePlay }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setProgress((audio.currentTime / audio.duration) * 100);
        };

        const handleEnded = () => {
            onTogglePlay(); // This will set isPlaying to false
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [onTogglePlay]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play().catch(e => console.error("Playback error:", e));
        } else {
            audioRef.current?.pause();
        }
    }, [isPlaying, song.src]);
    
    // Key ensures a new audio element is created when the song changes
    const audioKey = song.id;

    return (
        <div className="fixed bottom-[68px] left-0 right-0 p-2 z-40">
            <div className="bg-brand-card/90 backdrop-blur-md rounded-lg p-2 flex items-center space-x-3 relative overflow-hidden">
                 {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 h-0.5 bg-brand-pink" style={{ width: `${progress}%` }}></div>
                <div className="absolute bottom-0 h-0.5 bg-brand-gray/50" style={{ left: `${progress}%`, right: 0 }}></div>

                <audio ref={audioRef} src={song.src} key={audioKey} preload="auto" />
                <img src={song.coverArt} alt={song.title} className="w-12 h-12 rounded-md flex-shrink-0" />
                <div className="flex-grow min-w-0">
                    <p className="text-white font-bold truncate">{song.title}</p>
                </div>
                <div className="flex items-center space-x-2 text-white flex-shrink-0">
                    <button className="w-6 h-6"><PreviousIcon /></button>
                    <button onClick={onTogglePlay} className="w-10 h-10">
                        {isPlaying ? <PauseCircleIcon className="text-brand-green w-full h-full" /> : <PlayCircleIcon className="text-brand-green w-full h-full" />}
                    </button>
                    <button className="w-6 h-6"><NextIcon /></button>
                </div>
            </div>
        </div>
    );
};

export default MiniPlayer;
