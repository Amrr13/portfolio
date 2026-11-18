# Amr Mohamed Taher’s portfolio

A React and Vite portfolio covering AI engineering, Arabic NLP, and robotics.

## Develop locally

1. Install dependencies with `npm ci`.
2. Run `npm run dev` and open the URL printed by Vite.
3. Run `npm run build` to create the production site in `dist/`.

Project descriptions, categories, profile age, and credentials are in `src/content.ts`. Certificate images and the profile photo are in `public/`.

The Arabic analyzer uses grammar rules for simple constructions and a bundled UDPipe model to estimate the roles of words in other Modern Standard Arabic sentences. The function analyzes submitted text on the portfolio server and requires no external credentials. Use Vercel's development server on x64 Windows or Linux to test the server function locally. See the [parser and model credits](vendor/udpipe/README.md) for training and license details.
