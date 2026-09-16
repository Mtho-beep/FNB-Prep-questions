import type { Question } from '../types/questions'

// 25 behavioural / soft-skills questions, tailored to a recent BSc
// Mathematical Sciences (Computer Science & Mathematics) graduate who is
// currently an AI Developer Learner at Geeks4Learning, working on the FNB
// Intelligent Banking Simulation and the StudyTogether AI side project.
// Answers use STAR structure where it fits and are written in plain,
// early-career spoken English — not senior-engineer language.

export const behaviouralQuestions: Question[] = [
  {
    id: 'beh-001',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Beginner',
    question: 'Tell us about yourself.',
    answer:
      "I recently graduated with a BSc in Mathematical Sciences, majoring in Computer Science and Mathematics, from Sefako Makgatho Health Sciences University. Right now I'm on the AI Developer Learnership at Geeks4Learning, where I'm sharpening my Python, backend and AI skills. The main project I'm working on is the FNB Intelligent Banking Simulation, a multi-agent LLM system that turns natural-language banking requirements into verified SQL, and I'm part of a five-person team building that end to end. Outside of that I've also been building my own project called StudyTogether, a collaborative study platform for high-school learners. What ties it all together for me is that I like using AI and software to solve real, practical problems, and I'm looking for a role like this one where I can keep growing as an AI engineer while contributing from day one.",
    keyPoints: [
      'Opens with education and current status (learnership) to set context quickly',
      'Names the flagship project (FNB simulation) and own project (StudyTogether) as proof of hands-on work',
      'Ends by connecting background to why this role/company makes sense',
    ],
    followUps: [
      'What part of the FNB project are you personally responsible for?',
      'What made you choose AI over other areas of software development?',
    ],
    projectConnection:
      'Anchor this answer on the FNB Intelligent Banking Simulation and StudyTogether — they are your strongest, most concrete proof points.',
    tags: ['intro', 'background', 'star'],
  },
  {
    id: 'beh-002',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Beginner',
    question: 'What are your strengths?',
    answer:
      "One of my biggest strengths is that I'm comfortable working across the whole stack of an AI system — from the math and ML fundamentals I studied in my degree, through to writing the Python and SQL that actually makes a pipeline work. On the FNB project, that meant I could contribute to both the agent logic and the database side without needing someone to translate between the two for me. I'd also say I'm a fast, structured learner — the learnership moves quickly, and I've had to pick up LangGraph and multi-agent concepts largely on my own, which I did by building small test pipelines before touching the real project. Lastly, I take ownership: if something in the pipeline breaks, I don't wait to be told to fix it, I dig into the logs and work out where it went wrong.",
    keyPoints: [
      'Picks 2-3 strengths, not a long list',
      'Backs each strength with a concrete example from real work',
      'Balances technical breadth with a soft-skill (ownership, fast learning)',
    ],
    followUps: [
      'Can you give a specific example of when your ownership mindset helped the team?',
      'How did you go about learning LangGraph on your own?',
    ],
    tags: ['strengths', 'self-assessment'],
  },
  {
    id: 'beh-003',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Beginner',
    question: 'What is your biggest weakness?',
    answer:
      "I sometimes spend too long trying to perfect a piece of code or an agent prompt before showing it to the team, when actually getting quick feedback earlier would save time. It showed up on the FNB project when I kept refining the Requirement Agent's prompt on my own for a few days instead of syncing with the Code Agent owner earlier. Once I did share it, we realised we needed to agree on the output format first, which would have saved me some rework. I've been actively working on this by setting myself a rule to share a rough version after a day rather than a polished one after a week, and checking in with teammates earlier in the process. It's made my work fit into the team's workflow much better.",
    keyPoints: [
      'Picks a real, believable weakness (not "I work too hard")',
      'Shows self-awareness with a concrete example',
      'Ends with the corrective action already being taken, not just a promise',
    ],
    followUps: [
      'How do you know the change is actually working?',
      'What other feedback have you gotten from teammates about your work style?',
    ],
    tags: ['weakness', 'self-assessment', 'star'],
  },
  {
    id: 'beh-004',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Beginner',
    question: 'Why did you choose AI?',
    answer:
      "My Mathematics background made statistics, linear algebra and probability feel natural to me, and AI is really where that math becomes something you can build and see working. What pulled me in specifically was realising how much of a real problem — like a bank employee having to write SQL themselves — can be solved by an AI system that understands plain language. Working on the FNB project made that concrete for me: watching a natural-language request turn into verified SQL through a chain of agents is genuinely exciting, and it's a space that's moving fast, which keeps me motivated to keep learning.",
    keyPoints: [
      'Connects math background to AI naturally',
      'Uses a specific, tangible example rather than "AI is the future"',
      'Shows genuine curiosity/motivation, not just a career-trend answer',
    ],
    followUps: [
      'What area of AI are you most interested in exploring next?',
      'How does your maths background help you in day-to-day AI engineering work?',
    ],
    tags: ['motivation', 'ai'],
  },
  {
    id: 'beh-005',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Beginner',
    question: 'Why did you choose IT?',
    answer:
      "I've always liked the combination of logical problem-solving and building something you can actually see work, and IT gives me that immediately — you write code, run it, and get a result. During my degree I found I enjoyed the programming and database modules more than the purely theoretical ones, because I could apply the maths straight away. It also felt like the field where I could keep learning indefinitely; there's always a new tool, framework or concept, and I like that it never gets stale. That's part of why I've stayed in it past graduation, moving into an AI-focused learnership rather than a more general IT role.",
    keyPoints: [
      'Ties choice back to enjoying logical, hands-on problem solving',
      'Uses degree experience as evidence',
      'Shows it is a deliberate, ongoing choice (learnership), not just a default',
    ],
    followUps: [
      'What specifically drew you from general IT into AI?',
      'What is a module or project from your degree that confirmed this was the right path?',
    ],
    tags: ['motivation', 'it'],
  },
  {
    id: 'beh-006',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Beginner',
    question: 'Why do you want to work at FNB?',
    answer:
      "FNB has a strong reputation for actually shipping digital and AI innovation rather than just talking about it, and that matters to me because I want my first real role to be somewhere I can learn from people who are solving problems at scale. I've already been getting hands-on exposure to how AI can apply to banking through the FNB Intelligent Banking Simulation project during my learnership, working with agents that handle natural-language banking queries, and that has shown me how much impact good AI engineering can have in this industry — from fraud detection to smarter customer service. I want to keep building in that direction, ideally at a bank that's investing seriously in AI, and from what I've seen FNB is one of the leaders in that space in South Africa.",
    keyPoints: [
      "Shows genuine, specific interest rather than a generic 'great company' answer",
      'Connects existing simulation project experience to real motivation',
      'Frames it as wanting to learn and grow, appropriate for an early-career candidate',
    ],
    followUps: [
      'What do you know about how FNB is currently using AI?',
      'What would you want to learn in your first six months here?',
    ],
    tags: ['motivation', 'fnb', 'company-fit'],
  },
  {
    id: 'beh-007',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Beginner',
    question: 'Why should we choose you?',
    answer:
      "I bring a solid foundation — a Mathematics and Computer Science degree plus hands-on, current experience building a real multi-agent AI system modelled on banking use cases. I'm not coming in with just theory; I've actually built the Requirement Agent to Code Agent to Verifier Agent pipeline, worked with LangGraph, PostgreSQL and read-only database execution, and I've hit real problems like hallucinated SQL and had to solve them. I'm also early enough in my career that I'm still very coachable, but I've shown through the learnership and my own StudyTogether project that I take initiative rather than waiting to be told what to do. That combination — relevant hands-on AI experience plus genuine drive to keep learning — is what I think makes me a strong fit for this role.",
    keyPoints: [
      'Leads with concrete, relevant technical experience, not generic enthusiasm',
      'Balances "coachable junior" with "shows initiative" — the right pitch for entry-level',
      'Directly answers the competitive framing without putting other candidates down',
    ],
    followUps: [
      'What specific contribution did you make to the FNB project pipeline?',
      'What would you want to prove in your first three months?',
    ],
    tags: ['self-pitch', 'differentiation'],
  },
  {
    id: 'beh-008',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Intermediate',
    question: 'Where do you see yourself in five years?',
    answer:
      "In five years I'd like to be a confident, mid-to-senior AI engineer who can own the design of an AI system end to end — not just building agents or models, but making good calls about architecture, reliability and how AI fits safely into a business like banking. I want to have deepened my knowledge of things like RAG, LLM evaluation and production ML systems, and ideally be mentoring newer developers the way I hope to be mentored here. I'm not fixed on a specific job title; what matters more to me is being someone the team trusts with harder, more ambiguous problems because I've built a track record of shipping reliable AI features.",
    keyPoints: [
      'Focuses on skill and responsibility growth, not just a job title',
      'Shows realistic ambition appropriate for a graduate, not overreaching',
      'Mentions wanting to eventually mentor others, showing long-term commitment',
    ],
    followUps: [
      'What skills do you think you need to develop most in the next year?',
      'What does "senior" mean to you in an AI engineering context?',
    ],
    tags: ['career-goals', 'growth'],
  },
  {
    id: 'beh-009',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Beginner',
    question: 'What are your long-term career goals?',
    answer:
      "Long term, I want to build genuine depth as an AI engineer — someone who understands the full pipeline from data and model behaviour through to how a system is deployed and monitored in production. I'd like to work on AI applied to problems that actually matter to people's lives, and banking is a good example because decisions there affect people's money and trust. Eventually I'd like to specialise further, likely in either applied LLM systems or ML for risk and fraud, but I want that specialisation to come from real experience rather than picking it too early. For now my goal is simple: join a team where I can learn fast and contribute meaningfully.",
    keyPoints: [
      'Shows a direction (applied AI, possibly fraud/risk) without over-committing',
      'Connects goals to real-world impact',
      'Keeps the immediate ask realistic: learn fast, contribute now',
    ],
    followUps: [
      'What draws you toward fraud/risk specifically versus other AI applications?',
      'How do you plan to keep learning outside of work?',
    ],
    tags: ['career-goals'],
  },
  {
    id: 'beh-010',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Beginner',
    question: 'What motivates you?',
    answer:
      "I'm motivated by seeing something I built actually work and solve a real problem — that moment when the FNB pipeline takes a plain-English request and returns the correct, verified SQL result is genuinely satisfying to me. I'm also motivated by learning; I like being slightly out of my depth because that's when I grow the fastest, which is part of why I pushed myself to understand LangGraph and multi-agent design rather than sticking to what I already knew. And I care about doing work that has real stakes — banking data and financial decisions matter to people, so building something reliable there feels meaningful, not just technically interesting.",
    keyPoints: [
      'Names concrete sources of motivation (seeing things work, learning, real stakes)',
      'Uses the FNB project as tangible evidence',
      'Avoids generic answers like "money" or "recognition"',
    ],
    followUps: [
      'Tell us about a specific moment recently where you felt that motivation.',
      'What demotivates you, and how do you push through it?',
    ],
    tags: ['motivation'],
  },
  {
    id: 'beh-011',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Beginner',
    question: 'What are you passionate about?',
    answer:
      "I'm genuinely passionate about AI systems that make technical work more accessible to non-technical people — that's the whole idea behind the FNB project, letting someone describe what they need in plain language instead of writing SQL themselves. I'm also passionate about education and access to learning, which is why I built StudyTogether in my own time: I wanted high-school learners to have a simple platform to study together and stay accountable. Outside of direct project work, I enjoy just tinkering — trying out new AI tools and small experiments to understand how they work under the hood.",
    keyPoints: [
      'Connects passion directly to both main projects (FNB and StudyTogether)',
      'Shows a personal, self-driven side project as evidence of genuine interest',
      'Keeps it authentic rather than reciting a mission statement',
    ],
    followUps: [
      'What inspired you specifically to build StudyTogether?',
      'What is a recent AI tool or concept you experimented with on your own?',
    ],
    tags: ['passion', 'interests'],
  },
  {
    id: 'beh-012',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Beginner',
    question: 'What are your interests outside of technology?',
    answer:
      "Outside of tech I enjoy staying active and following sport, and I like reading up on topics outside my field just to keep a broad perspective — it actually helps with problem-solving because I'm not always thinking in the same patterns. I also enjoy explaining things to people; when friends or family ask me about AI or what I'm building, I like finding simple ways to describe it, which has actually helped me communicate technical ideas more clearly at work too. It keeps me well-rounded rather than only thinking about code all day.",
    keyPoints: [
      'Gives a genuine, simple answer rather than overselling hobbies as "strategic"',
      'Draws a light, honest connection back to workplace skills (communication)',
      'Keeps it brief — this question does not need a long answer',
    ],
    followUps: [
      'How do you make time for these interests alongside a demanding learnership?',
      'Has anything outside tech ever given you an idea for how to solve a technical problem?',
    ],
    tags: ['interests', 'personal'],
  },
  {
    id: 'beh-013',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Intermediate',
    question: 'What achievement are you most proud of?',
    answer:
      "I'm most proud of getting the FNB Intelligent Banking Simulation's agent pipeline working end to end for the first time — Requirement Agent parsing a natural-language ask, the Code Agent generating SQL, and the Verifier Agent checking it against the schema before it ever touched the read-only database. Situation: we were a five-person team with a tight timeline and none of us had built a production-style multi-agent system before. Task: I was responsible for a meaningful part of the agent logic and the verification step. Action: I broke the problem down, built small test cases before wiring agents together, and worked closely with teammates to agree on a consistent state format between agents. Result: we got a working pipeline that correctly rejected an incorrect or unsafe SQL query and asked for refinement instead of just executing it — which felt like a real, safe AI system, not just a demo.",
    keyPoints: [
      'Uses full STAR structure clearly',
      'Picks an achievement tied to the flagship project, not a vague personal claim',
      'Highlights safety/verification as the meaningful outcome, which is relevant to banking',
    ],
    followUps: [
      'What was the hardest part of getting the agents to communicate correctly?',
      'How did the team divide responsibilities for this?',
    ],
    projectConnection: 'This is your strongest STAR story — the FNB pipeline going from idea to working, verified system.',
    tags: ['achievement', 'star', 'fnb'],
  },
  {
    id: 'beh-014',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Intermediate',
    question: 'Tell us about a difficult challenge you experienced.',
    answer:
      "Situation: on the FNB project, early on our Code Agent would sometimes generate SQL that looked plausible but referenced columns that didn't exist in our schema — a form of hallucination. Task: I needed to find a way to stop that from ever reaching the database, without slowing the whole pipeline down too much. Action: I worked on strengthening the Verifier Agent to check generated SQL against the actual schema metadata before execution, and added a refinement loop so the Code Agent could retry with the specific error instead of failing silently. I also tightened the prompt given to the Code Agent to explicitly list the valid schema. Result: hallucinated column references dropped significantly, and when they did happen, the system caught them before touching the read-only database instead of returning an error to the user.",
    keyPoints: [
      'Names a specific, technical challenge (SQL hallucination) rather than something vague',
      'Shows the actual engineering action taken, not just "I worked hard"',
      'Result is measurable and safety-relevant',
    ],
    followUps: [
      'How did you validate that the fix actually worked?',
      'What would you do differently if hallucinations still slipped through occasionally?',
    ],
    projectConnection: 'Directly reuses the SQL-hallucination problem from the FNB project — keep this consistent with your technical answers on that topic.',
    tags: ['challenge', 'star', 'fnb'],
  },
  {
    id: 'beh-015',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Intermediate',
    question: 'Tell us about a time you failed.',
    answer:
      "Situation: early in building StudyTogether, I designed the study-room database schema on my own without getting feedback first, assuming I understood all the requirements. Task: once I started building the room administration features, I realised the schema didn't properly support things like room rules or multiple admins per room. Action: rather than patch around it, I went back, reviewed the actual use cases properly, and rebuilt the schema with proper relationships between rooms, users, roles and rules. I also started sketching schemas on paper and getting a second opinion before implementing, going forward. Result: the second version of the schema was far more flexible, and I avoided a bigger rebuild later, but it did cost me a few days of rework I could have skipped.",
    keyPoints: [
      'Picks a genuine failure with real consequences (rework), not a fake weakness',
      'Shows the lesson changed future behaviour (getting feedback before implementing)',
      'Keeps blame on process, not on other people',
    ],
    followUps: [
      'How do you now decide when to get feedback versus just building?',
      'Did this experience change how you approach the FNB project schema decisions?',
    ],
    tags: ['failure', 'star', 'studytogether'],
  },
  {
    id: 'beh-016',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Intermediate',
    question: 'Tell us about a mistake you made and what you learned from it.',
    answer:
      "Situation: on the FNB project, I once pushed a change to the Code Agent's prompt template without properly testing it against our existing set of sample queries. Task: the change was meant to improve SQL formatting, but it accidentally broke how the agent handled queries involving joins. Action: as soon as a teammate flagged strange output, I reverted the change immediately, then went back and built a small local test script that ran a fixed set of sample requirements through the agent before any prompt change could be merged. Result: we caught two more potential regressions with that script over the following weeks before they ever reached the team, and it's become part of how we now work. The lesson was that in AI systems, small prompt changes can have surprisingly large effects, so testing before merging is non-negotiable.",
    keyPoints: [
      'Concrete, believable technical mistake tied to prompt engineering',
      'Shows immediate corrective action (revert) plus a lasting process improvement (test script)',
      'Draws a clear, transferable lesson about testing AI/prompt changes',
    ],
    followUps: [
      'What does that test script check for specifically?',
      'How do you balance testing thoroughness with development speed on a tight timeline?',
    ],
    tags: ['mistake', 'star', 'fnb'],
  },
  {
    id: 'beh-017',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Beginner',
    question: 'How do you handle pressure?',
    answer:
      "I deal with pressure by breaking whatever is stressing me out into smaller, concrete steps, because vague, big problems feel overwhelming but a clear next task doesn't. During tighter deadlines on the FNB project, I'd write out exactly what needed to be done that day rather than thinking about the whole remaining scope at once. I also try to communicate early if I think a deadline is at risk, rather than staying quiet and hoping it works out — that's saved the team from surprises more than once. And practically, I make sure I'm not trying to solve everything alone; asking a teammate for a second pair of eyes usually gets me unstuck faster than pushing through pressure by myself.",
    keyPoints: [
      'Gives a concrete method (breaking work into steps), not just "I stay calm"',
      'Includes proactive communication as part of handling pressure',
      'Shows willingness to ask for help rather than struggling silently',
    ],
    followUps: [
      'Tell us about a specific deadline that felt tight — how did you handle it?',
      'How do you know when it is time to ask for help versus keep pushing?',
    ],
    tags: ['pressure', 'stress-management'],
  },
  {
    id: 'beh-018',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Beginner',
    question: 'How do you handle criticism?',
    answer:
      "I try to treat criticism as information about the work, not about me personally, which took some conscious practice but has made a real difference. On the learnership, a mentor once pointed out that my early agent code had almost no comments explaining the reasoning behind decisions, which made it hard for teammates to follow. Instead of getting defensive, I asked for a concrete example of what good documentation looked like, applied it, and now I document architectural decisions as I go rather than after the fact. I'd rather get that kind of direct feedback early than have small issues turn into bigger ones later.",
    keyPoints: [
      'Separates feedback about the work from feedback about self-worth',
      'Uses a real, specific example of receiving and acting on criticism',
      'Shows the change stuck (ongoing documentation habit), not just a one-time fix',
    ],
    followUps: [
      'Has there been a time you disagreed with criticism you received? How did you handle it?',
      'How do you now give feedback to others based on what you learned?',
    ],
    tags: ['criticism', 'feedback', 'star'],
  },
  {
    id: 'beh-019',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Beginner',
    question: "How do you respond when you don't know something?",
    answer:
      "I say so honestly rather than guessing or bluffing, and then I go find the answer as quickly as I can. When I first encountered LangGraph on the FNB project, I hadn't used it before, so I told the team that upfront, then spent time going through the documentation and building a tiny standalone example before touching the real pipeline. I also find it useful to ask a specific, well-framed question to a teammate rather than a vague one — it gets me a faster, more useful answer and shows I've already tried to work it out myself. In an interview or on the job, I'd rather admit a gap and show how I'd close it than pretend to know something I don't.",
    keyPoints: [
      'Leads with honesty over bluffing, which interviewers specifically look for',
      'Gives a concrete example of self-teaching (LangGraph) before asking for help',
      'Shows a habit of asking specific, well-prepared questions',
    ],
    followUps: [
      'How long did it take you to get comfortable with LangGraph?',
      'What resources do you typically use to learn something new quickly?',
    ],
    tags: ['learning', 'honesty'],
  },
  {
    id: 'beh-020',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Beginner',
    question: 'How do you approach learning a new technology?',
    answer:
      "I start with the official documentation or a well-regarded quick-start guide to get the core concepts, then I build a small, throwaway project to actually use it rather than just reading. That's exactly how I picked up LangGraph and FastAPI — I wrote tiny standalone scripts first, deliberately breaking things to understand why they broke, before applying the tool to the FNB project or StudyTogether. I also try to connect the new tool to something I already know; understanding LangGraph was easier once I related its state graph to concepts I already knew from software design. Once I'm using it in a real project, I keep a short personal note of gotchas I hit, so I don't repeat the same mistake twice.",
    keyPoints: [
      'Concrete, repeatable learning process: docs, small project, connect to prior knowledge',
      'Uses real examples (LangGraph, FastAPI) rather than a hypothetical',
      'Shows a habit (notes on gotchas) that compounds learning over time',
    ],
    followUps: [
      'What was the trickiest concept to learn recently, and how did you eventually get it?',
      'How do you decide which resource to trust when learning something new?',
    ],
    tags: ['learning', 'growth'],
  },
  {
    id: 'beh-021',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Intermediate',
    question: 'How do you manage your time?',
    answer:
      "I keep a simple daily list of what needs to get done, ranked by what's blocking someone else versus what's just my own task, because unblocking teammates usually has more impact than finishing my own nice-to-have first. Balancing the learnership curriculum, the FNB project deadlines and my own StudyTogether project has forced me to be realistic about what I can do in a day rather than overcommitting. I also block out focused time for harder tasks like debugging agent logic, since that kind of work doesn't go well in small fragmented chunks, and I leave lighter tasks like documentation for when my focus is lower.",
    keyPoints: [
      'Gives a concrete prioritisation rule (unblocking others first)',
      'Acknowledges managing multiple real commitments (learnership, FNB project, personal project)',
      'Shows awareness of matching task type to energy/focus level',
    ],
    followUps: [
      'How do you decide what to say no to when everything feels urgent?',
      'What tools, if any, do you use to track your tasks?',
    ],
    tags: ['time-management'],
  },
  {
    id: 'beh-022',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Intermediate',
    question: 'How do you prioritize tasks when you have multiple deadlines?',
    answer:
      "I first work out which tasks are dependencies for other people, because those get priority — if my part of the Verifier Agent is blocking a teammate from testing their Code Agent changes, that comes before something only I need. Then I look at effort versus impact: quick wins that unblock a lot of downstream work get done early. When I genuinely have two hard deadlines colliding, like a learnership assignment and a project milestone, I communicate early with whoever is affected rather than silently letting one slip, so we can agree on a realistic plan together instead of it being a surprise.",
    keyPoints: [
      'Uses a clear framework: dependencies first, then effort vs impact',
      'Grounds it in the real dynamic of team dependencies (FNB agents)',
      'Emphasises proactive communication over silently struggling',
    ],
    followUps: [
      'Tell us about a specific time two deadlines actually collided for you.',
      'How do you communicate a delay without it looking like an excuse?',
    ],
    tags: ['prioritisation', 'time-management'],
  },
  {
    id: 'beh-023',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Intermediate',
    question: 'How do you deal with uncertainty?',
    answer:
      "AI projects are full of uncertainty — you often don't know exactly how a model or agent will behave until you test it — so I've learned to get comfortable making a reasonable decision with the information I have, then testing and adjusting quickly rather than waiting for perfect certainty. On the FNB project, we weren't sure upfront how many refinement retries the Code Agent would realistically need before producing valid SQL, so instead of guessing indefinitely, I picked a sensible starting limit, instrumented it so we could see actual retry counts in practice, and then adjusted based on real data. I try to treat uncertainty as something you reduce with small experiments, not something you can eliminate by thinking longer.",
    keyPoints: [
      'Frames uncertainty as normal in AI work, showing maturity for the domain',
      'Gives a concrete example (retry limits) of deciding under uncertainty',
      'Shows an experiment-and-adjust mindset rather than analysis paralysis',
    ],
    followUps: [
      'What did the actual retry data show once you measured it?',
      'How do you know when you have "enough" information to make a decision?',
    ],
    tags: ['uncertainty', 'decision-making'],
  },
  {
    id: 'beh-024',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Intermediate',
    question: 'How do you stay motivated when a problem is difficult?',
    answer:
      "I remind myself that getting stuck is part of the process, not a sign I'm not capable — especially in AI work, where debugging why an agent produced a certain output can take a while. Practically, I break the hard problem into smaller pieces I can actually make progress on, so I have small wins to keep me going rather than staring at one big unsolved issue. When I was debugging why our Verifier Agent occasionally passed SQL that referenced the wrong table, I focused on reproducing just one failing case reliably first, instead of trying to fix the whole problem at once. Once I had that one case understood, the motivation came back because I could see a path forward.",
    keyPoints: [
      'Normalises difficulty as expected in AI/debugging work',
      'Uses a specific technique: reduce to one reproducible case',
      'Shows motivation is sustained by visible progress, not willpower alone',
    ],
    followUps: [
      "What do you do if you're stuck for days with no progress at all?",
      'Has a teammate ever helped you get unstuck? What did that look like?',
    ],
    tags: ['motivation', 'resilience'],
  },
  {
    id: 'beh-025',
    category: 'Behavioural & Soft Skills',
    difficulty: 'Intermediate',
    question: 'What makes you different from other candidates?',
    answer:
      "I think what sets me apart is that I'm not just learning AI theory — I've actually built and shipped a multi-agent system modelled directly on a real banking use case, hitting real problems like SQL hallucination, verification and read-only database access, which are exactly the kind of concerns a bank cares about. On top of that, I've built my own product, StudyTogether, entirely outside of any coursework, which shows I don't just do AI work when it's assigned to me — I go looking for problems to solve. Combine that with a strong maths foundation and a genuine, current curiosity about this field, and I think I bring a rare mix for someone this early in their career: real hands-on experience, self-driven initiative, and a solid theoretical base to build on.",
    keyPoints: [
      'Avoids putting down other candidates; focuses purely on own evidence',
      'Combines hands-on relevant project experience with self-initiated work',
      'Reinforces maths foundation as a differentiator for AI specifically',
    ],
    followUps: [
      'What specifically about StudyTogether shows initiative beyond a normal side project?',
      'How would you apply what you learned on the FNB project on day one here?',
    ],
    tags: ['differentiation', 'self-pitch'],
  },
]
