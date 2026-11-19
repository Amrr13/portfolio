# Amr Mohamed Taher’s portfolio

A React and Vite portfolio focused on data science and machine learning, with projects in Arabic NLP, computer vision, and robotics.

## Develop locally

1. Install dependencies with `npm ci`.
2. Run `npm run dev` and open the URL printed by Vite.
3. Run `npm run build` to create the production site in `dist/`.

Project descriptions, categories, profile age, and credentials are in `src/content.ts`. Certificate images and the profile photo are in `public/`.

## Arabic analyzer

Create a [Gemini API key](https://aistudio.google.com/apikey) and add it as the
server-side `GEMINI_API_KEY` in the [Vercel project environment variables](https://vercel.com/amrr13s-projects/portfolio-do2n/settings/environment-variables).
Select Production and redeploy. Store local development credentials in an ignored
`.env.local` file and use Vercel's development server to run the function locally.

The server sends the submitted sentence to Gemini 3.5 Flash-Lite and validates
its structured response against the original words. If the provider is unavailable,
the demo returns a rule-based result for supported simple sentences. Other
sentences receive an availability message.
