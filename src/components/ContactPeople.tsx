import { PhoneIcon } from '@/components/Icons'
import { contactPeople } from '@/lib/contacts'
import { cn } from '@/lib/cn'
import { btnBase, btnPrimary } from '@/lib/ui'

function displayPhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('91') && digits.length === 12) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`
  }
  return phone
}

export function ContactPeople() {
  return (
    <section aria-labelledby="contact-people-heading">
      <p className="m-0 text-[0.78rem] font-bold tracking-[0.16em] text-blood uppercase">
        District leadership
      </p>
      <h2 id="contact-people-heading" className="mt-2 font-display text-[clamp(1.45rem,3vw,1.85rem)] font-bold">
        DYFI Idukki office bearers
      </h2>
      <ul className="mt-6 m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 sm:gap-7 lg:grid-cols-2 xl:grid-cols-4 xl:gap-8">
        {contactPeople.map((person) => (
          <li
            key={person.englishName}
            className="flex flex-col overflow-hidden rounded-[1.25rem] border border-white/12 bg-[rgba(10,5,7,0.72)] shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-[18px]"
          >
            <div className="aspect-4/5 overflow-hidden bg-white/6">
              <img
                src={person.photo}
                alt={person.englishName}
                className="h-full w-full object-cover"
                style={{
                  objectPosition: person.photoPosition ?? 'center 12%',
                  transform: `scale(${person.photoZoom ?? 1})`,
                  transformOrigin: person.photoOrigin ?? 'center 18%',
                }}
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="m-0 font-display text-[1.12rem] font-bold leading-snug">{person.englishName}</h3>
              <p className="mt-2 space-y-1.5 text-[0.9rem] leading-[1.55] text-white/70">
                {person.roles.map((role) => (
                  <span key={role} className="block">
                    {role}
                  </span>
                ))}
              </p>
              <div className="mt-auto pt-4">
                <a
                  href={`tel:${person.phone}`}
                  className={cn(
                    btnBase,
                    btnPrimary,
                    'w-full min-h-9 shrink-0 whitespace-nowrap px-2.5 text-[0.78rem]',
                  )}
                >
                  <PhoneIcon className="size-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{displayPhone(person.phone)}</span>
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
