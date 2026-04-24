# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server (hot reload)
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

There is no test runner or linter configured.

## Architecture

**Stack:** React 18, React Router DOM v6, Vite. Plain JavaScript (no TypeScript). No backend — all data is static mock data.

**Auth:** `isAuthenticated` is in-memory `useState` in `App.jsx`. Login/logout are passed down via `authActions`. There is no real session persistence.

**Routing & layouts — two shells:**
- `AuthLayout` wraps `/login` and `/register` (two-column marketing + form grid)
- `ProtectedLayout` wraps all authenticated routes — renders the sidebar nav and a `<div className="content-area">` where the page `<Outlet />` renders. Access is gated by `ProtectedRoute` in `App.jsx`.

**Pages** (`src/pages/`): `DashboardPage`, `DietPage`, `WorkoutPage`, `CommunityPage`, `PostDetailPage`, `ProfilePage`, `LoginPage`, `RegisterPage`. Each page imports directly from `src/data/mockData.js` — there are no API calls.

**Shared components** (`src/components/`): `StatCard`, `ProgressBar`, `QuickLinkCard`, `PostCard`, `PageHeader`. These are presentational only.

**Styling:** Single global stylesheet at `src/styles/global.css` using CSS custom properties (`--bg`, `--card`, `--primary`, etc.). No CSS modules, no utility framework. Layout uses CSS Grid throughout. Responsive breakpoint at 900 px collapses the sidebar into a horizontal nav row.

**Mock data** (`src/data/mockData.js`): Exports `dashboardData`, `nutritionGoals`, `foodLogs`, `workoutLogs`, `posts`, `commentsByPostId`, `profile`. Any new page feature should pull from or extend this file until a real backend is added.
