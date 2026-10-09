# Hyperframes Composition Brief: NestGH

## Objective
Create a polished 20-second vertical launch video for NestGH, showing the mobile journey from search to owner contact.

## Output
- Composition directory: `brag-output-2026-10-04-223914/composition/`
- Rendered video: `brag-output-2026-10-04-223914/brag.mp4`
- Format: vertical — 1080x1920 (9:16)
- Duration: exactly 20 seconds

## Source Material
- Project root: NestGH checkout; use the public frontend, existing design tokens, and official assets only.
- Primary files read: `index.html`, `styles.css`, `app.js`, `commercial-listings.js`
- Product name: NestGH
- Tagline / strongest claim: “Find Your Next Place”; official lockup: “FIND · LIST · RENT.”
- Key UI moment: mobile search/filter controls, followed by comparison, details, and contact.
- Copy that must appear verbatim:
  - “Find Your Next Place”
  - “Shops & Spaces to Let”
  - “Contact owner”
  - “FIND · LIST · RENT”
- Sample records are permitted by the user for this video only. Keep them isolated to composition files, with highly visible “ILLUSTRATIVE · NOT LIVE LISTINGS” labeling on search/results/details. Do not add sample data to the NestGH production source or backend.

## Creative Direction
- Tone preset: polished
- Creative direction: premium, modern, trustworthy, mobile-first; Ghanaian context through real local place names and GH₵, not stock visuals or decorative clichés.
- Angle: a vertical product walkthrough that feels like NestGH in use. Move through search, filters, a brief comparison of two illustrative cards, one detail view, and the contact action.
- Hook: actual NestGH mobile header and “Find Your Next Place.”
- Outro: official logo, “FIND · LIST · RENT,” and “Search. Compare. Contact.”
- Avoid:
  - Generic SaaS language
  - Stock photos or invented property imagery
  - Fake product claims or testimonials
  - Unlabeled sample records that could be mistaken for real listings
  - Fake owner names, contact numbers, or a simulated successful contact

## Visual Identity
- Background: `#f5f8f6`
- Text: `#10201a`
- Accent: `#0f7a4b` (dark-theme green: `#69c996`); restrained gold from the official logo.
- Display font: Bricolage Grotesque
- Body font: Bricolage Grotesque with system sans-serif fallback.
- Use the official logo file and the actual NestGH copy, colors, rounded cards, filters, and buttons.

## Demo content — video only
- Shop — Osu, Accra — GH₵ 4,500 / month — 120 m².
- Office — Tema — GH₵ 3,200 / month — 85 m².
- These are illustrative invented values for the video, not NestGH inventory. Show a visible demo disclaimer on the filter/results/detail scenes. Use icon placeholders, never listing photos.

## Storyboard
Use the full storyboard in `brag-plan.md` as the creative contract.

1. Start the search — 3s — real mobile homepage headline and Greater Accra search cue.
2. Search and filter — 3s — actual Shops & Spaces filter fields, sample location, and search tap.
3. Compare spaces — 5.5s — two clearly labeled video-only sample cards, Osu/Accra and Tema.
4. View and contact — 5s — labeled shop detail card and Contact owner button; no contact information or simulated connection.
5. Find · List · Rent — 3.5s — official NestGH logo and branded close.

## Audio
- Audio role: warm, quiet polish under UI motion.
- Audio arc: low music bed, sparse clicks on actual-looking actions, fade on the closing brand.
- Music: `assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`
- Music treatment: start at zero at low level; fade out by 20 seconds.
- Music cue guidance: bundled cue JSON at `assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json`, approximately 109.96 BPM. Optional accents near 4.39, 8.74, 13.11, and 17.47 seconds; prioritize readable text.
- Audio-reactive treatment: subtle green glow pulses driven by measured RMS/bass energy in the bundled cue preset. No waveform graphics.
- Audio-coupled moments: filter/search tap, comparison card arrivals, detail/contact tap, final logo.
- SFX: two or three soft, low-risk interface clicks, no success/connection sound.
- Voiceover: off; do not generate narration.

## Hyperframes Instructions
Use native Hyperframes timing and local media assets. Show real NestGH structure and actual copy; explicitly label all synthetic property details as illustrative video data. Keep the vertical UI legible on a phone, and make the contact button visible without inventing contact details or implying a real connection.

Run `hyperframes check` before render. Render and deliver locally; do not publish or upload.
