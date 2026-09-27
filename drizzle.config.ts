import { readFileSync } from 'node:fs'
import { URL } from 'node:url'
import { defineConfig } from 'drizzle-kit'

for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eq = trimmed.indexOf('=')
  if (eq === -1) continue
  const key = trimmed.slice(0, eq)
  const value = trimmed.slice(eq + 1)
  if (!process.env[key]) process.env[key] = value
}

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL is missing in .env.local')
}

const parsed = new URL(databaseUrl)

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 5432,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, '') || 'postgres',
    ssl: { rejectUnauthorized: false },
  },
})
