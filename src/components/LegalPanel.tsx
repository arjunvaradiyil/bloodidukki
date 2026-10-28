import { SITE_NAME } from '@/lib/defaults'

type LegalPanelProps = {
  kind: 'privacy' | 'policy'
}

export function LegalPanel({ kind }: LegalPanelProps) {
  const title =
    kind === 'privacy' ? (
      <>
        <span className="text-white">Privacy</span> <span className="text-blood">policy</span>
      </>
    ) : (
      <>
        <span className="text-white">Site</span> <span className="text-blood">policy</span>
      </>
    )

  const body =
    kind === 'privacy' ? (
      <>
        <p>
          {SITE_NAME.plain} collects only the details you submit on this site — such as name, mobile number, blood
          group, block, and hospital information — so volunteers can coordinate donation and requests.
        </p>
        <p>
          We use this information to match donors, follow up on requests, and contact you about camps or support. We do
          not sell your data. Access is limited to the DYFI Idukki volunteer team handling this service.
        </p>
        <p>
          You can ask us to update or remove your details by emailing dyfiidukki@gmail.com.
        </p>
      </>
    ) : (
      <>
        <p>
          This website helps people in Idukki find hospitals and register as voluntary blood donors or requesters. It is
          a community coordination service, not a hospital, blood bank, or emergency medical provider.
        </p>
        <p>
          In an emergency, contact the hospital blood bank or local emergency services directly. Submitting a form does
          not guarantee a donor or a unit of blood.
        </p>
        <p>
          Information listed here is shared in good faith and may change. Please confirm details with the hospital
          before you travel.
        </p>
      </>
    )

  return (
    <article className="mx-auto max-w-[40rem] text-center">
      <p className="m-0 mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-white/55 uppercase">Legal</p>
      <h2 className="m-0 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold tracking-tight leading-[1.08]">
        {title}
      </h2>
      <div className="mt-6 space-y-4 text-[1.05rem] leading-[1.7] text-white/75">{body}</div>
    </article>
  )
}
