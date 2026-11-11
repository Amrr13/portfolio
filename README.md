# Amr Mohamed Taher’s portfolio

A React and Vite portfolio covering AI engineering, Arabic NLP, and robotics.

## Develop locally

1. Install dependencies with `npm ci`.
2. Run `npm run dev` and open the URL printed by Vite.
3. Run `npm run build` to create the production site in `dist/`.

Project descriptions, categories, profile age, and credentials are in `src/content.ts`. Certificate images and the profile photo are in `public/`.

The Vercel build uses Vite. The Arabic analyzer uses Gemini when `GEMINI_API_KEY` is configured. Otherwise, a verified Vercel account can use Reflection Beam through the project's built-in identity while the zero-price offer is available. It uses basic grammar rules if neither hosted model is available. Use Vercel's development server to test the server function locally.
