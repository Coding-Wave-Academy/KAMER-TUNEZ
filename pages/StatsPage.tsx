
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { ChartData } from '../types';
import { GoogleGenAI } from '@google/genai';

const mockStreams: ChartData[] = [
  { name: 'Mon', value: 2400 },
  { name: 'Tue', value: 1398 },
  { name: 'Wed', value: 9800 },
  { name: 'Thu', value: 3908 },
  { name: 'Fri', value: 4800 },
  { name: 'Sat', value: 3800 },
  { name: 'Sun', value: 4300 },
];

const mockDemographics: ChartData[] = [
  { name: 'Cameroon', value: 400 },
  { name: 'Nigeria', value: 300 },
  { name: 'France', value: 200 },
  { name: 'USA', value: 100 },
];
const COLORS = ['#1ED760', '#1DB954', '#158c42', '#0d5d2a'];


const StatsPage: React.FC = () => {
    const [insights, setInsights] = useState('');
    const [isLoadingInsights, setIsLoadingInsights] = useState(true);

    const fetchInsights = async () => {
        setIsLoadingInsights(true);
        const dataSummary = {
            weeklyStreams: mockStreams.reduce((acc, cur) => acc + cur.value, 0),
            topCountry: mockDemographics[0].name,
            streamsData: mockStreams,
            demographicsData: mockDemographics
        };
        const prompt = `
            As an expert music industry analyst for a Cameroonian artist, analyze the following data and provide actionable insights.
            The response should be concise, mobile-friendly, and use markdown for formatting (bolding, lists).

            Data:
            - Total weekly streams: ${dataSummary.weeklyStreams}
            - Top listening country: ${dataSummary.topCountry}
            - Daily streams breakdown: ${JSON.stringify(dataSummary.streamsData)}
            - Listener demographics by country: ${JSON.stringify(dataSummary.demographicsData)}

            Provide:
            1.  **Summary**: A quick overview of the week's performance.
            2.  **Key Insights**: 2-3 bullet points on what the data means (e.g., peak days, audience concentration).
            3.  **Growth Plan**: 2-3 actionable suggestions for the artist to grow their audience based on this data.
        `;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setInsights(response.text);
        } catch (error) {
            console.error("Error fetching AI insights:", error);
            setInsights("Could not load AI insights. Please check your connection or API key.");
        } finally {
            setIsLoadingInsights(false);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, []);

    return (
        <div className="p-4" style={{ background: 'radial-gradient(circle at top, #1DB95430, #0A0F0D 50%)' }}>
            <h1 className="text-3xl font-bold text-white my-4">Your Stats</h1>
            
            <div className="bg-brand-card p-4 rounded-xl mb-6">
                <h2 className="font-bold text-white mb-2">Weekly Streams</h2>
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <BarChart data={mockStreams} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="#B3B3B3" fontSize={12} />
                            <YAxis stroke="#B3B3B3" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#1A221F', border: 'none', borderRadius: '8px' }}/>
                            <Bar dataKey="value" fill="#1ED760" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-brand-card p-4 rounded-xl mb-6">
                <h2 className="font-bold text-white mb-2">Listener Demographics</h2>
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <PieChart>
                             <Pie data={mockDemographics} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {mockDemographics.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1A221F', border: 'none', borderRadius: '8px' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-brand-card p-4 rounded-xl">
                <h2 className="font-bold text-white mb-2">AI Growth Coach</h2>
                {isLoadingInsights ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-brand-gray rounded w-1/4"></div>
                        <div className="h-3 bg-brand-gray rounded w-full"></div>
                        <div className="h-3 bg-brand-gray rounded w-5/6"></div>
                         <div className="h-4 bg-brand-gray rounded w-1/3 mt-4"></div>
                        <div className="h-3 bg-brand-gray rounded w-full"></div>
                        <div className="h-3 bg-brand-gray rounded w-4/6"></div>
                    </div>
                ) : (
                    <div className="prose prose-invert prose-sm text-brand-light-gray" dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}/>
                )}
            </div>
        </div>
    );
};

export default StatsPage;
