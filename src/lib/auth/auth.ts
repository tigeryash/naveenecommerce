import { drizzle } from '@payloadcms/db-postgres/drizzle/node-postgres'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

const db = drizzle(process.env.DATABASE_URI as string)

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
    usePlural: false, // Should be false when having custom table name mapping as outlined below
  }),
  advanced: {
    generateId: false, // Should be false since we'll let Payload generate the ids
  },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: 'users',
  },
  account: {
    modelName: 'user_accounts',
    accountLinking: {
      allowDifferentEmails: true,
      enabled: true,
    },
  },
  verification: {
    modelName: 'user_verifications',
  },
  session: {
    modelName: 'user_sessions',
  },
})
