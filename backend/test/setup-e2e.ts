import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { unlink } from 'node:fs/promises'

import { PrismaClient } from '@prisma/client'
import { createWriteStream } from 'fs'

import { envSchema } from '@/infra/env/env'

const env = envSchema.parse(process.env)
export const db = `${randomUUID()}.db`

createWriteStream(`./prisma/${db}`).end()

const prisma = new PrismaClient({ datasourceUrl: `file:./${db}` })

beforeAll(async () => {
  process.env.DATABASE_URL = `file:./${db}`
  execSync(`npx prisma migrate deploy`)
})

afterAll(async () => {
  await unlink(`./prisma/${db}`)
  await prisma.$disconnect()
})
