function isPostgresUrl(value: string) {
  return value.startsWith('postgres://') || value.startsWith('postgresql://')
}

/** Vercel Storage / Neon injects POSTGRES_URL when a Postgres store is linked. */
export function postgresConnectionString() {
  for (const raw of [
    process.env.POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.DATABASE_URL,
  ]) {
    const url = raw?.trim()
    if (url && isPostgresUrl(url)) return url
  }
  return null
}
