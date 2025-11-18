
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Page, Song } from './types';
import BottomNav from './components/BottomNav';
import MiniPlayer from './components/MiniPlayer';
import FullScreenPlayer from './components/FullScreenPlayer';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import StatsPage from './pages/StatsPage';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Home);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreenPlayerOpen, setFullScreenPlayerOpen] = useState(false);
  
  // Centralized Audio Engine
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const handlePlaybackEnded = () => {
      setIsPlaying(false);
      // Optional: play next song in a queue here
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handlePlaybackEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handlePlaybackEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(e => console.error("Audio playback error:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handlePlaySong = useCallback((song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = song.src;
      audioRef.current.load();
      audioRef.current.play().catch(e => console.error("Audio playback error on new song:", e));
    }
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (!currentSong) return;
    setIsPlaying(prev => !prev);
  }, [currentSong]);

  const handleClosePlayer = useCallback(() => {
    setIsPlaying(false);
    setCurrentSong(null);
    setFullScreenPlayerOpen(false);
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
    }
  }, []);
  
  const handleSeek = useCallback((time: number) => {
    if (audioRef.current) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    }
  }, []);


  const renderPage = () => {
    const props = { playSong: handlePlaySong, setActivePage };
    switch (activePage) {
      case Page.Home:
        return <HomePage {...props} />;
      case Page.Create:
        return <CreatePage {...props} />;
      case Page.Stats:
        return <StatsPage />;
      case Page.Profile:
        return <ProfilePage />;
      default:
        return <HomePage {...props} />;
    }
  };

  return (
    <>
      {/* This single audio element powers the entire app */}
      <audio ref={audioRef} preload="metadata" />

      <div className="md:hidden">
        <div className="bg-brand-dark min-h-screen text-white font-sans">
          <main className={currentSong ? 'pb-44' : 'pb-24'}>
            {renderPage()}
          </main>
          
          <AnimatePresence>
            {currentSong && !isFullScreenPlayerOpen && (
               <MiniPlayer 
                  song={{...currentSong, layoutId: `cover-art-${currentSong.id}`}}
                  isPlaying={isPlaying} 
                  onTogglePlay={handleTogglePlay}
                  onClose={handleClosePlayer}
                  onOpenFullScreen={() => setFullScreenPlayerOpen(true)}
                  currentTime={currentTime}
                  duration={duration}
               />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isFullScreenPlayerOpen && currentSong && (
              <FullScreenPlayer
                song={{...currentSong, layoutId: `cover-art-${currentSong.id}`}}
                isPlaying={isPlaying}
                onTogglePlay={handleTogglePlay}
                onClose={() => setFullScreenPlayerOpen(false)}
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
              />
            )}
          </AnimatePresence>

          <BottomNav activePage={activePage} setActivePage={setActivePage} />
        </div>
      </div>
      <div className="hidden md:flex flex-col items-center justify-center min-h-screen bg-brand-dark text-white p-8 text-center">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <h1 className="text-3xl font-bold mb-2">Optimized for Mobile</h1>
        <p className="text-brand-light-gray max-w-md">
          For the best experience, please open this application on a mobile device. The interface is specifically designed for smaller screens.
        </p>
      </div>
    </>
  );
};

export default App;
