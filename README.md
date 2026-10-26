# Harshil Kamchetty — Portfolio

Live: **https://harshilkamchetty.vercel.app/**

Personal portfolio of Harshil Kamchetty, Computer Science (CSIT) student at MVSR Engineering College, Hyderabad.

The background is a custom HTML5 canvas particle engine: section titles and images are rebuilt from particles as you scroll, and the **Particle Lab** lets visitors type their own words or load an image to turn into particles.

## Tech stack

- React 19 + TypeScript
- Vite 6 + Tailwind CSS 4
- Canvas 2D particle physics (no WebGL library)
- GSAP / Motion for UI animation, `react-pageflip` for the competitions book
- Vercel (static hosting + serverless functions in `api/`)

## Run locally

Prerequisite: Node.js 20+

```bash
npm install
npm run dev        # Express + Vite dev server on http://localhost:3000
```

Build for production:

```bash
npm run build      # outputs to dist/
```

## Optional: visitor email alerts

`api/notify.ts` (on Vercel) and `server.ts` (locally) can email the owner when someone visits or uses the Particle Lab, via [Brevo](https://www.brevo.com/). Alerts include approximate location (city/country from the hosting provider), device type and browser. No data is stored.

Set these environment variables to enable it:

| Variable | Purpose |
| --- | --- |
| `BREVO_API_KEY` | Brevo transactional email API key |
| `BREVO_SENDER_EMAIL` | Verified sender address in Brevo |
| `NOTIFICATION_RECIPIENT_EMAIL` | Where alerts are sent |

Without `BREVO_API_KEY` the endpoint does nothing.

## Project structure

```
api/                 Vercel serverless functions (notify, health)
server/brevo.ts      Email alert logic shared by api/ and server.ts
server.ts            Local Express dev server
src/components/      Page sections and the particle engine
src/data/            All portfolio content (edit portfolioData.ts to update text)
public/              Static assets (images, favicons, robots.txt, sitemap.xml)
```
