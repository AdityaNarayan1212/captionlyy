# Captionly

AI-powered social media caption generator. Upload photos, match the vibe, post like a main character.

## Features

- Upload 1–10 images with client-side compression
- AI vision analysis (scenery, mood, colors, vibe score)
- 19 caption styles with short, medium, and long variants
- Mood slider (calm → chaotic) with live regeneration
- Tone, emoji, capitalization, and platform controls
- Photo dump titles and album names for multi-image uploads
- Explore page with trending caption categories
- Favorites with custom folders (local storage)

## Tech Stack

- Next.js 16 + TypeScript + Tailwind CSS
- shadcn/ui + Framer Motion
- Google Gemini API (optional, free tier)
- Local browser storage (no login required)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### AI Vision (Optional)

Captionly works in **demo mode** without an API key using smart templates. For real image analysis:

1. Get a free [Google Gemini API key](https://aistudio.google.com/apikey)
2. Open **Settings** in the app and paste your key
3. Your key stays in your browser — never sent to our servers

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run start` — Start production server
