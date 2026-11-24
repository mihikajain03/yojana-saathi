# Project memory

## Product intent & audience

- Web app for Indian citizens to discover relevant government schemes (yojanas) based on personal details.
- Two main discovery paths: an eligibility form and an AI chatbot.
- Audience: general public, likely wide range of digital literacy; content must be clear and accessible.

## Brand personality & voice

- Modern, trustworthy, helpful, citizen-centric.
- Tone should be clear and approachable, guiding users through scheme eligibility without jargon.

## Visual design & UX direction

- Stack: React (Vite), Tailwind CSS, Lucide React icons; `@/` path alias for imports.
- Custom `ink` color scale defined in `tailwind.config.js` under `theme.extend.colors`; it is a rename of Tailwind's built-in `slate` scale (50–900).
- `ink-*` utility classes are used across JSX components and views (e.g. `bg-ink-*`, `text-ink-*`, `border-ink-*`).
- Responsive, production-worthy UI; avoid cookie-cutter layouts per global prompt.

## Decisions, constraints & rationale

- Do not use `@apply` with custom `ink-*` classes inside `index.css` layers — Vite dev server PostCSS pipeline fails to resolve custom-theme colors at `@apply` time, even though production build passes.
- Decision: inside CSS `@apply` rules, use standard `slate-*` equivalents instead of `ink-*`; keep `ink` defined in config so JSX utility classes continue to work.
- Lucide React is the only icon library; no extra UI/theme packages unless explicitly requested.
- Global instructions in `.bolt/prompt` take precedence and are not restated here.

## Open questions & assumptions

- Exact set of government schemes and data source not yet specified.
- AI chatbot backend/provider and eligibility-matching logic details not yet established.
- Accessibility requirements (language localization, screen-reader support) not yet defined.