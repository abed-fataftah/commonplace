import { z } from "zod";

export const NOTE_LIMITS = {
  titleMax: 120,
  contentMax: 40_000,
  tagMax: 24,
  tagsMax: 8,
} as const;

const title = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(NOTE_LIMITS.titleMax, `Title must be at most ${NOTE_LIMITS.titleMax} characters`);

const content = z
  .string()
  .max(NOTE_LIMITS.contentMax, `Note is too long (max ${NOTE_LIMITS.contentMax} characters)`);

const tag = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Tag cannot be empty")
  .max(NOTE_LIMITS.tagMax, `Tag must be at most ${NOTE_LIMITS.tagMax} characters`)
  .regex(/^[^\s,]+$/, "Tags cannot contain spaces or commas");

const tags = z
  .array(tag)
  .max(NOTE_LIMITS.tagsMax, `A note can have at most ${NOTE_LIMITS.tagsMax} tags`)
  .transform((list) => [...new Set(list)]);

/** How a note looks on the wire: what the API returns, what the client receives. */
export const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const createNoteSchema = z.strictObject({
  title,
  content: content.default(""),
  tags: tags.default([]),
});

export const updateNoteSchema = z
  .strictObject({
    title: title.optional(),
    content: content.optional(),
    tags: tags.optional(),
  })
  .refine((patch) => Object.keys(patch).length > 0, {
    message: "Provide at least one field to update",
  });

export type Note = z.infer<typeof noteSchema>;
export type CreateNoteInput = z.input<typeof createNoteSchema>;
export type CreateNoteData = z.output<typeof createNoteSchema>;
export type UpdateNoteInput = z.input<typeof updateNoteSchema>;
export type UpdateNoteData = z.output<typeof updateNoteSchema>;
