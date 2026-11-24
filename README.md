# Yojana Saathi: AI-Powered Government Scheme Finder

Yojana Saathi helps Indian citizens discover central government schemes
they are eligible for, and explains them in simple language through an
AI chatbot.

**Live website:** [PASTE VERCEL URL HERE]

## Problem Statement
India has thousands of government schemes (scholarships, agriculture,
healthcare, housing, education loans), but many eligible citizens are
unaware of them or find the official information too complex. This
creates an awareness gap.

## Objectives
- Help users find schemes they are eligible for, based on their details
- Explain schemes in simple English and Hinglish
- Guide users on documents and application steps

## Target Audience
Students, farmers and low-income families.

## Features
- **Eligibility finder:** form (age, state, category, annual income,
  occupation) with validation, and filter logic that shows matching schemes
- **Browse schemes:** view all schemes by category
- **Scheme detail pages:** benefits, eligibility, documents, how to
  apply, official links
- **AI chatbot:** answers questions about government schemes using the
  Gemini API, declines unrelated questions, and handles errors
  (empty input, long input, network and API failures)
- Mobile-friendly responsive design, no login required

## Technologies Used
- React, TypeScript, Vite, Tailwind CSS
- Vercel serverless function (`/api/chat`)
- Google Gemini API
- Git and GitHub

## AI Tools Used
| Tool | Contribution |
|---|---|
| Claude | Project planning, prompt design, debugging, documentation |
| Bolt.new | Generated the first version of the website from the five-part prompt |
| Cursor | Integrated the AI chatbot (serverless API, system prompt, error handling) |

## How the Chatbot Works
User message → Chat UI → `sendMessage()` → `POST /api/chat`
(serverless function) → Gemini API → reply shown in the chat.
The API key is stored only as a server-side environment variable and
is never exposed in the frontend.

## Screenshots
[ADD SCREENSHOTS HERE]

## Prompt Documentation
See [PROMPTS.md](PROMPTS.md) for the initial five-part prompt, follow-up
prompts and improvements.

## Run Locally
1. Clone the repository
   ```
   git clone [YOUR REPO LINK]
   cd yojana-saathi
   ```
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file (see `.env.example`) and add your key
   ```
   GEMINI_API_KEY=your_key_here
   ```
4. Run with Vercel CLI (so the `/api` route works locally)
   ```
   npm i -g vercel
   vercel dev
   ```

## Disclaimer
Scheme information is for awareness only. Always verify details on the
official government websites before applying.

## Team
[ADD TEAM MEMBER NAMES]
