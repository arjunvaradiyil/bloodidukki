import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logoTextPrimary',
      type: 'text',
      label: 'Logo text (primary)',
      defaultValue: 'DYFI',
      required: true,
    },
    {
      name: 'logoTextAccent',
      type: 'text',
      label: 'Logo text (accent)',
      defaultValue: 'IDUKKI',
      required: true,
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation links',
      labels: {
        singular: 'Link',
        plural: 'Links',
      },
      minRows: 1,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: {
            description: 'Use a page path such as /hospitals, or #section-id for on-page anchors.',
          },
        },
      ],
      defaultValue: [
        { label: 'Find Hospitals', href: '#' },
        { label: 'Request for Blood', href: '#' },
        { label: 'Contact Us', href: '#' },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA button label',
      defaultValue: 'Donate Now',
      required: true,
    },
    {
      name: 'ctaHref',
      type: 'text',
      label: 'CTA button link',
      defaultValue: '#donate',
      required: true,
    },
  ],
}
