
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Song, Page } from '../types';
import { BellIcon, EditIcon, UploadIcon, CreateWithAIIcon, MoreIcon, FilterIcon } from '../components/icons';
import UploadSongModal from '../components/UploadSongModal';
import AudioPlayer from '../components/AudioPlayer';
import { GoogleGenAI, Modality } from '@google/genai';
import { generateMusic } from '../services/kieApi';

const mockSongs: Song[] = [
  { id: '1', title: 'Life in the Ghetto', description: 'Describe the style of your song', coverArt: 'https://picsum.photos/seed/song1/100/100', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '2', title: 'Makossa Feelings', description: 'Upbeat and vibrant track', coverArt: 'https://picsum.photos/seed/song2/100/100', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
];

const GENRES = ["Makossa", "Bikutsi", "Afrobeat", "Njang", "Ambas-Gida"];
type Mode = 'Instrumental' | 'Lyrics';
type CreateView = 'hub' | 'ai_creation';

interface CreatePageProps {
  playSong: (song: Song) => void;
  setActivePage: (page: Page) => void;
}

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


const AICreationView: React.FC<{ onBack: () => void; playSong: (song: Song) => void }> = ({ onBack, playSong }) => {
    const [mode, setMode] = useState<Mode>('Lyrics');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [lyrics, setLyrics] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedSong, setGeneratedSong] = useState<Song | null>(null);
    const [isLoadingText, setIsLoadingText] = useState(false);
    const [isEditingCover, setIsEditingCover] = useState(false);
    const [coverPrompt, setCoverPrompt] = useState('');

    const resetForm = () => {
        setGeneratedSong(null);
        setTitle('');
        setDescription('');
        setLyrics('');
    };

     const generateWithAI = useCallback(async (field: 'description' | 'lyrics') => {
        setIsLoadingText(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            let prompt = '';
            if (field === 'description') {
                prompt = `Generate a short, vibrant song description for a Cameroonian song titled "${title || 'Untitled'}".`;
            } else if (field === 'lyrics') {
                prompt = `Generate song lyrics for a Cameroonian ${description || 'afrobeat'} song titled "${title || 'Untitled'}". The lyrics should be in English, with some Cameroonian Pidgin English phrases.`;
            }

            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt });
            const text = response.text.trim().replace(/^"|"$/g, '');
            
            if (field === 'description') setDescription(text);
            if (field === 'lyrics') setLyrics(text);

        } catch (error) {
            console.error("Error generating text with AI:", error);
            alert("Failed to generate text. Please check your API key and try again.");
        } finally {
            setIsLoadingText(false);
        }
    }, [title, description]);

    const handleGenreSelect = async (genre: string) => {
        setIsLoadingText(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Generate a one-sentence, evocative musical style description for a song in the Cameroonian genre of "${genre}".`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setDescription(response.text.trim());
        } catch (error) {
            console.error("Error generating genre description:", error);
        } finally {
            setIsLoadingText(false);
        }
    };
    
    const generateCoverArt = async (artPrompt: string) => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: artPrompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
            return 'https://picsum.photos/seed/default/512/512';
        } catch (error) {
            console.error("Error generating cover art:", error);
            return 'https://picsum.photos/seed/error/512/512';
        }
    };

    const handleGenerateMusic = async () => {
        setIsGenerating(true);
        setGeneratedSong(null);
        
        const audioUrl = await generateMusic({
            prompt: `${title} - ${description}`,
            durationInSeconds: 210 // 3.5 minutes
        });

        const artPrompt = `Vibrant, abstract album cover for a song titled "${title}" described as "${description}". Modern Cameroonian art style.`;
        setCoverPrompt(artPrompt);
        const coverArtUrl = await generateCoverArt(artPrompt);

        setGeneratedSong({
            id: Date.now().toString(),
            title: title || "Untitled Masterpiece",
            description: description,
            src: audioUrl,
            coverArt: coverArtUrl,
        });

        setIsGenerating(false);
    };
    
     const handleRegenerateCover = async () => {
         if (!generatedSong || !coverPrompt) return;
         setIsLoadingText(true);
         const newCover = await generateCoverArt(coverPrompt);
         setGeneratedSong(prev => prev ? { ...prev, coverArt: newCover } : null);
         setIsLoadingText(false);
         setIsEditingCover(false);
    }

    return (
        <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 bg-brand-dark z-10 overflow-y-auto"
            style={{ background: 'radial-gradient(circle at top, #B91D7330, #0A0F0D 50%)' }}
        >
             <div className="flex items-center p-4">
                <button onClick={onBack} className="mr-4 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="text-xl font-bold">Create with AI</h2>
            </div>
             <div className="p-4 pb-40">
                 {isGenerating && (
                    <div className="flex flex-col items-center justify-center my-8">
                        <div className="relative w-32 h-32">
                             <div className="absolute inset-0 bg-brand-pink rounded-full opacity-20 animate-ping"></div>
                             <div className="relative w-32 h-32 bg-brand-pink/30 rounded-full flex items-center justify-center">
                                <div className="w-20 h-20 bg-brand-pink rounded-full"></div>
                             </div>
                        </div>
                        <p className="mt-4 text-white font-semibold animate-pulse">Generating your masterpiece...</p>
                    </div>
                )}
                
                {!isGenerating && generatedSong && (
                     <div className="my-4 text-center">
                        <h2 className="text-2xl font-bold mb-4">Your Track is Ready!</h2>
                        <div className="relative w-64 h-64 mx-auto rounded-xl shadow-lg mb-4">
                            <img src={generatedSong.coverArt} alt="Generated Cover Art" className="w-full h-full object-cover rounded-xl"/>
                            <button onClick={() => setIsEditingCover(true)} className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80">
                                <EditIcon className="w-5 h-5"/>
                            </button>
                        </div>
                        <AudioPlayer src={generatedSong.src} />
                         <div className="flex items-center space-x-4 mt-6">
                            <button onClick={resetForm} className="w-full bg-brand-gray py-3 rounded-full font-bold">Create More</button>
                            <button onClick={() => playSong(generatedSong)} className="w-full bg-brand-pink text-white py-3 rounded-full font-bold">Play Song</button>
                        </div>
                    </div>
                )}

                {!isGenerating && !generatedSong && (
                    <>
                        <div className="bg-brand-card p-1 rounded-full flex items-center max-w-sm mx-auto mb-8">
                            <button onClick={() => setMode('Instrumental')} className={`w-1/2 py-2 rounded-full text-sm font-bold transition-colors ${mode === 'Instrumental' ? 'bg-brand-pink text-white' : 'text-brand-light-gray'}`}>Instrumental</button>
                            <button onClick={() => setMode('Lyrics')} className={`w-1/2 py-2 rounded-full text-sm font-bold transition-colors ${mode === 'Lyrics' ? 'bg-brand-pink text-white' : 'text-brand-light-gray'}`}>Lyrics</button>
                        </div>
                        <div className="space-y-6">
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add your Song's Title" className="w-full bg-brand-card text-white placeholder-brand-light-gray p-4 rounded-lg border-2 border-transparent focus:border-brand-pink focus:outline-none"/>
                            <div className="bg-brand-card p-4 rounded-lg">
                                <label className="text-white font-bold">Song Description</label>
                                <p className="text-sm text-brand-light-gray mb-2">Type your style and generate quality tracks</p>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-transparent text-white focus:outline-none resize-none"/>
                                <div className="text-right"><button onClick={() => generateWithAI('description')} disabled={isLoadingText} className="text-brand-pink font-bold text-sm hover:text-red-400 disabled:opacity-50">Auto-generate</button></div>
                            </div>
                             {mode === 'Lyrics' && (
                                <div className="bg-brand-card p-4 rounded-lg">
                                    <label className="text-white font-bold">Lyrics</label>
                                    <p className="text-sm text-brand-light-gray mb-2">Type your lyrics</p>
                                    <textarea value={lyrics} onChange={(e) => setLyrics(e.target.value)} rows={6} className="w-full bg-transparent text-white focus:outline-none resize-none"/>
                                    <div className="text-right"><button onClick={() => generateWithAI('lyrics')} disabled={isLoadingText} className="text-brand-pink font-bold text-sm hover:text-red-400 disabled:opacity-50">Auto-generate Lyrics</button></div>
                                </div>
                             )}
                            <div>
                                <label className="text-white font-bold mb-2 block">Genre</label>
                                <div className="flex flex-wrap gap-2">{GENRES.map(genre => (<button key={genre} onClick={() => handleGenreSelect(genre)} disabled={isLoadingText} className="bg-brand-card text-white px-3 py-1 rounded-full text-sm hover:bg-brand-gray transition-colors disabled:opacity-50">{genre}</button>))}</div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {!generatedSong && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-brand-dark/80 backdrop-blur-sm border-t border-brand-gray/20">
                    <button onClick={handleGenerateMusic} disabled={isGenerating || isLoadingText || !title} className="w-full bg-brand-pink text-white font-bold py-4 rounded-full text-lg disabled:bg-brand-gray disabled:cursor-not-allowed">
                        {isGenerating ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            )}
            
            <AnimatePresence>
                {isEditingCover && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-brand-card p-6 rounded-xl w-full max-w-sm">
                            <h3 className="font-bold text-lg mb-4">Edit Cover Art Prompt</h3>
                            <textarea value={coverPrompt} onChange={(e) => setCoverPrompt(e.target.value)} rows={4} className="w-full bg-brand-dark text-white p-3 rounded-lg border-2 border-brand-gray focus:border-brand-pink focus:outline-none resize-none"/>
                            <div className="flex items-center space-x-4 mt-4">
                                <button onClick={() => setIsEditingCover(false)} className="w-full bg-brand-gray py-2 rounded-full font-bold">Cancel</button>
                                <button onClick={handleRegenerateCover} disabled={isLoadingText} className="w-full bg-brand-pink text-white py-2 rounded-full font-bold disabled:opacity-50">{isLoadingText ? '...' : 'Regenerate'}</button>
                            </div>
                        </motion.div>
                     </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

const CreatePage: React.FC<CreatePageProps> = ({ playSong, setActivePage }) => {
    const [view, setView] = useState<CreateView>('hub');
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);

    if (view === 'ai_creation') {
        return <AICreationView onBack={() => setView('hub')} playSong={playSong} />;
    }

    return (
        <div className="relative min-h-screen overflow-hidden" style={{ background: 'radial-gradient(circle at top, #1DB95430, #0A0F0D 50%)' }}>
            <div className="p-4">
                <h1 className="text-4xl font-extrabold text-white my-6">Create your masterpiece</h1>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button onClick={() => setUploadModalOpen(true)} className="bg-brand-card p-4 rounded-xl flex flex-col items-start space-y-4 hover:bg-brand-card/70 transition-colors duration-200">
                        <div className="p-2 bg-brand-green rounded-full">
                            <UploadIcon className="h-6 w-6 text-brand-dark" />
                        </div>
                        <div className="text-left">
                            <h2 className="font-bold text-white">Upload Song</h2>
                            <p className="text-xs text-brand-light-gray">Publish your existing or new sound</p>
                        </div>
                    </button>
                    <button onClick={() => setView('ai_creation')} className="bg-brand-pink/20 p-4 rounded-xl flex flex-col items-start space-y-4 border border-brand-pink hover:bg-brand-pink/30">
                        <div className="p-2 bg-brand-pink rounded-full">
                            <CreateWithAIIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                            <h2 className="font-bold text-white">Create with AI</h2>
                            <p className="text-xs text-brand-light-gray">Generate a new track with AI assistance</p>
                        </div>
                    </button>
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

export default CreatePage;
