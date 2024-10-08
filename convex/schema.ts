import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  entries: defineTable({
    input: v.string(),
    response: v.string(),
    userId: v.id("user_profiles"),
  }),
    user_profiles: defineTable({
        jobTitle: v.string(),
        difficulty: v.string(),
    }),
});