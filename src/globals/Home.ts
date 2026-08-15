import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home Page',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'group',
      name: 'hero',
      label: 'Hero',
      fields: [
        {
          name: 'headlinePrimary',
          type: 'text',
          label: 'Headline (white)',
          defaultValue: 'One Donation.',
          required: true,
        },
        {
          name: 'headlineAccent',
          type: 'text',
          label: 'Headline (red)',
          defaultValue: 'Countless Lives.',
          required: true,
        },
        {
          name: 'subheadline',
          type: 'text',
          label: 'Subheadline',
          defaultValue: "Your blood can be someone's second chance.",
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          defaultValue:
            'Every drop you donate helps save lives, supports families, and builds a stronger community.',
          required: true,
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Background image',
        },
        {
          name: 'backgroundVideo',
          type: 'text',
          label: 'Background video URL (optional)',
          admin: {
            description: 'MP4/WebM URL. Falls back to the background image when empty.',
          },
        },
        {
          name: 'primaryCta',
          type: 'group',
          label: 'Primary CTA',
          fields: [
            {
              name: 'label',
              type: 'text',
              defaultValue: 'Donate Blood',
              required: true,
            },
            {
              name: 'href',
              type: 'text',
              defaultValue: '#donate',
              required: true,
            },
          ],
        },
        {
          name: 'secondaryCta',
          type: 'group',
          label: 'Secondary CTA',
          fields: [
            {
              name: 'label',
              type: 'text',
              defaultValue: 'Find a Blood Camp',
              required: true,
            },
            {
              name: 'href',
              type: 'text',
              defaultValue: '#camps',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Impact stats',
      labels: {
        singular: 'Stat',
        plural: 'Stats',
      },
      maxRows: 4,
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Blood Drop', value: 'drop' },
            { label: 'People', value: 'people' },
            { label: 'Heart', value: 'heart' },
          ],
          defaultValue: 'drop',
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
      defaultValue: [
        { icon: 'drop', value: '1 Pint', label: 'Can save up to 3 lives' },
        { icon: 'people', value: '10,000+', label: 'Happy Donors' },
        { icon: 'heart', value: '50,000+', label: 'Lives Impacted' },
      ],
    },
    {
      type: 'group',
      name: 'about',
      label: 'About section',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'About Us',
        },
        {
          name: 'body',
          type: 'textarea',
          defaultValue:
            'We connect willing donors with patients who need blood urgently across Idukki and beyond. Our camps, hospital partnerships, and volunteer network make donation simple, safe, and impactful.',
        },
      ],
    },
    {
      type: 'group',
      name: 'whyDonate',
      label: 'Why donate section',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Why Donate',
        },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
          ],
          defaultValue: [
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
      ],
    },
    {
      type: 'group',
      name: 'eligibility',
      label: 'Eligibility section',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Eligibility',
        },
        {
          name: 'items',
          type: 'array',
          fields: [{ name: 'text', type: 'text', required: true }],
          defaultValue: [
            { text: 'Age 18–65 and in generally good health' },
            { text: 'Weight at least 50 kg (110 lbs)' },
            { text: 'No recent illness, tattoo, or major surgery' },
            { text: 'Wait the required interval since your last donation' },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'faq',
      label: 'FAQ section',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'FAQ',
        },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'question', type: 'text', required: true },
            { name: 'answer', type: 'textarea', required: true },
          ],
          defaultValue: [
            {
              question: 'How long does donation take?',
              answer: 'The whole visit usually takes 30–45 minutes. The actual draw is about 8–10 minutes.',
            },
            {
              question: 'Does it hurt?',
              answer: 'You may feel a brief pinch. Most donors say the process is quicker and easier than expected.',
            },
            {
              question: 'How often can I donate?',
              answer: 'Whole blood donors can typically give every 56 days, depending on local guidelines.',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'contact',
      label: 'Contact section',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Contact',
        },
        {
          name: 'body',
          type: 'textarea',
          defaultValue: 'Ready to donate or host a camp? Reach out and we’ll help you get started.',
        },
        {
          name: 'email',
          type: 'text',
          defaultValue: 'hello@donateblood.org',
        },
        {
          name: 'phone',
          type: 'text',
          defaultValue: '+91 98765 43210',
        },
      ],
    },
  ],
}
