export function AdminLogo() {
  return (
    <span style={{ alignItems: 'center', display: 'inline-flex', gap: 12 }}>
      <img src="/icon.png" alt="" width={44} height={44} style={{ borderRadius: 10 }} />
      <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Jeevanam Idukki</span>
    </span>
  )
}

export function AdminIcon() {
  return <img src="/icon.png" alt="Jeevanam Idukki" width={28} height={28} style={{ borderRadius: 6 }} />
}
