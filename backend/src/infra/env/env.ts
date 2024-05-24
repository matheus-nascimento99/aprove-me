import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().int().optional().default(4000),
  DATABASE_URL: z.string().url(),
  AWS_BUCKET_NAME: z.string().optional(),
  AWS_ACCESS_KEY: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
})

export type Env = z.infer<typeof envSchema>
