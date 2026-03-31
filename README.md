# Nixon Kurian — Portfolio

A futuristic, production-grade personal portfolio for an AI Systems Engineer. Built with Next.js (App Router), Three.js, and Notion as a headless CMS.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

## Features

- **Dynamic content** — All projects, blogs, book, and "now" data pulled from Notion
- **3D visuals** — Subtle floating orb and wireframe grid via `@react-three/fiber` (desktop only)
- **Glassmorphism design** — Dark theme with purple/cyan neon accents
- **Responsive** — Mobile-first; 3D disabled on small screens, replaced with gradient
- **Performant** — Three.js loaded via `dynamic()` with `ssr: false`; low-poly geometry
- **Animated** — Framer Motion fade-in, stagger, and hover effects

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui |
| Animation | Framer Motion |
| 3D | Three.js, @react-three/fiber, @react-three/drei |
| CMS | Notion API (`@notionhq/client`) |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Hero, Now panel, featured projects, writing preview, book showcase |
| `/work` | Full projects grid |
| `/writing` | Blog grid |
| `/book` | Dedicated book page |

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url> && cd portfolio
npm install
```

### 2. Configure Notion

1. Create a [Notion integration](https://www.notion.so/my-integrations) and get your API key
2. Create four Notion databases with these properties:

**Projects DB**
| Property | Type |
|----------|------|
| Name | Title |
| Description | Rich text |
| Tags | Multi-select |
| Status | Select |
| Featured | Checkbox |
| Order | Number |
| Link | URL |

**Blogs DB**
| Property | Type |
|----------|------|
| Name | Title |
| Thumbnail | Files & media |
| Link | URL |
| Date | Date |
| Tags | Multi-select |

**Book DB**
| Property | Type |
|----------|------|
| Name | Title |
| Description | Rich text |
| Cover | Files & media |
| BuyLink | URL |
| Highlights | Rich text (newline-separated) |

**Now DB**
| Property | Type |
|----------|------|
| Text | Title |
| Active | Checkbox |

3. Share each database with your integration
4. Copy database IDs from the Notion URL

### 3. Set Environment Variables

```bash
cp .env.example .env.local
```

Fill in:

```
NOTION_API_KEY=secret_xxx
NOTION_PROJECT_DB=xxx
NOTION_BLOG_DB=xxx
NOTION_BOOK_DB=xxx
NOTION_NOW_DB=xxx
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.tsx            # Home page
  work/page.tsx       # Projects grid
  writing/page.tsx    # Blog grid
  book/page.tsx       # Book page
  layout.tsx          # Root layout (dark theme)
  globals.css         # Tailwind + custom styles

components/
  Hero.tsx            # Full-viewport hero with 3D background
  Navbar.tsx          # Sticky nav with blur on scroll
  ProjectCard.tsx     # Glass card with hover glow
  BlogCard.tsx        # Thumbnail card with hover zoom
  BookShowcase.tsx    # Cover + details layout
  NowPanel.tsx        # Terminal-style "now" display
  SceneCanvas.tsx     # Three.js canvas wrapper
  FloatingOrb.tsx     # Animated wireframe sphere
  GridBackground.tsx  # Subtle 3D wireframe plane
  Container.tsx       # Max-width wrapper (1200px)
  SectionHeading.tsx  # Animated section title

lib/
  notion.ts           # Notion client init
  fetchProjects.ts    # Query projects DB
  fetchBlogs.ts       # Query blogs DB
  fetchBook.ts        # Query book DB
  fetchNow.ts         # Query now DB

types/
  index.ts            # TypeScript interfaces
```

## Deployment

Deploy to Vercel:

```bash
npm run build
```

Set the environment variables in your Vercel dashboard, then deploy.

## License

MIT
