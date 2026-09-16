import type { Question } from '../types/questions'

// 40 questions on the FNB Intelligent Banking Simulation project and
// 20 questions on the StudyTogether AI project. These are the user's two
// real, concrete projects, so answers are specific and technical rather
// than generic, while staying at a junior/early-career level of depth.

const fnbQuestions: Question[] = [
  {
    id: 'proj-001',
    category: 'Project Questions',
    difficulty: 'Beginner',
    question: 'Tell us about a project you have worked on.',
    answer:
      "The project I'd highlight is the FNB Intelligent Banking Simulation, which I've been building as part of a five-person team during my AI Developer Learnership. It's a multi-agent LLM pipeline that takes a natural-language banking request, turns it into a structured requirement, generates SQL for it, verifies that SQL is safe and correct against our schema, and only then executes it read-only against PostgreSQL. I contributed to the agent logic and verification layer specifically. It's the project that's taught me the most about real AI engineering — not just calling an LLM, but building the guardrails around it.",
    keyPoints: [
      'Gives a one-sentence summary of what the system does before any detail',
      'States personal contribution clearly',
      'Frames it as a learning experience about guardrails, not just LLM usage',
    ],
    followUps: ['Can you walk through the pipeline step by step?', 'What was your specific role on the team?'],
    tags: ['projects', 'fnb', 'overview'],
  },
  {
    id: 'proj-002',
    category: 'Project Questions',
    difficulty: 'Beginner',
    question: 'Explain your FNB Intelligent Banking project.',
    answer:
      "It's a simulation of how a bank could let staff or systems query banking data using plain English instead of SQL. A user's natural-language request goes to a Requirement Agent, which turns it into a structured specification. That goes to a Code Agent, which generates the actual SQL. A Verifier Agent then checks that SQL against our schema and data rules before anything runs. Only verified queries are executed, and only with read-only access to PostgreSQL. If verification fails, the system loops back for refinement instead of just erroring out or, worse, running something incorrect.",
    keyPoints: [
      'Explains the three-agent pipeline in plain language',
      'Emphasises the safety design: verify before execute, read-only access',
      'Mentions the refinement loop as the recovery mechanism',
    ],
    followUps: ['Why three agents instead of one big agent?', 'What happens after multiple failed refinement attempts?'],
    tags: ['fnb', 'architecture'],
  },
  {
    id: 'proj-003',
    category: 'Project Questions',
    difficulty: 'Beginner',
    question: 'What problem were you trying to solve?',
    answer:
      "The core problem is that a lot of valuable banking data sits behind SQL, and non-technical staff either need to learn SQL or wait on a developer every time they need an answer. That's slow and doesn't scale. We wanted to explore whether an AI pipeline could safely bridge that gap — letting someone ask a plain-English question and get a reliable, verified answer — without introducing the risk of an AI system making unchecked changes to sensitive banking data.",
    keyPoints: [
      'States the access-to-data problem clearly',
      'Explains why this matters (scalability, developer bottleneck)',
      'Immediately ties the solution back to safety, not just convenience',
    ],
    followUps: ['Who would the realistic end user of this system be?', 'What alternative solutions did you consider before this approach?'],
    tags: ['fnb', 'problem-statement'],
  },
  {
    id: 'proj-004',
    category: 'Project Questions',
    difficulty: 'Beginner',
    question: 'Why did you choose this problem?',
    answer:
      "It came out of the learnership's brief to build something that modelled a realistic banking AI use case, but I was genuinely drawn to it because it combines several things I care about — natural language understanding, database systems, and safety-critical design — in one system. It's also a problem that's directly relevant to where I want my career to go, applying AI in financial services, so it wasn't just an assignment to me, it was something I wanted to get right.",
    keyPoints: [
      'Connects the brief to genuine personal interest, not just compliance',
      'Names the specific technical areas that appealed (NLP, databases, safety)',
      'Links the choice to career direction',
    ],
    followUps: ['What part of the problem did you find most interesting personally?', 'Would you choose a similar problem again given the choice?'],
    tags: ['fnb', 'motivation'],
  },
  {
    id: 'proj-005',
    category: 'Project Questions',
    difficulty: 'Beginner',
    question: 'Why did you use AI?',
    answer:
      "Because the core challenge — understanding an open-ended, natural-language request and turning it into a precise, structured database query — isn't something you can solve well with fixed rules or a simple form. Language is too flexible for that. An LLM is good at that kind of flexible interpretation, but on its own it isn't reliable enough for something as sensitive as banking data, so the interesting engineering problem was combining AI's flexibility with deterministic checks like schema verification and read-only access.",
    keyPoints: [
      'Justifies AI specifically because the task is open-ended, not rule-based',
      'Is honest that AI alone is not sufficient — needs deterministic guardrails',
      'Frames the real engineering value as combining flexibility with reliability',
    ],
    followUps: ['Could you have solved part of this without an LLM at all?', 'What would you lose by using a rule-based system instead?'],
    tags: ['fnb', 'ai-justification'],
  },
  {
    id: 'proj-006',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'Explain the architecture of your system.',
    answer:
      "It's a LangGraph-orchestrated multi-agent pipeline with three main agents sitting on top of a PostgreSQL database. The Requirement Agent takes the raw user input and produces a structured specification. That specification is passed as shared state to the Code Agent, which generates SQL from it. The generated SQL, along with the specification, goes to the Verifier Agent, which checks it against schema metadata and validation rules. If it passes, the query runs through a read-only database connection; if it fails, the state is routed back with the failure reason for refinement. LangGraph manages that state and the conditional routing between agents.",
    keyPoints: [
      'Names the concrete components: three agents, LangGraph, PostgreSQL, read-only execution',
      'Describes data flow explicitly (spec -> SQL -> verification -> execution or retry)',
      'Mentions LangGraph specifically for state and conditional routing',
    ],
    followUps: ['What does the shared state object actually contain?', 'How is the conditional routing between agents implemented in LangGraph?'],
    tags: ['fnb', 'architecture', 'langgraph'],
  },
  {
    id: 'proj-007',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'Explain the pipeline from beginning to end.',
    answer:
      "It starts with a natural-language request, like 'show me all accounts with more than three failed login attempts this month.' The Requirement Agent parses that into a structured spec — entities, filters, time ranges. The Code Agent turns that spec into SQL. The Verifier Agent checks the SQL against our schema, confirming referenced tables and columns exist and the query doesn't violate our read-only, safety rules. If it passes, we run it against PostgreSQL through a read-only connection and return the result. If it fails, the Verifier Agent's reason for failure is fed back to the Code Agent, which retries with that context, up to a bounded number of attempts.",
    keyPoints: [
      'Uses a concrete example request to make the flow tangible',
      'Walks through every stage in order without skipping steps',
      'Explains the retry loop with bounded attempts, showing awareness of infinite-loop risk',
    ],
    followUps: ['What happens if the bounded retries are exhausted?', 'How is the structured spec represented — JSON, a Python object, something else?'],
    tags: ['fnb', 'pipeline'],
  },
  {
    id: 'proj-008',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'What does the Requirement Agent do?',
    answer:
      "It's the entry point of the pipeline. It takes the raw natural-language request and turns it into a structured specification the rest of the system can work with — identifying things like which entities are involved (accounts, transactions, customers), what filters or conditions apply, and what the actual intent of the request is. It's essentially translating ambiguous human language into something precise enough for a Code Agent to generate correct SQL from, and it's also where we can catch a request that's too vague and ask for clarification rather than guessing.",
    keyPoints: [
      'Defines the agent\'s single responsibility clearly: NL to structured spec',
      'Gives examples of what it extracts (entities, filters, intent)',
      'Mentions it as the natural place to catch ambiguous requests',
    ],
    followUps: ['What does that structured specification actually look like?', 'How does it handle a genuinely ambiguous request?'],
    tags: ['fnb', 'agents'],
  },
  {
    id: 'proj-009',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'What does the Code Agent do?',
    answer:
      "The Code Agent takes the structured specification from the Requirement Agent and generates the actual SQL query. It's given the relevant schema information so it knows which tables and columns are valid, and it's prompted specifically to produce standard, safe SQL rather than anything using dynamic or unusual constructs. If a previous attempt was rejected by the Verifier Agent, the Code Agent also receives that failure reason so its next attempt is informed rather than a blind retry.",
    keyPoints: [
      'Defines the responsibility: spec to SQL generation',
      'Notes that schema context is passed in to reduce hallucination',
      'Explains how failure feedback improves retries',
    ],
    followUps: ['How do you provide the schema context to the Code Agent without making the prompt too large?', 'Have you compared different prompt strategies for SQL generation?'],
    tags: ['fnb', 'agents'],
  },
  {
    id: 'proj-010',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'What does the Verifier Agent do?',
    answer:
      "It's the safety layer of the pipeline. Before any SQL touches the database, the Verifier Agent checks it against our actual schema — confirming every referenced table and column genuinely exists — and against a set of rules, like rejecting anything that isn't a read-only SELECT statement. If the query fails any of those checks, it doesn't get executed; instead the Verifier Agent produces a clear reason for the failure that gets routed back to the Code Agent for another attempt.",
    keyPoints: [
      'Defines it clearly as the safety/validation gate before execution',
      'Names specific checks: schema existence, read-only enforcement',
      'Explains the feedback loop it produces on failure',
    ],
    followUps: ['What specific rules does it check beyond schema existence?', 'How would you extend it to catch more subtle logical errors, not just structural ones?'],
    tags: ['fnb', 'agents', 'verification'],
  },
  {
    id: 'proj-011',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'Why did you use multiple agents?',
    answer:
      "Because each stage of the problem — understanding intent, generating SQL, and verifying safety — benefits from a focused, specialised prompt rather than one agent trying to juggle all three responsibilities at once. Splitting it up made each agent's job simpler and easier to test in isolation, and it meant we could improve the Verifier Agent's strictness without touching how the Code Agent generates SQL. It also gave us a natural place to insert a safety checkpoint between generation and execution, which would be harder to enforce cleanly inside one single agent.",
    keyPoints: [
      'Explains specialisation and separation of concerns as the main driver',
      'Notes the testability benefit of isolated agents',
      'Highlights that multi-agent design naturally creates a safety checkpoint',
    ],
    followUps: ['What are the downsides of this multi-agent approach?', 'Did you ever consider merging any two of the agents?'],
    tags: ['fnb', 'agents', 'architecture'],
  },
  {
    id: 'proj-012',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: "Why couldn't one LLM perform the entire task?",
    answer:
      "A single LLM call could probably produce SQL directly from a natural-language request most of the time, but the risk is that the same model that generated a mistake is also the one being asked to catch it — there's no independent check. Splitting verification into its own agent, with its own focused instructions and access to schema metadata, gives us a genuinely separate checkpoint rather than hoping one model self-corrects. It also makes the system's behaviour more predictable and debuggable, since we can look at exactly which stage failed instead of treating the whole thing as one opaque call.",
    keyPoints: [
      'Explains the "self-grading" risk of one model doing generation and verification',
      'Frames separate verification as an independent, more trustworthy checkpoint',
      'Adds a debuggability argument for splitting responsibilities',
    ],
    followUps: ['Is it possible for the Verifier Agent itself to make a mistake? How would you catch that?', 'How much slower is the multi-agent approach compared to one call?'],
    tags: ['fnb', 'agents', 'design-rationale'],
  },
  {
    id: 'proj-013',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'Why did you use LangGraph?',
    answer:
      "We needed a way to manage state that's shared and updated across multiple agents, plus conditional branching — like routing back to the Code Agent specifically when verification fails, rather than always moving forward linearly. LangGraph gives us that as a graph of nodes and edges, where each agent is a node and the edges define how state flows and which conditions trigger which path. That was a much cleaner fit than trying to hand-roll our own control flow with plain function calls, especially once we added the refinement loop.",
    keyPoints: [
      'Explains the specific need: shared state plus conditional routing',
      'Describes LangGraph\'s graph-of-nodes model concretely',
      'Contrasts it with the alternative of hand-rolled control flow',
    ],
    followUps: ['How does LangGraph compare to just writing your own orchestration loop in Python?', 'What would you use instead if LangGraph were not available?'],
    tags: ['fnb', 'langgraph'],
  },
  {
    id: 'proj-014',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How do the agents communicate?',
    answer:
      "They communicate through a shared state object that gets passed along the LangGraph graph — each agent reads the parts of the state relevant to it, does its job, and updates the state with its output before passing it to the next node. For example, the Requirement Agent writes the structured specification into state; the Code Agent reads that and writes the generated SQL; the Verifier Agent reads both and writes back a pass/fail result plus a reason if it fails. There's no direct agent-to-agent messaging outside of that shared state — LangGraph's graph structure decides what happens next based on it.",
    keyPoints: [
      'Explains shared-state communication rather than direct messaging',
      'Gives a concrete walk-through of what each agent reads/writes',
      'Clarifies that LangGraph, not the agents themselves, decides the next step',
    ],
    followUps: ['What data type is the shared state object — a dict, a typed class?', 'How do you prevent one agent from accidentally overwriting another\'s data in state?'],
    tags: ['fnb', 'agents', 'state'],
  },
  {
    id: 'proj-015',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How does the system maintain state?',
    answer:
      "State is maintained as a single object that flows through the LangGraph graph for the duration of one request — it accumulates the original request, the structured specification, the generated SQL, verification results, and retry count as it passes through each agent node. It's scoped to a single pipeline run rather than persisted long-term, since each banking request is handled independently. If we wanted history across requests, like remembering previous queries in a session, we'd need to add a separate persistence layer, which wasn't part of the current scope.",
    keyPoints: [
      'Describes state as accumulating through one run, not persisted across runs',
      'Lists what fields accumulate in state (spec, SQL, verification result, retry count)',
      'Is honest about the current scope not including cross-session memory',
    ],
    followUps: ['How would you add session memory across multiple requests from the same user?', 'What happens to state if the process crashes mid-pipeline?'],
    tags: ['fnb', 'state', 'langgraph'],
  },
  {
    id: 'proj-016',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'What happens when the generated SQL is incorrect?',
    answer:
      "It gets caught by the Verifier Agent before it ever reaches the database. The Verifier Agent checks the SQL structurally against the schema — are the tables and columns real, is it a read-only query — and if something's wrong, it doesn't just reject silently; it produces a specific reason, like 'column customer_status does not exist on table accounts.' That reason is routed back to the Code Agent as part of the state, so its next attempt is targeted at the actual problem instead of guessing again from scratch.",
    keyPoints: [
      'Confirms the Verifier Agent is the catch point before execution',
      'Gives a concrete example of a specific, useful failure reason',
      'Explains how that reason feeds the refinement loop',
    ],
    followUps: ['What if the SQL is structurally valid but logically wrong for the user\'s intent?', 'How many retries do you allow before giving up?'],
    tags: ['fnb', 'verification', 'error-handling'],
  },
  {
    id: 'proj-017',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How do you verify generated SQL?',
    answer:
      "Verification happens in a few layers. First, a structural check confirms the SQL is syntactically valid. Second, a schema check confirms every table and column referenced actually exists in our database metadata, which is the main defence against hallucinated columns. Third, a policy check confirms the query is read-only — no INSERT, UPDATE, DELETE or DDL statements are allowed through. Only once a query passes all three does it get executed, and even then it runs through a database role that only has read permissions as a final backstop.",
    keyPoints: [
      'Breaks verification into clear layers: syntax, schema, policy',
      'Explicitly names the read-only policy check as blocking write statements',
      'Mentions database-level read-only role as a defence-in-depth backstop',
    ],
    followUps: ['What tooling or library do you use for SQL parsing/validation?', 'How do you keep the schema metadata used for verification up to date?'],
    tags: ['fnb', 'verification', 'security'],
  },
  {
    id: 'proj-018',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How do you prevent hallucinated SQL?',
    answer:
      "Two things work together here. First, we give the Code Agent explicit, accurate schema information in its prompt, rather than trusting it to remember or guess table structures — the more precisely we constrain what it's allowed to reference, the less room there is for it to invent something. Second, even with a good prompt, LLMs can still hallucinate, so the Verifier Agent independently checks every table and column reference against the real schema metadata before execution. That combination — constrain the input, then verify the output — is what actually keeps hallucination from reaching the database.",
    keyPoints: [
      'Explains prevention (good schema context in the prompt) and detection (verification) as two layers',
      'Is realistic that prompting alone cannot fully prevent hallucination',
      'Frames it as a "constrain input, verify output" pattern applicable to LLM systems generally',
    ],
    followUps: ['How large can the schema get before it becomes a problem to include in the prompt?', 'Have you measured how often hallucination actually happens?'],
    tags: ['fnb', 'hallucination', 'llm'],
  },
  {
    id: 'proj-019',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How do you prevent malicious SQL?',
    answer:
      "We treat the Code Agent's output the same way you'd treat any untrusted input, even though it's our own system generating it. The Verifier Agent enforces that only SELECT statements are allowed — anything resembling an INSERT, UPDATE, DELETE, DROP or other data-modifying or schema-modifying statement is rejected outright. On top of that, the database connection used for execution is bound to a read-only role at the database level, so even if a malicious or destructive query somehow slipped past application-level checks, the database itself would refuse to execute it. That layered defence — application-level policy plus database-level permissions — is deliberate.",
    keyPoints: [
      'Treats LLM output as untrusted input, a key security mindset',
      'Names the explicit statement-type allowlist (SELECT only)',
      'Emphasises defence-in-depth with database-level read-only permissions as a backstop',
    ],
    followUps: ['What would you do if you needed to eventually support write operations safely?', 'How would you defend against prompt injection trying to get the Code Agent to generate a write statement?'],
    tags: ['fnb', 'security', 'sql-injection'],
  },
  {
    id: 'proj-020',
    category: 'Project Questions',
    difficulty: 'Beginner',
    question: 'Why did you use PostgreSQL?',
    answer:
      "PostgreSQL is a mature, production-grade relational database with strong support for fine-grained roles and permissions, which mattered a lot for a project centred on safe, read-only access. It also has good tooling for inspecting schema metadata programmatically, which we relied on for the Verifier Agent's schema checks. Beyond the technical fit, it's widely used in real banking and enterprise systems, so building against it made our simulation feel closer to a realistic production environment than a lightweight database would have.",
    keyPoints: [
      'Justifies choice via role/permission granularity relevant to read-only design',
      'Mentions schema introspection tooling as directly useful for verification',
      'Notes real-world/production relevance as a reason for realism',
    ],
    followUps: ['What specific PostgreSQL features did you use for the read-only role?', 'How does querying schema metadata in PostgreSQL actually work?'],
    tags: ['fnb', 'postgresql', 'database'],
  },
  {
    id: 'proj-021',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'Why did you use read-only database access?',
    answer:
      "Because the whole point of the system is to answer questions about banking data, not to modify it, and giving an AI-generated query write access would introduce a risk with no corresponding benefit for this use case. Enforcing read-only access at the database connection level means that even in the worst case — a bug in our verification logic, or a cleverly malicious input — the system is structurally incapable of changing or deleting real data. It's a simple, high-leverage safety control that doesn't rely on our application code being perfect.",
    keyPoints: [
      'Explains read-only as matching the actual use case (querying, not modifying)',
      'Frames it as a structural safeguard that does not depend on perfect application logic',
      'Shows security-mindset: defence that survives your own bugs',
    ],
    followUps: ['What would change in your design if you needed to support write operations in future?', 'How is the read-only role actually configured in PostgreSQL?'],
    tags: ['fnb', 'security', 'database'],
  },
  {
    id: 'proj-022',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How did you handle database security?',
    answer:
      "We layered it: a dedicated database role with read-only permissions used for query execution, application-level verification rejecting anything that isn't a SELECT, and credentials kept out of source code using environment variables rather than being hard-coded. We also scoped the read-only role narrowly to just the tables the system actually needs, rather than granting broad access, following the principle of least privilege. None of these individually would be enough on their own, which is why we treated it as layers rather than one control.",
    keyPoints: [
      'Lists concrete layers: DB role, app-level checks, credential handling',
      'Names least privilege explicitly as a guiding principle',
      'Frames security as layered defence, not a single control',
    ],
    followUps: ['How do you manage and rotate database credentials in this kind of simulation?', 'What would you add if this were a real production system rather than a simulation?'],
    tags: ['fnb', 'security', 'database'],
  },
  {
    id: 'proj-023',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'What was the biggest technical challenge?',
    answer:
      "The biggest challenge was reliably preventing SQL hallucination — cases where the Code Agent generated SQL that looked completely plausible but referenced a column or table that didn't exist, or subtly misunderstood a relationship between tables. It wasn't something we could fix with a single change; it took a combination of giving the Code Agent much more explicit schema context, tightening the Verifier Agent's checks against real schema metadata, and building a proper refinement loop so failures became productive retries instead of dead ends.",
    keyPoints: [
      'Names a specific, credible technical challenge (hallucination)',
      'Shows it required a combination of fixes, not one silver bullet',
      'Ties directly to concepts covered elsewhere (verification, refinement loop)',
    ],
    followUps: ['How did you first notice this was happening?', 'How would you quantify how much this challenge improved over time?'],
    tags: ['fnb', 'challenge'],
  },
  {
    id: 'proj-024',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'What was the biggest mistake you made?',
    answer:
      "Early on I underestimated how much a small prompt change could affect the Code Agent's behaviour — I once adjusted the prompt to improve SQL formatting and it accidentally broke how the agent handled multi-table joins, which we only caught because a teammate noticed odd output during testing. The mistake taught me that in LLM-based systems, changes that look purely cosmetic can have real functional side effects, so now I test any prompt change against a fixed set of sample requirements before merging it.",
    keyPoints: [
      'Names a specific, real mistake (prompt change breaking joins)',
      'Is honest about how it was caught (teammate, not by the author)',
      'Shows the resulting process change (test set before merging prompt changes)',
    ],
    followUps: ['What does that test set of sample requirements actually look like?', 'Has a similar mistake happened again since you introduced that process?'],
    tags: ['fnb', 'mistake', 'lessons-learned'],
  },
  {
    id: 'proj-025',
    category: 'Project Questions',
    difficulty: 'Beginner',
    question: 'What did you learn from the project?',
    answer:
      "The biggest lesson was that building a trustworthy AI system is mostly about the guardrails around the model, not the model itself — verification, read-only access, retries with context, all of that mattered more to reliability than which LLM we used. I also learned a lot about working with LangGraph and multi-agent coordination in practice rather than just in theory, and about how much clearer communication needs to be in a team when everyone's work depends on a shared state format.",
    keyPoints: [
      'Draws the central lesson: guardrails matter more than the model choice',
      'Names concrete technical learning (LangGraph, multi-agent coordination)',
      'Adds a teamwork lesson about shared interfaces',
    ],
    followUps: ['What would you tell someone just starting a similar project?', 'How has this changed the way you approach new AI projects?'],
    tags: ['fnb', 'lessons-learned'],
  },
  {
    id: 'proj-026',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'What would you improve?',
    answer:
      "I'd want to add a more thorough automated test suite that runs a broad set of realistic banking requests through the full pipeline and checks both correctness and safety, rather than relying mostly on manual testing during development. I'd also improve observability — logging not just pass/fail but why the Verifier Agent rejected something, in a structured way we could analyse over time to spot patterns in what kinds of requests are hardest for the Code Agent.",
    keyPoints: [
      'Names a concrete, realistic improvement (automated regression test suite)',
      'Names a second improvement (structured observability/logging) with a clear reason',
      'Shows forward-thinking about maintainability, not just features',
    ],
    followUps: ['What would a good automated test case for this pipeline look like?', 'What metrics would you track in that observability layer?'],
    tags: ['fnb', 'improvements'],
  },
  {
    id: 'proj-027',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How would you make the system faster?',
    answer:
      "I'd look first at reducing unnecessary LLM calls — for example, caching schema information so it isn't re-fetched every run, and checking whether some verification steps can be done with lightweight, non-LLM checks like a SQL parser rather than another model call. I'd also consider running independent parts of the pipeline concurrently where possible, and using a smaller, faster model for simpler requests while reserving a larger model for more complex ones, since not every request needs the same amount of reasoning power.",
    keyPoints: [
      'Suggests caching static context (schema) rather than refetching every run',
      'Suggests replacing LLM calls with cheaper deterministic checks where possible',
      'Introduces model-routing (smaller model for simple requests) as an optimisation',
    ],
    followUps: ['How would you decide which requests are "simple" versus "complex" automatically?', 'What would you measure to know the system got faster?'],
    tags: ['fnb', 'performance'],
  },
  {
    id: 'proj-028',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How would you reduce LLM costs?',
    answer:
      "The biggest lever is avoiding unnecessary calls in the first place — caching repeated context like schema details, and routing straightforward requests to a smaller, cheaper model while only using a larger model for harder cases. I'd also look at prompt length, since trimming unnecessary context directly reduces token cost per call, and at whether the Verifier Agent truly needs an LLM call for every check or whether some of its checks can be done with plain code instead, which is both cheaper and more deterministic.",
    keyPoints: [
      'Names caching and model-tiering as primary cost levers',
      'Mentions prompt trimming as a direct token-cost reduction',
      'Suggests replacing some LLM verification checks with deterministic code',
    ],
    followUps: ['How would you measure cost per request in this system?', 'Is there a risk in replacing LLM checks with deterministic code?'],
    tags: ['fnb', 'cost-optimisation', 'llm'],
  },
  {
    id: 'proj-029',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How would you scale the system?',
    answer:
      "I'd start by making the pipeline stateless per request so multiple instances could run behind a load balancer, handling many concurrent user requests independently. I'd also look at where LLM calls become the bottleneck and consider a queue so spikes in demand don't overwhelm the system, processing requests as capacity allows rather than dropping them. On the database side, since we're read-only, I'd consider read replicas so a high volume of verified queries doesn't put pressure on a single database instance.",
    keyPoints: [
      'Explains statelessness as key to horizontal scaling',
      'Introduces queuing to smooth out demand spikes',
      'Suggests read replicas, which fits naturally with the read-only design',
    ],
    followUps: ['How would you handle a sudden spike in requests during peak banking hours?', 'What would you monitor to know when to scale up?'],
    tags: ['fnb', 'scalability', 'system-design'],
  },
  {
    id: 'proj-030',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How would you deploy the system?',
    answer:
      "I'd containerise the pipeline with Docker so it runs consistently across environments, expose it behind a FastAPI service, and deploy it to a managed environment like a Kubernetes cluster or a cloud container service so it can scale and restart automatically if something fails. I'd keep configuration like database credentials and model API settings in environment variables or a secrets manager rather than in the codebase, and set up a proper CI pipeline to run tests before anything reaches production.",
    keyPoints: [
      'Names containerisation (Docker) and an orchestrator for resilience/scaling',
      'Chooses FastAPI as the service layer, consistent with the user\'s known stack',
      'Mentions secrets management and CI as part of a real deployment, not just "push to server"',
    ],
    followUps: ['What would your CI pipeline actually check before deployment?', 'How would you handle zero-downtime deployments for this kind of service?'],
    tags: ['fnb', 'deployment'],
  },
  {
    id: 'proj-031',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How would you monitor the system?',
    answer:
      "I'd track both system health and AI-specific behaviour. On the system side: request latency, error rates, and database connection health, using standard monitoring tools. On the AI side, which is easy to overlook: how often the Verifier Agent rejects a query, how many retries requests typically need, and any drift in those numbers over time, since a rising rejection rate could mean the Code Agent's prompt needs attention or the schema has changed. I'd also want alerting if verification failures spike suddenly, since that could indicate a real problem rather than normal noise.",
    keyPoints: [
      'Separates system-level monitoring from AI-behaviour-specific monitoring',
      'Names concrete AI-specific metrics: rejection rate, retry counts, drift over time',
      'Adds alerting on anomalies, not just passive dashboards',
    ],
    followUps: ['What would count as a "normal" verification rejection rate versus a concerning one?', 'How would you detect if the underlying LLM provider changed model behaviour?'],
    tags: ['fnb', 'monitoring', 'observability'],
  },
  {
    id: 'proj-032',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'What happens if the LLM goes down?',
    answer:
      "The pipeline can't generate new requirements or SQL without it, so I'd want the system to fail gracefully — returning a clear message that the service is temporarily unavailable rather than hanging or crashing. Practically, I'd add retries with backoff for transient failures, and ideally a fallback to a secondary model provider for a genuine outage, so a single provider's downtime doesn't take the whole system offline. I'd also make sure any partially completed request state doesn't get lost or corrupted if the LLM call fails mid-pipeline.",
    keyPoints: [
      'Prioritises graceful failure with a clear user-facing message',
      'Adds retries with backoff for transient issues',
      'Suggests a fallback provider for genuine outages, and protecting in-flight state',
    ],
    followUps: ['How would you decide when to fail over to a secondary provider automatically?', 'What would the user actually see during an outage?'],
    tags: ['fnb', 'reliability', 'failure-handling'],
  },
  {
    id: 'proj-033',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'What happens if PostgreSQL goes down?',
    answer:
      "Since the pipeline depends on the database for both schema verification and query execution, I'd want it to detect a connection failure quickly and return a clear, specific error rather than a generic crash. I'd add connection retries with a short backoff for brief blips, and health checks so the service knows the database is unavailable before even attempting a full pipeline run, saving an unnecessary and costly LLM call for a request that can't complete anyway. For a production system, I'd also want a standby replica to fail over to.",
    keyPoints: [
      'Focuses on fast, clear failure detection over silent hangs',
      'Adds a smart optimisation: check DB health before spending an LLM call',
      'Mentions standby/replica failover for production-grade reliability',
    ],
    followUps: ['How would the health check actually be implemented?', 'What is the cost trade-off of checking database health before every request?'],
    tags: ['fnb', 'reliability', 'database'],
  },
  {
    id: 'proj-034',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How would you test the system?',
    answer:
      "I'd test at multiple levels. Unit tests for individual pieces like the schema-checking logic in the Verifier Agent, using known-good and known-bad SQL samples. Integration tests running realistic natural-language requests through the full pipeline and checking that the final SQL and result are correct. And a specific set of adversarial test cases designed to try to produce hallucinated or malicious SQL, to make sure the guardrails actually hold under deliberate pressure, not just normal use.",
    keyPoints: [
      'Separates unit tests, integration tests, and adversarial/security-focused tests',
      'Gives a concrete unit-test example (schema checking with good/bad SQL)',
      'Explicitly calls out adversarial testing of the safety guardrails',
    ],
    followUps: ['Can you give an example of an adversarial test case you would write?', 'How do you decide when the test suite gives you enough confidence to ship a change?'],
    tags: ['fnb', 'testing'],
  },
  {
    id: 'proj-035',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How would you handle sensitive banking information?',
    answer:
      "First, minimise exposure — the pipeline should only ever see the data it strictly needs to answer a given request, not broad dumps of customer information. Second, make sure logging never captures sensitive values in plain text; if we log a query for debugging, sensitive fields should be masked. Third, enforce access control so only authorised users or systems can even submit requests to the pipeline in the first place, and keep the read-only database role scoped to only the tables genuinely needed.",
    keyPoints: [
      'Leads with data minimisation as the first principle',
      'Explicitly addresses log masking, an easy-to-miss but important detail',
      'Ties access control and least-privilege scoping together',
    ],
    followUps: ['How would you mask sensitive fields in logs practically?', 'What compliance considerations (like POPIA) would apply here?'],
    tags: ['fnb', 'security', 'privacy'],
  },
  {
    id: 'proj-036',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How would you handle incorrect AI output?',
    answer:
      "If the Verifier Agent catches it, the system already handles it through the refinement loop. But for output that's structurally valid yet logically wrong for what the user actually meant — which verification can't always catch — I'd want a way for the user to flag the result as incorrect, and log that case for review. Over time, those flagged cases become useful data for improving the Requirement Agent's prompt or adding new verification rules that catch that class of mistake in future.",
    keyPoints: [
      'Distinguishes structural errors (already caught) from logical/intent errors (harder to catch)',
      'Introduces user feedback as a mechanism to catch what verification misses',
      'Frames flagged cases as a feedback loop for continuous improvement',
    ],
    followUps: ['How would you build that user-feedback flagging into the interface?', 'How often would you expect this kind of logical error to happen?'],
    tags: ['fnb', 'error-handling', 'human-in-the-loop'],
  },
  {
    id: 'proj-037',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How would you implement human-in-the-loop?',
    answer:
      "I'd add a review step for higher-risk or higher-impact requests — for example, anything touching a large number of records or unusual patterns — where a human approves the generated and verified SQL before it actually executes, rather than everything running fully automatically. Lower-risk, routine requests could still run automatically since the existing guardrails already cover them well. This way human oversight is focused where it adds the most value, instead of becoming a bottleneck on every single request.",
    keyPoints: [
      'Proposes risk-based routing: not everything needs human review',
      'Gives a concrete example of what would trigger review (large record counts, unusual patterns)',
      'Balances safety with not creating an approval bottleneck',
    ],
    followUps: ['How would you define "higher-risk" precisely enough to automate the routing decision?', 'Who would realistically be the human reviewer in a bank setting?'],
    tags: ['fnb', 'human-in-the-loop'],
  },
  {
    id: 'proj-038',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How would you improve the accuracy of the system?',
    answer:
      "I'd start by building a proper evaluation set of realistic banking requests with known-correct SQL, so we can measure accuracy objectively instead of relying on impressions from manual testing. From there, I'd look at where errors cluster — is it the Requirement Agent misunderstanding intent, or the Code Agent struggling with a certain kind of join or filter — and target improvements specifically at that weak point, whether that's better prompting, more schema context, or few-shot examples of similar correct queries.",
    keyPoints: [
      'Starts with building a measurable evaluation set, showing a data-driven mindset',
      'Explains diagnosing which agent is the actual source of errors',
      'Names concrete levers: better prompting, more context, few-shot examples',
    ],
    followUps: ['What would a good evaluation set actually contain?', 'How would you use few-shot examples specifically to improve the Code Agent?'],
    tags: ['fnb', 'evaluation', 'improvements'],
  },
  {
    id: 'proj-039',
    category: 'Project Questions',
    difficulty: 'Beginner',
    question: 'What did you personally contribute to the project?',
    answer:
      "I worked specifically on parts of the agent logic and the Verifier Agent's schema-checking and read-only enforcement, and I was one of the people who identified and fixed the SQL-hallucination issue by tightening schema context and adding the refinement loop with failure reasons. I also contributed to how the team agreed on the shared state format between agents, which came out of a discussion I raised early on to avoid rework later.",
    keyPoints: [
      'Names specific, concrete contributions rather than a vague "I helped with everything"',
      'Ties contribution to the hallucination fix and refinement loop already discussed',
      'Mentions a process contribution (shared state format) alongside code contribution',
    ],
    followUps: ['If a teammate described your contribution, would they say the same thing?', 'What part of the project are you least proud of your contribution to?'],
    tags: ['fnb', 'personal-contribution'],
  },
  {
    id: 'proj-040',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'If you rebuilt the project today, what would you change?',
    answer:
      "I'd invest in the evaluation and testing setup much earlier instead of building it up gradually — having a fixed set of realistic requests with known-correct answers from day one would have caught issues like the hallucination problem faster and with more confidence. I'd also design the shared state format more deliberately upfront as a team, with a clear schema, rather than letting it evolve organically as we went, since a couple of our early integration issues traced back to assumptions about what fields would be present in state.",
    keyPoints: [
      'Prioritises earlier investment in evaluation/testing as the top change',
      'Names a second concrete change: designing the shared state schema deliberately upfront',
      'Both changes are realistic, specific lessons rather than vague hindsight',
    ],
    followUps: ['How would you convince a team to invest in testing infrastructure before building features?', 'What would an upfront state schema design session actually look like?'],
    tags: ['fnb', 'retrospective'],
  },
]

const studyTogetherQuestions: Question[] = [
  {
    id: 'proj-041',
    category: 'Project Questions',
    difficulty: 'Beginner',
    question: 'Tell us about your StudyTogether project.',
    answer:
      "StudyTogether is a collaborative study platform I built on my own initiative, aimed at high-school learners who want to study together online. It has study rooms where learners can join, friends lists, room administration with rules, and backend APIs and a database behind all of that. I wanted to explore how AI could add real value to studying — like accountability features — while also just building a solid, real full-stack product outside of any coursework or assignment.",
    keyPoints: [
      'Frames it clearly as a self-initiated project, not an assignment',
      'Names the concrete features: study rooms, friends, room admin/rules',
      'Connects it to genuine interest in AI-assisted education',
    ],
    followUps: ['What made you decide to build this specifically?', 'What stage is the project at currently?'],
    tags: ['studytogether', 'overview'],
  },
  {
    id: 'proj-042',
    category: 'Project Questions',
    difficulty: 'Beginner',
    question: 'What problem does StudyTogether solve?',
    answer:
      "A lot of high-school learners study alone and lose motivation or accountability without realising it, especially outside of formal class time. StudyTogether gives them a shared virtual space to study together, similar to how people use co-working spaces, with room rules and light accountability features to help them actually stay focused rather than just being on a call with friends. It's about making self-directed studying feel less isolating and more structured.",
    keyPoints: [
      'Names the real problem: isolation and lack of accountability in solo studying',
      'Uses a relatable analogy (co-working spaces) to explain the concept',
      'Distinguishes it from just "being on a call" by emphasising structure/rules',
    ],
    followUps: ['How do the room rules actually work in practice?', 'How do you know learners are more focused using this than studying alone?'],
    tags: ['studytogether', 'problem-statement'],
  },
  {
    id: 'proj-043',
    category: 'Project Questions',
    difficulty: 'Beginner',
    question: 'Why did you build it?',
    answer:
      "I wanted a project that was fully mine end to end, where I made every product and technical decision myself, as a way to grow beyond what the learnership curriculum covers. I also genuinely believe in the problem — I remember struggling with staying accountable studying alone in school, and I thought a simple, well-built platform could help with that for current learners. It was as much about building real product and engineering judgement as it was about the idea itself.",
    keyPoints: [
      'Shows personal motivation to grow beyond assigned coursework',
      'Ties to authentic personal experience with the problem',
      'Frames it as deliberate skill-building, not just "I had an idea"',
    ],
    followUps: ['What specific skills were you hoping to build that the learnership does not cover?', 'How much of the idea came from your own school experience versus research?'],
    tags: ['studytogether', 'motivation'],
  },
  {
    id: 'proj-044',
    category: 'Project Questions',
    difficulty: 'Beginner',
    question: 'Who are the target users?',
    answer:
      "The primary users are high-school learners, particularly those preparing for exams who want structure and peer accountability while studying outside school hours. Secondary users would be small study groups or even a few friends who already study together informally and want a dedicated space with rules and structure rather than just an ad-hoc video call. It's deliberately narrow — high-school learners — rather than trying to serve university students or professionals too, at least in this version.",
    keyPoints: [
      'Names a specific, narrow primary user (high-school learners)',
      'Adds a realistic secondary use case (existing informal study groups)',
      'Shows deliberate scoping rather than trying to serve everyone',
    ],
    followUps: ['Why did you choose to scope it to high-school learners specifically rather than university students too?', 'How would the product change if you expanded to university students?'],
    tags: ['studytogether', 'users'],
  },
  {
    id: 'proj-045',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'Explain the architecture.',
    answer:
      "It follows a fairly standard full-stack structure — a backend exposing APIs for authentication, study rooms, friends and room administration, backed by a relational database storing users, rooms, memberships and rules. The frontend consumes those APIs to render the study room experience. I kept the architecture deliberately simple and modular so that features like the AI accountability concepts could be added later as a separate service rather than being tangled into the core room/user logic from the start.",
    keyPoints: [
      'Describes a standard, sensible full-stack layout: API backend, relational DB, frontend',
      'Explains modularity as a deliberate choice to keep AI features decoupled',
      'Keeps the description honest about it being a fairly standard structure rather than overselling complexity',
    ],
    followUps: ['What backend framework and database did you use specifically?', 'How do rooms, users and rules relate to each other in your schema?'],
    tags: ['studytogether', 'architecture'],
  },
  {
    id: 'proj-046',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'What role does AI play in the system?',
    answer:
      "AI is mainly explored around accountability — the idea of using signals like activity in the room, or potentially computer vision, to give learners gentle feedback on whether they're actually engaged in the study session. It's intentionally a smaller, more careful part of the product rather than the core of it, because I'm conscious that anything monitoring learners, especially minors, has to be handled very carefully in terms of privacy and fairness, so it's been treated as an experimental, opt-in layer on top of the core study-room product.",
    keyPoints: [
      'Positions AI as an accountability layer, not the core product',
      'Shows deliberate caution given the user base includes minors',
      'Frames it as opt-in and experimental rather than a default, invasive feature',
    ],
    followUps: ['What would the simplest, lowest-risk version of this AI feature look like?', 'How would you test whether this feature actually helps or just annoys users?'],
    tags: ['studytogether', 'ai', 'ethics'],
  },
  {
    id: 'proj-047',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How could AI detect whether a student is sleeping?',
    answer:
      "The general approach would be computer vision using the learner's webcam feed, looking for signals like prolonged eye closure, head position (like a head dropping forward or resting on a hand), and lack of movement over an extended period. You'd typically use a face and landmark detection model to track eye aspect ratio and head pose over time, rather than making a decision from a single frame, since a single closed-eye frame could just be a blink. It's a genuinely hard problem to get right reliably.",
    keyPoints: [
      'Names concrete, plausible signals: eye closure duration, head pose, lack of movement',
      'Mentions eye aspect ratio and head pose as real computer-vision techniques',
      'Notes the importance of looking over time, not a single frame, to avoid false positives',
    ],
    followUps: ['What model or library would you actually use for face/landmark detection?', 'How would you tune the threshold for "prolonged" eye closure?'],
    tags: ['studytogether', 'computer-vision'],
  },
  {
    id: 'proj-048',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'What computer vision approach could you use?',
    answer:
      "A practical approach would be a lightweight face landmark detection model, like something built on MediaPipe or a similar library, to track eye aspect ratio and head pose in real time on the client side rather than sending raw video to a server. Running it client-side is important both for privacy and for reducing bandwidth and server cost. The output would be simple, low-dimensional signals — 'eyes closed for over N seconds', 'head tilted beyond X degrees' — rather than storing or transmitting actual video or images.",
    keyPoints: [
      'Names a realistic, lightweight technique (MediaPipe-style landmark detection)',
      'Explicitly chooses client-side processing for privacy and cost reasons',
      'Emphasises reducing raw video to simple signals rather than storing footage',
    ],
    followUps: ['Why is client-side processing better here than sending video to a server?', 'What would you do with a detected signal once you have it?'],
    tags: ['studytogether', 'computer-vision', 'privacy'],
  },
  {
    id: 'proj-049',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'What are the limitations of this approach?',
    answer:
      "It can easily misread context — someone resting their eyes briefly while thinking, wearing glasses that create glare, poor lighting, or a webcam angle that makes head-pose estimation unreliable, can all trigger a false 'not studying' signal. It also can't tell the difference between someone sleeping and someone reading printed material off-screen, which is a completely normal part of studying. Because of that, I don't think this kind of signal should ever be used punitively or shown as a hard judgement — at most it's a soft, private nudge to the learner themselves.",
    keyPoints: [
      'Names concrete failure modes: glasses/glare, lighting, camera angle, reading off-screen',
      'Clearly distinguishes normal studying behaviour from "not engaged"',
      'Draws the ethical conclusion: soft private nudge only, never punitive judgement',
    ],
    followUps: ['How would you design the "nudge" so it does not feel invasive?', 'Would you ever show this data to a parent or teacher? Why or why not?'],
    tags: ['studytogether', 'limitations', 'ethics'],
  },
  {
    id: 'proj-050',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How would you reduce false positives?',
    answer:
      "I'd require a sustained signal over a meaningful time window rather than reacting to a single frame — for example, eyes closed continuously for 20-30 seconds rather than a couple of seconds, which naturally filters out blinking or brief eye rest. I'd also combine multiple signals rather than relying on one; head pose plus eye closure together is more reliable than either alone. And I'd let users correct the system — if a learner marks a flagged moment as inaccurate, that feedback could help tune thresholds over time.",
    keyPoints: [
      'Uses time-windowed detection to filter out normal blinking/brief movements',
      'Combines multiple signals rather than relying on one weak signal',
      'Introduces a user feedback/correction loop to improve accuracy over time',
    ],
    followUps: ['How would you use that user correction data without it being gamed?', 'What time window would you start testing with, and why?'],
    tags: ['studytogether', 'computer-vision', 'reliability'],
  },
  {
    id: 'proj-051',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How would you protect student privacy?',
    answer:
      "The most important decision is processing video on the learner's own device and never uploading or storing raw footage — only simple derived signals, if any, would ever leave the device, and ideally not even those. I'd make the feature fully opt-in with a clear, plain-language explanation of what it does before anyone turns it on, and give an obvious way to turn it off at any time. Given many users would be minors, I'd also want parental awareness or consent built into onboarding, not treated as an afterthought.",
    keyPoints: [
      'Prioritises on-device processing and never storing raw video',
      'Makes the feature opt-in with clear, plain-language explanation upfront',
      'Explicitly addresses the minors angle with parental consent in onboarding',
    ],
    followUps: ['How would you communicate this clearly to a 15-year-old user versus their parent?', 'What data, if any, would you be comfortable storing at all?'],
    tags: ['studytogether', 'privacy', 'ethics'],
  },
  {
    id: 'proj-052',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How would you handle consent?',
    answer:
      "Consent needs to be explicit, specific and revocable — not a single blanket 'I agree to terms' checkbox at signup, but a distinct opt-in specifically for any camera-based accountability feature, explained in plain language a teenager would actually understand. Given the target users are minors, I'd also want a parent or guardian to be informed or to consent, depending on age, before the feature is enabled, and I'd make it trivially easy to withdraw consent at any time without losing access to the rest of the platform.",
    keyPoints: [
      'Distinguishes specific, feature-level consent from a generic terms checkbox',
      'Uses plain language appropriate for a teenage audience',
      'Ensures withdrawing consent does not lock users out of the core, non-AI product',
    ],
    followUps: ['At what age would you require parental consent versus letting the learner decide themselves?', 'How would you design the consent flow in the UI?'],
    tags: ['studytogether', 'consent', 'ethics'],
  },
  {
    id: 'proj-053',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How would you prevent AI from unfairly penalizing students?',
    answer:
      "The core design choice is to never let this kind of signal automatically penalise anyone — no reduced access, no visible 'score' shown to others, no reporting to a teacher or parent based purely on an AI inference. At most, it's a private, personal nudge to the learner themselves, framed supportively rather than as a judgement. I'd also make sure learners can dispute or dismiss a flagged moment easily, and I'd regularly review how often the system flags normal behaviour incorrectly, since a feature that frequently misjudges people will just erode trust in the whole product.",
    keyPoints: [
      'Sets a firm design rule: never automatically penalise based on this signal',
      'Frames any output as a private, supportive nudge, not a public or reported score',
      'Adds a dispute/dismiss mechanism plus ongoing review of false-positive rates',
    ],
    followUps: ['What would you do if a learner felt the feature was unfair despite these safeguards?', 'Would you ever aggregate this data across a class or group? Why or why not?'],
    tags: ['studytogether', 'fairness', 'ethics'],
  },
  {
    id: 'proj-054',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How would you scale StudyTogether?',
    answer:
      "I'd design the backend APIs to be stateless so I can run multiple instances behind a load balancer as user numbers grow, and use a managed, scalable database rather than something that only works well at small scale. For the study-room experience specifically, real-time features like presence and room activity would need a proper pub/sub or websocket infrastructure that can handle many concurrent rooms, rather than a naive polling approach that gets expensive fast as usage grows.",
    keyPoints: [
      'Applies statelessness for horizontal scaling of the API layer',
      'Chooses a managed, scalable database over an ad hoc small-scale one',
      'Identifies real-time room presence/activity as the trickiest scaling problem, needing pub/sub or websockets',
    ],
    followUps: ['What would you use specifically for the real-time presence feature — websockets, polling, something else?', 'How would you shard or partition data if user numbers grew very large?'],
    tags: ['studytogether', 'scalability'],
  },
  {
    id: 'proj-055',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'What was technically difficult?',
    answer:
      "Designing the database schema for study rooms was trickier than I expected — modelling rooms, memberships, roles like admin versus member, and room-specific rules in a way that was flexible enough for different room configurations but still simple to query, took a couple of iterations to get right. I initially under-modelled it, which meant I had to redesign the schema once I actually started building the room administration features and realised the first version couldn't support multiple admins or custom rules cleanly.",
    keyPoints: [
      'Names a specific, real technical difficulty: room/membership/role schema design',
      'Is honest about needing a redesign rather than getting it right the first time',
      'Ties back to a genuine "tell us about a time you failed" story already covered',
    ],
    followUps: ['What does the final schema look like now?', 'What would you do differently if you designed this schema again from scratch?'],
    tags: ['studytogether', 'challenge', 'database'],
  },
  {
    id: 'proj-056',
    category: 'Project Questions',
    difficulty: 'Beginner',
    question: 'What did you learn from building it?',
    answer:
      "I learned how much product thinking matters alongside technical skill — deciding what not to build, like holding off on the computer-vision feature, was as important as the features I did build. I also got much more comfortable designing a real database schema from scratch and iterating on it once real requirements showed the first version wasn't flexible enough. And building something with real potential users, even if it's still early, made me think much more seriously about privacy and consent than a purely academic project would have.",
    keyPoints: [
      'Highlights product judgement (what not to build) as a real lesson',
      'Names concrete technical growth: database schema design and iteration',
      'Connects the project to genuinely internalising privacy/consent thinking',
    ],
    followUps: ['How has this changed how you approach the FNB project\'s design decisions?', 'What is the next feature you plan to build for StudyTogether?'],
    tags: ['studytogether', 'lessons-learned'],
  },
  {
    id: 'proj-057',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'What would you improve?',
    answer:
      "I'd want to build out proper automated testing for the backend APIs, which I've been less disciplined about compared to the FNB project's more structured team process. I'd also want to do real user testing with actual high-school learners before building the AI accountability features further, since I don't want to invest heavily in something based on my own assumptions about what would actually help them stay focused.",
    keyPoints: [
      'Names a concrete gap (automated testing) rather than a vague "make it better"',
      'Proposes real user testing before investing further in the AI feature',
      'Shows self-awareness comparing personal project discipline to the more structured FNB project',
    ],
    followUps: ['What would a first round of user testing with learners actually look like?', 'What testing framework would you use for the backend APIs?'],
    tags: ['studytogether', 'improvements'],
  },
  {
    id: 'proj-058',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How would you monetize it?',
    answer:
      "Given the audience is high-school learners who typically don't have much spending power themselves, I'd lean toward a freemium model — core study rooms and accountability features free, with optional premium features like advanced room customisation or analytics for a small fee, possibly aimed at parents rather than learners directly. I'd be cautious about anything that makes safety or privacy features a paid tier, since that would create a bad incentive to under-protect free users.",
    keyPoints: [
      'Chooses freemium as realistic given the target audience\'s limited spending power',
      'Considers parents as a possible paying customer, not just learners',
      'Sets an ethical boundary: safety/privacy features should never be paywalled',
    ],
    followUps: ['What features specifically would you put behind a paid tier?', 'Would schools or teachers be a better customer than individual parents?'],
    tags: ['studytogether', 'monetisation', 'ethics'],
  },
  {
    id: 'proj-059',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How would you test it?',
    answer:
      "I'd combine automated backend tests for the APIs — covering things like room creation, membership rules, and permission checks for admin actions — with manual usability testing involving real learners, since a lot of whether this product actually works comes down to whether teenagers find it genuinely useful and not annoying. I'd also specifically test edge cases around room rules and permissions, like what happens if the only admin leaves a room, since those are the kinds of gaps that are easy to miss but frustrating for real users.",
    keyPoints: [
      'Combines automated API tests with real usability testing, not just one or the other',
      'Names a concrete edge case (admin leaving a room) showing genuine product thinking',
      'Prioritises real learner feedback given the product\'s success depends on actual usage patterns',
    ],
    followUps: ['What automated testing framework would you use for the backend?', 'How would you recruit real high-school learners to test with?'],
    tags: ['studytogether', 'testing'],
  },
  {
    id: 'proj-060',
    category: 'Project Questions',
    difficulty: 'Intermediate',
    question: 'How would you handle thousands of simultaneous users?',
    answer:
      "I'd make sure the API layer is stateless and horizontally scalable behind a load balancer, and move real-time features like room presence to proper websocket or pub/sub infrastructure rather than something that polls the database constantly, since that would fall over quickly at that scale. I'd add caching for data that doesn't change often, like room metadata, and make sure the database is properly indexed for the most common queries, like fetching a learner's active rooms. I'd also want load testing done before assuming any of this actually holds up under real concurrent traffic.",
    keyPoints: [
      'Applies stateless horizontal scaling and proper real-time infrastructure (not polling)',
      'Adds caching and indexing as concrete performance levers',
      'Insists on load testing rather than assuming the design works without verification',
    ],
    followUps: ['What would you specifically load test, and what tools would you use?', 'What is the first part of the system you would expect to break under load?'],
    tags: ['studytogether', 'scalability', 'performance'],
  },
]

export const projectQuestions: Question[] = [...fnbQuestions, ...studyTogetherQuestions]
