import type { Question } from '../types/questions'

// 10 System Design questions.

export const systemDesignQuestions: Question[] = [
  {
    id: 'sd-001',
    category: 'System Design',
    difficulty: 'Intermediate',
    question: 'How would you design a scalable AI application?',
    answer:
      "I'd design the application layer to be stateless so it can scale horizontally behind a load balancer, use a queue to smooth out bursts of demand rather than processing everything synchronously, and separate expensive LLM calls from cheaper deterministic logic so I can scale and monitor them independently. I'd also add caching for repeated or static context, like schema information in the FNB pipeline, and build in observability from the start so I can actually see where bottlenecks appear as load grows.",
    keyPoints: [
      'Stateless application layer for horizontal scaling behind a load balancer',
      'Queue-based processing to smooth demand bursts',
      'Separate and independently scale expensive LLM calls from cheaper deterministic logic; cache static context',
    ],
    followUps: ['What would be the first component to become a bottleneck as load increases?', 'How would you decide when to introduce a queue versus handling requests synchronously?'],
    tags: ['system-design', 'scalability'],
  },
  {
    id: 'sd-002',
    category: 'System Design',
    difficulty: 'Intermediate',
    question: 'How would you design a chatbot for a bank?',
    answer:
      "I'd start by scoping what the chatbot should and shouldn't handle — routine queries like balance checks or FAQs are good candidates, while anything sensitive or high-stakes should route to a human. Architecturally, I'd use RAG to ground responses in the bank's actual, current policy and product documents rather than relying on the model's general training knowledge, add clear escalation paths to a human agent, and log conversations for quality review, all while being careful about what customer data the chatbot has access to.",
    keyPoints: [
      'Clear scope: routine queries automated, sensitive/high-stakes issues routed to humans',
      'RAG grounds responses in the bank\'s actual current documents, not general knowledge',
      'Clear escalation paths to humans, careful data access scoping, and conversation logging for review',
    ],
    followUps: ['What would you do if the chatbot could not confidently answer a question?', 'How would you evaluate the chatbot\'s answer quality before launch?'],
    tags: ['system-design', 'chatbot'],
  },
  {
    id: 'sd-003',
    category: 'System Design',
    difficulty: 'Intermediate',
    question: 'How would you design a fraud detection system?',
    answer:
      "I'd design it as a pipeline: real-time feature computation from incoming transactions, a model scoring each transaction for fraud risk, a decision layer applying a threshold with different actions (allow, flag for review, block) depending on risk level, and a feedback loop where confirmed outcomes feed back into retraining. I'd keep the scoring model separate from the decision logic, so business rules around thresholds can be adjusted without retraining the model itself, and add monitoring to catch model drift over time.",
    keyPoints: [
      'Pipeline: real-time features -> model scoring -> risk-based decision layer -> feedback loop',
      'Separates scoring model from decision/threshold logic for flexibility',
      'Monitors for model drift over time, not just a one-time deployment',
    ],
    followUps: ['How would you handle the real-time latency requirement for feature computation?', 'How would you validate the system before it goes live with real transactions?'],
    tags: ['system-design', 'fraud-detection'],
  },
  {
    id: 'sd-004',
    category: 'System Design',
    difficulty: 'Intermediate',
    question: 'How would you design a RAG system?',
    answer:
      "I'd start with a document ingestion pipeline that chunks source documents into reasonably sized pieces, generates embeddings for each chunk, and stores them in a vector database. At query time, I'd embed the user's question, retrieve the most relevant chunks by similarity, and pass those chunks along with the question into the LLM's prompt to generate a grounded answer. I'd also track which chunks were actually used, so answers can cite their sources, and periodically refresh the ingestion pipeline as source documents change.",
    keyPoints: [
      'Ingestion: chunk documents, generate embeddings, store in a vector database',
      'Query time: embed the question, retrieve relevant chunks, include them in the LLM prompt',
      'Track source chunks for citations; refresh ingestion as documents change',
    ],
    followUps: ['How would you decide on chunk size for the documents?', 'What would you do if retrieval returned irrelevant chunks for a query?'],
    tags: ['system-design', 'rag'],
  },
  {
    id: 'sd-005',
    category: 'System Design',
    difficulty: 'Intermediate',
    question: 'How would you design an AI agent system?',
    answer:
      "I'd design it the way we approached the FNB pipeline: break the overall task into specialised agents with clear, single responsibilities, define a shared state format upfront so agents can communicate reliably, use an orchestration framework like LangGraph to manage the flow and any conditional routing or loops, and add an independent verification step before any consequential action is taken. I'd also build in bounded retries and clear logging so failures are debuggable rather than mysterious.",
    keyPoints: [
      'Break the task into specialised agents with single, clear responsibilities',
      'Define a shared state format upfront; use an orchestration framework for flow/routing',
      'Independent verification before consequential actions; bounded retries and clear logging',
    ],
    followUps: ['How would you decide the right number of agents for a new problem?', 'What would you do differently for a system with much higher stakes than FNB\'s simulation?'],
    tags: ['system-design', 'agents'],
  },
  {
    id: 'sd-006',
    category: 'System Design',
    difficulty: 'Intermediate',
    question: 'How would you handle millions of users?',
    answer:
      "I'd make sure every layer of the system can scale horizontally — stateless services behind load balancers, a database that supports read replicas or sharding for very high read volume, and caching for frequently accessed, slow-changing data. For AI-specific components, I'd consider batching or queuing LLM requests, and using a smaller/cheaper model for routine requests to keep costs and latency manageable at that scale. Load testing well before reaching that scale would be essential to find bottlenecks early rather than discovering them in production.",
    keyPoints: [
      'Horizontal scaling at every layer: stateless services, database read replicas/sharding, caching',
      'Batching/queuing LLM requests and model-tiering for cost/latency at scale',
      'Proactive load testing to find bottlenecks before they hit production',
    ],
    followUps: ['Which part of your current projects would struggle first at millions of users?', 'How would you decide between sharding and read replicas for the database layer?'],
    tags: ['system-design', 'scalability'],
  },
  {
    id: 'sd-007',
    category: 'System Design',
    difficulty: 'Intermediate',
    question: 'How would you handle high traffic?',
    answer:
      "I'd use a load balancer to distribute requests across multiple instances of the service, add a queue to absorb sudden spikes so the system degrades gracefully rather than falling over, and use caching aggressively for anything that doesn't need to be recomputed on every request. I'd also make sure the system can auto-scale based on real traffic metrics, and set up alerting so the team knows about a traffic spike before customers start noticing problems.",
    keyPoints: [
      'Load balancing across multiple service instances',
      'Queuing to absorb spikes gracefully rather than failing under load',
      'Caching, auto-scaling based on real metrics, and proactive alerting',
    ],
    followUps: ['What would "graceful degradation" actually look like for the FNB pipeline under high traffic?', 'How would you decide what to cache versus always recompute?'],
    tags: ['system-design', 'performance'],
  },
  {
    id: 'sd-008',
    category: 'System Design',
    difficulty: 'Intermediate',
    question: 'How would you reduce latency?',
    answer:
      "I'd look for the biggest contributors first — often LLM calls in an AI pipeline — and reduce them by using smaller models where sufficient, trimming prompt size, and running independent steps in parallel rather than sequentially where possible. Caching repeated computations and using a CDN or edge caching for static content also helps broadly. I'd measure end-to-end latency with proper monitoring so I'm optimising the actual bottleneck, not guessing.",
    keyPoints: [
      'Identify and target the biggest contributors first (often LLM calls)',
      'Smaller models where sufficient, trimmed prompts, and parallelising independent steps',
      'Caching and monitoring to ensure you optimise the real bottleneck, not a guess',
    ],
    followUps: ['Which specific step in the FNB pipeline would you profile first for latency?', 'What is the difference between latency and throughput, and why does that distinction matter?'],
    tags: ['system-design', 'performance'],
  },
  {
    id: 'sd-009',
    category: 'System Design',
    difficulty: 'Intermediate',
    question: 'How would you monitor an AI application?',
    answer:
      "I'd track standard system health metrics like latency, error rates and resource usage, alongside AI-specific signals like hallucination or verification-failure rates, retry counts, and any drift in output patterns over time. I'd set up alerting on anomalies in these AI-specific metrics specifically, since a rising failure rate can indicate a real problem — like a schema change or a shift in the kinds of requests coming in — well before it becomes visible through generic system metrics alone.",
    keyPoints: [
      'Standard system metrics: latency, error rates, resource usage',
      'AI-specific metrics: hallucination/verification-failure rates, retry counts, output drift',
      'Alerting on AI-specific anomalies, which generic system metrics alone would miss',
    ],
    followUps: ['What would a rising verification-failure rate most likely indicate in the FNB pipeline?', 'How would you set a sensible alert threshold without too many false alarms?'],
    tags: ['system-design', 'monitoring'],
  },
  {
    id: 'sd-010',
    category: 'System Design',
    difficulty: 'Intermediate',
    question: 'How would you handle system failures?',
    answer:
      "I'd design for graceful degradation rather than a hard crash — clear, specific error messages, retries with backoff for transient issues, and fallback behaviour where possible, like failing over to a secondary provider for an LLM outage. I'd make sure failures are logged with enough detail to actually diagnose them afterward, and set up alerting so the team knows about a failure quickly rather than finding out from a frustrated user. Regularly testing failure scenarios deliberately, rather than only reacting when they happen for real, also builds real confidence in how the system behaves under stress.",
    keyPoints: [
      'Graceful degradation: clear errors, retries with backoff, fallback behaviour where possible',
      'Detailed logging for diagnosis and prompt alerting for the team',
      'Deliberately testing failure scenarios ahead of time, not just reacting when they occur',
    ],
    followUps: ['What failure scenario would you prioritise testing first for the FNB pipeline?', 'How would you decide when a fallback is worth the added complexity versus just failing clearly?'],
    tags: ['system-design', 'reliability'],
  },
]
