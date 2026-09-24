# VIDPULL — Free YouTube & Instagram Downloader

A high-performance web application designed with a bold Neo-Brutalist aesthetic for downloading videos, audio, and reels from **YouTube** and **Instagram** — 100% free, anonymously, and with zero registration.

---

## ⚡ Features

- **YouTube 4K & Full HD**: Download videos up to 4K Ultra HD (2160p) & 60FPS in MP4 and WebM formats.
- **Studio 320kbps MP3**: Direct audio extraction with clean metadata.
- **Instagram Reels & Carousels**: Download HD Reels and multi-slide Carousel albums.
- **Lossless Media Trimmer**: Custom `MM:SS` start and end timestamp slicing.
- **Subtitles & Closed Captions**: Download official and auto-generated `.SRT` or `.VTT` caption tracks.
- **Private & Stateless**: Local history stored exclusively in your browser's `localStorage`.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS (Neo-Brutalist design tokens), Microsoft Fluent UI Icons, Canvas Confetti
- **Backend**: Node.js, Express, `yt-dlp` (`youtube-dl-exec`)
- **Architecture**: Unified full-stack application (Express serves both the Vite SPA bundle and the streaming media engine).

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Python 3](https://www.python.org/) (for `yt-dlp` engine)

### Installation

```bash
git clone https://github.com/Ashaz11223344/VIDPULL-Free-YouTube-Instagram-Downloader.git
cd VIDPULL-Free-YouTube-Instagram-Downloader
npm install
```

### Local Development

Start both the backend API server and Vite frontend dev server with one command:

```bash
npm run dev
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`

---

## 📦 Production & Deployment

### Build & Run Locally
```bash
npm run build
npm start
```
Your full website and API will run together on `http://localhost:3001`.

### Deploying to Render / Railway
This project is configured as a single unified service:
1. Connect this repository to **Render** or **Railway**.
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm start`
4. Choose the Node environment and deploy!

---

## 📄 License
MIT License. Created for educational and personal utility purposes.
