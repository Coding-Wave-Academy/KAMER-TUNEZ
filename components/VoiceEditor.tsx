import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MicIcon, RecordIcon, VolumeIcon, PlayCircleIcon, PauseCircleIcon } from './icons';

interface VoiceEditorProps {
    instrumentalUrl: string;
    onClose: () => void;
    onSave: (mixedAudioBlob: Blob) => void;
}

type RecordingState = 'idle' | 'recording' | 'recorded';
type PlaybackState = 'playing' | 'paused';

const VoiceEditor: React.FC<VoiceEditorProps> = ({ instrumentalUrl, onClose, onSave }) => {
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const [playbackState, setPlaybackState] = useState<PlaybackState>('paused');
    const [error, setError] = useState<string | null>(null);

    const instrumentalAudioRef = useRef<HTMLAudioElement>(null);
    const vocalsAudioRef = useRef<HTMLAudioElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const [instrumentalVolume, setInstrumentalVolume] = useState(0.7);
    const [vocalsVolume, setVocalsVolume] = useState(1.0);

    useEffect(() => {
        if (instrumentalAudioRef.current) instrumentalAudioRef.current.volume = instrumentalVolume;
    }, [instrumentalVolume]);

    useEffect(() => {
        if (vocalsAudioRef.current) vocalsAudioRef.current.volume = vocalsVolume;
    }, [vocalsVolume]);
    
    const cleanup = useCallback(() => {
        mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
    }, []);

    useEffect(() => {
        return cleanup;
    }, [cleanup]);

    const startRecording = async () => {
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = event => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                if (vocalsAudioRef.current) vocalsAudioRef.current.src = audioUrl;
                setRecordingState('recorded');
                cleanup();
            };

            mediaRecorderRef.current.start();
            setRecordingState('recording');
            if (instrumentalAudioRef.current) {
                instrumentalAudioRef.current.currentTime = 0;
                instrumentalAudioRef.current.play();
            }

        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError("Microphone access denied. Please enable it in your browser settings.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recordingState === 'recording') {
            mediaRecorderRef.current.stop();
            if (instrumentalAudioRef.current) instrumentalAudioRef.current.pause();
        }
    };
    
    const togglePlayback = () => {
        const instrumental = instrumentalAudioRef.current;
        const vocals = vocalsAudioRef.current;
        if (!instrumental || !vocals) return;
        
        if (playbackState === 'paused') {
            instrumental.play();
            vocals.play();
            setPlaybackState('playing');
        } else {
            instrumental.pause();
            vocals.pause();
            setPlaybackState('paused');
        }
    };
    
    const handleSave = () => {
        // NOTE: True audio mixing on the client-side requires the Web Audio API and is complex.
        // This is a simplified "save" that just saves the vocal track.
        // A real implementation would merge the two audio sources.
        if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            onSave(audioBlob);
        } else {
            alert("No vocals recorded to save!");
        }
    };
    
    const handleReset = () => {
        setRecordingState('idle');
        setPlaybackState('paused');
        if (instrumentalAudioRef.current) instrumentalAudioRef.current.currentTime = 0;
        if (vocalsAudioRef.current) vocalsAudioRef.current.src = '';
    }

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-brand-card w-full max-w-sm p-6 rounded-2xl relative text-white"
            >
                <audio ref={instrumentalAudioRef} src={instrumentalUrl} preload="auto" loop={false} />
                <audio ref={vocalsAudioRef} preload="auto" loop={false} />

                <h2 className="text-xl font-bold text-center mb-4">Voice & Song Editor</h2>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                
                <div className="space-y-4 my-6">
                     <div className="flex items-center space-x-3">
                        <VolumeIcon className="w-5 h-5 text-brand-light-gray"/>
                        <span className="text-sm w-24">Instrumental</span>
                        <input type="range" min="0" max="1" step="0.01" value={instrumentalVolume} onChange={e => setInstrumentalVolume(parseFloat(e.target.value))} className="w-full"/>
                    </div>
                    <div className="flex items-center space-x-3">
                        <MicIcon className="w-5 h-5 text-brand-light-gray"/>
                        <span className="text-sm w-24">Vocals</span>
                        <input type="range" min="0" max="1" step="0.01" value={vocalsVolume} onChange={e => setVocalsVolume(parseFloat(e.target.value))} className="w-full" disabled={recordingState !== 'recorded'}/>
                    </div>
                </div>

                <div className="flex justify-center items-center space-x-4 my-8">
                     {recordingState === 'recorded' && (
                        <button onClick={togglePlayback} className="w-16 h-16">
                            {playbackState === 'paused' ? <PlayCircleIcon className="text-brand-green w-full h-full"/> : <PauseCircleIcon className="text-brand-green w-full h-full"/>}
                        </button>
                    )}
                    {recordingState !== 'recorded' && (
                         <button onClick={recordingState === 'recording' ? stopRecording : startRecording} className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center transition-transform duration-200 active:scale-90">
                            {recordingState === 'recording' ? 
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-8 h-8 bg-white rounded-md"/> : 
                                <RecordIcon className="w-8 h-8 text-white"/>}
                         </button>
                    )}
                </div>
                <p className="text-center text-brand-gray text-sm h-6">
                    {recordingState === 'idle' && "Press the button to record your vocals"}
                    {recordingState === 'recording' && "Recording..."}
                    {recordingState === 'recorded' && "Preview your mix"}
                </p>


                <div className="flex items-center space-x-4 mt-6">
                    <button onClick={recordingState === 'recorded' ? handleReset : onClose} className="w-full bg-brand-gray py-3 rounded-full font-bold">{recordingState === 'recorded' ? "Record Again" : "Cancel"}</button>
                    <button onClick={handleSave} disabled={recordingState !== 'recorded'} className="w-full bg-brand-green text-black py-3 rounded-full font-bold disabled:bg-brand-gray">Save Masterpiece</button>
                </div>

            </motion.div>
        </motion.div>
    );
};

export default VoiceEditor;
