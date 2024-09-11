"use client"

import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPEN_API_KEY // This is the default and can be omitted
});



export const handlePlayerAction = action({
  args: { message: v.string(), userId: v.id("user_profiles") },
  handler: async (ctx, args) => {
    const chatCompletion = await client.chat.completions.create({
    messages: [{ role: 'user', content: args.message }],
    model: 'gpt-3.5-turbo',
    });

    const response = chatCompletion.choices[0].message.content ?? "";
    const input = args.message;
    const userId = args.userId;
    
    await ctx.runMutation(api.chat.insertEntry, { input, response, userId });

    return chatCompletion;
  },
  });


  export const insertEntry = mutation(
    {
      args: { input: v.string(), response: v.string(), userId: v.id("user_profiles") },
      handler: async (ctx, args) => {
        await ctx.db.insert("entries", {
          input: args.input,
          response: args.response,
          userId: args.userId,
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
  
export const getUserEntry = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const entries = await ctx.db.query('entries').filter((q) => q.eq(q.field("userId"), args.userId)).collect();
    return entries;
  },
});