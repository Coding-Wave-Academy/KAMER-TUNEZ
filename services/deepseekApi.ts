// This file simulates the DeepSeek API for lyrics generation.
import * as env from './env';

const API_BASE_URL = 'https://api.deepseek.com/v1';

/**
 * Simulates generating lyrics from a prompt using the DeepSeek API.
 * @param prompt - A description of the desired lyrics.
 * @returns A promise that resolves to the generated lyrics as a string.
 */
export const generateLyrics = async (prompt: string): Promise<string> => {
    console.log(`[DeepSeek API] Request to generate lyrics for prompt: "${prompt}"`);

    if (!env.DEEPSEEK_API_KEY || env.DEEPSEEK_API_KEY === "YOUR_DEEPSEEK_API_KEY_HERE") {
        console.warn("[DeepSeek API] No API Key found. Returning mock data.");
        await new Promise(resolve => setTimeout(resolve, 1500));
        return `(Verse 1)
Sunlight on the Douala coast, yeah
Marketplace hustle, we do the most
From the mountains of Bamenda high
To the city lights under the sky

(Chorus)
Oh, Cameroon, my sweet country
Your rhythm lives inside of me
From Makossa beat to Bikutsi sway
We celebrate life every day.`;
    }

    // In a real application, you'd make a fetch call here:
    /*
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "You are a songwriter specializing in Cameroonian music styles." },
                { role: "user", content: `Generate song lyrics for a song described as: ${prompt}. Include some Cameroonian Pidgin English.` }
            ]
        })
    });
    const data = await response.json();
    return data.choices[0].message.content;
    */
    
    // For now, return mock data.
    await new Promise(resolve => setTimeout(resolve, 1500));
     return `(Verse 1)
Sunlight on the Douala coast, yeah
Marketplace hustle, we do the most
From the mountains of Bamenda high
To the city lights under the sky

(Chorus)
Oh, Cameroon, my sweet country
Your rhythm lives inside of me
From Makossa beat to Bikutsi sway
We celebrate life every day.`;
};
