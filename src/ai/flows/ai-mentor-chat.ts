
'use server';

/**
 * @fileOverview AI-powered chat flow for personalized user assistance.
 *
 * - getChatResponse - A function that retrieves a response to a user's message.
 * - ChatInput - The input type for the getChatResponse function, including the user's message.
 * - ChatOutput - The return type for the getChatResponse function, containing the AI's response.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  message: z.string().describe('The user message to respond to.'),
  userClass: z.string().describe("The user's class (Warrior, Scholar, Tycoon) to tailor the response."),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI-generated response to the user message.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function getChatResponse(input: ChatInput): Promise<ChatOutput> {
  return aiMentorChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiMentorChatPrompt',
  input: {
    schema: z.object({
      message: z.string().describe('The user message to respond to.'),
      userClass: z.string().describe("The user's class (Warrior, Scholar, Tycoon) to tailor the response."),
    }),
  },
  output: {
    schema: z.object({
      response: z.string().describe('The AI-generated response to the user message.'),
    }),
  },
  prompt: `You are an AI mentor in a futuristic, anime-inspired game called LevelUp Earth. Your role is to provide helpful and engaging responses to users.

User Class: {{{userClass}}}
User Message: {{{message}}}

Respond to the user's message in a helpful and engaging way.
`,
});

const aiMentorChatFlow = ai.defineFlow<typeof ChatInputSchema, typeof ChatOutputSchema>(
  {
    name: 'aiMentorChatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return { response: output?.response || '' };
  }
);
