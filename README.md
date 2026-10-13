# Taklifnomalar

Mobile-first cinematic wedding invitation with seven CSS ceremony scenes and a shared, configuration-driven invitation engine. Uzbek interface; no runtime dependencies, external fonts, analytics or backend required.

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

## Luxury Peel Envelope theme

Refined on `feature/peel-premium-refine`, created from `work` with the existing Peel commits carried forward; use `?theme=peel` to preview. Uzbek Heritage remains the default and all existing themes keep their own behavior.

The luxury envelope has a real pointer-driven tear strip: drag the left tab to the right. Only the pulled part peels, and the envelope unlocks at 92% travel. A tap or Enter/Space does not open it. Releasing early or pointer cancellation returns the strip gracefully. Keyboard users can repeatedly press ArrowRight to advance, ArrowLeft to reverse, and Home/Escape to reset. Reduced motion retains drag/keyboard requirements while simplifying the reveal. Music starts only on successful completion, through the existing shared controller. The inner card rises, then the matching hero composition emerges at the same position.

Customize in `js/invitation-config.js`:

```js
themeOptions: {
  peel: {
    phrase: 'Bir muhabbatdan boshlangan yo‘l — bir umrga ulanadi.',
    music: null // e.g. 'assets/audio/peel-piano.mp3'
  }
},
giftCards: [
  { holder: 'FULL RECIPIENT NAME', number: '0000 0000 0000 0000', label: 'Uzcard' }
]
```

The zero number above is a documentation placeholder, not a real payment destination. Supply only public receiving-card details you intend to share. This refinement branch temporarily includes the explicitly marked preview holder `SHAXZOD NAMUNA` with number `0000 0000 0000 0000` and `giftCardsDemo: true`. The number is not a payment destination. For production, replace the preview data and set `giftCardsDemo: false`, or set `giftCards: []` to hide the section. Only a maximum of two valid entries with a name and a 12–19 digit number are rendered. Inside each visual card, only the number and full holder name appear; labels, expiry, CVV and other metadata are never rendered. Do not add secret card details to client configuration. This section does not process payments.

Leave `invitation.music` null to preserve theme-specific music. Peel defaults to the existing original `assets/audio/royal.wav` piano-style demo; supply a licensed final instrumental at `assets/audio/peel-piano.mp3` and set `themeOptions.peel.music` to that path. A non-null `invitation.music` remains the shared global override.

For a real portrait, place `assets/images/couple.webp` and set `invitation.heroImage` to that path. Adjust `imagePosition`, for example `'center 30%'`, to protect faces. Without a photo the theme uses a monogram, refined ring motifs and a discreet dove illustration, never generated people.

Side ribbons are lightweight SVG layers at the outside edges. Their top anchors and first spline segments remain fixed. A passive scroll listener with a single requestAnimationFrame adjusts only the lower spline control points and tail length in both directions; the tall paths extend beyond the viewport. The red, pearl and champagne strands have restrained material highlights. Geometry is recalculated on resize. They do not intercept touch or pointer events. Reduced motion leaves them static. Doves glide only a few pixels and stop moving in reduced-motion mode. All assets are CSS or inline original SVG, with no new runtime dependency.

Validation (server running):

```sh
npm test
node tests/peel.mjs
node tests/browser.mjs
node tests/uzbek.mjs
node tests/smoke.mjs
```

Peel checks 360×800, 375×812, 390×844, 412×915, 430×932, 768×1024 and 1440×1000. Checks cover tap/Enter rejection, progressive partial tearing, reset below threshold, real Chromium touch events and cancellation, full mouse/touch completion, one audio start, fixed ribbon anchors with reversible lower-path deformation, pointer-transparent ribbon layers, gift-field restrictions and visibility, RSVP, keyboard progress and reduced motion. Review screenshots are stored outside the repository in `/tmp/peel-review/`.

Real iPhone Safari, Samsung Chrome and Telegram in-app testing remains necessary for pointer capture, interrupted gestures, browser chrome/safe areas, media policies and physical 3D folds. Chromium touch emulation does not replace those device checks. RSVP continues to report honest localStorage demo status unless a backend is configured.

The gifting section is titled “To‘yona uchun karta” and sits between Location and RSVP. The demo disclaimer appears outside the visual card, which continues to contain only number and full holder name. The premium refinement repeats a single botanical linework family across the embossed envelope, message frame and dividers, adds layered paper edges, and closes with a burgundy stationery panel and large monogram. No new asset downloads or runtime dependencies were added; `js/peel-ribbons.js` owns the isolated ribbon geometry.

The current work branch’s dedicated `peel.html` page and forced-theme routing are preserved. Preview with `peel.html` or `?theme=peel`; the dedicated page stays Peel even if a conflicting query parameter is supplied. Cache version identifiers were refreshed for this refinement.

The To‘yona card is a **payment card**, separate from the venue/map. Location retains its venue, address, URL and “Xaritada ochish” action. The physical payment-card face has approximately 1.586:1 proportions and contains only the grouped number and full holder name; decorative rings carry no banking metadata. An understated “Karta raqamini nusxalash” action sits beneath each card and copies the unspaced digits only. Clipboard API failure falls back to a temporary readonly textarea and the browser's copy command, then removes the textarea and restores focus. If both fail, the UI reports failure rather than false success.

Customize section text through `invitation.themeOptions.peel.gifting` (`title`, `intro`, `description`). Up to two public receiving cards remain supported through `giftCards`. The all-zero preview card and external demo disclaimer remain enabled. Accidental expiry, CVV, CVC, PIN, securityCode or other properties are excluded by explicit field projection; they never appear in the card or copy action.

Additional payment-card checks: `node tests/payment.mjs` validates 360, 375, 390, 412 and 430px widths, the separate map URL and popup, 1.586:1 proportions, visible demo details, two-card support, private-field exclusion, actual Chromium clipboard contents, fallback cleanup and honest failure feedback. The copy action remains keyboard-focusable while working. Review screenshots are outside the checkout in `/tmp/payment-review/`.
