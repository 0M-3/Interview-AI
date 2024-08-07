import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPEN_API_KEY // This is the default and can be omitted
});



export const handlePlayerAction = action({
  args: { message: v.string()},
  handler: async (ctx, args) => {
    const chatCompletion = await client.chat.completions.create({
    messages: [{ role: 'user', content: args.message }],
    model: 'gpt-3.5-turbo',
    });

    console.log(chatCompletion);
    return chatCompletion;
  },
  });