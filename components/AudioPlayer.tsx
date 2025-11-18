import React, { useState, useRef, useEffect, useCallback } from 'react';

interface AudioPlayerProps {
  src: string;
}

const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    
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
        
        const handlePlaybackEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            if(audioRef.current) audioRef.current.currentTime = 0;
            updateProgressBar();
        };

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', handlePlaybackEnded);

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', handlePlaybackEnded);
        };
    }, [updateProgressBar]);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if(audio){
            audio.currentTime = Number(e.target.value);
            setCurrentTime(audio.currentTime);
            updateProgressBar();
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    return (
        <div className="bg-brand-card p-4 rounded-lg flex items-center space-x-4">
            <audio ref={audioRef} src={src} preload="metadata"></audio>
            <button onClick={togglePlayPause} className="text-white p-2 bg-brand-green-dark rounded-full flex-shrink-0">
                {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                )}
            </button>
            <div className="flex-grow flex items-center space-x-2">
                <span className="text-xs text-brand-light-gray w-10 text-center">{formatTime(currentTime)}</span>
                <input
                    ref={progressBarRef}
                    type="range"
                    value={currentTime}
                    step="1"
                    min="0"
                    max={duration || 0}
                    onChange={handleSeek}
                    className="w-full h-1 rounded-lg appearance-none cursor-pointer progress-slider"
                />
                <span className="text-xs text-brand-light-gray w-10 text-center">{formatTime(duration)}</span>
            </div>
             <div className="flex items-center space-x-2 w-24">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-light-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-brand-gray rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
    );
};

export default AudioPlayer;