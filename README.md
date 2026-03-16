# Brand Hub

A centralized digital brand asset platform with AI-powered search. Built with Express, Vite, React, Tailwind CSS, and shadcn/ui.

## Features

- **AI-Powered Search** — Natural language queries against your full brand context (Claude)
- **Logos** — Background toggles (white/black/gray/checkerboard) with download buttons
- **Colors** — One-click copy for HEX, RGB, CMYK, and Pantone values
- **Gradients** — Live previews with CSS code
- **Typography** — Live specimens with weight previews and hierarchy examples
- **Images & Artwork** — Tag-filtered galleries
- **Icons** — Searchable grid with download packs
- **Brand Guidelines** — Sidebar-navigated content modules
- **Admin Dashboard** — Asset inventory and management
- **Dark Mode** — Full theme toggle with system preference detection
- **Mobile Responsive** — Adaptive layouts throughout

## Local Development

```bash
npm install
npm run dev
```

The dev server starts on port 5000 with both the Express API and Vite HMR.

## Deploying to Vercel

1. Import this repository on [vercel.com/new](https://vercel.com/new)
2. Add the environment variable `ANTHROPIC_API_KEY` with your Anthropic API key (for AI search)
3. Deploy — Vercel auto-detects the config from `vercel.json`

The frontend is built with `npm run build:client` and served as static files. The `/api` directory contains the Express serverless function handling all backend routes.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Optional | Enables AI-powered search. Falls back to keyword search without it. |

## Stack

- **Frontend:** React, Tailwind CSS, shadcn/ui, Framer Motion, Wouter
- **Backend:** Express (serverless on Vercel)
- **AI:** Anthropic Claude (via `@anthropic-ai/sdk`)
- **Fonts:** Cabinet Grotesk, Satoshi (Fontshare), JetBrains Mono (Google Fonts)
