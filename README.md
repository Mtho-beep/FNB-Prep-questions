# FNB AI Interview Preparation App

An interactive, offline-first web app for preparing for an AI / software engineering interview. Built with
React, TypeScript, Vite and Tailwind CSS. All questions, model answers and progress tracking are stored
locally — there is no backend, no external API, and no OpenAI/Claude API key required.

**Not affiliated with, endorsed by, or built by FirstRand Bank Limited (FNB).** This is an independent
practice tool.

## Features

- **Dashboard** — overall progress, completed/remaining counts, mastered/difficult counts, per-category
  progress bars, recent activity, and quick-action cards.
- **341 real interview questions** across 13 categories (Behavioural, Teamwork, Project Questions — FNB
  Intelligent Banking Simulation & StudyTogether, AI Fundamentals, Machine Learning, LLMs & Generative AI,
  AI Agents, Python, SQL & Databases, AI + Banking, AI Ethics, System Design, Security), each with a model
  answer, key points, follow-up questions, and (where relevant) a note connecting it back to your own
  projects.
- **10 Coderbyte-style coding questions** (Two Sum, Valid Parentheses, Binary Search, etc.) with a problem
  statement, examples, hints, a Python and JavaScript solution, line-by-line explanation, time/space
  complexity, common mistakes, and a follow-up question. JavaScript solutions run for real, in your browser,
  against the sample test cases; Python is a clearly-labelled simulated practice environment (no backend
  exists to execute Python).
- **45 Rapid Fire flashcards** for quick memorisation.
- **Practice modes**: Browse (by category), Random, Weak Areas (difficult/incomplete only), and Mock
  Interview (15 random questions across categories, one at a time, answer hidden until you say you've
  answered).
- **Search and filters** by category, difficulty, and completion/mastery status.
- **Progress persisted to LocalStorage**: completed, mastered, difficult, last-viewed question, category
  progress, and mock interview history — with a "Reset Progress" option (with confirmation).
- Responsive layout (desktop/tablet/mobile) with a collapsible sidebar.

## Project Structure

```
src/
  components/     Sidebar, QuestionCard, AnswerDropdown, ProgressBar, CategoryCard,
                   MockInterview, CodingQuestion, CodeEditor, SearchBar, Filters, Badge
  data/            One .ts file per category + coderbyteQuestions.ts, rapidFireQuestions.ts, index.ts
  pages/           Dashboard, Practice, MockInterviewPage, Coderbyte, RapidFire
  hooks/           useLocalStorage, useProgress, useQuestions
  types/           questions.ts (shared data model)
  utils/           slug.ts (category <-> URL slug mapping)
  App.tsx, main.tsx, index.css
```

## Install & Run

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

To build a static production bundle:

```bash
npm run build
npm run preview
```

## Limitations

- Python code in the Coderbyte section is **not actually executed** — there is no backend or Python
  runtime in the browser. The app says this explicitly rather than faking a result. Switch the language
  selector to JavaScript to get real, in-browser execution against the sample test cases.
- Rapid Fire "known" tracking is session-only (not persisted) — it's meant for quick, repeatable drilling
  rather than long-term progress tracking, which lives on the main question set instead.
- Mock Interview history is stored in LocalStorage per browser/device; it won't sync across devices.
