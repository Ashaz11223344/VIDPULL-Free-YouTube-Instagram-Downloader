# Video Downloader Website - Product Requirements Document

## Project Overview
A web-based platform that allows users to download videos from Instagram and YouTube with multiple quality options and audio-only export capabilities. The site should be fast, intuitive, and provide a frictionless user experience similar to the reference sites while maintaining a unique design identity defined in `design.md`.

---

## 1. CORE FEATURES

### 1.1 YouTube Video Download
**Feature:** Users can paste a YouTube URL and download the video in multiple formats and quality options.

**Requirements:**
- Accept YouTube URLs in multiple formats:
  - Standard: `https://www.youtube.com/watch?v=VIDEO_ID`
  - Short: `https://youtu.be/VIDEO_ID`
  - Playlist variants: `https://www.youtube.com/playlist?list=PLAYLIST_ID`
- Display available quality options in descending order (4K, 1080p, 720p, 480p, 360p, 240p, 144p)
- Each quality should show:
  - Resolution/quality label
  - File size estimate
  - Frame rate (fps)
- Allow selection of multiple formats:
  - MP4 (H.264)
  - WebM (VP9)
  - AVI (optional)
- Show video metadata on selection:
  - Thumbnail
  - Title
  - Duration
  - Channel name
  - Upload date

---

### 1.2 Instagram Video Download
**Feature:** Users can download videos/Reels from Instagram.

**Requirements:**
- Accept Instagram URLs in multiple formats:
  - Direct post: `https://www.instagram.com/p/POST_ID/`
  - Reel: `https://www.instagram.com/reel/REEL_ID/`
  - Story (if accessible): `https://www.instagram.com/stories/USERNAME/`
- Download in available quality (typically 720p max for Instagram)
- Support carousel/album posts (download as ZIP or individual files)
- Show post metadata:
  - Thumbnail
  - Caption preview
  - Like count
  - Posted date

---

### 1.3 Audio-Only Export (MP3)
**Feature:** Extract and download audio as MP3 from YouTube videos.

**Requirements:**
- Available for YouTube videos only
- One-click conversion to MP3 format
- Show audio bitrate options (128kbps, 192kbps, 256kbps, 320kbps)
- Retain metadata (title, artist if available)
- Default to 192kbps as recommended option
- File size estimate before download

---

### 1.4 Download Management
**Requirements:**
- Real-time progress indication (percentage bar)
- Estimated time remaining
- Cancel button during download
- Download history (browser localStorage - last 10 downloads)
  - Show URL, title, download time
  - Quick re-download option
  - Option to clear history
- Copy download link to clipboard
- Direct download to user's device (no account required)

---

## 2. USER INTERFACE DESIGN

### 2.1 Design System Reference
**CRITICAL INSTRUCTION TO AGENT:**
- Consult and follow `design.md` file for all UI/UX decisions
- All colors, typography, spacing, and layout rules must come from `design.md`
- Do not make design assumptions; use design.md as the single source of truth
- If design.md doesn't specify something, ask or make minimal assumptions that align with the defined system

### 2.2 Layout Structure
**Header Section:**
- Logo/Brand name (left)
- Navigation: Home | FAQ | Contact (right, optional)
- Simple, clean header (max 80px height)

**Main Input Section:**
- Centered, prominent input field
- Placeholder text: "Paste YouTube or Instagram link..."
- Large download/process button (CTA)
- Subtitle: "Free, no registration required"

**Results Section:**
- Display video/media details in card format
- Quality selector (dropdown or radio buttons)
- Format selector (for YouTube)
- Prominent "Download" button
- Alternative actions (Copy Link, Share)

**Download History Sidebar (Optional):**
- Collapsible sidebar showing recent downloads
- Max height with scroll

**Footer:**
- Simple footer with: Terms of Service | Privacy Policy | Contact
- Copyright notice

### 2.3 Responsive Design
- Mobile-first approach
- Desktop: Full layout with sidebar
- Tablet: Optimized card layout
- Mobile: Single-column, stacked elements, simplified controls

### 2.4 User Experience
- Instant URL validation (visual feedback - checkmark/error)
- Loading state with spinner during fetch
- Error messages clear and actionable
- Success notifications with download link
- Dark mode support (if specified in design.md)

---

## 3. TECHNICAL SPECIFICATION

### 3.1 Architecture
- **Frontend Framework:** React + TypeScript
- **Styling:** Follow design.md system (CSS-in-JS or utility classes as defined)
- **Build Tool:** Vite
- **State Management:** React Context API or lightweight alternative
- **HTTP Client:** Fetch API or Axios

### 3.2 Backend/API Requirements
- Use existing video download APIs/services:
  - **YouTube:** yt-dlp library, youtube-dl, or commercial API (RapidAPI alternatives)
  - **Instagram:** instagram-downloader libraries or API services
  - OR: Implement proxy endpoints if using third-party APIs

**Decision Point:**
- Option A: Client-side download (browser-based, privacy-focused)
- Option B: Backend processing (faster, better handling of rate limits)
- **Recommendation:** Hybrid - Backend handles extraction; client initiates download

### 3.3 API Endpoints (if Backend Required)
```
POST /api/video/fetch
  Input: { url: string, platform: 'youtube' | 'instagram' }
  Output: { 
    title, thumbnail, duration, metadata,
    formats: [{ quality, size, fps, format, url }]
  }

POST /api/video/download
  Input: { url: string, quality: string, format: string, audioOnly?: boolean }
  Output: Download stream or signed URL

GET /api/health
  Output: { status: 'ok' }
```

### 3.4 Libraries & Dependencies
**Frontend:**
- `react` (core)
- `typescript` (type safety)
- `vite` (build)
- `axios` or `fetch` (HTTP)
- `clsx` or similar (conditional classes)

**Backend (if needed):**
- `yt-dlp` or `ytdl-core` (YouTube)
- `instagram-dl` or similar (Instagram)
- `express` or `fastify` (API server)
- `cors` (cross-origin requests)
- `dotenv` (environment variables)
- `morgan` (logging)

---

## 4. FUNCTIONAL REQUIREMENTS

### 4.1 Core Workflow
1. User opens website
2. User pastes URL into input field
3. System validates URL (YouTube or Instagram)
4. Fetch metadata and available formats
5. Display video details and download options
6. User selects quality/format/audio-only
7. Initiate download
8. Show download progress
9. Download completes → success notification
10. Save to download history

### 4.2 Error Handling
- **Invalid URL:** "Please enter a valid YouTube or Instagram URL"
- **Video Unavailable:** "This video is private or has been removed"
- **Network Error:** "Connection failed. Please try again"
- **Unsupported Content:** "Downloads not available for this type of content"
- **Rate Limited:** "Too many requests. Please wait a few moments"

### 4.3 Validation Rules
- URL must be from YouTube.com or Instagram.com
- URL must be a valid video/reel post (not profile, hashtag, etc.)
- Quality selection must match available options
- File size limits (warn if >500MB for browser download)

---

## 5. PERFORMANCE REQUIREMENTS

- Page load time: < 2 seconds
- URL validation response: < 500ms
- Metadata fetch: < 3 seconds
- Download initiation: < 1 second
- Progressive download indication (update every 100-500ms)

---

## 6. SECURITY & LEGAL CONSIDERATIONS

### 6.1 Security
- HTTPS only
- No storage of user data (stateless)
- Rate limiting (max 10 requests per minute per IP for non-authenticated users)
- API key/secrets in environment variables
- CORS headers properly configured

### 6.2 Legal Notes
- Add disclaimer: "For personal use only. Respect copyright and creator rights."
- Terms of Service must clarify:
  - Service is provided as-is
  - User responsible for legal usage
  - No storage of downloaded content on servers
  - Respect for DMCA/copyright laws
- Privacy Policy: No user tracking, no data collection (optional: basic analytics)

---

## 7. REFERENCE SITES ANALYSIS

**fastdl.app Analysis:**
- Minimal, centered input
- Quick quality selection
- Direct download without complex UI
- Fast response time
- Clean typography

**app.ytdown.to Analysis:**
- Larger feature set (batch download visible)
- Clear metadata display
- Quality grid layout
- Format options prominent
- Download button clearly visible

**Inspiration to Take:**
- Simplicity of fastdl.app input
- Quality/format clarity from ytdown.to
- Fast response times of both
- Minimal clutter approach

---

## 8. DELIVERABLES & MILESTONES

### Phase 1: MVP
- ✅ YouTube video download (single quality)
- ✅ Instagram video download
- ✅ UI with input and results display
- ✅ Basic error handling
- ✅ Download history (localStorage)

### Phase 2: Enhancement
- ✅ Multiple quality options for YouTube
- ✅ MP3 audio export
- ✅ Format selection
- ✅ Progress indication
- ✅ Rate limiting

### Phase 3: Polish
- ✅ Responsive mobile design
- ✅ Dark mode toggle
- ✅ Download speed optimization
- ✅ Advanced error recovery
- ✅ Analytics & monitoring

---

## 9. IMPLEMENTATION NOTES FOR AGENT

### Critical Design Instructions
**⚠️ MUST READ design.md FIRST:**
Before writing ANY UI code, read and fully understand the `design.md` file. All decisions about colors, spacing, typography, components, and layout MUST come from this file. Do not use default styles or make up design patterns.

### File Structure (Recommended)
```
src/
├── components/
│   ├── Header.tsx
│   ├── InputSection.tsx
│   ├── ResultCard.tsx
│   ├── DownloadOptions.tsx
│   ├── ProgressBar.tsx
│   └── DownloadHistory.tsx
├── hooks/
│   ├── useDownload.ts
│   ├── useVideoFetch.ts
│   └── useLocalStorage.ts
├── services/
│   ├── api.ts
│   ├── youtube.ts
│   └── instagram.ts
├── types/
│   └── index.ts
├── App.tsx
├── styles/ (if needed)
└── utils/
    ├── validation.ts
    ├── formatting.ts
    └── constants.ts
```

### Development Priorities
1. Input validation & error messages
2. API integration for metadata fetch
3. Quality/format selection UI
4. Download functionality
5. Progress indication
6. History management
7. Responsive design
8. Performance optimization

### Testing Checkpoints
- Test with various YouTube URLs (videos, shorts, playlists)
- Test with various Instagram URLs (posts, reels, carousels)
- Test invalid URLs
- Test network error scenarios
- Test on mobile, tablet, desktop
- Performance profiling (lighthouse scores > 80)

---

## 10. SUCCESS CRITERIA

- Users can download YouTube/Instagram content in <5 clicks
- Download process takes <30 seconds from URL input
- Zero user data stored server-side
- 99% uptime
- Mobile responsive (passes mobile usability test)
- Clear, actionable error messages
- Follows design.md guidelines consistently

---

## Questions for Clarification

Before implementation, confirm:
1. ✅ Backend processing vs. client-side download preferred?
2. ✅ Should we support Instagram Stories (ephemeral content)?
3. ✅ YouTube playlist batch download priority?
4. ✅ Analytics/tracking requirements?
5. ✅ Maximum file size limit?
6. ✅ Rate limiting strategy?

---

## References & Inspiration
- https://fastdl.app/en5IW
- https://app.ytdown.to/en38/

---

**Document Version:** 1.0  
**Last Updated:** 2026-09-01  
**Status:** Ready for Implementation