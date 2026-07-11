# RWA.LAT Visual System

## 1. Visual Theme & Atmosphere

RWA.LAT is a precise, cinematic financial instrument: pure black space, platinum hardware, smoked glass and restrained mint energy. The interface must feel engineered rather than decorated. Every screen has one dominant object and a clear financial hierarchy. Page backgrounds are always `#000000`; depth comes from materials, borders and local light inside components, never ambient page gradients.

## 2. Color

- Canvas: `#000000`
- Glass: `rgba(12, 16, 20, .62)`
- Glass strong: `rgba(18, 23, 28, .76)`
- Hairline: `rgba(255, 255, 255, .12)`
- Glass rim: `rgba(218, 239, 255, .58)`
- Primary text: `#F5F7F8`
- Secondary text: `#929AA6`
- Faint text: `#626A75`
- Mint: `#2FE6BF`
- Ice: `#C5E3F7`
- Positive: `#2FE6BF`
- Negative: `#FF627A`
- Medium risk: `#7589FF`
- High risk: `#FFAD3D`

No page-level `linear-gradient` or `radial-gradient`. A component may use a tightly bounded specular highlight or glow when it represents glass refraction, an active control or an illuminated 3D object.

## 3. Typography

Use Inter for navigation and body text; use Space Grotesk for portfolio values, yields and financial metrics. Use tabular numbers. Headlines are sentence case, never decorative all-caps. Micro labels are limited to portfolio and compliance metadata.

## 4. Spacing & Grid

Use an 8px grid with 20px mobile gutters, 16px below 390px, and 24-32px between major sections. Touch targets are at least 44px. The H5 content width is capped at 430px. Safe-area insets are mandatory for the header and fixed dock.

## 5. Layout & Composition

The top bar is quiet and balanced: brand or page title on the left, notification and profile on the right. Home uses portfolio copy followed by a large orbital globe. Invest uses a segmented filter, one large hero product, then three strong horizontal products. Detail pages use a cinematic 3D hero, identity and metrics, then documentation. Wallet uses the balance and coin as a single hero composition. Avoid nested cards and uniform card repetition.

## 6. Components

- Liquid glass: neutral translucent fill, bright ice rim, top inner highlight, deep black shadow, 22-30px backdrop blur.
- Bottom dock: one elliptical four-item glass capsule plus a separate circular AI button.
- Primary navigation: Home, Invest, Portfolio, Wallet. Profile is opened from the top-right avatar.
- Icons: Lucide-style 1.7-1.9px monoline icons; 3D art is reserved for asset identity.
- Buttons: primary mint fill only for transactional confirmation; secondary actions use neutral glass.
- Cards: use borders and spacing first. A card exists only when content needs a shared interactive surface.

### 6.1 Locked Application Chrome

The existing `Brand`, `TopBar` and `BottomDock` components in `components/rwa-h5.tsx` are the only source of truth for the app chrome. Do not redraw, replace or restyle these components per screen, route or generated visual.

- **Top-left brand:** Root screens use the existing geometric RWA mark plus the `RWA.LAT` wordmark at the top left. Its white circle, horizontal axis and single mint node are fixed. Do not substitute a robot, orbit logo, text-only wordmark or a new brand mark. Detail and transactional screens use the existing detail header with a back control and compact brand or page title.
- **Top-right actions:** Root screens use the existing notification control and avatar. The avatar alone opens Profile; Profile is never a dock item.
- **Bottom navigation:** Root screens show exactly one four-item elliptical glass dock: Home, Invest, Portfolio, Wallet. A separate circular AI action sits beside/over the dock as implemented by `BottomDock`; it is not a fifth dock item. There is no Profile, Settings, Activity or other extra item in the dock.
- **Detail flows:** Asset details, orders, wallet flows, activity, positions, AI plans, notifications and account flows hide the dock and use their existing detail header plus any fixed transactional action. Never render a partial or altered dock on these pages.
- **Prototype images:** Every generated root-screen mockup must visibly follow this chrome. Generated detail-flow mockups must omit the dock rather than inventing a different menu. Treat a mockup that violates these rules as rejected output.

## 7. Motion & Interaction

Tap feedback is 120-160ms; component transitions 220-320ms; screen changes 320-420ms. 3D objects float subtly and respond to pointer/touch parallax. Orbital nodes move at different speeds. Reduced-motion stops continuous rotation and replaces parallax with a static poster-like composition.

## 8. Voice & Brand

Copy is concise, factual and financially literate. Use terms such as projected yield, minimum investment, settlement and risk. Avoid hype, unverifiable claims and generic AI language. RWA.LAT is written exactly with the period.

## 9. Anti-patterns

- No blue-purple or blue-green background gradients.
- No ambient blurred blobs behind the phone.
- No repeated generic glass cards with identical geometry.
- No emoji, random 3D icon packs, illegible model text or fake brand marks.
- No glow as a substitute for realistic material and hierarchy.
- No profile item in the bottom dock.
- No tiny centered copy, filler pills or pseudo-technical labels.
- No 3D image pasted into a box without spatial integration or motion.

## 10. Product-Ready Delivery Standard

This is a production-shaped product demo, not a wireframe collection. Every implementation task must begin by reading this document and the approved concept images for its screen or flow.

- **Build the full job:** A page must cover the user's complete task, its related detail views, confirmation steps, history/receipt where appropriate, permissions and all relevant non-ideal states. A single attractive first viewport is never a completed feature.
- **Prefer complete over sparse:** Use the information density, disclosures, tools and history that a real investment user needs. Add useful, domain-specific content rather than placeholder cards, empty columns or generic filler.
- **Concept images are implementation references:** For every material new surface or major flow, create and review a high-fidelity concept image in `assets/generated/原型图/` before or alongside implementation. The implementation must preserve the approved image's hierarchy, material language and locked application chrome.
- **No placeholder experience:** Do not use lorem ipsum, fake product names, dead buttons, empty tabs, generic stock imagery or visual-only controls. A demo action must be interactive, show a meaningful result or state why it is unavailable.
- **Use real integration shapes early:** Where a real partner API is not yet available, create a typed mock adapter that mirrors the expected request, response, error, latency and degraded states. When an API or authoritative public data source is needed to make a feature credible, research it and record the integration decision rather than inventing data contracts.
- **Review gate:** Before a task can move to `待审核`, verify visual fidelity against the concept image, all intended states, responsive behavior, keyboard/focus behavior and any relevant data/interaction path. Record the checks and remaining external dependencies in that task's note.
