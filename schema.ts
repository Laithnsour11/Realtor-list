import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  contacts: defineTable({
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
    location: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
      })
    ),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .searchIndex("search", {
      searchField: "name",
      filterFields: ["email", "phone", "serviceAreaValue", "notes"],
    }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
