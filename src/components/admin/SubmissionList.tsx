import type { AdminViewServerProps } from 'payload'
import { importSubmissions, listSubmissions, type FormKind } from '@/lib/submission-log'

function titleFor(kind: string) {
  if (kind === 'donations') return 'Donations'
  if (kind === 'blood-requests') return 'Blood Requests'
  if (kind === 'contact-messages') return 'Contact Messages'
  return kind
}

function cells(kind: string, data: Record<string, unknown>, at: string) {
  if (kind === 'donations') {
    return [data.name, data.mobile, data.bloodGroup, data.block, data.preferredDate, at]
  }
  if (kind === 'blood-requests') {
    return [data.patientName, data.bloodGroup, data.hospital, data.neededBy, data.mobile, at]
  }
  return [data.name, data.mobile, data.email, data.message, at]
}

function headers(kind: string) {
  if (kind === 'donations') return ['Name', 'Mobile', 'Blood group', 'Block', 'Preferred date', 'Submitted']
  if (kind === 'blood-requests') {
    return ['Patient', 'Blood group', 'Hospital', 'Needed by', 'Mobile', 'Submitted']
  }
  return ['Name', 'Mobile', 'Email', 'Message', 'Submitted']
}

export async function SubmissionList({ initPageResult, payload }: AdminViewServerProps) {
  const kind = (initPageResult?.collectionConfig?.slug || '') as FormKind
  const client = payload || initPageResult?.req?.payload
  if (client) {
    try {
      await importSubmissions(client)
    } catch {
      // Show the shared log even if this instance cannot write into Payload.
    }
  }
  const rows = await listSubmissions(kind)

  if (rows.length === 0 && client) {
    try {
      const existing = await client.find({
        collection: kind,
        limit: 100,
        depth: 0,
        overrideAccess: true,
        sort: '-createdAt',
      })
      for (const doc of existing.docs) {
        rows.push({
          id: String(doc.id),
          kind,
          at: String(doc.createdAt || ''),
          data: doc as Record<string, unknown>,
        })
      }
    } catch {
      // Keep the shared log empty-state if Payload has no rows on this instance.
    }
  }

  return (
    <div className="gutter">
      <h1 className="dashboard__label">{titleFor(kind)}</h1>
      <p style={{ margin: '0 0 1.25rem', opacity: 0.72 }}>
        {rows.length === 0
          ? 'No submissions yet.'
          : `${rows.length} ${rows.length === 1 ? 'submission' : 'submissions'}`}
      </p>
      {rows.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                {headers(kind).map((label) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {cells(kind, row.data, row.at).map((value, index) => (
                    <td key={`${row.id}-${index}`}>{value == null ? '' : String(value)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
