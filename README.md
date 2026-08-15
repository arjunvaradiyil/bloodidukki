# Donate Blood

Blood donation landing site built with **Next.js 16** and **Payload CMS 3**.

## Quick start

```bash
pnpm install
pnpm dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

On first admin visit, create your user. Then edit globals:

| Global | What it controls |
|--------|------------------|
| **Header** | Logo text, nav links, Donate Now CTA |
| **Home Page** | Hero copy, background image/video, impact stats, About / Why Donate / Eligibility / FAQ / Contact |

## Stack

- Next.js App Router + React 19
- Payload CMS with SQLite (`DATABASE_URL=file:./.db`)
- Custom CSS (Sora + Manrope)

Upload a hero image under **Media**, then attach it on **Home Page → Hero → Background image**.
