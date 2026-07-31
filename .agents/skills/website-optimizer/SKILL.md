---
name: website-optimizer
description: >
  Optimizes website performance by eliminating UI delays, reducing API latency, 
  and fixing image loading issues. Use this skill whenever the user asks to 
  optimize site speed, resolve lag, or improve frontend metrics.
---
# Website Optimizer Workflow

You are an expert performance engineer and Quality Assurance Validator. When optimizing a site, you must proactively identify and resolve bottlenecks to ensure a frictionless, instant user experience. **Crucially, you must validate all optimizations in production.**

## 1. Image & Asset Optimization
- **Eliminate Buffering & Blurriness:** Ensure images are served at the correct resolution for their container. If a high-res image is needed on click, preload it or use progressive loading.
- **Modern Standards:** Use `loading="lazy"` for off-screen images and `priority`/preloading for above-the-fold content. Use modern formats (WebP/AVIF) and proper `srcset` configurations.
- **Placeholders:** Always implement blur-up placeholders or skeleton loaders so the user never stares at a blank space.
- **Mandatory Image Validation:** Always validate that images load correctly in the browser when making structural HTML changes or refactoring image URLs. Never assume URL string manipulation is correct without visual validation via Playwright or by capturing screenshots of the live UI.

## 2. API & Data Fetching
- **Eliminate Waterfalls:** Identify consecutive `await` statements that do not depend on each other and refactor them to run concurrently.
  - *Example:* Change `const a = await fetchA(); const b = await fetchB();` to `const [a, b] = await Promise.all([fetchA(), fetchB()]);`
- **Caching:** Ensure data fetching uses caching strategies (e.g., SWR, React Query, or framework-specific caches) to eliminate redundant network delays on repeated visits.
- **Debouncing:** Ensure search bars and rapid interactions are properly debounced.

## 3. UI Reactivity & Flow
- **Optimistic Updates:** The UI must respond *instantly* to user clicks. Update the UI optimistically before waiting for the API response.
- **Feedback:** If a delay is unavoidable, provide immediate visual feedback (e.g., active states, disabled buttons, spinners) within 50ms of a click.
- **Code Splitting:** Lazy-load heavy, non-critical components to keep the initial JavaScript bundle small and the main thread unblocked.

## 4. Strict Validation & Verification Loop (Mandatory)
- **Production-Only Testing:** All validation must be done against the live production URL (e.g. `https://celebrease.com`). NEVER test against localhost.
- **Deployment Verification:** If your optimization requires a deployment (e.g., Netlify/Vercel), you MUST wait for the deployment to finish and verify it was successful before testing.
- **Playwright Validation:** You must verify the functionality directly in the production environment using the Playwright MCP. If it fails, write and execute a standalone, headless Node.js Playwright script.
- **Zero-Defect Standard:** Repeatedly test, verify, and loop until you have unshakeable 100% proof that the exact required change is live and functioning without defects. Never declare a task complete prematurely.

## 5. Common Gotchas
- **Playwright Timings:** When validating optimizations via Playwright, do not rely solely on `networkidle`. Explicitly wait for specific DOM elements or API responses to confirm the UI is rendered.
- **Framework Caching:** Frameworks like Next.js aggressively cache responses. Ensure your Playwright validation tests aren't being served stale data by using cache-busting mechanisms if necessary.
- **Image Optimization Boundaries:** When refactoring image URLs or adding standard `srcset`s, beware of framework-specific image components (e.g., `next/image`) that might conflict with standard HTML attributes.
