import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    process.env.GOOGLE_GENAI_API_KEY ? googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }) : undefined,
  ].filter(Boolean),
  model: 'googleai/gemini-2.0-flash',
});

