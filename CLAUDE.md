# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Sandy's personal portfolio site built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Commands

```bash
npm run dev          # start dev server at localhost:3000
npm run build        # production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

Run a single Jest test file:
```bash
npx jest path/to/file.test.ts
```

## Architecture

- **App Router** (`app/`) — all routes are in `app/`, using React Server Components by default. Client components are marked `"use client"`.
- **Components** (`components/`) — shared UI components. Keep client-only state/interactivity isolated to leaf components so parent layouts remain server-rendered.
- **Tailwind** — utility-first styling; no separate CSS modules unless a component has complex animation state that Tailwind can't express cleanly.
- **Static assets** (`public/`) — images, fonts, and other static files served directly.

## Git workflow

- Commit locally after each meaningful change.
- **Never push** unless explicitly asked to push.

## Key conventions

- Use the App Router file conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`.
- Prefer `Image` from `next/image` for all images (automatic optimization).
- Prefer `Link` from `next/link` for internal navigation.
- Environment variables exposed to the browser must be prefixed `NEXT_PUBLIC_`.
