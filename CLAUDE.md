# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WWII Timeline is an interactive React application that explores World War II through a cinematic perspective, connecting historical events (1939-1945) with films and TV series. The app features a horizontal timeline interface with Firebase integration and TMDB (The Movie Database) API enrichment.

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (built on Radix UI)
- **State Management**: TanStack Query for API state
- **Routing**: React Router DOM
- **Database**: Firebase Firestore
- **External API**: TMDB (The Movie Database)

## Development Commands

```bash
# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Project Architecture

### Core Components
- **GitTimeline** (`src/components/ui/git-timeline.tsx`): Main timeline visualization component
- **HorizontalTimeline** (`src/components/ui/horizontal-timeline.tsx`): Alternative timeline layout
- **EnrichedMovieCard** (`src/components/ui/enriched-movie-card.tsx`): Displays movie data with TMDB integration

### Data Layer
- **Firebase Integration**: 
  - `src/lib/firebase.ts` - Firebase configuration
  - `src/lib/firestore.ts` - Firestore service layer with CRUD operations
- **TMDB Integration**:
  - `src/lib/tmdb.ts` - TMDB API service with movie search and enrichment
  - `src/lib/tmdb-cache.ts` - Caching layer for TMDB API calls
  - `src/utils/enrichWithTMDB.ts` - Enrichment utilities

### Data Structure
- Historical events stored in `src/data/sampleEvents.ts`
- Events contain: year, date, title, description, type (battle/liberation/etc), and related movies
- Movies include: title, year, director
- TMDB enrichment adds: posters, ratings, cast, trailers, detailed metadata

### Key Features
- **Timeline Navigation**: Horizontal scrolling through WWII events
- **Movie Integration**: Each historical event linked to relevant films/series
- **TMDB Enrichment**: Movies enhanced with posters, ratings, cast, and trailers
- **Search & Filtering**: Filter by period, event type, or search movies
- **Firebase Storage**: Events stored in Firestore with real-time updates
- **Data Migration**: Utility to migrate local data to Firebase

## Code Conventions

- **File Organization**: Components in `src/components/`, utilities in `src/utils/`, services in `src/lib/`
- **TypeScript**: Strict typing enabled, interfaces defined for all data structures
- **Styling**: Tailwind CSS classes, shadcn/ui components for consistency
- **API Calls**: Use TanStack Query for caching and state management
- **Error Handling**: Graceful degradation when Firebase/TMDB unavailable

## Environment Variables

The project requires TMDB API credentials:
- `VITE_TMDB_BASE_URL` - TMDB API base URL
- `VITE_TMDB_ACCESS_TOKEN` - TMDB API access token
- `VITE_TMDB_IMAGE_BASE_URL` - TMDB image CDN base URL

Firebase configuration is currently hardcoded in `src/lib/firebase.ts`.

## Important Files

- `src/App.tsx` - Main app component with routing
- `src/pages/Index.tsx` - Homepage with timeline and filtering
- `src/data/sampleEvents.ts` - Historical events dataset
- `src/lib/firestore.ts` - Database operations
- `src/lib/tmdb.ts` - Movie data enrichment service
- `tailwind.config.ts` - Tailwind configuration with custom colors
- `vite.config.ts` - Build configuration with path aliases (@/ → src/)

## Linting and Type Checking

- ESLint configuration in `eslint.config.js` with React and TypeScript rules
- TypeScript strict mode disabled for some checks (`noImplicitAny: false`, `strictNullChecks: false`)
- Run `npm run lint` before committing changes