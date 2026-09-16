import type { Question } from '../types/questions'

// 26 LLM / Generative AI questions, tied where relevant to the FNB
// Requirement/Code/Verifier agent pipeline the user actually built.

export const llmQuestions: Question[] = [
  {
    id: 'llm-001',
    category: 'LLMs & Generative AI',
    difficulty: 'Beginner',
    question: 'What is an LLM?',
    answer:
      "An LLM, or Large Language Model, is a deep learning model trained on huge amounts of text to predict and generate language — given some input text, it predicts what comes next, one piece at a time. That simple mechanism, scaled up with billions of parameters and massive training data, turns out to be powerful enough to do things like answer questions, write code, and hold conversations. In the FNB project, the LLM powering our agents is what lets the Requirement Agent interpret a plain-English banking request.",
    keyPoints: [
      'Deep learning model trained on huge text data to predict/generate language',
      'Core mechanism: predicting the next piece of text given context',
      'Scale (parameters, data) is what makes it capable of complex tasks',
    ],
    followUps: ['What does "large" actually refer to in LLM?', 'How is an LLM different from older NLP models?'],
    tags: ['llm', 'fundamentals'],
  },
  {
    id: 'llm-002',
    category: 'LLMs & Generative AI',
    difficulty: 'Intermediate',
    question: 'How does an LLM generate text?',
    answer:
      "It generates text one token at a time, predicting a probability distribution over possible next tokens given everything generated so far, then selecting one (often the most likely, or sampled based on temperature), and repeating that process, feeding its own output back in as new context. It keeps doing this until it produces a stop condition or hits a length limit, which is why longer generations can sometimes drift, since small early choices shape everything that follows.",
    keyPoints: [
      'Predicts one token at a time based on prior context',
      'Selects the next token via greedy choice or sampling',
      'Feeds its own output back in as context for the next prediction (autoregressive)',
    ],
    followUps: ['What does "autoregressive" mean in this context?', 'How does temperature affect this token-selection process?'],
    tags: ['llm', 'text-generation'],
  },
  {
    id: 'llm-003',
    category: 'LLMs & Generative AI',
    difficulty: 'Beginner',
    question: 'What are tokens?',
    answer:
      "Tokens are the small chunks of text an LLM actually processes — often pieces of words, whole common words, or punctuation, rather than full words or single characters. For example, 'banking' might be one token, but a rarer word might get split into two or three. Tokens matter practically because pricing, context window limits, and speed are all measured in tokens, not words or characters.",
    keyPoints: [
      'Small text units the model processes — often subword pieces',
      'Not always full words or single characters',
      'Pricing, context limits and latency are measured in tokens',
    ],
    followUps: ['Why do models use subword tokens instead of whole words?', 'Roughly how many tokens is a typical English word?'],
    tags: ['tokens', 'llm'],
  },
  {
    id: 'llm-004',
    category: 'LLMs & Generative AI',
    difficulty: 'Intermediate',
    question: 'What are embeddings?',
    answer:
      "Embeddings are numeric vector representations of text (or other data) that capture semantic meaning — texts with similar meaning end up with vectors that are close together in that vector space, even if they don't share the same words. They're the foundation of semantic search and RAG systems, since comparing vectors lets you find relevant content by meaning rather than exact keyword matching.",
    keyPoints: [
      'Numeric vectors that capture semantic meaning of text',
      'Similar meaning -> vectors close together in vector space',
      'Foundation for semantic search and RAG',
    ],
    followUps: ['How would you measure how "close" two embeddings are?', 'How are embeddings generated in the first place?'],
    tags: ['embeddings', 'llm'],
  },
  {
    id: 'llm-005',
    category: 'LLMs & Generative AI',
    difficulty: 'Intermediate',
    question: 'What is semantic search?',
    answer:
      "Semantic search finds results based on meaning rather than exact keyword matches — searching for 'lost my card' could still surface a document about 'reporting a stolen card' because the meanings are close, even without shared words. It typically works by converting both the query and the documents into embeddings, then finding the documents whose embeddings are closest to the query's embedding.",
    keyPoints: [
      'Finds results by meaning, not just exact keyword overlap',
      'Example: "lost my card" matching "reporting a stolen card"',
      'Implemented by comparing query and document embeddings',
    ],
    followUps: ['How is semantic search different from traditional keyword search like SQL LIKE queries?', 'What could go wrong with pure semantic search?'],
    tags: ['semantic-search', 'embeddings'],
  },
  {
    id: 'llm-006',
    category: 'LLMs & Generative AI',
    difficulty: 'Intermediate',
    question: 'What is vector search?',
    answer:
      "Vector search is the technical mechanism behind semantic search — given a query vector (embedding), it finds the nearest vectors in a large collection, usually using a distance metric like cosine similarity, often accelerated with a specialised vector database or index (like an ANN index) so it stays fast even with millions of vectors. It's the retrieval step in most RAG pipelines.",
    keyPoints: [
      'Finds nearest vectors to a query vector using a distance metric like cosine similarity',
      'Vector databases/ANN indexes make this efficient at large scale',
      'It is the retrieval mechanism underlying RAG',
    ],
    followUps: ['What is cosine similarity measuring exactly?', 'Name a vector database you have heard of or would consider using.'],
    tags: ['vector-search', 'rag'],
  },
  {
    id: 'llm-007',
    category: 'LLMs & Generative AI',
    difficulty: 'Intermediate',
    question: 'What is RAG?',
    answer:
      "RAG, or Retrieval-Augmented Generation, is a pattern where you retrieve relevant information from an external source — like a document store or database — and feed it into the LLM's prompt as context before it generates an answer, rather than relying purely on what the model memorised during training. It's how you get an LLM to answer accurately about information it wasn't trained on, or that's changed since training, like current account balances or recent policy documents.",
    keyPoints: [
      'Retrieves relevant external information and feeds it into the prompt as context',
      'Reduces reliance on the model\'s frozen training-time knowledge',
      'Useful for current, private, or domain-specific information',
    ],
    followUps: ['How would RAG apply to the FNB banking system if you were to add it?', 'What is the typical retrieval step built on (hint: think embeddings)?'],
    tags: ['rag', 'llm'],
  },
  {
    id: 'llm-008',
    category: 'LLMs & Generative AI',
    difficulty: 'Intermediate',
    question: 'Why use RAG?',
    answer:
      "RAG lets you ground an LLM's answers in real, current, verifiable information instead of relying on what it memorised during training, which reduces hallucination and lets the system reflect information that's private, proprietary, or simply too recent to have been in training data. For a bank, that might mean grounding answers in internal policy documents or product terms, rather than having the model guess based on general knowledge.",
    keyPoints: [
      'Grounds answers in real, current, verifiable data',
      'Reduces hallucination compared to relying purely on memorised training knowledge',
      'Enables use of private/proprietary or very recent information',
    ],
    followUps: ['What is the alternative to RAG if you want the model to "know" new information?', 'What are the limitations of RAG?'],
    tags: ['rag', 'llm'],
  },
  {
    id: 'llm-009',
    category: 'LLMs & Generative AI',
    difficulty: 'Beginner',
    question: 'What is hallucination?',
    answer:
      "Hallucination is when an LLM generates output that sounds confident and plausible but is actually incorrect or made up — like a SQL query referencing a column that doesn't exist in the schema, which is exactly the failure mode we had to design around in the FNB project's Code Agent. The dangerous part isn't that it's wrong, it's that it often looks just as convincing as a correct answer, which is why verification matters so much.",
    keyPoints: [
      'Confident, plausible-sounding but factually incorrect or fabricated output',
      'Directly ties to the FNB SQL-hallucination problem the user already knows well',
      'Dangerous because it looks as convincing as correct output',
    ],
    followUps: ['Why is hallucination especially risky in a banking context?', 'What is the difference between hallucination and a model simply being outdated?'],
    tags: ['hallucination', 'llm'],
  },
  {
    id: 'llm-010',
    category: 'LLMs & Generative AI',
    difficulty: 'Intermediate',
    question: 'Why do LLMs hallucinate?',
    answer:
      "LLMs are fundamentally predicting the most statistically likely next token based on patterns learned during training, not looking anything up or reasoning about ground truth — so when they lack real information about something, they can still generate something that fits the pattern of a plausible answer, without any built-in mechanism to know it's wrong. It's made worse when the training data is sparse or ambiguous on a topic, or when a prompt nudges the model toward answering confidently even without solid grounding.",
    keyPoints: [
      'Models predict statistically likely text, not verified facts',
      'No built-in mechanism to "know" it doesn\'t know something',
      'Sparse/ambiguous training data and prompts demanding confident answers make it worse',
    ],
    followUps: ['How does this relate to why RAG helps reduce hallucination?', 'Can hallucination ever be fully eliminated? Why or why not?'],
    tags: ['hallucination', 'llm'],
  },
  {
    id: 'llm-011',
    category: 'LLMs & Generative AI',
    difficulty: 'Intermediate',
    question: 'How can hallucinations be reduced?',
    answer:
      "A combination of techniques works best: grounding responses with RAG so the model has real context to draw from; giving the model explicit, accurate context (like real schema information, as we do for the Code Agent) rather than expecting it to recall details; adding an independent verification step, like our Verifier Agent, that checks output against ground truth before it's trusted or acted on; and prompting the model to say when it's unsure rather than always answering confidently.",
    keyPoints: [
      'RAG for grounding responses in real information',
      'Providing explicit, accurate context directly in the prompt',
      'Independent verification of output, plus prompting for honest uncertainty',
    ],
    followUps: ['Which of these did you actually apply on the FNB project?', 'How would you measure whether these techniques are working?'],
    tags: ['hallucination', 'llm'],
  },
  {
    id: 'llm-012',
    category: 'LLMs & Generative AI',
    difficulty: 'Beginner',
    question: 'What is prompt engineering?',
    answer:
      "Prompt engineering is the practice of carefully designing the instructions and context you give an LLM to get more reliable, accurate output, without changing the model itself. It includes things like being explicit about the desired output format, giving relevant examples, and providing necessary context like schema details. On the FNB project, this was one of our main levers for reducing SQL hallucination — a clearer, more specific prompt to the Code Agent measurably changed its output quality.",
    keyPoints: [
      'Designing instructions/context to get better output without changing the model',
      'Includes format instructions, examples, and relevant context',
      'Was a real, practical lever used on the FNB project to reduce hallucination',
    ],
    followUps: ['What is one specific prompt change you made on the FNB project and why?', 'What is the difference between prompt engineering and fine-tuning?'],
    tags: ['prompt-engineering', 'llm'],
  },
  {
    id: 'llm-013',
    category: 'LLMs & Generative AI',
    difficulty: 'Intermediate',
    question: 'What makes a good prompt?',
    answer:
      "A good prompt is specific and unambiguous about what's expected — the desired output format, any constraints, and relevant context the model needs but doesn't already have, like our database schema. It often helps to give an example of the expected output, and to break a complex task into clear steps rather than one vague instruction. It should also anticipate edge cases; for the Code Agent, that meant explicitly telling it to only generate SELECT statements, not assuming it would infer that on its own.",
    keyPoints: [
      'Specific, unambiguous about desired output and constraints',
      'Includes necessary context and, ideally, examples',
      'Explicitly addresses edge cases rather than assuming the model will infer them',
    ],
    followUps: ['Can you give an example of a vague prompt versus an improved version?', 'How do you iterate on a prompt systematically rather than by guesswork?'],
    tags: ['prompt-engineering', 'llm'],
  },
  {
    id: 'llm-014',
    category: 'LLMs & Generative AI',
    difficulty: 'Intermediate',
    question: 'What is structured output?',
    answer:
      "Structured output is when you constrain an LLM to respond in a specific, predictable format, like JSON matching a defined schema, rather than free-form prose. This matters a lot when another piece of code needs to parse and act on the model's response — in the FNB pipeline, the Requirement Agent's output needs to be structured so the Code Agent can reliably read the entities and filters from it, rather than trying to parse loose natural language.",
    keyPoints: [
      'Constrains model output to a predictable format like JSON',
      'Critical when downstream code needs to parse and act on the output reliably',
      'Directly relevant to how the Requirement Agent passes its output to the Code Agent',
    ],
    followUps: ['How do you actually enforce structured output from an LLM in practice?', 'What happens if the model still produces malformed structured output occasionally?'],
    tags: ['structured-output', 'llm'],
  },
  {
    id: 'llm-015',
    category: 'LLMs & Generative AI',
    difficulty: 'Beginner',
    question: 'What is temperature?',
    answer:
      "Temperature is a setting that controls how random or deterministic an LLM's output is. A low temperature (close to 0) makes the model favour the most likely next token, giving more consistent, predictable output — useful for something like SQL generation where you want reliability. A higher temperature introduces more randomness, encouraging more varied or creative output, which is better suited to brainstorming or creative writing tasks than a banking pipeline.",
    keyPoints: [
      'Controls randomness in next-token selection',
      'Low temperature: consistent, predictable output — good for SQL generation',
      'High temperature: more varied/creative output — good for brainstorming',
    ],
    followUps: ['What temperature would you use for the Code Agent, and why?', 'What happens at temperature exactly 0?'],
    tags: ['temperature', 'llm'],
  },
  {
    id: 'llm-016',
    category: 'LLMs & Generative AI',
    difficulty: 'Intermediate',
    question: 'What is context window?',
    answer:
      "The context window is the maximum amount of text, measured in tokens, that an LLM can consider at once — including the prompt, any provided context, and the conversation history. If your input plus expected output exceeds that limit, older or excess content gets cut off, which matters a lot when you're feeding in something like a database schema alongside a user's request, since large schemas can eat into that budget quickly.",
    keyPoints: [
      'Maximum tokens the model can consider at once (input + output)',
      'Exceeding it means content gets truncated or cut off',
      'Relevant when combining schema context with a user request in the same prompt',
    ],
    followUps: ['How would you handle a schema too large to fit comfortably in the context window?', 'What are the trade-offs of using a model with a much larger context window?'],
    tags: ['context-window', 'llm'],
  },
  {
    id: 'llm-017',
    category: 'LLMs & Generative AI',
    difficulty: 'Intermediate',
    question: 'What is fine-tuning?',
    answer:
      "Fine-tuning is the process of further training a pre-trained LLM on your own, more specific dataset so it adapts its behaviour or style to your particular use case, rather than relying purely on prompting. For example, you might fine-tune a model on examples of correct SQL generation for your specific schema style, so it produces more consistent output with shorter prompts. It's more expensive and slower to iterate on than prompting, so it's usually a later-stage optimisation, not a first step.",
    keyPoints: [
      'Further trains a pre-trained model on your own specific dataset',
      'Adapts behaviour/style beyond what prompting alone can achieve',
      'More costly and slower to iterate than prompt engineering, usually a later optimisation',
    ],
    followUps: ['When would you reach for fine-tuning instead of just improving the prompt?', 'What data would you need to fine-tune a model for SQL generation?'],
    tags: ['fine-tuning', 'llm'],
  },
  {
    id: 'llm-018',
    category: 'LLMs & Generative AI',
    difficulty: 'Intermediate',
    question: 'Fine-tuning vs RAG?',
    answer:
      "RAG changes what information the model has access to at query time, by retrieving and injecting relevant context, without changing the model's weights — it's great for keeping answers current and grounded in specific documents. Fine-tuning changes the model itself, adjusting its weights to change its behaviour, tone, or style consistently — better suited for teaching a model a specific format or skill rather than specific facts. In practice they can be combined: fine-tune for consistent behaviour, RAG for current, factual grounding.",
    keyPoints: [
      'RAG: changes available information at query time, no weight changes',
      'Fine-tuning: changes the model\'s weights/behaviour directly',
      'RAG suits current/factual grounding; fine-tuning suits consistent style/skill; can combine both',
    ],
    followUps: ['Which would you reach for first on a tight budget and timeline?', 'Could you use both together on the FNB project? How?'],
    tags: ['rag', 'fine-tuning', 'llm'],
  },
  {
    id: 'llm-019',
    category: 'LLMs & Generative AI',
    difficulty: 'Beginner',
    question: 'What is zero-shot prompting?',
    answer:
      "Zero-shot prompting is asking an LLM to perform a task with no examples given — just a clear instruction and the task itself, relying entirely on what the model already learned during training. It's the simplest approach and often works well for straightforward tasks, but for something more specific or nuanced, like generating SQL in a particular style, it can be less reliable than giving the model an example first.",
    keyPoints: [
      'Asks the model to perform a task with no examples provided',
      'Relies entirely on the model\'s pre-trained general knowledge',
      'Simple but can be less reliable for specific/nuanced tasks',
    ],
    followUps: ['When would zero-shot prompting be enough versus needing few-shot?', 'Could you give an example of a zero-shot prompt for the Requirement Agent?'],
    tags: ['zero-shot', 'prompt-engineering'],
  },
  {
    id: 'llm-020',
    category: 'LLMs & Generative AI',
    difficulty: 'Beginner',
    question: 'What is few-shot prompting?',
    answer:
      "Few-shot prompting means including a small number of example input-output pairs directly in the prompt to show the model exactly the pattern or format you want, before giving it the real task. For the Code Agent, that might mean showing two or three examples of a natural-language spec paired with correctly generated SQL, which tends to make output far more consistent than just describing the format in words.",
    keyPoints: [
      'Includes a few example input-output pairs directly in the prompt',
      'Demonstrates the desired pattern/format rather than just describing it',
      'Tends to improve consistency over zero-shot for specific formats',
    ],
    followUps: ['How many examples is usually enough before returns diminish?', 'What is the risk of choosing bad or unrepresentative examples?'],
    tags: ['few-shot', 'prompt-engineering'],
  },
  {
    id: 'llm-021',
    category: 'LLMs & Generative AI',
    difficulty: 'Intermediate',
    question: 'What is function/tool calling?',
    answer:
      "Function or tool calling is a capability where an LLM can decide to invoke an external function or API — like a database query, a calculator, or a search tool — rather than trying to answer everything purely from its own generated text. The model outputs a structured request specifying which tool to call and with what arguments, your code executes that tool, and the result gets fed back to the model. This is central to how AI agents actually do things in the real world, like our Code Agent effectively 'calling' the database via the verification and execution steps.",
    keyPoints: [
      'Lets an LLM request an external function/API call rather than only generating text',
      'Model outputs a structured call (which tool, what arguments); your code executes it',
      'Central to how agents interact with real systems, not just generate text',
    ],
    followUps: ['How would you design a tool interface so the model uses it reliably?', 'What happens if the model calls a tool with invalid arguments?'],
    tags: ['tool-calling', 'agents'],
  },
  {
    id: 'llm-022',
    category: 'LLMs & Generative AI',
    difficulty: 'Beginner',
    question: 'What is an AI copilot?',
    answer:
      "An AI copilot is an assistant that works alongside a human, helping them complete a task faster or more effectively rather than fully automating it end to end — like a coding assistant that suggests code as a developer types, or an assistant that drafts a response for a human to review and send. The key idea is the human stays in control and makes the final call, with the AI handling the more repetitive or time-consuming parts.",
    keyPoints: [
      'Assists a human rather than fully replacing their judgement',
      'Human stays in control and makes final decisions',
      'AI handles repetitive/time-consuming parts to speed up the human',
    ],
    followUps: ['How would a copilot model apply to reviewing the FNB pipeline\'s generated SQL?', 'What is the difference between a copilot and a fully autonomous agent?'],
    tags: ['copilot', 'human-in-the-loop'],
  },
  {
    id: 'llm-023',
    category: 'LLMs & Generative AI',
    difficulty: 'Intermediate',
    question: 'What are limitations of LLMs?',
    answer:
      "LLMs can hallucinate confidently incorrect information, their knowledge is frozen at training time unless augmented with RAG, they can be sensitive to how a prompt is phrased, and they don't have built-in real reasoning or fact-checking — they're doing sophisticated pattern completion, not genuine understanding. They're also expensive and can be slow at scale, and they can be manipulated through prompt injection if untrusted input is fed into them without care.",
    keyPoints: [
      'Hallucination, frozen training-time knowledge, prompt sensitivity',
      'Sophisticated pattern completion, not genuine reasoning or fact-checking',
      'Cost, latency at scale, and vulnerability to prompt injection',
    ],
    followUps: ['Which of these limitations did you have to actively design around in the FNB project?', 'How would you explain "pattern completion, not understanding" to a non-technical person?'],
    tags: ['llm', 'limitations'],
  },
  {
    id: 'llm-024',
    category: 'LLMs & Generative AI',
    difficulty: 'Intermediate',
    question: 'How would you evaluate an LLM application?',
    answer:
      "I'd build a fixed evaluation set of realistic inputs with known-correct or acceptable outputs, and measure the application against it consistently as I make changes, rather than relying on impressions from a handful of manual tests. For the FNB pipeline specifically, that means a set of natural-language requests with known-correct SQL, checking not just whether the final answer is right but whether verification correctly caught the cases it should have. I'd also track things like hallucination rate and retry counts over time as ongoing quality signals, not just a one-time check before launch.",
    keyPoints: [
      'Builds a fixed evaluation set with known-correct/acceptable outputs',
      'Evaluates both final correctness and intermediate behaviour (e.g. verification catching errors)',
      'Tracks ongoing quality metrics over time, not just a pre-launch check',
    ],
    followUps: ['What would you include in that evaluation set for the FNB pipeline specifically?', 'How would you evaluate output quality when there isn\'t a single "correct" answer?'],
    tags: ['llm-evaluation', 'fnb'],
  },
  {
    id: 'llm-025',
    category: 'LLMs & Generative AI',
    difficulty: 'Intermediate',
    question: 'How would you reduce LLM latency?',
    answer:
      "I'd look at using a smaller, faster model for simpler sub-tasks, reserving a larger model only for the parts that genuinely need more reasoning power. I'd also reduce prompt size where possible, since fewer tokens mean faster processing, and consider streaming output back to the user so it feels responsive even if the full generation takes a moment. Caching repeated or similar requests, and running independent steps in parallel rather than strictly sequentially where the pipeline design allows it, would also help.",
    keyPoints: [
      'Model-tiering: smaller/faster model for simpler steps',
      'Reduce prompt size; stream output for perceived responsiveness',
      'Caching and parallelising independent steps where possible',
    ],
    followUps: ['Which steps in the FNB pipeline could realistically run in parallel?', 'What is the trade-off of using a smaller model for some steps?'],
    tags: ['latency', 'llm', 'performance'],
  },
  {
    id: 'llm-026',
    category: 'LLMs & Generative AI',
    difficulty: 'Intermediate',
    question: 'How would you reduce LLM costs?',
    answer:
      "The main levers are using the smallest model that still meets quality requirements for each specific step, minimising prompt length by trimming unnecessary context, caching repeated calls like static schema information instead of resending it every time, and avoiding unnecessary retries by improving the initial prompt quality so fewer refinement loops are needed in the first place. I'd measure cost per request so I could see the actual impact of each of these changes rather than guessing.",
    keyPoints: [
      'Use the smallest sufficient model per step; trim unnecessary prompt content',
      'Cache repeated/static context instead of resending it',
      'Reduce retries by improving initial prompt quality; measure cost per request',
    ],
    followUps: ['How would you measure cost per request across a multi-agent pipeline?', 'What is the risk of being too aggressive about cost-cutting on an LLM pipeline?'],
    tags: ['cost-optimisation', 'llm'],
  },
]
