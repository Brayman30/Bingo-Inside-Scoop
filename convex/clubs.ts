import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitClub = mutation({
  args: {
    clubName: v.string(),
    description: v.optional(v.string()),
    submitterName: v.string(),
    submitterEmail: v.string(),
    submitterSchoolEmail: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if club already exists (case-insensitive)
    const existingClub = await ctx.db
      .query("clubSubmissions")
      .withIndex("by_club_name", (q) => q.eq("clubName", args.clubName.trim()))
      .first();

    if (existingClub) {
      throw new Error(`The club "${args.clubName}" has already been submitted.`);
    }

    await ctx.db.insert("clubSubmissions", {
      clubName: args.clubName.trim(),
      description: (args.description ?? "").trim(),
      submitterName: args.submitterName.trim(),
      submitterEmail: args.submitterEmail.trim(),
      submitterSchoolEmail: args.submitterSchoolEmail.trim(),
      approved: true, // Auto-approve for now
      featured: false,
    });
    return { success: true };
  },
});

export const submitMultipleClubs = mutation({
  args: {
    clubs: v.array(v.object({
      clubName: v.string(),
      description: v.optional(v.string()),
    })),
    submitterName: v.string(),
    submitterEmail: v.string(),
    submitterSchoolEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const results = [];
    const errors = [];

    for (const club of args.clubs) {
      try {
        // Check if club already exists (case-insensitive)
        const existingClub = await ctx.db
          .query("clubSubmissions")
          .withIndex("by_club_name", (q) => q.eq("clubName", club.clubName.trim()))
          .first();

        if (existingClub) {
          errors.push(`The club "${club.clubName}" has already been submitted.`);
          continue;
        }

        await ctx.db.insert("clubSubmissions", {
          clubName: club.clubName.trim(),
          description: (club.description ?? "").trim(),
          submitterName: args.submitterName.trim(),
          submitterEmail: args.submitterEmail.trim(),
          submitterSchoolEmail: args.submitterSchoolEmail.trim(),
          approved: true, // Auto-approve for now
          featured: false,
        });
        results.push(club.clubName);
      } catch (error) {
        errors.push(`Failed to submit "${club.clubName}": ${error}`);
      }
    }

    return { 
      success: results.length > 0,
      submitted: results,
      errors: errors,
      totalSubmitted: results.length
    };
  },
});

export const getAllClubs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("clubSubmissions")
      .order("desc") // Most recent first
      .collect();
  },
});

export const getClubsCount = query({
  args: {},
  handler: async (ctx) => {
    const clubs = await ctx.db.query("clubSubmissions").collect();
    return clubs.length;
  },
});
