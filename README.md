# UX & Accessibility Audit (Revamp)

## Summary
The interface was modernized using the school color palette (Green, Navy, Gold) while addressing readability, contrast, semantics, keyboard navigation, motion sensitivity, and scalable structure.

## Changes Implemented
1. Color & Contrast
	- Reworked gradients to avoid low-contrast gold overlays behind brand text.
	- Replaced gradient-filled heading text with solid white or navy for WCAG contrast.
	- Added high-contrast gold button variant with navy text.
2. Typography / Hierarchy
	- Normalized heading levels (h1 in hero, h2 for major sections, h3/h4 nested subsections).
3. Landmarks & Semantics
	- Added <main>, role=banner, role=contentinfo, article roles for club cards.
4. Navigation / Focus
	- Implemented a skip link for screen readers/keyboard users.
	- Added consistent focus ring utility (.focus-ring) and improved link focus styles.
5. Forms
	- Associated labels explicitly with inputs; added aria-labels where necessary.
	- Dynamic add/remove buttons include accessible text.
6. Motion & Performance
	- Added prefers-reduced-motion override disabling non-essential animations.
7. State Feedback
	- Submission button uses aria-live via dynamic label for screen reader clarity.
8. Reusability
	- Created utility classes (card-glass, btn-brand, btn-outline-brand, badge-gold) to reduce duplication.

## Remaining Opportunities
| Area | Recommendation |
|------|----------------|
| Color contrast | Run automated tests (axe) for any residual edge cases (e.g., subtle muted text). |
| Dark mode | Introduce a toggle and CSS variables for dark theme inversion. |
| Form validation | Add inline accessible error messaging regions (aria-describedby) instead of only toast. |
| Loading states | Skeleton or shimmer placeholders for club list while querying. |
| Performance | Consider reducing layered radial gradients on low-power devices (feature-detect or prefers-reduced-data). |
| Internationalization | Externalize static strings for future translation. |

## Quick A11y Self-Check
Checklist (current status):
- [x] Page has a single <h1>
- [x] Landmarks: banner, main, contentinfo present
- [x] Skip link functional
- [x] Labels programmatically associated
- [x] Interactive controls keyboard reachable
- [x] Focus visible
- [x] Animations suppressible via reduced motion
- [ ] Inline validation messaging (future)
- [ ] Dark mode (future)

## Developer Notes
Tailwind utilities provide animation classes; avoid @apply loops with custom animation utilities to prevent circular dependency build failures.

# Grayson High School Club Bingo Website
  
This is a project built with [Chef](https://chef.convex.dev) using [Convex](https://convex.dev) as its backend.
 You can find docs about Chef with useful information like how to deploy to production [here](https://docs.convex.dev/chef).
  
This project is connected to the Convex deployment named [`adorable-blackbird-471`](https://dashboard.convex.dev/d/adorable-blackbird-471).
  
## Project structure
  
The frontend code is in the `app` directory and is built with [Vite](https://vitejs.dev/).
  
The backend code is in the `convex` directory.
  
`npm run dev` will start the frontend and backend servers.

## App authentication

Chef apps use [Convex Auth](https://auth.convex.dev/) with Anonymous auth for easy sign in. You may wish to change this before deploying your app.

## Developing and deploying your app

Check out the [Convex docs](https://docs.convex.dev/) for more information on how to develop with Convex.
* If you're new to Convex, the [Overview](https://docs.convex.dev/understanding/) is a good place to start
* Check out the [Hosting and Deployment](https://docs.convex.dev/production/) docs for how to deploy your app
* Read the [Best Practices](https://docs.convex.dev/understanding/best-practices/) guide for tips on how to improve you app further

## HTTP API

User-defined http routes are defined in the `convex/router.ts` file. We split these routes into a separate file from `convex/http.ts` to allow us to prevent the LLM from modifying the authentication routes.
