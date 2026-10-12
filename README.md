# Taklifnomalar

Mobile-first cinematic wedding invitation with six CSS ceremony scenes and a shared, configuration-driven invitation engine. Uzbek interface; no runtime dependencies, external fonts, analytics or backend required.

## Run

Node.js 24 and Python 3 are available in the cloud environment.

```sh
cd /workspace/taklifnomalar
npm ci
npm start
```

The server listens on port 3000. For deployment, serve the checkout as a static site with HTTPS. No build is needed. Do not publish node_modules or tests.

## Customize

Edit `js/invitation-config.js`. It is the source of couple names, venue, date, timezone, optional portrait, music, message and timeline. Use an ISO date with an explicit UTC offset; display uses `timeZone` (default Asia/Tashkent). Set `heroImage` to a portrait WebP/AVIF and adjust `imagePosition` to preserve faces. Without a photo a decorative monogram frame is rendered.

Themes: `?theme=royal`, `?theme=uzbek`, `?theme=botanical`, `?theme=ribbon`, `?theme=samarkand`, `?theme=garden`. The development selector appears only with `?dev=1`. The default theme is Uzbek Heritage. No theme selector is visible on ordinary invitations.

Theme palettes, textures and decorations live in `themes/`; scene motion is in `css/animations.css`. Theme metadata and music paths are in the shared config module. No-JavaScript fallback is deliberately static: update the `<noscript>` text in index.html when making a new invitation because the browser cannot read JS config without JavaScript.

## Audio

`assets/audio/*.wav` are original synthesized 16-second instrumental demo loops created for this project, not recordings of traditional instruments. Replace them with licensed piano/strings, dutor/nay, or ambient instrumentals for production. Set `music` to override a theme's track. Audio starts on the opening button gesture, fades from zero to 0.35, and can be muted using the bottom-right control. Browser playback refusal leaves the control available for retry. WAV files are fetched only after interaction; local WOFF2 fonts include their OFL licenses.

## RSVP

By default `submitRSVP()` validates and stores the latest answer in this device's localStorage, clearly marked as demo. Organizers do not receive it. Set `rsvpEndpoint` to an HTTPS backend that accepts JSON POST and enables CORS for the invitation origin. Success must return a 2xx response after persisting the answer. For Google Apps Script, provide a CORS-compatible endpoint/proxy; do not use opaque `no-cors` requests or assume they confirm delivery. Never put endpoint credentials in client code. Payload: name, attendance (yes/no), guests (0 for absent), comment, createdAt. Public RSVP endpoints need backend validation and abuse protection.

## Validation

```sh
npm test
node tests/browser.mjs
```

The browser suite requires Chromium at `/usr/bin/chromium` and the server running on port 3000. It checks all six themes at 390×844, 430×932, 768×1024 and 1440×1000, scroll locking, one-shot opening, overflow, RSVP persistence, map URLs, playback controls, reduced motion, keyboard opening and no-JS fallback. Chromium mobile emulation is not actual iPhone Safari or Samsung hardware testing; those remain release checks. No animation framework, canvas, Three.js or build chain is used.

## Uzbek Heritage upgrade

The existing engine remains shared; `js/uzbek.js` extends only the Uzbek theme's presentation, and `themes/uzbek.css` scopes all new styles to it. The opening is a ceremonial patir reveal in an evening courtyard, with the actual hero composition behind it. The theme keeps the existing countdown, map, RSVP, scroll observers and music controller. Its audio target is 0.30 over 1800ms; other themes retain 0.35 over 2500ms.

- Direct preview: append `?theme=uzbek` to your deployed site URL. Optional guest greeting: `?theme=uzbek&guest=Shahzod`. Guest input is normalized, limited to 60 characters and inserted as text, never interpreted as HTML.
- Couple portrait: place a licensed real image at `assets/images/couple.webp`; set `invitation.heroImage` to that path and adjust `imagePosition` (for example `center 30%`). No invented people are used in the placeholder.
- Final instrumental: place the licensed file at `assets/audio/uzbek-heritage.mp3`, then change only `themes.uzbek.music` to that path. The current `assets/audio/uzbek.wav` demo remains active until replaced. `invitation.music` is a global override, so leave it null if other themes should keep their own tracks.
- Names: edit `invitation.bride` and `invitation.groom`. Monograms and page title follow automatically.
- Date: edit `invitation.date` with an explicit timezone offset, such as `2026-11-21T18:00:00+05:00`; `timeZone` controls display. Countdown uses that same date.
- Venue: edit `invitation.venue.name`, `.address`, and `.mapUrl`. The demo map is a venue search, not a confirmed exact pin.
- Message: edit `invitation.invitationText`; the existing text is preserved. The greeting can be personalized through the URL.

New original assets: `assets/images/uzbek-patir.svg` (layered baked crust, stamping and procedural texture), `assets/textures/uzbek-ornament.svg` (shared carved/suzani geometry), and `assets/icons/uzbek-music.svg`. All are local SVG assets; no new package or third-party illustration was added.

Additional validation: `node tests/uzbek.mjs` checks 360×800, 375×812, 390×844, 412×915, 430×932, 768×1024 and 1440×1000, plus guest input safety and reduced-motion keyboard opening. It writes review screenshots to `/tmp/uzbek-review/`. `npm test`, `node tests/browser.mjs`, and `node tests/smoke.mjs` remain available.

Real iPhone Safari, Samsung Chrome and Telegram in-app browsers still require device testing, especially dynamic browser bars, real safe-area insets, autoplay rules and volume control (some iOS versions control media volume at system level). Chromium emulation verifies layout and behavior but cannot establish those device-specific results. RSVP remains explicitly local-device demo storage until a real endpoint is configured.
