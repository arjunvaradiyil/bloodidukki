import type { AdminViewServerProps } from 'payload'

const DESCRIPTIONS: Record<string, string> = {
  users: 'Admin accounts',
  donations: 'Donor registrations',
  hospitals: 'Hospital directory',
  'blood-requests': 'Requests from the public',
  'contact-messages': 'Messages from the contact form',
}

export async function AdminDashboard({
  initPageResult,
  payload: payloadFromProps,
  user: userFromProps,
  visibleEntities: visibleFromProps,
}: AdminViewServerProps) {
  const payload = payloadFromProps || initPageResult?.req?.payload
  const user = userFromProps || initPageResult?.req?.user
  const visibleEntities = visibleFromProps || initPageResult?.visibleEntities
  const adminRoute = payload?.config.routes.admin || '/admin'
  const collections = (payload?.config.collections || []).filter((collection) => {
    if (collection.admin?.hidden) return false
    if (!visibleEntities?.collections) return true
    return visibleEntities.collections.includes(collection.slug)
  })

  const counts = await Promise.all(
    collections.map(async (collection) => {
      try {
        const result = await payload!.count({
          collection: collection.slug as never,
          overrideAccess: true,
        })
        return result.totalDocs
      } catch {
        return null
      }
    }),
  )

  return (
    <div className="gutter">
      <header style={{ margin: '0 0 2rem' }}>
        <p
          style={{
            color: 'var(--theme-error-500, #e5484d)',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.16em',
            margin: '0 0 0.4rem',
            textTransform: 'uppercase',
          }}
        >
          Jeevanam Idukki
        </p>
        <h1 className="dashboard__label" style={{ margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ margin: '0.5rem 0 0', opacity: 0.7 }}>
          Signed in as {user?.email || 'admin'}
        </p>
      </header>
      <ul
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {collections.map((collection, index) => {
          const label =
            typeof collection.labels?.plural === 'string' ? collection.labels.plural : collection.slug
          const count = counts[index]
          return (
            <li key={collection.slug}>
              <a
                href={`${adminRoute}/collections/${collection.slug}`}
                style={{
                  background: 'var(--theme-elevation-50)',
                  border: '1px solid var(--theme-elevation-150)',
                  borderLeft: '4px solid var(--theme-error-500, #e5484d)',
                  borderRadius: 12,
                  color: 'var(--theme-text)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  minHeight: 120,
                  padding: '1.1rem 1.2rem',
                  textDecoration: 'none',
                }}
              >
                <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: '0.82rem', opacity: 0.65 }}>
                  {DESCRIPTIONS[collection.slug] ?? 'Manage entries'}
                </span>
                <span
                  style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    lineHeight: 1,
                    marginTop: 'auto',
                  }}
                >
                  {count ?? '-'}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
