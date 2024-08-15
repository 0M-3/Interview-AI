import { v } from "convex/values";
import { mutation } from "./_generated/server";

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
        return id;
    },
});