
import React, { useState } from 'react';
import { Page } from './types';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import StatsPage from './pages/StatsPage';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Create);

  const renderPage = () => {
    switch (activePage) {
      case Page.Home:
        return <HomePage />;
      case Page.Create:
        return <CreatePage />;
      case Page.Stats:
        return <StatsPage />;
      case Page.Profile:
        return <ProfilePage />;
      default:
        return <CreatePage />;
    }
  };

  return (
    <>
      <div className="md:hidden">
        <div className="bg-brand-dark min-h-screen text-white font-sans">
          <main className="pb-24">
            {renderPage()}
          </main>
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
