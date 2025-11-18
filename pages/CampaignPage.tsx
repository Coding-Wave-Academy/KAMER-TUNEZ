
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page, Song } from '../types';

const mockSongs: Song[] = [
  { id: '1', title: 'Life in the Ghetto', description: 'Describe the style of your song', coverArt: 'https://picsum.photos/seed/song1/100/100', src: '...' },
  { id: '2', title: 'Makossa Feelings', description: 'Upbeat and vibrant track', coverArt: 'https://picsum.photos/seed/song2/100/100', src: '...' },
  { id: '3', title: 'Bikutsi Night', description: 'Energetic dance rhythm', coverArt: 'https://picsum.photos/seed/song3/100/100', src: '...' },
];

const CAMEROON_REGIONS = ["Adamaoua", "Centre", "East", "Far North", "Littoral", "North", "North-West", "South", "South-West", "West"];

interface CampaignPageProps {
    setActivePage: (page: Page) => void;
}

const CampaignPage: React.FC<CampaignPageProps> = ({ setActivePage }) => {
    const [step, setStep] = useState(1);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [goal, setGoal] = useState('');
    const [budget, setBudget] = useState(5000);
    const [targetedRegions, setTargetedRegions] = useState<string[]>([]);
    
    const handleRegionToggle = (region: string) => {
        setTargetedRegions(prev => 
            prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
        );
    };

    const renderStep = () => {
        switch (step) {
            case 1: // Select Song
                return (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="text-2xl font-bold mb-4">1. Select a song to promote</h2>
                        <div className="space-y-2">
                            {mockSongs.map(song => (
                                <button key={song.id} onClick={() => { setSelectedSong(song); setStep(2); }} className={`w-full flex items-center space-x-4 p-3 rounded-lg text-left transition-all ${selectedSong?.id === song.id ? 'bg-brand-green/30 border-brand-green' : 'bg-brand-card hover:bg-brand-card/70 border-transparent'} border-2`}>
                                    <img src={song.coverArt} alt={song.title} className="w-12 h-12 rounded-md" />
                                    <div>
                                        <p className="font-bold text-white">{song.title}</p>
                                        <p className="text-sm text-brand-light-gray">{song.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                );
            case 2: // Set Goal & Budget
                 return (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="text-2xl font-bold mb-4">2. Goal & Budget</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="font-semibold mb-2 block">What is your main goal?</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['More Streams', 'New Followers', 'Audience Engagement', 'Get on Playlists'].map(g => (
                                        <button key={g} onClick={() => setGoal(g)} className={`p-3 rounded-lg text-sm transition-colors ${goal === g ? 'bg-brand-green text-black font-bold' : 'bg-brand-card hover:bg-brand-card/70'}`}>{g}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="font-semibold mb-2 block">Set your budget (XAF)</label>
                                <input type="range" min="1000" max="50000" step="1000" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full progress-slider" />
                                <p className="text-center text-lg font-bold text-brand-green mt-2">{budget.toLocaleString()} XAF</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-8">
                            <button onClick={() => setStep(1)} className="w-full bg-brand-gray py-3 rounded-full font-bold">Back</button>
                            <button onClick={() => setStep(3)} disabled={!goal} className="w-full bg-brand-green text-black py-3 rounded-full font-bold disabled:bg-brand-gray">Next</button>
                        </div>
                    </motion.div>
                );
            case 3: // Targeting
                return (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="text-2xl font-bold mb-4">3. Target Audience</h2>
                        <p className="text-brand-light-gray mb-4 text-sm">Select the regions in Cameroon you want to target.</p>
                        <div className="flex flex-wrap gap-2">
                            {CAMEROON_REGIONS.map(region => (
                                <button key={region} onClick={() => handleRegionToggle(region)} className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${targetedRegions.includes(region) ? 'bg-brand-green text-black' : 'bg-brand-card hover:bg-brand-card/70'}`}>
                                    {region}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center space-x-4 mt-8">
                            <button onClick={() => setStep(2)} className="w-full bg-brand-gray py-3 rounded-full font-bold">Back</button>
                            <button onClick={() => setStep(4)} disabled={targetedRegions.length === 0} className="w-full bg-brand-green text-black py-3 rounded-full font-bold disabled:bg-brand-gray">Review</button>
                        </div>
                    </motion.div>
                );
            case 4: // Review & Pay
                return (
                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Review Campaign</h2>
                        <div className="bg-brand-card p-4 rounded-lg my-4 text-left space-y-3">
                           <div className="flex justify-between items-center"><span className="text-brand-light-gray">Song:</span> <span className="font-bold text-right">{selectedSong?.title}</span></div>
                           <div className="flex justify-between items-center"><span className="text-brand-light-gray">Goal:</span> <span className="font-bold">{goal}</span></div>
                           <div className="flex justify-between items-center"><span className="text-brand-light-gray">Regions:</span> <span className="font-bold">{targetedRegions.length === CAMEROON_REGIONS.length ? 'All' : `${targetedRegions.length} selected`}</span></div>
                           <div className="flex justify-between items-center border-t border-brand-gray pt-3 mt-2"><span className="text-brand-light-gray">Total Budget:</span><span className="text-brand-green font-extrabold text-2xl">{budget.toLocaleString()} XAF</span></div>
                        </div>
                        <p className="text-sm text-brand-gray">You will be redirected to Nkwa Pay to complete your payment.</p>
                        <button onClick={() => setStep(5)} className="w-full bg-brand-green text-black py-3 rounded-full font-bold mt-6">Launch with Nkwa Pay</button>
                         <button onClick={() => setStep(3)} className="w-full mt-2 text-brand-light-gray py-2">Back to Edit</button>
                    </motion.div>
                );
            case 5: // Complete
                return (
                     <motion.div key="step5" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                         <div className="w-16 h-16 bg-brand-green rounded-full mx-auto flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold">Campaign Launched!</h2>
                        <p className="text-brand-light-gray mb-6">Your song is now being promoted. You can track its performance on the Stats page.</p>
                        <button onClick={() => setActivePage(Page.Home)} className="w-full bg-brand-green text-black py-3 rounded-full font-bold">Back to Home</button>
                    </motion.div>
                );
        }
    };
    
    return (
        <div className="min-h-screen" style={{ background: 'radial-gradient(circle at top, #1DB95430, #0A0F0D 50%)' }}>
            <div className="flex items-center p-4">
                <button onClick={() => setActivePage(Page.Home)} className="mr-4 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-xl font-bold">Create a Campaign</h1>
            </div>

            <div className="p-4">
                <AnimatePresence mode="wait">
                    {renderStep()}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CampaignPage;
