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
  handler: async (ctx, args): Promise<OpenAI.Chat.Completions.ChatCompletion> => {
    const entries = await ctx.runQuery(api.chat.getUserEntry, { userId: args.userId });
    const prefix = entries.map((entry: { input: string; response: string }) => {
      return `${entry.input}\n\n${entry.response}\n\n`;
    }).join("\n\n");
    const suffix = "\nPlease continue the interview by asking me the next question. Do not answer the questions you have asked me.";
    const context = "Following are the questions and answers from our interview which have already been conducted:\n"
    const userInput = args.message;
    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: `${prefix}${context}${userInput}${suffix}` }],
      model: 'gpt-3.5-turbo',
    });
    const response = chatCompletion.choices[0].message.content ?? "";
    const input = args.message;
    const userId = args.userId;
    console.log(`${prefix}${context}${userInput}${suffix}`);
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