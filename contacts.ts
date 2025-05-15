import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    serviceAreaType: v.union(
      v.literal("city"),
      v.literal("county"),
      v.literal("state")
    ),
    serviceAreaValue: v.string(),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const location = await ctx.runAction(api.geocoding.geocodeAddress, {
      address: args.serviceAreaValue,
    });

    const contactId: Id<"contacts"> = await ctx.db.insert("contacts", {
      ...args,
      userId,
      location,
    });
    return contactId;
  },
});

export const search = query({
  args: { searchQuery: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    if (!args.searchQuery) {
      return await ctx.db
        .query("contacts")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
    }

    return await ctx.db
      .query("contacts")
      .withSearchIndex("search", (q) => 
        q.search("name", args.searchQuery)
      )
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});
