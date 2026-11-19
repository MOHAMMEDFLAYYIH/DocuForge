# DocuForge — website

Static marketing + legal site for the **DocuForge** Android app (`app.docuforge.studio`).
Plain HTML, CSS and JavaScript — no frameworks, no build step, no dependencies.

The content is taken from the app itself: 34 tools across three suites, a fully on-device
pipeline, and no account system of any kind.

```
.
├── index.html            Landing page (hero, features, full tool catalogue, FAQ)
├── privacy.html          Privacy policy — bilingual English + Arabic
├── terms.html            Terms of service
├── data.html             What is stored on the device and how to delete it
├── support.html          Help centre and contact form
├── 404.html              Not-found page
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/style.css      All styles (tokens, components, responsive, print, RTL)
    ├── js/main.js         Theme, mobile nav, reveal, copy, mailto forms
    └── img/
        ├── app-icon.png       Real app icon, 512×512 (from the Flutter project)
        ├── app-icon-1024.png  1024×1024, for the Play listing
        ├── og.jpg             1200×630 social preview
        ├── og.svg             Source for the preview
        ├── feature-graphic.png 1024×500 Play feature graphic
        └── feature-graphic.svg Source for the feature graphic
```

## Run it locally

```bash
python3 -m http.server 8080
# open http://127.0.0.1:8080
```

## What comes from the app

| Item | Source in the Flutter project |
|---|---|
| App name, package | `pubspec.yaml`, `android/app/build.gradle.kts` |
| Tool inventory (34) | `docs/TOOLS.md` |
| Privacy text | `docs/PRIVACY_POLICY.md` |
| Logo | `assets/brand/app_icon.png` |
| Icon 1024 | `ios/Runner/Assets.xcassets/AppIcon.appiconset/` |
| Feature copy | `README.md`, `docs/PLAY_STORE_CHECKLIST.md` |

## Before you publish — replace these

Only a handful of values are still placeholders. Search for `class="ph"` (amber highlight)
and for `docuforge.app`.

| Find | Replace with |
|---|---|
| `docuforge.app` | your real domain (canonical, OG tags, sitemap, robots) |
| `[your name or company name]` | your legal name or company (`terms.html`, `privacy.html` if you add a controller line) |
| `[street address, city, country]` | your business address (`terms.html`) |
| `[your country]`, `[your city, country]` | governing law and jurisdiction (`terms.html`) |
| `USD 50` | your liability cap, if you want a different one (`terms.html`) |
| `sderf236@gmail.com`, `sderf236@gmail.com` | your real addresses |

**Screenshots** are still CSS placeholders on the landing page. Replace them with real
captures when you have them:

```html
<img src="assets/img/shot-1.png" alt="Home screen listing the three tool suites" class="shot">
```

Use 1080×1920 PNG or WebP, under ~300 KB each.

## Deploy

Any static host works, free at this size:

- **Netlify** — drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
- **Cloudflare Pages** — connect the repo, no build command, output directory `/`.
- **GitHub Pages** — repo settings → Pages → deploy from branch.
- **Vercel** — import the repo, framework preset "Other".

Then point the domain at the host and enable HTTPS. Google Play requires the privacy policy
URL to be publicly reachable over HTTPS, with no login, no PDF and no country restriction.

## Google Play checklist

Because this app creates **no accounts**, Play's account-deletion requirement does not apply.
`data.html` is still there because users ask "where is my data?" and it answers precisely.

- [ ] **Privacy policy URL** → `https://yourdomain/privacy.html`
- [ ] Privacy policy opens without signing in, from any country, on mobile
- [ ] **Data safety form** → declare **no data collected, no data shared** (matches §10 of the policy)
- [ ] **Ads declaration** → "No ads" (the app has no ad SDK, so there is no `app-ads.txt`)
- [ ] **Permissions** → camera, photos/media, biometric; justify each in the listing
- [ ] **Content rating** questionnaire completed
- [ ] **Target audience** → 13+ (the app is a general utility, not child-directed)
- [ ] **Developer website** → `https://yourdomain/`
- [ ] **Support email** → `support@yourdomain`
- [ ] **Store listing** — title ≤ 30 chars, short description ≤ 80, full description ≤ 4000
- [ ] **Screenshots** — at least 2 phone screenshots, 320–3840 px
- [ ] **Feature graphic** — `assets/img/feature-graphic.png` (1024×500)
- [ ] **App icon** — `assets/img/app-icon-1024.png` (512×512 is also generated from it)
- [ ] **Privacy policy linked inside the app** — Settings → About → Privacy

## Design notes

All colours, radii and spacing live in `:root` at the top of `assets/css/style.css`, with a
dark-mode override in `:root[data-theme="dark"]`. The palette is derived from the app icon:
teal `#0d9488` and green `#22c55e` on near-black `#04100e`.

The theme toggle stores the choice in `localStorage` under `docuforge-theme` and falls back to
the OS preference. An inline script applies it before first paint, so there is no flash.

The privacy page includes an Arabic section with `dir="rtl"`. The `.rtl` class in the CSS
handles text alignment, list padding and table alignment for that block.

## Forms

`support.html` uses a `mailto:` hand-off — no backend, no secrets, no third-party processor.
To receive submissions server-side instead, replace the `<form data-mailto-form="...">`
element with a Formspree / Netlify Forms / Worker endpoint and delete the handler in
`assets/js/main.js`.

## Notes

- No cookies, no analytics, no external fonts, no tracker scripts.
- Legal pages follow Google Play's requirements and common GDPR expectations, but they are a
  starting point, not legal advice. Have a lawyer review them for your jurisdiction.
- `data.html` replaces the earlier account-deletion page, which no longer applied once the
  app turned out to have no sign-in.
