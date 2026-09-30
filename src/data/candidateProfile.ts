// A compact candidate profile for the voice interviewer.
// Every fact here is taken from the existing model answers in this folder
// (behaviouralQuestions.ts, projectQuestions.ts, agentQuestions.ts), except
// SARAO, which the user provided directly. Do not add achievements here
// that are not stated elsewhere in the app.

export interface CandidateProject {
  name: string
  facts: string[]
}

export interface CandidateProfile {
  education: string
  current: string
  skills: string[]
  projects: CandidateProject[]
  experience: CandidateProject[]
}

export const candidateProfile: CandidateProfile = {
  education:
    'BSc Mathematical Sciences (majoring in Computer Science and Mathematics), Sefako Makgatho Health Sciences University.',
  current: 'AI Developer Learnership at Geeks4Learning.',
  skills: [
    'Python',
    'SQL',
    'PostgreSQL',
    'FastAPI',
    'Machine learning',
    'LLMs',
    'Prompt engineering',
    'Embeddings',
    'RAG',
    'AI agents',
    'LangGraph',
  ],
  projects: [
    {
      name: 'FNB Intelligent Banking Simulation',
      facts: [
        'Built as part of a five-person team during the learnership.',
        'Multi-agent LLM pipeline orchestrated with LangGraph: natural-language request -> Requirement Agent (structured specification) -> Code Agent (generates SQL) -> Verifier Agent (checks SQL against schema metadata and rules) -> read-only execution on PostgreSQL.',
        'On verification failure, state is routed back with the failure reason for refinement (retry loop).',
        'Personal contribution: parts of the agent logic, the Verifier Agent schema-checking and read-only enforcement, helped fix SQL hallucination by tightening schema context and adding the refinement loop, and raised the shared state format discussion early.',
      ],
    },
    {
      name: 'StudyTogether',
      facts: [
        'Own-initiative collaborative study platform for high-school learners.',
        'Study rooms, friends lists, room administration with rules; backend APIs and a relational database (users, rooms, memberships, rules).',
        'Rebuilt the room schema once after realising it did not support room rules or multiple admins.',
        'AI accountability (e.g. computer vision to detect a learner who may be sleeping) is being explored as a concept — do not assume it is fully implemented. Privacy, consent and false positives are known concerns.',
      ],
    },
  ],
  experience: [
    {
      name: 'SARAO (South African Radio Astronomy Observatory) — vacation work',
      facts: [
        'Exposure to email security and phishing awareness.',
        'Exposure to log review.',
        'Exposure to vulnerability assessment.',
        'Professional technical workplace exposure. Do not assume responsibilities beyond this.',
      ],
    },
  ],
}

/** One compact text block sent to the LLM — never the whole question bank. */
export function candidateProfileSummary(profile: CandidateProfile = candidateProfile): string {
  const lines = [
    `Education: ${profile.education}`,
    `Current: ${profile.current}`,
    `Skills studied/used: ${profile.skills.join(', ')}`,
  ]
  for (const p of [...profile.projects, ...profile.experience]) {
    lines.push(`${p.name}:`)
    for (const f of p.facts) lines.push(`  - ${f}`)
  }
  return lines.join('\n')
}

/**
 * Generic questions about experience that has no dedicated question in the
 * bank. They carry no model answer, so they are scored on communication and
 * relevance only.
 */
export const profileQuestions = [
  {
    id: 'profile-sarao-1',
    question: 'Tell me about your vacation work at SARAO.',
    context: candidateProfile.experience[0].facts.join(' '),
  },
  {
    id: 'profile-sarao-2',
    question: 'What did you learn during your time at SARAO, and how has it influenced your approach to technology?',
    context: candidateProfile.experience[0].facts.join(' '),
  },
]
