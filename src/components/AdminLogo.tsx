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
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2C12 2 4.5 10.4 4.5 15.4a7.5 7.5 0 0 0 15 0C19.5 10.4 12 2 12 2Z"
          fill="#fff"
        />
        <path
          d="M12 11.2 13.2 14.4 16.5 14.5 13.9 16.5 14.8 19.7 12 17.8 9.2 19.7 10.1 16.5 7.5 14.5 10.8 14.4Z"
          fill={BLOOD}
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
