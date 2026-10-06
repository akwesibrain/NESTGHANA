# Hyperframes Composition Brief: NestGH

## Objective
Create a 20-second, polished launch-style brag for NestGH, grounded in the real website and the newly implemented Shops & Spaces frontend.

## Output
- Composition directory: `brag-output-2026-10-04-221718/composition/`
- Rendered video: `brag-output-2026-10-04-221718/brag.mp4`
- Format: landscape — 1280x720
- Duration: 20 seconds

## Source Material
- Project root: the NestGH checkout; include only the public website sources and supplied assets.
- Primary files read: `index.html`, `styles.css`, `app.js`, `commercial-listings.js`, `scripts/sync-public-frontend.mjs`
- Product name: NestGH
- Tagline / strongest claim: “Find Your Next Place”; the actual lockup is “FIND · LIST · RENT.”
- Key UI or visual moment to recreate: real home hero/category row, then the Shops & Spaces filters and implemented empty state.
- Copy that must appear verbatim:
  - “Find Your Next Place”
  - “Shops & Spaces to Let”
  - “Business spaces to let”
  - “No shops or spaces available yet.”
  - “FIND · LIST · RENT”

## Creative Direction
- Tone preset: polished
- Creative direction: quiet, confident product film for a Ghana property marketplace
- Interpretation: restrained motion, generous holds, soft crossfades, and a small number of gentle interface sounds.
- Angle: Show the actual path from the real NestGH home page into commercial search. Land on the implemented empty-state design and make the no-demo-data approach explicit without suggesting a successful API response.
- Hook: The actual “Find Your Next Place” hero headline, paired with NestGH's current brand palette.
- Outro / punchline: NestGH; “FIND · LIST · RENT”; “Business spaces to let.”
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Unrelated visual redesign
  - Any fake property card, listing, image, location, rent, advance, size, availability, or contact
  - Implying that the backend returned an empty result; Supabase is not configured in the current environment

## Visual Identity
- Background: `#f5f8f6`
- Text: `#10201a`
- Accent: `#0f7a4b` (dark-theme green: `#69c996`)
- Display font: Bricolage Grotesque
- Body font: Bricolage Grotesque, with system sans-serif fallback
- Visual references from the project: actual nav/hero, category tile, commercial filters, rounded white panels and green buttons.

## Storyboard
Use the complete storyboard in `brag-plan.md` as the creative contract.

Scene summary:
1. Find your next place — 3s — real hero and headline.
2. One more category — 3s — actual Shops & Spaces category tile.
3. Search the space — 5s — real commercial filters and Search spaces button; no result card.
4. No invented listings — 5s — the actual designed empty-state copy, shown as a design state only.
5. NestGH — 4s — actual wordmark/tagline and business-spaces category line.

## Audio
- Audio role: warm, restrained polish under the UI.
- Audio arc: quiet instrumental bed; subtle click at category and search; light closing accent and fade.
- Music: `assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`
- Music treatment: begin at 0, low volume, fade out by the final logo hold.
- Music cue guidance: optional preset `assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json`, ~109.96 BPM. Green glow pulses use measured RMS/bass energy near 8.74, 9.83, 13.11, 17.47, 18.56, and 19.66s. The category click is near 4.39s; cues are not used to rush text.
- Audio-reactive treatment: subtle green glow pulses follow the bundled preset's measured RMS/bass energy; no visualizer graphics.
- Audio-coupled moments:
  - Scene 2 category choice — soft selection cue.
  - Scene 3 filter and search action — minimal soft UI click.
  - Scene 5 logo reveal — quiet closing accent if it fits.
- SFX selection guidance: restrained; use the two selected low-risk interface clicks.
- SFX analysis guidance: prefer low or medium high-frequency-risk sounds; avoid repeated sharp clicks.
- Exact SFX choice: `click_003.ogg` at category selection and `click_002.ogg` at the search action; brief, low-risk, and quiet.
- Audio files: keep selected local audio in `composition/assets/`.
- Voiceover: off. Do not generate or add narration.

## Hyperframes Instructions
Create a native Hyperframes composition in this output folder; do not use a generic promotional template. Reference the source project for visual fidelity. Keep the visual journey recognizable as NestGH, preserve text readability, use only claims present in the source or accurately describing implementation, and do not insert listings or fake data.

Run `hyperframes check` before rendering. Create and render locally. Do not publish or upload the composition.
