
import React, { useState, useCallback } from 'react';
import { BellIcon } from '../components/icons';
import AudioPlayer from '../components/AudioPlayer';
import { GoogleGenAI } from '@google/genai';

const GENRES = ["Makossa", "Bikutsi", "Afrobeat", "Njang", "Ambas-Gida"];

type Mode = 'Instrumental' | 'Lyrics';

const Header: React.FC = () => (
    <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-3">
            <img src="https://picsum.photos/seed/avatar/40/40" alt="User Avatar" className="w-10 h-10 rounded-full"/>
        </div>
        <button className="relative text-brand-light-gray">
            <BellIcon className="h-6 w-6"/>
        </button>
    </div>
);


const CreatePage: React.FC = () => {
    const [mode, setMode] = useState<Mode>('Lyrics');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [lyrics, setLyrics] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
    const [isLoadingText, setIsLoadingText] = useState(false);
    
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
            const text = response.text;
            
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

    const handleGenerateMusic = () => {
        setIsGenerating(true);
        setGeneratedAudio(null);
        // Simulate SUNO API call
        setTimeout(() => {
            // In a real app, this URL would come from the API
            setGeneratedAudio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
            setIsGenerating(false);
        }, 5000);
    };

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
                
                {!isGenerating && generatedAudio && (
                     <div className="my-8">
                        <h2 className="text-center text-2xl font-bold mb-4">Your Track is Ready!</h2>
                        <AudioPlayer src={generatedAudio} />
                    </div>
                )}

                {!isGenerating && !generatedAudio && (
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
                                        <button key={genre} onClick={() => setDescription(prev => prev ? `${prev}, ${genre}`: genre)} className="bg-brand-card text-white px-3 py-1 rounded-full text-sm hover:bg-brand-gray transition-colors">
                                            {genre}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </div>

            <div className="fixed bottom-24 left-0 right-0 p-4">
                 <button 
                    onClick={handleGenerateMusic}
                    disabled={isGenerating}
                    className="w-full bg-brand-green text-black font-bold py-4 rounded-full text-lg hover:bg-brand-green-dark transition-transform duration-200 ease-in-out active:scale-95 disabled:bg-brand-gray disabled:cursor-not-allowed">
                     {isGenerating ? 'Generating...' : 'Generate'}
                 </button>
            </div>
        </div>
    );
};

export default CreatePage;
