# FNB AI Interview Preparation App

An interactive, offline-first web app for preparing for an AI / software engineering interview. Built with
React, TypeScript, Vite and Tailwind CSS. All questions, model answers and progress tracking are stored
locally. The core app needs no backend or API key; the optional AI Voice Mock Interview can use Groq's
free tier or Claude (through the Streamlit server) or a local Ollama model, and falls back to offline
scoring without any of them.

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
- **AI Voice Mock Interview** (`/voice-interview`) — see below.

## AI Voice Mock Interview

A spoken, timed interview on top of the existing question bank (no questions are duplicated — the
engine adapts `src/data` through `services/interviewAdapter.ts`).

- **Modes**: 15-Minute FNB Mock Interview (introduction → motivation → project deep dive → technical →
  behavioural → closing), AI Technical, Project Deep Dive, AI Fundamentals, Behavioural, Rapid Fire, and a
  Coding Interview where you explain your approach to a Coderbyte problem out loud.
- **Timer-driven**: each phase has a time budget; long answers mean fewer questions, and the interview
  jumps to closing when time is short. Difficulty can be fixed or Adaptive (goes deeper after strong
  answers, easier after weak ones, capped at junior level).
- **Adaptive follow-ups**: every answer is classified strong / partial / weak / off-topic / unclear, and
  the interviewer probes deeper, clarifies, redirects or moves on — referring back to what you said.
  Question choice mixes ~40% core, 30% weak areas (questions you marked Difficult + weak topics from this
  interview), 20% project-linked and 10% random.
- **Voice**: speech-to-text via the browser's Web Speech API (`useSpeechRecognition`), text-to-speech via
  `speechSynthesis` (`useTextToSpeech`) with voice/speed settings. The transcript is always editable, and
  everything works in text-only mode.
- **Report**: a 100-point *practice* score (Technical 25, Project 20, Problem Solving 15, Communication 15,
  Behavioural 10, AI/ML Fundamentals 10, Confidence 5), strengths, areas to improve, recommended questions
  from the bank, and a per-answer review with the existing model answer. Saved to **Interview History** and
  summarised on the Dashboard.
- Model answers, key points and scores are never shown during the interview (unless you turn on
  Live feedback). An interrupted interview (reload, crash, network failure) can be resumed with its
  transcript intact.

### AI provider

| Provider | Where it runs | Configure |
|---|---|---|
| Groq (free tier) | `streamlit_app.py` calls Groq server-side (`llm.py`); the key never reaches the browser | `GROQ_API_KEY` (and optionally `GROQ_MODEL`, default `openai/gpt-oss-120b`) in Streamlit secrets — free key at console.groq.com |
| Claude (paid) | Same, via the Anthropic API. Takes priority if both keys are set | `ANTHROPIC_API_KEY` (and optionally `ANTHROPIC_MODEL`, default `claude-opus-5`) in Streamlit secrets |
| Ollama | Browser → your local Ollama server | `VITE_OLLAMA_MODEL` / `VITE_OLLAMA_URL` in `.env.local` (see `.env.example`) |
| Offline | No AI: keyword-overlap scoring and the follow-ups stored with each question | nothing |

The provider can also be chosen on the interview setup screen, which checks the connection first.

Ollama allows `http://localhost:*` origins by default. If you open the app from another origin, start
Ollama with that origin allowed, e.g. `OLLAMA_ORIGINS=http://192.168.1.10:5173 ollama serve`.

### Privacy

The app never records or stores audio — only text transcripts. Note that Chrome and Edge implement the
Web Speech API by sending audio to Google/Microsoft for transcription; use text mode to avoid that.
Transcripts are sent to the selected AI provider for evaluation and saved with your progress.

## Project Structure

```
src/
  components/     Sidebar, QuestionCard, AnswerDropdown, ProgressBar, CategoryCard,
                   MockInterview, CodingQuestion, CodeEditor, SearchBar, Filters, Badge
    voice/         VoiceInterviewSetup, VoiceInterviewRoom, InterviewReportView, VoiceInterviewSummary
  data/            One .ts file per category + coderbyteQuestions.ts, rapidFireQuestions.ts,
                   candidateProfile.ts (facts the interviewer may rely on), index.ts
  pages/           Dashboard, Practice, MockInterviewPage, Coderbyte, RapidFire,
                   VoiceInterviewPage, InterviewHistoryPage, QuestionPage
  hooks/           useLocalStorage, useProgress, useQuestions, useSpeechRecognition,
                   useTextToSpeech, useVoiceSettings, useVoiceInterview
  services/        interviewAdapter, interviewPlanner, interviewContext, interviewEvaluator, aiProvider
  types/           questions.ts, interview.ts (shared data models)
  utils/           slug.ts (category <-> URL slug mapping), time.ts
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
- Voice recognition needs a browser with the Web Speech API (Chrome, Edge; Safari partially; not
  Firefox). Accuracy depends on the browser's speech service, your microphone and accent.
- Offline scoring is a keyword-overlap estimate: it rewards covering the model answer's ideas but cannot
  tell whether a technical claim is correct. Use Groq, Claude or Ollama for real evaluation.
- Small local models (e.g. an 8B model on CPU) can take a minute or more per answer; Groq or Claude is
  much faster.
- Groq's free tier has rate limits; if you hit one, that answer is scored offline and the interview continues.
- The practice score is not a prediction of a real interview outcome.
