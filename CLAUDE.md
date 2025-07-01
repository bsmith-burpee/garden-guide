# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 content-driven website for Burpee Garden Guide, integrating with Contentful CMS to deliver expert gardening advice, recipes, and product showcases. The site serves as a proof-of-concept for migrating content from Magento to a modern Next.js architecture.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture & Key Patterns

### Contentful Integration
- **Environment Variables Required:** `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`, `CONTENTFUL_ENVIRONMENT`
- **Content Types:** Articles (527), Recipes (47), Products, Ingredients
- **Dual Slug Support:** Legacy `slug` and `newSlug` fields for URL migration
- **Rich Text Rendering:** Custom `@contentful/rich-text-react-renderer` implementation with Tailwind styling

### Data Fetching Patterns
- **Server Components:** Use `getArticles()`, `getRecipes()` from `@/lib/contentful` for SSG/SSR
- **Client-side Pagination:** API routes at `/api/articles` and `/api/recipes` with `skip`/`limit` parameters
- **Infinite Scroll:** Custom hook `useInfiniteScroll` with 200px threshold, 12 items per page

### Next.js Configuration
- **Image Domains:** Contentful CDN (`images.ctfassets.net`) configured in `next.config.ts`
- **App Router:** Modern routing with dynamic segments `[slug]` for articles/recipes
- **TypeScript:** Strict mode with path aliases (`@/*`)

### Component Structure
- **Card Components:** `ArticleCard`, `RecipeCard` with consistent design patterns
- **List Components:** `ArticlesList`, `RecipesList` with infinite scroll capability
- **Layout:** Header/Footer with Burpee branding, responsive navigation
- **Rich Text:** Custom renderer for Contentful documents with proper Tailwind styling

### Key Technical Decisions
- **Server/Client Boundary:** Contentful client code isolated to server-side utilities
- **Image Handling:** Next.js Image component with automatic HTTPS protocol enforcement
- **Error Handling:** 404 pages for missing content, graceful API error responses
- **Performance:** Static generation where possible, client-side infinite scroll for large datasets

### Styling & Responsiveness
- **Tailwind CSS:** Utility-first approach with custom CSS variables
- **Grid Layouts:** Responsive breakpoints (1 col mobile, 2 col tablet, 3 col desktop)
- **Loading States:** Animated spinners for infinite scroll
- **Typography:** Proper heading hierarchy and line clamping for content previews

### Content Management
- **Slug Migration:** Code handles both old and new slug systems for seamless transitions
- **SEO Optimization:** Dynamic metadata generation per article/recipe page
- **Content Limits:** Pagination respects Contentful's 7MB response size limit
- **Rich Content:** Proper rendering of embedded assets and structured text

## Development Notes

- The codebase uses Next.js 15 with React 19, ensuring modern patterns and performance
- Contentful integration requires proper environment setup with valid API credentials
- Image optimization is critical - all Contentful images must be properly configured
- The infinite scroll implementation is custom-built and requires careful state management
- TypeScript is enforced in strict mode throughout the entire codebase