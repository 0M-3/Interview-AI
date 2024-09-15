import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action, internalAction, internalQuery, mutation, query } from "./_generated/server";
import OpenAI from 'openai';
const client = new OpenAI({
  apiKey: process.env.OPEN_API_KEY // This is the default and can be omitted
});


export const createUserProfile = mutation({
    args: {
        jobTitle: v.string(),
        difficulty: v.string(),
},
    
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("user_profiles", {
            jobTitle: args.jobTitle,
            difficulty: args.difficulty,
        });
//      TODO: fire an action which sets up OPENAPI for the user
        ctx.scheduler.runAfter(0, internal.user_profiles.setupUserProfile, { user_profile: id,  });
        return id;

    },
});





export const setupUserProfile = internalAction({
  args: { user_profile: v.id("user_profiles"), },
  handler: async (ctx, args) => {
    const user_id = await ctx.runQuery(internal.user_profiles.getUser, { userId: args.user_profile });

    if (!user_id) {
        throw new Error("User not found");
    }

    const input =`You are an AI Interviewer for ${user_id.jobTitle} role and 
            you are responsible for setting up an interview environment for me in order to determine if I am suitable for the position. 
            You will setup an interview environment for me which will involve asking me questions to determine my
            behavioral, technical and cultural suitability for the role. In order determine this ask me a variety of
            questions until you are satisfied in having quantified my performance.
            During this entire time, please track the blunders I make in answering your questions, I am allowed 3 blunders before
            I fail the interview.
            The interview must have the following structure:
            - A brief opening in which you introduce yourself and ask me to introduce myself.
            - No more than 10 questions can be asked by you to ascertain my competence.
            - Interview must end if I have made 3 blunders.
            - At the end of the interview rate me based upon scores out of scale of 10 in 
            Behavioral, Technical and Cultural suitability. 
            
            Go ahead and setup the interview environment. Begin by asking me the first question.
            ` 
    const chatCompletion = await client.chat.completions.create({
    messages: [{ role: 'user', content: input}],
    model: 'gpt-3.5-turbo',
    });
    const response = chatCompletion.choices[0].message.content ?? "";
    await ctx.runMutation(api.chat.insertEntry, { input, response, userId: user_id._id });

 },
  });


  export const insertEntry = mutation(
    {
      args: { input: v.string(), response: v.string(), user_id: v.id("user_profiles") },
      handler: async (ctx, args) => {
        const id = 
        await ctx.db.insert("entries", {
          input: args.input,
          response: args.response,
          userId: args.user_id,
        });
      },
    }
  );

export const getAllEntries = query({
    args: {
        userId: v.id("user_profiles"),
},
  handler: async (ctx, args) => {
  const entries = await ctx.db.query('entries')
  .filter((q)=> q.eq(q.field("userId"), args.userId))
  .collect();
  return entries;
  },
}
)
  
export const getUser = internalQuery({
    args: {
        userId: v.id("user_profiles"),
},
    
    handler: async (ctx, args) => {
        return await ctx.db.get(args.userId);
    },
});
