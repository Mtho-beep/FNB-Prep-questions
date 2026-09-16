import type { Question } from '../types/questions'

// 17 AI Agents questions, heavily grounded in the FNB multi-agent /
// LangGraph pipeline the user actually built.

export const agentQuestions: Question[] = [
  {
    id: 'agent-001',
    category: 'AI Agents',
    difficulty: 'Beginner',
    question: 'What is an AI agent?',
    answer:
      "An AI agent is a system built around an LLM that can take actions and make decisions toward a goal, often using tools, maintaining some form of state, and sometimes looping until a task is complete — rather than just responding once to a single prompt. In the FNB project, each of our Requirement, Code and Verifier components acts as an agent: each has a specific role, receives input, and produces output that drives what happens next in the pipeline.",
    keyPoints: [
      'Built around an LLM but can take actions/decisions toward a goal',
      'Often uses tools, maintains state, and may loop until done',
      'FNB\'s Requirement/Code/Verifier agents are concrete examples',
    ],
    followUps: ['What specifically makes something an "agent" versus just an LLM call?', 'Which of the FNB agents has the most autonomy?'],
    tags: ['agents', 'fundamentals'],
  },
  {
    id: 'agent-002',
    category: 'AI Agents',
    difficulty: 'Intermediate',
    question: 'How is an AI agent different from an LLM application?',
    answer:
      "A basic LLM application typically takes an input, makes one call to the model, and returns an output — like a simple chatbot response. An agent goes further: it can decide what to do next based on intermediate results, potentially call tools or other agents, and loop or branch depending on outcomes. Our FNB pipeline isn't just one call — it dynamically routes between agents and can loop back for refinement based on verification results, which is what makes it agentic rather than a single LLM call.",
    keyPoints: [
      'Simple LLM app: one call, one output',
      'Agent: makes decisions, can call tools/other agents, can loop or branch',
      'FNB pipeline\'s dynamic routing and refinement loop is what makes it agentic',
    ],
    followUps: ['At what point would you say a system stops being "just an LLM app" and becomes an agent?', 'Could the FNB pipeline be built as a single LLM call instead? What would be lost?'],
    tags: ['agents', 'llm'],
  },
  {
    id: 'agent-003',
    category: 'AI Agents',
    difficulty: 'Beginner',
    question: 'What is a multi-agent system?',
    answer:
      "A multi-agent system is one where multiple specialised agents collaborate, each responsible for a different part of a larger task, rather than one agent trying to do everything. The FNB pipeline is a clear example: the Requirement Agent, Code Agent and Verifier Agent each own a distinct responsibility and pass information between each other through shared state to complete the overall task together.",
    keyPoints: [
      'Multiple specialised agents collaborating on a larger task',
      'Each agent owns a distinct responsibility',
      'FNB\'s three-agent pipeline is a direct real-world example',
    ],
    followUps: ['What are the coordination challenges specific to multi-agent systems?', 'How do you decide how many agents is the right number?'],
    tags: ['multi-agent', 'fnb'],
  },
  {
    id: 'agent-004',
    category: 'AI Agents',
    difficulty: 'Intermediate',
    question: 'Why use multiple agents?',
    answer:
      "Splitting responsibilities across agents makes each one's job simpler and easier to prompt well, test independently, and improve without affecting the others. It also creates natural checkpoints — like our Verifier Agent sitting between generation and execution — that would be harder to enforce cleanly inside a single monolithic agent trying to do everything at once. The trade-off is more coordination complexity and typically more LLM calls, but for a safety-sensitive use case like banking, that trade-off is worth it.",
    keyPoints: [
      'Specialisation makes each agent simpler to prompt, test and improve independently',
      'Creates natural safety checkpoints between stages',
      'Trade-off: more coordination complexity and LLM calls, but worth it for safety-sensitive use cases',
    ],
    followUps: ['What would you lose by merging the Code Agent and Verifier Agent into one?', 'How do you decide where to draw the boundary between agents?'],
    tags: ['multi-agent', 'design-rationale'],
  },
  {
    id: 'agent-005',
    category: 'AI Agents',
    difficulty: 'Beginner',
    question: 'What is tool use?',
    answer:
      "Tool use is when an agent can call external functions or APIs to do things an LLM can't do reliably on its own — like querying a real database, doing precise arithmetic, or searching the web — rather than trying to generate the answer purely from its own text prediction. In the FNB pipeline, executing the verified SQL against PostgreSQL is effectively a tool call: the agent's job is to produce the right SQL, and a separate, reliable execution tool actually runs it.",
    keyPoints: [
      'Agent calls external functions/APIs instead of relying purely on generated text',
      'Used for things LLMs are unreliable at doing directly: precise math, real data lookups',
      'FNB\'s database execution step is effectively a tool call',
    ],
    followUps: ['Why is it risky to let an LLM do arithmetic directly instead of using a tool?', 'What tools, if any, could you add to the Requirement Agent?'],
    tags: ['tool-use', 'agents'],
  },
  {
    id: 'agent-006',
    category: 'AI Agents',
    difficulty: 'Intermediate',
    question: 'What is agent memory?',
    answer:
      "Agent memory refers to information an agent retains and can use beyond a single step — this could be short-term, like the current pipeline's shared state carrying the spec and SQL through each stage, or long-term, like remembering a user's previous requests across sessions. The FNB pipeline currently only has short-term, per-run memory through LangGraph's state; it doesn't retain anything across separate user requests, which would need a separate persistence layer to add.",
    keyPoints: [
      'Information an agent retains and reuses beyond a single step',
      'Short-term: within one pipeline run. Long-term: across sessions',
      'FNB pipeline currently only has short-term, per-run state, honestly noted as a gap',
    ],
    followUps: ['How would you add long-term memory to the FNB pipeline?', 'What are the risks of adding long-term memory to a banking AI system?'],
    tags: ['agent-memory', 'fnb'],
  },
  {
    id: 'agent-007',
    category: 'AI Agents',
    difficulty: 'Intermediate',
    question: 'What is agent state?',
    answer:
      "Agent state is the data that represents everything relevant about where a task currently stands as it moves through a pipeline. In the FNB system, state includes the original request, the structured specification from the Requirement Agent, the SQL generated by the Code Agent, the verification result, and the retry count — it's what LangGraph passes between nodes, and each agent reads and updates the parts relevant to it.",
    keyPoints: [
      'Data representing the current status of a task as it moves through the pipeline',
      'FNB example: request, spec, SQL, verification result, retry count',
      'Passed between nodes in the LangGraph graph, read/updated by each agent',
    ],
    followUps: ['What would happen if two agents tried to update the same field in state simultaneously?', 'How is state different from long-term memory?'],
    tags: ['agent-state', 'langgraph'],
  },
  {
    id: 'agent-008',
    category: 'AI Agents',
    difficulty: 'Beginner',
    question: 'What is an agent workflow?',
    answer:
      "An agent workflow is the defined sequence, or graph, of steps an agent system follows to complete a task — which agent runs when, what conditions trigger moving forward versus looping back, and where the workflow ends. For the FNB pipeline, the workflow is: Requirement Agent, then Code Agent, then Verifier Agent, with a conditional edge that routes back to the Code Agent on verification failure, or forward to execution on success.",
    keyPoints: [
      'The defined sequence/graph of steps an agent system follows',
      'Includes conditions for branching or looping, not just a straight line',
      'FNB example: linear flow with a conditional loop-back on verification failure',
    ],
    followUps: ['How would you visualise or document this workflow for a new teammate?', 'What would you add to the workflow to handle a repeated verification failure?'],
    tags: ['agent-workflow', 'langgraph'],
  },
  {
    id: 'agent-009',
    category: 'AI Agents',
    difficulty: 'Beginner',
    question: 'What is LangGraph?',
    answer:
      "LangGraph is a framework for building applications, especially multi-agent or multi-step LLM systems, as a graph of nodes and edges, where each node represents a step (often an agent or function) and edges define how control and state flow between them, including conditional branches and loops. We used it to orchestrate the FNB pipeline's Requirement, Code and Verifier agents and to implement the refinement loop when verification fails.",
    keyPoints: [
      'Framework for building multi-step/multi-agent LLM applications as a graph',
      'Nodes = steps/agents, edges = control and state flow, including conditionals and loops',
      'Used directly to orchestrate the FNB pipeline and its refinement loop',
    ],
    followUps: ['How does LangGraph differ from just chaining function calls yourself?', 'What other orchestration frameworks have you heard of or considered?'],
    tags: ['langgraph', 'agents'],
  },
  {
    id: 'agent-010',
    category: 'AI Agents',
    difficulty: 'Intermediate',
    question: 'Why use LangGraph?',
    answer:
      "We needed conditional routing and looping — specifically, routing back to the Code Agent on verification failure rather than always moving forward — and LangGraph gives that to us cleanly as part of its graph model, rather than us hand-writing that control flow with nested conditionals and manual state passing. It also made the pipeline's structure more explicit and visual, which helped the team reason about and debug the flow together, since everyone could see the graph rather than trace through scattered function calls.",
    keyPoints: [
      'Provides conditional routing/looping cleanly through its graph model',
      'Avoids hand-rolled nested conditionals and manual state-passing code',
      'Makes pipeline structure explicit, aiding team understanding and debugging',
    ],
    followUps: ['What would the equivalent hand-rolled code have looked like without LangGraph?', 'What is a limitation of LangGraph you have run into?'],
    tags: ['langgraph', 'design-rationale'],
  },
  {
    id: 'agent-011',
    category: 'AI Agents',
    difficulty: 'Intermediate',
    question: 'What is an agent loop?',
    answer:
      "An agent loop is a repeating cycle where an agent takes an action, observes the result, and decides whether to act again or stop, continuing until some completion condition is met. In the FNB pipeline, the refinement loop is a bounded agent loop: the Code Agent generates SQL, the Verifier Agent checks it, and if it fails, control loops back to the Code Agent with the failure reason, up to a maximum number of attempts before giving up.",
    keyPoints: [
      'A repeating act-observe-decide cycle until a stopping condition is met',
      'FNB\'s refinement loop (generate, verify, retry) is a concrete bounded example',
      'Bounding the loop (max attempts) is important to avoid infinite loops',
    ],
    followUps: ['Why is it important to bound this loop with a maximum attempt count?', 'What would you do once the maximum attempts are exhausted?'],
    tags: ['agent-loop', 'fnb'],
  },
  {
    id: 'agent-012',
    category: 'AI Agents',
    difficulty: 'Intermediate',
    question: 'What is reflection?',
    answer:
      "Reflection is when an agent evaluates its own previous output or reasoning and uses that self-assessment to improve its next attempt, rather than just retrying blindly. In our pipeline, when the Verifier Agent's failure reason is fed back into the Code Agent's next prompt, that's a lightweight form of reflection — the system is using an assessment of what went wrong to inform a better next attempt, rather than the Code Agent just guessing again from scratch.",
    keyPoints: [
      'Agent evaluates its own output/reasoning to improve subsequent attempts',
      'Different from blind retrying — it uses specific feedback',
      'FNB\'s failure-reason-to-Code-Agent loop is a lightweight, practical example',
    ],
    followUps: ['How could you make the reflection step even more sophisticated in this pipeline?', 'What is the risk of an agent reflecting on and trusting its own flawed reasoning?'],
    tags: ['reflection', 'agents'],
  },
  {
    id: 'agent-013',
    category: 'AI Agents',
    difficulty: 'Intermediate',
    question: 'What is self-reflection prompting?',
    answer:
      "Self-reflection prompting is a technique where you explicitly ask the model to critique or check its own output before finalising it — for example, prompting the Code Agent to review its generated SQL against the given schema and flag any concerns before returning it, rather than returning the first thing it produces. It can catch some mistakes, but it isn't a substitute for independent verification, since a model reflecting on its own reasoning can still miss the same blind spots that caused the original mistake.",
    keyPoints: [
      'Explicitly prompts the model to critique/check its own output before finalising',
      'Can catch some mistakes proactively',
      'Not a substitute for independent verification, since the same blind spots can persist',
    ],
    followUps: ['Would you add this to the Code Agent in addition to the Verifier Agent, or instead of it?', 'What is a concrete self-reflection prompt you could write for SQL generation?'],
    tags: ['self-reflection', 'prompt-engineering'],
  },
  {
    id: 'agent-014',
    category: 'AI Agents',
    difficulty: 'Intermediate',
    question: 'What are the disadvantages of multi-agent systems?',
    answer:
      "They're more complex to design, debug and reason about than a single agent, since a problem could originate in any of several agents or in how they communicate. They also tend to cost more and be slower, since you're often making multiple LLM calls instead of one. And there's coordination risk — if agents disagree about the format or meaning of shared state, subtle bugs can appear that are harder to trace than a bug in a single, self-contained agent.",
    keyPoints: [
      'More complex to design/debug — failure could be in any agent or their communication',
      'Higher cost and latency from multiple LLM calls',
      'Coordination risk from disagreements about shared state format',
    ],
    followUps: ['Have you personally run into a coordination bug on the FNB project?', 'How would you make debugging a multi-agent system easier?'],
    tags: ['multi-agent', 'trade-offs'],
  },
  {
    id: 'agent-015',
    category: 'AI Agents',
    difficulty: 'Intermediate',
    question: 'How do you prevent agents from getting stuck in loops?',
    answer:
      "The most direct way is to bound the loop with a maximum number of attempts, like we did in the FNB refinement loop, so a persistently failing case doesn't retry forever. I'd also make sure each retry is actually informed by the previous failure, so it's not just blindly repeating the same mistake, and add a clear fallback — like returning a clear error to the user after the maximum retries — rather than the pipeline hanging or silently failing.",
    keyPoints: [
      'Bound the loop with a maximum attempt count',
      'Make each retry informed by the previous failure, not a blind repeat',
      'Define a clear fallback/exit path once the maximum is reached',
    ],
    followUps: ['What retry limit did you actually choose for the FNB pipeline, and how did you pick it?', 'What would you log when the maximum retries is hit, to help debug it later?'],
    tags: ['agent-loop', 'reliability'],
  },
  {
    id: 'agent-016',
    category: 'AI Agents',
    difficulty: 'Intermediate',
    question: 'How do you evaluate an AI agent?',
    answer:
      "I'd evaluate both the end-to-end outcome and the intermediate decisions the agent makes along the way — for the FNB pipeline, that means checking whether the final SQL and result are correct, but also whether the Verifier Agent correctly caught cases it should have caught, and how many retries typical requests need. I'd build a fixed test set of realistic scenarios, including deliberately tricky or adversarial ones, and track these metrics consistently over time as the system changes, rather than relying on one-off manual checks.",
    keyPoints: [
      'Evaluates both final outcome and intermediate agent decisions',
      'Uses a fixed, realistic (and adversarial) test set for consistency',
      'Tracks metrics over time, not just one-off manual spot checks',
    ],
    followUps: ['What would an adversarial test case for the Verifier Agent look like?', 'How would you know if the Requirement Agent specifically was the weak link versus the Code Agent?'],
    tags: ['agent-evaluation', 'fnb'],
  },
  {
    id: 'agent-017',
    category: 'AI Agents',
    difficulty: 'Intermediate',
    question: 'How do you make agents reliable?',
    answer:
      "Reliability comes from a combination of good prompting with explicit context, independent verification of anything risky before it's acted on, bounded retries with informed feedback rather than infinite or blind loops, and solid logging so failures can actually be understood and fixed rather than being mysterious. It also comes from testing against a realistic and adversarial set of scenarios before trusting the system, and continuing to monitor its behaviour once it's live, since reliability isn't a one-time achievement — it needs to be maintained as usage patterns and inputs evolve.",
    keyPoints: [
      'Good prompting with explicit context, plus independent verification',
      'Bounded, informed retries and solid logging/observability',
      'Ongoing testing and monitoring, not a one-time achievement',
    ],
    followUps: ['Which of these mattered most in practice on the FNB project?', 'How would you prioritise these if you only had time to implement one or two?'],
    tags: ['reliability', 'agents'],
  },
]
