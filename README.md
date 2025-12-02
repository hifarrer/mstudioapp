# Music Production App MVP

A modern music production application built with Next.js that integrates with Wavespeed AI API to create songs, music, and sounds.

## Features

- **Audio to Audio**: Transform existing audio files with remix or lyrics editing
- **Text to Audio**: Generate music from text prompts and lyrics
- **Advanced Audio Player**: Waveform visualization, scrubbing, volume control, and timeline
- **Modern UI**: Black background with gradient accents and glassmorphism effects

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_WAVESPEED_API_KEY=your_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

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

