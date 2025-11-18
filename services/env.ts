// This file centralizes access to environment variables.
// In a real build environment (like Vite or Create React App), you would use `import.meta.env.VITE_...`
// or `process.env.REACT_APP_...`.
// For this simple setup, we'll hardcode them here, but read from a conceptual .env file.
// This prevents the app from crashing if the keys are not set.

// PLEASE RENAME .env.example to .env AND PASTE YOUR KEYS THERE
// NOTE: These keys will be publicly visible in your browser's source code.
// This is NOT secure for a production application. Use a backend proxy for real apps.

export const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";
export const DEEPSEEK_API_KEY = "YOUR_DEEPSEEK_API_KEY_HERE";
export const KIE_AI_API_KEY = "YOUR_KIE_AI_API_KEY_HERE";
