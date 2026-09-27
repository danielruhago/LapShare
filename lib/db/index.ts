import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL?.trim()

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is missing. Put your Supabase Postgres URI in .env.local (see .env.example).',
  )
}

const POOL_GEN = 2
const globalForDb = globalThis as unknown as {
  pool?: Pool
  poolGen?: number
}

function createPool() {
  const url = new URL(connectionString)
  // pg currently treats sslmode=require as verify-full, which fails on
  // Supabase's pooler certificate chain. Drive SSL from Pool options instead.
  url.searchParams.delete('sslmode')
  url.searchParams.delete('ssl')

  const usesPooler = url.hostname.includes('pooler.supabase.com')

  return new Pool({
    connectionString: url.toString(),
    max: 10,
    ssl: { rejectUnauthorized: false },
    ...(usesPooler ? { allowExitOnIdle: true } : {}),
  })
}

if (!globalForDb.pool || globalForDb.poolGen !== POOL_GEN) {
  void globalForDb.pool?.end()
  globalForDb.pool = createPool()
  globalForDb.poolGen = POOL_GEN
}

export const pool = globalForDb.pool
export const db = drizzle(pool, { schema })
