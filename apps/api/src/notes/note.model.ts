import { Schema, model, type Types } from "mongoose";
import { NOTE_LIMITS, type Note } from "@commonplace/shared";

/** The shape of a note as it is stored, before it becomes an API response. */
export type NoteRecord = {
  _id: Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

const noteSchema = new Schema<NoteRecord>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: NOTE_LIMITS.titleMax,
    },
    content: {
      type: String,
      default: "",
      maxlength: NOTE_LIMITS.contentMax,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.length <= NOTE_LIMITS.tagsMax,
        message: `A note can have at most ${NOTE_LIMITS.tagsMax} tags`,
      },
    },
  },
  { timestamps: true },
);

// The notes list is ordered by most recently edited, so that is what we index.
noteSchema.index({ updatedAt: -1 });

export const NoteModel = model<NoteRecord>("Note", noteSchema);

/** The single place a stored note becomes the wire shape the API promises. */
export function toNote(record: NoteRecord): Note {
  return {
    id: record._id.toString(),
    title: record.title,
    content: record.content,
    tags: record.tags,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
