# Cadenze.io — Cadenze Studio

A music production and sound design app built with Next.js, integrating Wavespeed AI. **Cadenze Studio** offers a public homepage with hero, features, FAQ, and contact, plus login/registration and a protected dashboard for songwriters and music producers.

## Features

- **Homepage**: Hero, features, FAQ, and contact section (Cadenze.io branding)
- **Auth**: Email/password sign-up and login with PostgreSQL (Prisma) and NextAuth.js
- **Dashboard** (after login): Song Writers and Music Producers flows (stem separation, dubbing, text-to-music, etc.)
- **Design**: Studio neutral palette with earth accents (clay, olive) and semantic tokens

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables. In `.env` (or `.env.local`) add:
```env
# Required for database and auth
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-at-least-32-characters-long"

# Optional: Wavespeed API for dashboard tools
NEXT_PUBLIC_WAVESPEED_API_KEY=your_api_key_here
```

3. Run Prisma migrations to create the `User` table:
```bash
npx prisma migrate dev --name init
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000). Use the homepage to sign up, then log in to access the dashboard.

## Project Structure

```
├── app/
│   ├── api/              # API routes (optional server-side proxies)
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main page with tab navigation
│   └── globals.css       # Global styles
├── components/
│   ├── AudioToAudio.tsx  # Audio to Audio tab component
│   ├── TextToAudio.tsx   # Text to Audio tab component
│   └── AudioPlayer.tsx   # Advanced audio player with waveform
├── lib/
│   └── wavespeed-api.ts  # API client utilities
└── package.json
```

## API Endpoints

### Audio to Audio
- Upload an audio file
- Set original tags and new tags
- Choose edit mode (remix or lyrics)
- Provide original and new lyrics

### Text to Audio
- Enter a prompt describing the music style
- Provide lyrics
- Set bitrate (default: 256000)

## Notes

- For production, you'll need to implement file upload to a storage service (S3, etc.) for the Audio to Audio feature, as the API expects a publicly accessible URL.
- The app polls for results every 3 seconds after submission.
- Generated audio can be played, downloaded, and visualized with the waveform player.

## Technologies

- Next.js 14+ (App Router)
- React 18
- TypeScript
- Tailwind CSS
- WaveSurfer.js (for waveform visualization)




