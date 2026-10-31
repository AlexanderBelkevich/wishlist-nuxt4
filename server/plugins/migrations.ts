import { migrate } from 'drizzle-orm/libsql/migrator'

export default defineNitroPlugin(async () => {
  await migrate(db, { migrationsFolder: 'server/db/migrations' })
})
