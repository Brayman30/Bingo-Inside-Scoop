import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  clubSubmissions: defineTable({
    clubName: v.string(),
    description: v.string(),
    submitterName: v.string(),
    submitterEmail: v.string(),
    submitterSchoolEmail: v.string(),
    approved: v.boolean(),
    featured: v.boolean(),
  }).index("by_approved", ["approved"])
    .index("by_club_name", ["clubName"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
