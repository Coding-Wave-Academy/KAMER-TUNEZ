
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Page, Song } from './types';
import BottomNav from './components/BottomNav';
import MiniPlayer from './components/MiniPlayer';
import FullScreenPlayer from './components/FullScreenPlayer';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import StatsPage from './pages/StatsPage';
import ProfilePage from './pages/ProfilePage';
import CampaignPage from './pages/CampaignPage';

const DAILY_GENERATION_LIMIT = 5;

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Home);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreenPlayerOpen, setFullScreenPlayerOpen] = useState(false);
  const [generationCredits, setGenerationCredits] = useState(DAILY_GENERATION_LIMIT);

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (!currentSong) return;
    setIsPlaying(prev => !prev);
  }
  
  const handleUseCredit = () => {
    setGenerationCredits(prev => Math.max(0, prev - 1));
  }

  const handleClosePlayer = () => {
    setIsPlaying(false);
    setCurrentSong(null);
    setFullScreenPlayerOpen(false);
  }

  const renderPage = () => {
    switch (activePage) {
      case Page.Home:
        return <HomePage playSong={handlePlaySong} setActivePage={setActivePage} />;
      case Page.Create:
        return <CreatePage playSong={handlePlaySong} setActivePage={setActivePage} generationCredits={generationCredits} onUseCredit={handleUseCredit} />;
      case Page.Stats:
        return <StatsPage />;
      case Page.Profile:
        return <ProfilePage />;
      case Page.Campaign:
         return <CampaignPage setActivePage={setActivePage} />;
      default:
        return <HomePage playSong={handlePlaySong} setActivePage={setActivePage} />;
    }
  };

  return (
    <>
      <div className="md:hidden">
        <div className="bg-brand-dark min-h-screen text-white font-sans">
          <main className={`pb-24 ${currentSong ? 'pb-44' : ''}`}>
            {renderPage()}
          </main>
          
          <AnimatePresence>
            {currentSong && !isFullScreenPlayerOpen && (
               <MiniPlayer 
                  song={currentSong} 
                  isPlaying={isPlaying} 
                  onTogglePlay={handleTogglePlay}
                  onClose={handleClosePlayer}
                  onOpenFullScreen={() => setFullScreenPlayerOpen(true)}
               />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isFullScreenPlayerOpen && currentSong && (
              <FullScreenPlayer
                song={currentSong}
                isPlaying={isPlaying}
                onTogglePlay={handleTogglePlay}
                onClose={() => setFullScreenPlayerOpen(false)}
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
