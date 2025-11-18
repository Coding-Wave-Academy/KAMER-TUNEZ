
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Song } from '../types';
import { PreviousIcon, NextIcon, PlayCircleIcon, PauseCircleIcon } from './icons';

interface FullScreenPlayerProps {
    song: Song;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onClose: () => void;
}

const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const FullScreenPlayer: React.FC<FullScreenPlayerProps> = ({ song, isPlaying, onTogglePlay, onClose }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const progressBarRef = useRef<HTMLInputElement>(null);

     const updateProgressBar = useCallback(() => {
        if (progressBarRef.current && audioRef.current?.duration) {
            const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            progressBarRef.current.style.backgroundSize = `${progress}% 100%`;
        } else if (progressBarRef.current) {
            progressBarRef.current.style.backgroundSize = `0% 100%`;
        }
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setDuration(audio.duration);
            setCurrentTime(audio.currentTime);
        };
        const setAudioTime = () => {
             setCurrentTime(audio.currentTime);
             updateProgressBar();
        };
        const handleEnded = () => {
            if(isPlaying) onTogglePlay();
        };

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', handleEnded);

        if (isPlaying) {
            audio.play().catch(e => console.error(e));
        } else {
            audio.pause();
        }

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [isPlaying, song.src, onTogglePlay, updateProgressBar]);

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Number(e.target.value);
            setCurrentTime(audioRef.current.currentTime);
            updateProgressBar();
        }
    };
    
    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 bg-gradient-to-b from-brand-gray to-brand-dark z-50 flex flex-col p-4 text-white"
        >
            <audio ref={audioRef} src={song.src} preload="metadata" />
            <div className="flex-shrink-0 flex items-center justify-between">
                <button onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <p className="font-bold">Now Playing</p>
                <div className="w-6"></div>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
                <motion.img 
                    layoutId={`cover-art-${song.id}`}
                    src={song.coverArt} 
                    alt={song.title} 
                    className="w-full max-w-xs aspect-square rounded-2xl shadow-2xl shadow-black/50 mb-8"
                />
                <h2 className="text-3xl font-extrabold">{song.title}</h2>
                <p className="text-brand-light-gray mt-1">Ribert Kandi Junior</p>
            </div>

            <div className="flex-shrink-0">
                <div className="flex items-center text-xs text-brand-light-gray">
                    <span>{formatTime(currentTime)}</span>
                    <input
                        ref={progressBarRef}
                        type="range"
                        value={currentTime}
                        step="1"
                        min="0"
                        max={duration || 0}
                        onChange={handleSeek}
                        className="w-full h-1 rounded-lg appearance-none cursor-pointer mx-2 progress-slider"
                        style={{backgroundImage: 'linear-gradient(#B91D73, #B91D73)'}}
                    />
                    <span>{formatTime(duration)}</span>
                </div>
                <div className="flex items-center justify-center space-x-6 mt-4">
                    <button className="text-brand-light-gray w-8 h-8"><PreviousIcon /></button>
                    <button onClick={onTogglePlay} className="w-20 h-20">
                        {isPlaying ? <PauseCircleIcon className="text-brand-green w-full h-full"/> : <PlayCircleIcon className="text-brand-green w-full h-full"/>}
                    </button>
                    <button className="text-brand-light-gray w-8 h-8"><NextIcon /></button>
                </div>
            </div>
        </motion.div>
    );
};

export default FullScreenPlayer;
