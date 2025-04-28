'use server';
/**
 * @fileOverview A motivational anime quote generator for the LevelUp Earth application.
 *
 * - getMotivationalQuote - A function that retrieves a motivational anime-style quote.
 * - MotivationalQuoteInput - The input type for the getMotivationalQuote function.
 * - MotivationalQuoteOutput - The return type for the getMotivationalQuote function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const MotivationalQuoteInputSchema = z.object({
  userClass: z
    .string()
    .describe("The user's class (Warrior, Scholar, Tycoon) to tailor the quote."),
  missionType: z
    .string()
    .describe("The type of mission (Fitness, Knowledge, Wealth) the quote should relate to."),
  missionDescription: z
    .string()
    .optional()
    .describe('A description of the mission to provide more context for the quote.'),
});
export type MotivationalQuoteInput = z.infer<typeof MotivationalQuoteInputSchema>;

const MotivationalQuoteOutputSchema = z.object({
  quote: z.string().describe('A motivational anime-style quote.'),
});
export type MotivationalQuoteOutput = z.infer<typeof MotivationalQuoteOutputSchema>;

export async function getMotivationalQuote(input: MotivationalQuoteInput): Promise<MotivationalQuoteOutput> {
  return motivationalAnimeQuotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationalAnimeQuotesPrompt',
  input: {
    schema: z.object({
      userClass: z
        .string()
        .describe("The user's class (Warrior, Scholar, Tycoon) to tailor the quote."),
      missionType: z
        .string()
        .describe("The type of mission (Fitness, Knowledge, Wealth) the quote should relate to."),
      missionDescription: z
        .string()
        .optional()
        .describe('A description of the mission to provide more context for the quote.'),
    }),
  },
  output: {
    schema: z.object({
      quote: z.string().describe('A motivational anime-style quote.'),
    }),
  },
  prompt: `You are an AI mentor in a futuristic, anime-inspired game called LevelUp Earth. Your role is to provide motivational anime-style quotes to users based on their class and suggested missions.

User Class: {{{userClass}}}
Mission Type: {{{missionType}}}
{{#if missionDescription}}
Mission Description: {{{missionDescription}}}
{{/if}}

Generate a quote that is relevant to the user's class and mission type. The quote should be inspirational and encouraging, in the style of a classic anime character. Keep the quote short and impactful.

Quote:`,
});

const motivationalAnimeQuotesFlow = ai.defineFlow<
  typeof MotivationalQuoteInputSchema,
  typeof MotivationalQuoteOutputSchema
>(
  {
    name: 'motivationalAnimeQuotesFlow',
    inputSchema: MotivationalQuoteInputSchema,
    outputSchema: MotivationalQuoteOutputSchema,
  },
  async input => {
    const maxRetries = 3;
    let retryCount = 0;
    let delay = 1000; // Initial delay of 1 second

    while (retryCount <= maxRetries) {
      try {
        const {output} = await prompt(input);
        return output!;
      } catch (error: any) {
        if (error.message.includes('The model is overloaded')) {
          console.warn(`Model overloaded. Retry attempt ${retryCount + 1} of ${maxRetries}. Delay: ${delay}ms`);
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        } else {
          // If it's a different error, re-throw it
          throw error;
        }
      }
    }

    // If all retries failed, throw an error
    throw new Error('Failed to get a motivational quote after multiple retries due to model overload.');
  }
);
