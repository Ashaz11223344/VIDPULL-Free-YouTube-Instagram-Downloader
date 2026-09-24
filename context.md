# Vidpull Project Context & Architecture

## Overview
**Vidpull** is a high-performance, Neo-Brutalist web application for downloading videos, audio, and albums from **YouTube** and **Instagram**. It operates 100% free, anonymously, and without registration.

---

## Core Features
1. **YouTube Video & Audio**:
   - High-resolution video extractions up to **4K Ultra HD (2160p)** & 60FPS in MP4 and WebM formats.
   - Studio **320kbps MP3 audio** extraction with ID3 metadata.
2. **Instagram Media**:
   - HD Instagram Reels, Stories, and multi-slide Carousel Albums with individual item download support.
3. **Interactive Media Trimmer**:
   - Lossless start and end timestamp trimming (`MM:SS`) using server-side stream slicing (`yt-dlp` `--download-sections`).
4. **Subtitles & Closed Captions Extractor**:
   - Extraction of official and auto-generated captions in **.SRT** and **.VTT** formats in any available language.
5. **Platform Selection & Smart Validation**:
   - Strict platform mode toggling (YouTube vs. Instagram) with automatic URL-to-platform validation and clear error feedback.
6. **Stateless & Private**:
   - Download history stored strictly in browser `localStorage` (max 10 items). Zero server logs or tracking.

---

## Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (Tailwind v3) with custom Neo-Brutalist design tokens (`neo-bg`, `neo-accent`, `neo-secondary`, `neo-muted`, `shadow-neo`).
- **Icons**: Microsoft `@fluentui/react-icons` (Fluent UI System Icons).
- **Effects**: `canvas-confetti` for download completion celebrations.

### Backend
- **Server**: Node.js + Express (running on `http://localhost:3001`).
- **Engine**: `youtube-dl-exec` (backed by native `yt-dlp`).
- **Performance & Speed**:
  - `extractorArgs: 'youtube:player_client=android'` for ultra-fast metadata resolution (~3-4s).
  - 1-hour in-memory cache (`fetchCache`) for repeat URL metadata queries.
  - Streaming HTTP pipe direct to browser without persistent server disk accumulation.

---

## Design System (Neo-Brutalism)

- **Canvas Background**: Warm Cream (`#FFFDF5` / `bg-neo-bg`) with grid overlay pattern (`bg-grid`).
- **Borders & Shadows**: Thick black structural borders (`border-4 border-black`), zero border-radius on cards, hard offset shadows (`shadow-neo`, `shadow-neo-lg`).
- **Palette**:
  - Primary Accent: Bright Red (`#FF4B4B` / `bg-neo-accent`)
  - Secondary Accent: Vivid Yellow (`#FFE600` / `bg-neo-secondary`)
  - Muted Pill Accent: Soft Purple (`#D4C2FF` / `bg-neo-muted`)
  - Green Success: Electric Mint (`#00E699` / `bg-neo-green`)
- **Typography**: Heavy, uppercase, high-contrast headings with tight tracking (`font-black uppercase tracking-tighter`).

---

## API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/youtube/fetch` | `POST` | Resolves YouTube video metadata, resolutions, audio bitrates & subtitle tracks. |
| `/api/instagram/fetch` | `POST` | Resolves Instagram Reel or Carousel Album slides and media links. |
| `/api/youtube/download` | `GET` | Streams YouTube video/audio/subtitles with optional `startTime`, `endTime`, `isSubtitle`, `subLang`, `subFormat`. |
| `/api/instagram/download` | `GET` | Streams Instagram Reel or Carousel media items. |

---

## File & Directory Structure

```
Vidpull/
├── server/
│   └── index.js              # Express backend API & yt-dlp execution engine
├── src/
│   ├── components/
│   │   ├── Header.tsx         # Sticky navigation header with history counter
│   │   ├── MarqueeBanner.tsx  # Ticker banner
│   │   ├── InputSection.tsx   # Hero headline, platform toggle, input box & loading state
│   │   ├── ResultCard.tsx     # Media preview, quality radio grid, trimmer & subtitles tabs
│   │   ├── DownloadModal.tsx  # Download progress modal with speed metrics
│   │   ├── DownloadHistory.tsx# Drawer for viewing/clearing local download history
│   │   ├── FeaturesSection.tsx# Asymmetric Neo-Brutalist feature cards
│   │   ├── FAQSection.tsx     # Accordion FAQ
│   │   ├── LegalModals.tsx    # Terms, Privacy & DMCA policy modals
│   │   ├── Footer.tsx         # Footer with quick links & credit link
│   │   └── BrandIcons.tsx     # Custom SVG brand icons (YouTube, Instagram)
│   ├── services/
│   │   └── api.ts             # Frontend API service layer
│   ├── types/
│   │   └── index.ts           # Shared TypeScript interfaces & types
│   ├── utils/
│   │   ├── constants.ts       # Demo links, FAQs
│   │   ├── formatting.ts      # Bytes & duration formatting utilities
│   │   └── validation.ts      # URL regex patterns & platform detection
│   ├── App.tsx                # Main App component & state orchestration
│   ├── main.tsx               # App entrypoint
│   └── index.css              # Custom Tailwind utilities & Neo-Brutalist shadows
├── design.md                  # Comprehensive Neo-Brutalist design specification
├── prd.md                     # Product Requirements Document
├── vite.config.ts             # Vite server & proxy configuration (`/api` -> `3001`)
└── package.json               # Project dependencies
```

---

## Development Commands

- **Start Full App (Backend + Frontend)**:
  ```bash
  npm run dev
  ```
- **Start Backend API Server Only**:
  ```bash
  npm run dev:server
  # or
  npm run server
  ```
- **Start Frontend Vite Server Only**:
  ```bash
  npm run dev:client
  ```
- **Type Check**:
  ```bash
  npx tsc --noEmit
  ```
