import type { Question } from '../types/questions'

// 15 teamwork questions, grounded in the user's real five-person FNB
// Intelligent Banking Simulation team experience.

export const teamworkQuestions: Question[] = [
  {
    id: 'tw-001',
    category: 'Teamwork',
    difficulty: 'Beginner',
    question: 'Tell us about a time you worked in a team.',
    answer:
      "The clearest example is the FNB Intelligent Banking Simulation, where I've been working with four other developers to build a multi-agent LLM pipeline. Situation: we needed to design a system where a Requirement Agent, Code Agent and Verifier Agent all work together to turn a natural-language banking request into safe, verified SQL. Task: as a team we split ownership by agent and by layer, with me focused on parts of the agent logic and verification. Action: we held regular check-ins to agree on the shared state format between agents, since that was the one thing that could break everyone's work if we didn't align on it. Result: we got a working end-to-end pipeline, and the habit of agreeing on interfaces early became one of the biggest lessons I took from the project.",
    keyPoints: [
      'Uses the real five-person FNB team as the example throughout',
      'Highlights interface/contract agreement as the key teamwork lesson',
      'Follows STAR structure cleanly',
    ],
    followUps: [
      'How did you handle it when two team members disagreed on the state format?',
      'What was your specific role compared to the other four members?',
    ],
    projectConnection: 'This is your default "teamwork" story — the FNB five-person team and agreeing on shared interfaces.',
    tags: ['teamwork', 'star', 'fnb'],
  },
  {
    id: 'tw-002',
    category: 'Teamwork',
    difficulty: 'Beginner',
    question: 'What role do you normally take in a team?',
    answer:
      "I tend to be the person who pushes for clarity — making sure that before we start building, we've actually agreed on what a shared interface or output format looks like, because I've seen how much time gets wasted otherwise. On the FNB project, I often ended up proposing the structure for how agents pass state to each other, then getting the team to sign off on it before implementation started. I'm not usually the loudest voice in the room, but I'll speak up specifically when I think there's ambiguity that will bite us later. I'm also happy to just get hands-on and write code once direction is clear — I don't need to be leading to feel like I'm contributing.",
    keyPoints: [
      'Names a specific, credible role: clarifier of interfaces/direction',
      'Backed by the real FNB example (state format proposals)',
      'Balances leadership tendencies with being a solid individual contributor',
    ],
    followUps: [
      'Have you ever had to step back and let someone else take that role?',
      'How do you adjust your role depending on the team you are in?',
    ],
    tags: ['teamwork', 'self-assessment'],
  },
  {
    id: 'tw-003',
    category: 'Teamwork',
    difficulty: 'Intermediate',
    question: 'How do you handle disagreement with a teammate?',
    answer:
      "I try to separate the disagreement from the person — focus on what the code or design actually needs to do, not on being right. On the FNB project, a teammate and I disagreed about whether the Verifier Agent should reject a query outright on any schema mismatch or attempt an automatic retry first. I laid out the risk of retries hiding real problems, they laid out the cost of rejecting too eagerly and frustrating the user, and we ended up testing both approaches against a small set of sample queries to see which actually performed better rather than arguing in the abstract. It turned out a single bounded retry was the better trade-off, which neither of us had fully committed to going in.",
    keyPoints: [
      'Focuses on ideas, not personalities',
      'Uses a specific technical disagreement from the FNB project',
      'Resolves it with evidence/testing rather than authority or compromise for its own sake',
    ],
    followUps: [
      'What would you have done if the data had been inconclusive?',
      'How do you know when to let a disagreement go versus push further?',
    ],
    tags: ['conflict', 'star', 'fnb'],
  },
  {
    id: 'tw-004',
    category: 'Teamwork',
    difficulty: 'Intermediate',
    question: 'Tell us about a time you disagreed with someone.',
    answer:
      "Situation: while building StudyTogether, a collaborator and I disagreed on whether to include a computer-vision feature to detect if students were paying attention during study sessions. Task: I needed to raise my concern without just shutting the idea down, since it wasn't a bad idea, just a risky one. Action: I explained my concern about privacy, consent and false positives — flagging someone as 'not studying' unfairly could damage trust in the whole platform — and suggested we treat it as an optional, clearly-consented feature rather than a default, and start with much simpler accountability features like study timers and room check-ins. Result: we agreed to de-scope the computer-vision piece for a later phase and focus first on features that delivered value without the ethical risk, which I think was the right call for an early-stage product.",
    keyPoints: [
      'Uses a real product/ethics disagreement, not a fabricated generic one',
      'Shows persuasion through reasoning (privacy, consent, false positives), not just insisting',
      'Ties directly into the AI-ethics themes examiners may probe further',
    ],
    followUps: [
      'How would you actually implement consent for a feature like that if you revisited it?',
      'Did the other person fully agree, or was it a compromise?',
    ],
    projectConnection: 'Reuses the StudyTogether computer-vision/privacy tension — keep consistent with your AI ethics answers.',
    tags: ['conflict', 'star', 'studytogether'],
  },
  {
    id: 'tw-005',
    category: 'Teamwork',
    difficulty: 'Intermediate',
    question: "What would you do if a teammate wasn't contributing?",
    answer:
      "I'd first try to understand why, privately and without judgement — they might be stuck on something and too hesitant to ask, or dealing with something outside of work. I'd have a direct but supportive one-on-one conversation rather than escalating immediately or complaining to others. If it turned out they were stuck technically, I'd offer to pair with them on it. If the issue continued after that conversation and it was genuinely affecting the team's ability to hit deadlines — say, on the FNB project where each agent's owner blocks the others — I'd raise it with our team lead or supervisor, but only after trying to resolve it directly first, since going over someone's head immediately usually damages trust.",
    keyPoints: [
      'Leads with empathy and understanding before assuming laziness',
      'Escalation is a last resort, not the first move',
      'Grounds the stakes in the real FNB dependency structure',
    ],
    followUps: [
      'Has this actually happened to you? How did it play out?',
      'What would you do if the private conversation did not change anything?',
    ],
    tags: ['conflict', 'accountability'],
  },
  {
    id: 'tw-006',
    category: 'Teamwork',
    difficulty: 'Intermediate',
    question: 'How would you deal with a difficult teammate?',
    answer:
      "I'd try to stay professional and focus purely on the work rather than reacting to their tone or attitude. If someone was consistently dismissive of ideas in our FNB team meetings, for example, I'd address it directly but calmly — asking specifically what concerns they had about a suggestion, which usually turns a dismissive comment into an actual technical discussion. If the friction was more personal than technical, I'd try to find common ground, like a shared goal we both cared about — getting the pipeline working reliably — and keep steering conversations back to that. I wouldn't let it affect the quality of my own work or make me disengage from the team.",
    keyPoints: [
      'Stays professional and focused on shared goals rather than personal conflict',
      'Turns dismissiveness into a concrete technical discussion',
      'Shows resilience — not letting friction degrade own work quality',
    ],
    followUps: [
      'What is the line between a "difficult" teammate and one who is just direct?',
      'Have you had to manage this kind of dynamic during the learnership?',
    ],
    tags: ['conflict', 'difficult-people'],
  },
  {
    id: 'tw-007',
    category: 'Teamwork',
    difficulty: 'Beginner',
    question: 'How do you handle criticism from a teammate?',
    answer:
      "I try to take it at face value and assume good intent — that they're trying to make the work better, not attack me. When a teammate on the FNB project reviewed my early Verifier Agent code and pointed out I wasn't handling a specific schema edge case, I thanked them for catching it, fixed it, and made a mental note to think more about edge cases upfront next time. I think reacting defensively to teammate feedback just makes people less likely to be honest with you in the future, and I'd rather have a team that tells me the truth early than one that's polite but lets mistakes slide.",
    keyPoints: [
      'Assumes good intent behind feedback',
      'Uses a specific FNB code-review example',
      'Frames openness to feedback as building team trust',
    ],
    followUps: [
      'How do you give that same kind of direct feedback to others?',
      'Was there ever feedback you disagreed with? How did you handle that?',
    ],
    tags: ['feedback', 'teamwork'],
  },
  {
    id: 'tw-008',
    category: 'Teamwork',
    difficulty: 'Intermediate',
    question: 'How do you give constructive feedback?',
    answer:
      "I focus on being specific and on the work itself, not the person, and I try to give feedback close to when I noticed the issue rather than letting it pile up. On the FNB project, instead of saying a teammate's prompt for the Code Agent was unclear, I pointed to the exact lines where the schema wasn't specified explicitly and explained why that ambiguity was likely causing hallucinated columns, then suggested a concrete fix. I also try to lead with something that is working well before the critical part, not as a formula, but because it's honestly useful context. I check afterwards that the person understood the feedback the way I meant it, since tone can get lost, especially in written messages.",
    keyPoints: [
      'Emphasises specificity over vague criticism',
      'Uses a real, technical example (prompt clarity) rather than a hypothetical',
      'Shows care about how feedback lands, not just that it was delivered',
    ],
    followUps: [
      'How do you adjust your feedback style for someone more senior than you?',
      'Tell us about a time your feedback was not well received. What did you do?',
    ],
    tags: ['feedback', 'communication'],
  },
  {
    id: 'tw-009',
    category: 'Teamwork',
    difficulty: 'Beginner',
    question: 'How do you receive constructive feedback?',
    answer:
      "I listen fully before responding, even if my first instinct is to explain myself, because usually there's a valid point buried in there even if I don't agree with all of it. I ask clarifying questions if I don't immediately understand what needs to change — for example, asking a teammate for a specific example of where my agent's output format was inconsistent, rather than just nodding along. Then I actually act on it, because feedback that doesn't change anything isn't very useful to either person. I try not to take it personally; on a five-person project like FNB, feedback is just part of how we keep quality high.",
    keyPoints: [
      'Listens fully before responding rather than immediately defending',
      'Asks clarifying questions to make feedback actionable',
      'Follows through with real behaviour change',
    ],
    followUps: [
      'What is a recent piece of feedback you actually changed your approach because of?',
      'How do you handle feedback you think is wrong?',
    ],
    tags: ['feedback', 'growth'],
  },
  {
    id: 'tw-010',
    category: 'Teamwork',
    difficulty: 'Intermediate',
    question: 'What would you do if your team was going in the wrong direction?',
    answer:
      "I'd speak up as early as possible, since the cost of changing direction only grows the longer everyone keeps building. I'd raise it as a question rather than a flat statement — something like asking what happens if the Code Agent hits a query type we hadn't planned for — because that opens a discussion instead of putting people on the defensive. If I had data or a concrete example supporting my concern, like a failing test case, I'd bring that along rather than just an opinion. And if the team decided to continue on the current path anyway after hearing me out, I'd support that decision and contribute fully, since a team needs to move forward together even after a disagreement is resolved.",
    keyPoints: [
      'Raises concerns early and through questions rather than confrontation',
      'Backs concerns with concrete evidence where possible',
      'Commits to the team decision once it is made, showing maturity',
    ],
    followUps: [
      'Has this happened on the FNB project? What was the outcome?',
      'What if you felt the direction was genuinely risky, not just suboptimal?',
    ],
    tags: ['teamwork', 'decision-making'],
  },
  {
    id: 'tw-011',
    category: 'Teamwork',
    difficulty: 'Intermediate',
    question: 'How do you communicate technical information to a non-technical person?',
    answer:
      "I start from what the person actually cares about — the outcome, not the mechanism — and build up from there only if they want more detail. When explaining the FNB project to family or non-technical friends, I don't start with LangGraph or agent architectures; I say it's like having a small team of AI assistants where one understands what you're asking for, one writes the database query, and one double-checks it's safe before anything runs. I avoid jargon unless I've already defined it, and I check in by asking if it makes sense so far rather than assuming it does. I've found using an everyday analogy, like a team of assistants each doing one job, works much better than a technically accurate but dense explanation.",
    keyPoints: [
      'Leads with outcome/value before mechanism',
      'Uses a concrete, reusable analogy for the FNB project',
      'Checks for understanding actively rather than assuming',
    ],
    followUps: [
      'How would you explain what "hallucination" means to someone non-technical?',
      'How do you adjust this when the audience is a non-technical manager rather than a friend?',
    ],
    tags: ['communication', 'fnb'],
  },
  {
    id: 'tw-012',
    category: 'Teamwork',
    difficulty: 'Intermediate',
    question: 'Tell us about a time you helped someone understand something technical.',
    answer:
      "Situation: a teammate on the FNB project was newer to SQL and was struggling to understand why we needed read-only database access and a separate verification step rather than just letting the Code Agent run its generated SQL directly. Task: I wanted them to genuinely understand the reasoning, not just accept it, since they'd be maintaining that part of the system too. Action: I walked them through a concrete example — what would happen if the Code Agent generated a query with a subtle mistake and it ran directly against a production-like database versus being caught by the Verifier Agent first. I used a real failing example we'd actually seen rather than a hypothetical. Result: they not only understood it, but later caught a related edge case in the verification logic that I had missed, which showed the explanation had actually landed.",
    keyPoints: [
      'Uses a real teaching moment tied to the FNB security/verification design',
      'Shows using concrete failing examples over abstract explanation',
      'Result shows genuine understanding (they later contributed back), not just politeness',
    ],
    followUps: [
      'How do you check that someone has actually understood, not just nodded along?',
      'What do you do if someone still does not understand after a couple of explanations?',
    ],
    tags: ['communication', 'mentoring', 'fnb'],
  },
  {
    id: 'tw-013',
    category: 'Teamwork',
    difficulty: 'Intermediate',
    question: 'Tell us about a time you had to compromise.',
    answer:
      "Situation: on the FNB project, I wanted to spend more time building a more sophisticated retry and refinement mechanism for the Code Agent, while a teammate felt we should prioritise getting basic end-to-end functionality working first given our timeline. Task: both of us had valid points, and we needed to agree on a plan without either of us feeling overruled. Action: we agreed to implement a simple, single-retry version first to unblock the rest of the pipeline, with the more sophisticated version noted as a clear future improvement rather than dropped entirely. Result: we hit our milestone with a working, if simpler, pipeline, and I later got to revisit and improve the refinement logic once the core system was stable — so the compromise didn't mean giving up on the idea, just sequencing it differently.",
    keyPoints: [
      'Shows compromise as sequencing, not abandoning good ideas',
      'Real, specific technical trade-off from the FNB project',
      'Result shows the compromise paid off for both the deadline and the original idea',
    ],
    followUps: [
      'How do you decide when a compromise is the right call versus when to hold your ground?',
      'Did you eventually get to build the more sophisticated version?',
    ],
    tags: ['compromise', 'star', 'fnb'],
  },
  {
    id: 'tw-014',
    category: 'Teamwork',
    difficulty: 'Beginner',
    question: 'What does good teamwork mean to you?',
    answer:
      "To me, good teamwork means everyone understands not just their own task but how it fits into the bigger picture, so decisions get made with the whole system in mind rather than in isolation. It also means people feel safe raising concerns or admitting they're stuck, because that's what actually prevents bigger problems later — on the FNB project, the moments we caught issues early were always the moments someone felt comfortable flagging something didn't look right. And it means sharing credit and responsibility fairly; a working pipeline is the result of five people's work, not just whoever wrote the most visible part.",
    keyPoints: [
      'Emphasises shared understanding of the whole system, not just individual tasks',
      'Ties psychological safety directly to catching problems early',
      'Mentions fair credit-sharing, a mature team-culture point',
    ],
    followUps: [
      'How do you personally help build that kind of safety in a team?',
      'What is an example of the team catching something early because someone spoke up?',
    ],
    tags: ['teamwork', 'values'],
  },
  {
    id: 'tw-015',
    category: 'Teamwork',
    difficulty: 'Beginner',
    question: 'What makes a good team member?',
    answer:
      "A good team member is reliable — they do what they say they will, and if they can't, they say so early rather than letting others find out at the last minute. They're also willing to help outside of their exact task; on the FNB project, the moments that felt most like a real team were when someone would jump in to help debug another person's agent even though it wasn't technically their responsibility. I'd add curiosity and humility — being willing to learn from teammates rather than assuming you already know best, especially in a field like AI where things change quickly and nobody has all the answers.",
    keyPoints: [
      'Reliability and early communication are named as foundational',
      'Uses a real cross-help example from the FNB team',
      'Adds humility/curiosity as important in a fast-changing field like AI',
    ],
    followUps: [
      'Which of these traits do you think you still need to develop?',
      'How do you notice when a teammate needs help even if they have not asked?',
    ],
    tags: ['teamwork', 'values'],
  },
]
