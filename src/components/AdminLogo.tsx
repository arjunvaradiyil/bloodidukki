const BLOOD = '#e11d2e'

function DropBadge({ size }: { size: number }) {
  return (
    <span
      style={{
        alignItems: 'center',
        background: BLOOD,
        borderRadius: '50%',
        display: 'inline-grid',
        flexShrink: 0,
        height: size,
        placeItems: 'center',
        width: size,
      }}
    >
      <svg width={size / 2} height={size / 2} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2.5C12 2.5 5.5 10.2 5.5 15.2a6.5 6.5 0 0 0 13 0C18.5 10.2 12 2.5 12 2.5Z"
          fill="#fff"
        />
      </svg>
    </span>
  )
}

export function AdminLogo() {
  return (
    <span style={{ alignItems: 'center', display: 'inline-flex', gap: 10 }}>
      <DropBadge size={40} />
      <span style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
        <span style={{ color: 'var(--theme-text)' }}>Jeevanam</span>
        <span style={{ color: BLOOD, marginLeft: 6 }}>Idukki</span>
      </span>
    </span>
  )
}

export function AdminIcon() {
  return <DropBadge size={28} />
}
