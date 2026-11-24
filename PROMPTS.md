# Prompt Documentation

## 1. Initial Five-Part Prompt (Bolt.new)

```
Act as an expert full-stack web developer and UI/UX designer. Build a modern, responsive website called Yojana Saathi – AI-Powered Government Scheme Finder to help Indian citizens find government schemes based on their personal details.
Include a home page, eligibility form (age, state, gender, category, income, and occupation), scheme recommendations, category-wise scheme browsing, detailed scheme information, and an AI chatbot.
The website should filter schemes based on eligibility and display their benefits, criteria, required documents, application steps, and official links. The AI chatbot should answer government scheme-related questions in simple English and Hinglish.
Use React.js and Tailwind CSS. Create a clean, professional, mobile-friendly interface with subtle Indian tricolour-inspired colours. Ensure all features work properly, use reliable government information, and keep API keys secure.
Build a complete functional website with simple navigation and no login requirement.

```

| Part | Contribution to the generated website |
|---|---|
| Role | AI wrote professional, accessible code like a developer + designer |
| Task | Gave a clear goal (pages and features), so output stayed focused |
| Context | Made the UI simple and mobile-friendly for the target audience |
| Constraints | Controlled tech stack, pages, form fields and design |
| Output Format | Gave organized folder structure and explanations |

**Result:** **What Bolt generated:**
- A working React + TypeScript + Tailwind CSS project with a folder
  structure and a local scheme dataset (20 central government schemes
  with benefits, eligibility, documents, steps and official links)
- Pages: Home, Find Schemes (eligibility form), Browse Schemes,
  Scheme Details and About
- An eligibility filter that changes results based on the user's inputs
- A floating chatbot widget with a complete chat UI (message bubbles,
  suggestion chips, typing indicator)
- A disclaimer on the About page and links to official portals

**What was right:**
- All requested core pages and the form fields were created
- The layout was responsive and clean on mobile
- The folder structure was organized and easy to understand
- Filter results changed correctly for different inputs

**What was wrong or missing:**
- **Build error:** the first version crashed with `bg-ink-50 class does
  not exist`, even though Bolt reported that the build "passes type
  checks cleanly" (the AI's claim did not match the actual result)
- **Theme:** we asked for a blue/green theme, but Bolt used a
  saffron/white/green tricolour theme
- **Number of schemes:** we asked for 15 schemes, Bolt created 20
- **Extra page:** a Browse Schemes page was added that was not requested
- **Incorrect claim:** the homepage said "All States covered", which
  was not true for the dataset
- **Form validation:** submitting the form with empty fields showed all
  schemes instead of showing validation errors
- **Chatbot:** we asked for a placeholder UI only, but Bolt built a
  keyword-matching chatbot with predefined replies. For "cricket
  score?" it returned unrelated loan scheme information
- **Data accuracy:** scheme details were AI-generated, so we manually
  verified them against official government websites

These gaps became the basis for our follow-up prompts.

## 2. Prompt Log

After the initial five-part prompt, we used three follow-up prompts in
Bolt.new and one prompt in Cursor.

### Prompt 1: Error fix (Context-based + Chain + Structured)
- **Tool:** Bolt.new
- **Problem:** `bg-ink-50` class does not exist (PostCSS/Tailwind error)
- **Prompt:**
```
The preview is crashing with this error:

[plugin:vite:css] [postcss] /home/project/src/index.css:3:1:
The `bg-ink-50` class does not exist. If `bg-ink-50` is a custom
class, make sure it is defined within a `@layer` directive.

Please do the following in order:
1. Find every use of the custom "ink" color (bg-ink-*, text-ink-*,
   border-ink-*) in index.css and across all components.
2. Define the full "ink" color scale (50 to 900) in
   tailwind.config.js under theme.extend.colors, or replace these
   classes with standard Tailwind colors.
3. Make sure the project compiles with no errors.

Return the answer as: Problem / Cause / Fix / Files changed.
```
- **What Bolt found:** The `ink` color was already defined in the
  config and the production build passed, but the dev preview crashed
  because the `@apply` directive could not resolve the custom `ink-*`
  classes during PostCSS processing.
- **Fix:** Bolt replaced `ink-*` with standard `slate-*` classes inside
  6 `@apply` rules in `index.css` (Bolt Version 2).
- **Response evaluation:** Earlier Bolt had reported that the build
  "passes type checks cleanly", but the preview still crashed. We
  learned to test the AI's output ourselves instead of trusting its
  claim.

![Error fix prompt in Bolt](screenshots/bolt-error-fix.png)

### Prompt 2: Theme, stats and chatbot cleanup (Chain prompting)
- **Tool:** Bolt.new
- **Before:** Saffron/green theme, "All States covered" claim,
  keyword-based fake chatbot
- **Prompt:**
```
Please make these changes in order. Complete each step before the next.

1. Theme: change the color scheme from saffron/green to a blue and
   green theme (primary blue, green accents). Keep the design clean
   and readable.
2. Homepage stats: replace "All States covered" with an accurate
   claim based on the actual data (for example "Central schemes").
3. Chatbot: remove the keyword-matching reply logic. Move message
   handling into a single function sendMessage() in
   src/lib/chatApi.ts that currently returns a placeholder message
   ("AI assistant is being connected"). The UI must stay unchanged.
   This function will later be replaced with a real API call.

After each step, tell me which files changed.
```
- **After:** Blue/green theme, "100% Central schemes" stat, and chatbot
  logic moved into one `sendMessage()` function in `chatApi.ts`
  (Bolt Version 3). Bolt completed the steps one by one and reported
  the files changed after each step. Keeping the chatbot logic in one
  function later made the Cursor integration easier, because only one
  file had to change.

![Chain prompt in Bolt](screenshots/bolt-chain-prompt.png)

### Prompt 3: Form validation (Structured + Chain + Prompt refinement)
- **Tool:** Bolt.new
- **Before:** Submitting the form with empty fields showed all schemes
- **Prompt:**
```
The Find Schemes form currently submits with empty fields and shows
all schemes. Fix this in order:

1. Make all 5 fields required (age, state, category, annual income,
   occupation).
2. Validation rules: age must be a number between 1 and 120, income
   must be a number of 0 or more, and state, category and occupation
   must be selected.
3. Show a clear inline error message under each invalid field, in
   simple language.
4. Do not navigate to the results page until all fields are valid.
5. If no schemes match, show a friendly "no schemes found" state with
   a suggestion to browse all schemes.

Return the answer as: Problem / Cause / Fix / Files changed.
```
- **What Bolt did:** It first read the current FindSchemes view, checked
  the `UserProfile` type, and noticed that `gender` is optional (not
  one of the 5 required fields). Then it rewrote the view with full
  validation.
- **After:** All 5 fields are required with inline error messages, and
  results appear only after valid input.

![Form validation prompt in Bolt](screenshots/bolt-form-validation.png)

### Prompt 4: Chatbot integration (Role + Context + Constraints + Structured)
- **Tool:** Cursor
- **Prompt:**
```
Role: Senior full-stack developer.

Task: Replace the placeholder chatbot logic with a real AI chatbot
using the Gemini API.

Context: This is a React + Vite + Tailwind project called "Yojana
Saathi", a government scheme finder for Indian students, farmers and
low-income families. The chat UI already exists in
src/components/ChatbotWidget.tsx. It calls sendMessage() in
src/lib/chatApi.ts, which currently returns a placeholder message.
The project will be deployed on Vercel.

Constraints:
- Create a Vercel serverless function at /api/chat.ts that receives
  { messages } (chat history) via POST and calls the Gemini API
  using process.env.GEMINI_API_KEY. The key must never appear in
  frontend code.
- Add a system instruction on the server: the assistant is "Yojana
  Saathi", answers only about Indian government schemes in simple
  Hinglish, politely declines unrelated questions, never invents
  eligibility or amounts, and always reminds users to verify on the
  official website.
- Update sendMessage() in src/lib/chatApi.ts to call /api/chat and
  return the reply. Keep the UI unchanged.
- Error handling: empty or whitespace-only input, message longer
  than 500 characters, network failure, API failure (5xx), and
  rate limit (429), each with a friendly message shown in the chat.
- Keep a loading state while waiting.
- Add a .env.example file and make sure .env is in .gitignore.

Output format: List of files created or changed, the full code for
each, then a short explanation of how the request flows from UI to
Gemini and back.
```
- **Result:** Cursor created `/api/chat.ts` (serverless function),
  updated `chatApi.ts`, added the server-side system instruction,
  error handling, `.env.example` and `vercel.json`. The chatbot now
  returns real Gemini responses.

## Prompt Refinement: How a better prompt improved the output

| | Original prompt | Refined prompt (Prompt 3) |
|---|---|---|
| Instruction | "Form validation for all inputs" (one line, no rules) | Exact rules: 5 required fields, age 1 to 120, income 0 or more, inline errors, no navigation until valid |
| Output | Empty form submitted and showed all schemes | Validation errors appear and results show only for valid input |
| Why | Too vague, so the AI skipped it | Specific, ordered and measurable, so the AI could follow and we could test it |

## Prompt Engineering Techniques Used

| Technique | Where we used it |
|---|---|
| Role-based prompting | Initial prompt and the Cursor prompt (senior full-stack developer) |
| Context-based prompting | Initial prompt (problem and audience), error-fix prompt (exact error), Cursor prompt (project structure) |
| Structured prompting | "Problem / Cause / Fix / Files changed" output format, and the Role / Task / Context / Constraints / Output structure |
| Step-by-step (chain) prompting | Prompts 1, 2 and 3 (numbered steps, done in order) |
| Clear instructions and constraints | Initial prompt, validation rules, chatbot error-handling rules |
| Prompt refinement | Form validation: vague one-line constraint, then a detailed prompt |
| Response evaluation | Checked Bolt's claim "build passes" against the actual preview and found a crash; tested the chatbot ourselves |
