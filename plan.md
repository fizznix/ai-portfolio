You are an expert frontend + full-stack engineer.

Build a futuristic, production-grade personal portfolio website for an AI Systems Engineer using Next.js (App Router).

---

# 🎯 GOAL

Create a visually stunning, highly responsive, futuristic portfolio that behaves like a dynamic content-driven system.

This is NOT a static portfolio.

It must:

* Pull all content dynamically from Notion (headless CMS)
* Be easily maintainable without code changes
* Look futuristic (dark theme, neon accents, smooth animations)
* Include subtle 3D visuals using Three.js (non-intrusive, performant)
* Work flawlessly across desktop, tablet, and mobile

---

# 🧱 TECH STACK

* Next.js 14+ (App Router)
* TypeScript
* Tailwind CSS
* Framer Motion
* shadcn/ui
* Notion API (@notionhq/client)
* Three.js
* @react-three/fiber
* @react-three/drei

---

# 📁 PROJECT STRUCTURE

/app
/page.tsx
/work/page.tsx
/writing/page.tsx
/book/page.tsx

/components
Hero.tsx
ProjectCard.tsx
BlogCard.tsx
BookShowcase.tsx
NowPanel.tsx
Navbar.tsx
Container.tsx
SceneCanvas.tsx
FloatingOrb.tsx
GridBackground.tsx

/lib
notion.ts
fetchProjects.ts
fetchBlogs.ts
fetchBook.ts
fetchNow.ts

/types
index.ts

/styles
globals.css

---

# 🔐 ENV VARIABLES

NOTION_API_KEY=
NOTION_PROJECT_DB=
NOTION_BLOG_DB=
NOTION_BOOK_DB=
NOTION_NOW_DB=

---

# 🔌 NOTION CLIENT SETUP

Create /lib/notion.ts:

* Initialize Notion client
* Export client

---

# 📡 DATA FETCHING

Each fetch file must:

* Query respective Notion DB
* Map response into clean typed objects
* Handle missing fields safely
* Sort by "Order" if present

Types:

Project:

* title
* description
* tags[]
* status
* featured (boolean)
* order (number)
* link (optional)

Blog:

* title
* thumbnail
* link
* date
* tags[]

Book:

* title
* description
* coverImage
* buyLink
* highlights

Now:

* text
* active

---

# 🎨 DESIGN SYSTEM

GLOBAL STYLE:

* Background: #0a0a0a
* Text: white / gray-400
* Accent: purple-500 / cyan-400

Glassmorphism:

* bg-white/5
* backdrop-blur
* border-white/10

---

# 🌌 3D VISUAL SYSTEM (IMPORTANT)

Use Three.js via react-three-fiber.

These visuals must be:

* Subtle
* Low-poly
* Lightweight
* Non-blocking for UI
* Disabled or simplified on mobile

---

## Components to Build:

### 1. SceneCanvas.tsx

* Wrapper around Canvas from @react-three/fiber
* Positioned absolute (background layer)
* z-index behind UI

---

### 2. FloatingOrb.tsx

* A softly glowing animated sphere
* Slow floating motion (y-axis oscillation)
* Slight rotation
* Gradient/emissive material (purple/cyan)

---

### 3. GridBackground.tsx

* Subtle 3D grid or wireframe plane
* Low opacity
* Positioned behind hero

---

## Behavior Rules:

* Render ONLY on desktop (md and above)

* On mobile:

  * Disable OR replace with static gradient

* FPS friendly:

  * Use low segment geometry
  * Avoid heavy shaders

---

# 🧩 COMPONENT REQUIREMENTS

## Navbar

* Sticky
* Blur on scroll

---

## Hero

* Full viewport height

* Include:
  LEFT:
  Text content

  RIGHT / BACKGROUND:
  SceneCanvas with FloatingOrb + GridBackground

* Ensure text is always readable over 3D

---

## ProjectCard

* Glass card
* Hover glow
* Slight tilt effect (optional)

---

## BlogCard

* Thumbnail
* Hover zoom

---

## BookShowcase

* Highlight section

---

## NowPanel

* Terminal-style UI
* Blinking cursor effect

---

## Container

* Max width: 1200px

---

# 🏠 PAGES

## Home

Sections:

1. Navbar
2. Hero (with 3D background)
3. NowPanel
4. Featured Projects
5. Writing Preview
6. Book Showcase

---

## Work

* Projects grid

---

## Writing

* Blog grid

---

## Book

* Dedicated page

---

# 🎬 ANIMATIONS

Framer Motion:

* Fade-in
* Stagger
* Hover scale

3D:

* Slow ambient motion only
* No aggressive movement

---

# 📱 RESPONSIVENESS

Mobile-first:

* Disable 3D on small screens
* Replace with gradient background

---

# ⚡ PERFORMANCE

* Use dynamic import for 3D components:
  ssr: false

* Lazy load 3D

* Avoid blocking main thread

---

# 🧪 EDGE CASES

* Missing Notion fields
* Empty states
* Broken images fallback

---

# ✨ OPTIONAL ENHANCEMENTS

* Cursor glow
* Page transitions
* Parallax effect (light)

---

# 🧾 OUTPUT

* Full working code
* Clean structure
* Ready to run

---

# 🧠 IMPORTANT

* Do NOT hardcode content
* Keep 3D subtle — UI must remain primary
* Maintain performance and accessibility

---

Build this like a premium SaaS + research lab hybrid experience.
