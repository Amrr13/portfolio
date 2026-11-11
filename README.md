# Amr Mohamed Taher’s portfolio

A React and Vite portfolio covering AI engineering, Arabic NLP, and robotics.

## Develop locally

1. Install dependencies with `npm ci`.
2. Run `npm run dev` and open the URL printed by Vite.
3. Run `npm run build` to create the production site in `dist/`.

Project descriptions, categories, profile age, and credentials are in `src/content.ts`. Certificate images and the profile photo are in `public/`.

The Vercel build uses Vite. To enable custom Arabic sentences in the analyzer, set `GEMINI_API_KEY` in the Vercel project's server environment and redeploy. The built-in examples work independently. Use Vercel's development server to test the server function locally.
