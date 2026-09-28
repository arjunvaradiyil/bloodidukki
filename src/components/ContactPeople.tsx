import { contactPeople } from '@/lib/contacts'

export function ContactPeople() {
  return (
    <section aria-labelledby="contact-people-heading">
      <p className="m-0 text-[0.78rem] font-bold tracking-[0.16em] text-blood uppercase">
        District leadership
      </p>
      <h2 id="contact-people-heading" className="mt-2 font-display text-[clamp(1.45rem,3vw,1.85rem)] font-bold">
        DYFI Idukki office bearers
      </h2>
      <ul className="mt-6 m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-4">
        {contactPeople.map((person) => (
          <li
            key={person.englishName}
            className="overflow-hidden rounded-[1.25rem] border border-white/12 bg-[rgba(10,5,7,0.72)] shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-[18px]"
          >
            <div className="aspect-4/5 overflow-hidden bg-white/6">
              <img
                src={person.photo}
                alt={person.englishName}
                className="h-full w-full object-cover object-[center_12%]"
              />
            </div>
            <div className="p-4">
              <h3 className="m-0 font-malayalam text-[1.12rem] font-bold leading-snug">{person.name}</h3>
              <p className="mt-2 font-malayalam text-[0.9rem] leading-[1.55] text-white/70">
                {person.roles.map((role) => (
                  <span key={role} className="block">
                    {role}
                  </span>
                ))}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
