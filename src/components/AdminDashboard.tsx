import type { Payload } from 'payload'

type AdminDashboardProps = {
  payload: Payload
  user?: { email?: string | null } | null
  visibleEntities?: { collections: string[] }
}

export function AdminDashboard({ payload, user, visibleEntities }: AdminDashboardProps) {
  const adminRoute = payload.config.routes.admin
  const collections = payload.config.collections.filter((collection) => {
    if (collection.admin?.hidden) return false
    if (!visibleEntities?.collections) return true
    return visibleEntities.collections.includes(collection.slug)
  })

  return (
    <div className="gutter">
      <h1 className="dashboard__label">Dashboard</h1>
      <p style={{ margin: '0 0 1.25rem', opacity: 0.72 }}>
        Signed in as {user?.email || 'admin'}
      </p>
      <ul
        style={{
          display: 'grid',
          gap: 10,
          listStyle: 'none',
          margin: 0,
          maxWidth: 640,
          padding: 0,
        }}
      >
        {collections.map((collection) => {
          const label =
            typeof collection.labels?.plural === 'string' ? collection.labels.plural : collection.slug
          return (
            <li key={collection.slug}>
              <a
                className="btn btn--style-secondary btn--size-medium"
                href={`${adminRoute}/collections/${collection.slug}`}
                style={{ justifyContent: 'flex-start', width: '100%' }}
              >
                {label}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
