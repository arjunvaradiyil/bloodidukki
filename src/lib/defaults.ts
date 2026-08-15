export const defaultHeader = {
  logoTextPrimary: 'DYFI',
  logoTextAccent: 'IDUKKI',
  navItems: [
    { label: 'Find Hospitals', href: '#' },
    { label: 'Request for Blood', href: '#' },
    { label: 'Contact Us', href: '#' },
  ],
  ctaLabel: 'Donate Now',
  ctaHref: '/donate',
}

export const defaultHome = {
  hero: {
    headlinePrimary: 'One Donation.',
    headlineAccent: 'Countless Lives.',
    subheadline: "Your blood can be someone's second chance.",
    description:
      'Every drop you donate helps save lives, supports families, and builds a stronger community.',
    backgroundImage: null,
    backgroundVideo: '',
    primaryCta: { label: 'Donate Blood', href: '/donate' },
    secondaryCta: { label: 'Contact Us', href: '/contact' },
  },
  stats: [
    { icon: 'drop' as const, value: '1 Pint', label: 'Can save up to 3 lives' },
    { icon: 'people' as const, value: '10,000+', label: 'Happy Donors' },
    { icon: 'heart' as const, value: '50,000+', label: 'Lives Impacted' },
  ],
  about: {
    title: 'About Us',
    body: 'We connect willing donors with patients who need blood urgently across Idukki and beyond. Our camps, hospital partnerships, and volunteer network make donation simple, safe, and impactful.',
  },
  whyDonate: {
    title: 'Why Donate',
    items: [
      {
        title: 'Save lives instantly',
        description: 'A single donation can help up to three people in emergency care.',
      },
      {
        title: 'Strengthen your community',
        description: 'Local blood banks stay stocked because neighbors show up for each other.',
      },
      {
        title: 'Feel the impact',
        description: 'Know that your 15 minutes of courage can rewrite someone’s tomorrow.',
      },
    ],
  },
  eligibility: {
    title: 'Eligibility',
    items: [
      { text: 'Age 18–65 and in generally good health' },
      { text: 'Weight at least 50 kg (110 lbs)' },
      { text: 'No recent illness, tattoo, or major surgery' },
      { text: 'Wait the required interval since your last donation' },
    ],
  },
  faq: {
    title: 'FAQ',
    items: [
      {
        question: 'How long does donation take?',
        answer:
          'The whole visit usually takes 30–45 minutes. The actual draw is about 8–10 minutes.',
      },
      {
        question: 'Does it hurt?',
        answer:
          'You may feel a brief pinch. Most donors say the process is quicker and easier than expected.',
      },
      {
        question: 'How often can I donate?',
        answer:
          'Whole blood donors can typically give every 56 days, depending on local guidelines.',
      },
    ],
  },
  contact: {
    title: 'Contact',
    body: 'Ready to donate or host a camp? Reach out and we’ll help you get started.',
    email: 'dyfiidukki@gmail.com',
    phone: '+91 98765 43210',
  },
}

export type StatIcon = 'drop' | 'people' | 'heart'
