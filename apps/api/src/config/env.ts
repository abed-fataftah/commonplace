import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5001),
  MONGODB_URI: z
    .string({ error: "MONGODB_URI is required" })
    .trim()
    .min(1, "MONGODB_URI is required")
    .refine(
      (uri) => uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"),
      "MONGODB_URI must start with mongodb:// or mongodb+srv://",
    ),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:");
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
