import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
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

    const response = chatCompletion.choices[0].message.content ?? "";
    const input = args.message;
    
    await ctx.runMutation(api.chat.insertEntry, { input, response });

    return chatCompletion;
  },
  });


  export const insertEntry = mutation(
    {
      args: { input: v.string(), response: v.string() },
      handler: async (ctx, args) => {
        await ctx.db.insert("entries", {
          input: args.input,
          response: args.response,
        });
      },
    }
  );

export const getAllEntries = query({
  handler: async (ctx) => {
  const entries = await ctx.db.query('entries').collect();
  return entries;
  },
}
)
  