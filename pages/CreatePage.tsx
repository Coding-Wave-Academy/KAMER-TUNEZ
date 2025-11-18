
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellIcon, EditIcon } from '../components/icons';
import AudioPlayer from '../components/AudioPlayer';
import { GoogleGenAI, Modality } from '@google/genai';
import { Song } from '../types';

const GENRES = ["Makossa", "Bikutsi", "Afrobeat", "Njang", "Ambas-Gida"];

type Mode = 'Instrumental' | 'Lyrics';

interface CreatePageProps {
  playSong: (song: Song) => void;
}

const Header: React.FC = () => (
    <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-3">
            <img src="https://picsum.photos/seed/avatar/40/40" alt="User Avatar" className="w-10 h-10 rounded-full"/>
            <div className="bg-brand-card px-3 py-1 rounded-full">
                <p className="text-xs text-brand-light-gray">Generations: <span className="font-bold text-white">5/10</span></p>
            </div>
        </div>
        <button className="relative text-brand-light-gray">
            <BellIcon className="h-6 w-6"/>
        </button>
    </div>
);

const CreatePage: React.FC<CreatePageProps> = ({ playSong }) => {
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
    
    const generateWithAI = useCallback(async (field: 'title' | 'description' | 'lyrics') => {
        setIsLoadingText(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            let prompt = '';
            if (field === 'title') {
                prompt = `Generate a catchy song title for a Cameroonian ${description || 'afrobeat'} song.`;
            } else if (field === 'description') {
                prompt = `Generate a short, vibrant song description for a Cameroonian song titled "${title || 'Untitled'}".`;
            } else if (field === 'lyrics') {
                prompt = `Generate song lyrics for a Cameroonian ${description || 'afrobeat'} song titled "${title || 'Untitled'}". The lyrics should be in English, with some Cameroonian Pidgin English phrases.`;
            }

            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt });
            const text = response.text.trim().replace(/^"|"$/g, '');
            
            if (field === 'title') setTitle(text);
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
            return 'https://picsum.photos/seed/error/512/512'; // Return a fallback image
        }
    };

    const handleGenerateMusic = async () => {
        setIsGenerating(true);
        setGeneratedSong(null);
        
        // Simulate SUNO API call for audio
        await new Promise(resolve => setTimeout(resolve, 3000));
        const audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3';

        // Generate cover art
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
        <div className="min-h-screen" style={{ background: 'radial-gradient(circle at top, #1DB95430, #0A0F0D 50%)' }}>
            <Header />
            <div className="p-4">
                 {isGenerating && (
                    <div className="flex flex-col items-center justify-center my-8">
                        <div className="relative w-32 h-32">
                             <div className="absolute inset-0 bg-brand-green rounded-full opacity-20 animate-ping"></div>
                             <div className="relative w-32 h-32 bg-brand-green/30 rounded-full flex items-center justify-center">
                                <div className="w-20 h-20 bg-brand-green rounded-full"></div>
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
                            <button onClick={resetForm} className="w-full bg-brand-gray py-3 rounded-full font-bold">Create New</button>
                            <button onClick={() => playSong(generatedSong)} className="w-full bg-brand-green text-black py-3 rounded-full font-bold">Play Song</button>
                        </div>
                    </div>
                )}

                {!isGenerating && !generatedSong && (
                    <>
                        <div className="bg-brand-card p-1 rounded-full flex items-center max-w-sm mx-auto mb-8">
                            <button 
                                onClick={() => setMode('Instrumental')}
                                className={`w-1/2 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${mode === 'Instrumental' ? 'bg-brand-green-dark text-white' : 'text-brand-light-gray'}`}
                            >
                                Instrumental
                            </button>
                            <button 
                                onClick={() => setMode('Lyrics')}
                                className={`w-1/2 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${mode === 'Lyrics' ? 'bg-brand-green-dark text-white' : 'text-brand-light-gray'}`}
                            >
                                Lyrics
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Add your Song's Title"
                                className="w-full bg-brand-card text-white placeholder-brand-light-gray p-4 rounded-lg border-2 border-transparent focus:border-brand-green focus:outline-none"
                            />
                            
                            <div className="bg-brand-card p-4 rounded-lg">
                                <label className="text-white font-bold">Song Description</label>
                                <p className="text-sm text-brand-light-gray mb-2">Type your style and generate quality tracks</p>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full bg-transparent text-white focus:outline-none resize-none"
                                />
                                <div className="text-right">
                                    <button onClick={() => generateWithAI('description')} disabled={isLoadingText} className="text-brand-green font-bold text-sm hover:text-brand-green-dark disabled:opacity-50">Auto-generate</button>
                                </div>
                            </div>
                            
                             {mode === 'Lyrics' && (
                                <div className="bg-brand-card p-4 rounded-lg">
                                    <label className="text-white font-bold">Lyrics</label>
                                    <p className="text-sm text-brand-light-gray mb-2">Type your lyrics</p>
                                    <textarea
                                        value={lyrics}
                                        onChange={(e) => setLyrics(e.target.value)}
                                        rows={6}
                                        className="w-full bg-transparent text-white focus:outline-none resize-none"
                                    />
                                    <div className="text-right">
                                        <button onClick={() => generateWithAI('lyrics')} disabled={isLoadingText} className="text-brand-green font-bold text-sm hover:text-brand-green-dark disabled:opacity-50">Auto-generate Lyrics</button>
                                    </div>
                                </div>
                             )}

                            <div>
                                <label className="text-white font-bold mb-2 block">Genre</label>
                                <div className="flex flex-wrap gap-2">
                                    {GENRES.map(genre => (
                                        <button key={genre} onClick={() => handleGenreSelect(genre)} disabled={isLoadingText} className="bg-brand-card text-white px-3 py-1 rounded-full text-sm hover:bg-brand-gray transition-colors disabled:opacity-50">
                                            {genre}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </div>

            {!generatedSong && (
                <div className="fixed bottom-24 left-0 right-0 p-4 bg-brand-dark/50 backdrop-blur-sm">
                    <button 
                        onClick={handleGenerateMusic}
                        disabled={isGenerating || isLoadingText || !title}
                        className="w-full bg-brand-green text-black font-bold py-4 rounded-full text-lg hover:bg-brand-green-dark transition-transform duration-200 ease-in-out active:scale-95 disabled:bg-brand-gray disabled:cursor-not-allowed">
                        {isGenerating ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            )}
             <AnimatePresence>
                {isEditingCover && (
                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                     >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-brand-card p-6 rounded-xl w-full max-w-sm"
                        >
                            <h3 className="font-bold text-lg mb-4">Edit Cover Art Prompt</h3>
                            <textarea
                                value={coverPrompt}
                                onChange={(e) => setCoverPrompt(e.target.value)}
                                rows={4}
                                className="w-full bg-brand-dark text-white p-3 rounded-lg border-2 border-brand-gray focus:border-brand-green focus:outline-none resize-none"
                            />
                            <div className="flex items-center space-x-4 mt-4">
                                <button onClick={() => setIsEditingCover(false)} className="w-full bg-brand-gray py-2 rounded-full font-bold">Cancel</button>
                                <button onClick={handleRegenerateCover} disabled={isLoadingText} className="w-full bg-brand-green text-black py-2 rounded-full font-bold disabled:opacity-50">{isLoadingText ? '...' : 'Regenerate'}</button>
                            </div>
                        </motion.div>
                     </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CreatePage;
