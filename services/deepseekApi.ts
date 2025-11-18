
// This file simulates the DeepSeek API for lyrics and text generation.
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

    // In a real application, you'd make a fetch call here to the DeepSeek API
    
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

/**
 * Simulates generating a song description from a prompt using the DeepSeek API.
 * @param prompt - A prompt for the description.
 * @returns A promise that resolves to the generated description as a string.
 */
export const generateDescription = async (prompt: string): Promise<string> => {
    console.log(`[DeepSeek API] Request to generate description for prompt: "${prompt}"`);

    if (!env.DEEPSEEK_API_KEY || env.DEEPSEEK_API_KEY === "YOUR_DEEPSEEK_API_KEY_HERE") {
        console.warn("[DeepSeek API] No API Key found. Returning mock data.");
        await new Promise(resolve => setTimeout(resolve, 1000));
        return "A high-energy track blending traditional Cameroonian rhythms with modern Afro-pop vibes, perfect for the dancefloor.";
    }

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simple heuristic to return different mock descriptions based on input keywords
    if (prompt.toLowerCase().includes("makossa")) {
        return "A vibrant Makossa track featuring groovy basslines, bright brass sections, and an infectious rhythmic drive characteristic of Douala.";
    } else if (prompt.toLowerCase().includes("bikutsi")) {
        return "A fast-paced Bikutsi anthem with intense balafon-style guitar riffs and a stomping 6/8 percussion beat.";
    }
    
    return "A soulful and melodic composition that fuses contemporary sounds with authentic local instruments, creating a unique sonic landscape.";
};
