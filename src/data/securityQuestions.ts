import type { Question } from '../types/questions'

// 13 Security questions.

export const securityQuestions: Question[] = [
  {
    id: 'sec-001',
    category: 'Security',
    difficulty: 'Intermediate',
    question: 'How would you secure an AI system?',
    answer:
      "I'd apply the same layered thinking we used on the FNB project: least-privilege access so the system only touches the data it needs, independent verification of anything the AI generates before it's acted on, strong authentication for anything that can trigger the system, encrypted and carefully controlled credentials, and thorough logging so incidents can actually be investigated. No single control is enough on its own, which is why treating it as layered defence matters.",
    keyPoints: [
      'Least-privilege access and independent verification of AI-generated actions',
      'Strong authentication and carefully controlled, encrypted credentials',
      'Thorough logging to support incident investigation',
    ],
    followUps: ['Which of these layers was most important on the FNB project specifically?', 'What would you add if the system also needed write access?'],
    tags: ['security', 'ai'],
  },
  {
    id: 'sec-002',
    category: 'Security',
    difficulty: 'Beginner',
    question: 'What is authentication?',
    answer:
      "Authentication is the process of verifying that someone or something is actually who they claim to be — like a username and password, a token, or multi-factor verification. It answers the question 'who are you', as distinct from authorization, which answers 'what are you allowed to do' once you're verified.",
    keyPoints: [
      'Verifies identity — confirming who someone or something is',
      'Examples: passwords, tokens, multi-factor verification',
      'Distinct from authorization, which governs permissions once identity is confirmed',
    ],
    followUps: ['What is multi-factor authentication and why does it help?', 'How would authentication apply to a service calling the FNB pipeline\'s API?'],
    tags: ['authentication', 'security'],
  },
  {
    id: 'sec-003',
    category: 'Security',
    difficulty: 'Beginner',
    question: 'What is authorization?',
    answer:
      "Authorization determines what an already-authenticated user or system is actually allowed to do — which resources they can access and what actions they can perform. In the FNB project, this is exactly what the read-only database role enforces: even a properly authenticated connection is only authorized to run SELECT statements, nothing more.",
    keyPoints: [
      'Determines what an authenticated identity is allowed to do',
      'Governs access to resources and permitted actions',
      'FNB example: the read-only role authorizes only SELECT statements',
    ],
    followUps: ['How is role-based access control (RBAC) an example of authorization in practice?', 'What would happen if authentication succeeded but authorization was misconfigured?'],
    tags: ['authorization', 'security'],
  },
  {
    id: 'sec-004',
    category: 'Security',
    difficulty: 'Beginner',
    question: 'Authentication vs authorization.',
    answer:
      "Authentication answers 'who are you' — verifying identity. Authorization answers 'what are you allowed to do' — governing permissions once identity is confirmed. You always need authentication first; you can't meaningfully authorize someone until you know who they are. A simple way to remember it: authentication is showing your ID at the door, authorization is which rooms your ID actually lets you into.",
    keyPoints: [
      'Authentication: verifying identity ("who are you")',
      'Authorization: governing permissions ("what can you do")',
      'Authentication always comes first, logically',
    ],
    followUps: ['Can you have authorization without authentication? Why or why not?', 'How would you implement both for the FNB pipeline\'s API?'],
    tags: ['authentication', 'authorization'],
  },
  {
    id: 'sec-005',
    category: 'Security',
    difficulty: 'Intermediate',
    question: 'What is least privilege?',
    answer:
      "Least privilege is the principle that any user, system, or process should only have the minimum access necessary to do its job, nothing more. It's the reasoning behind why the FNB pipeline's database connection uses a role scoped only to read access on the specific tables it needs, rather than broad access to the whole database — so even if something goes wrong, the damage it could cause is limited.",
    keyPoints: [
      'Grant only the minimum access necessary to do the job',
      'FNB example: database role scoped to read-only access on needed tables',
      'Limits the potential damage from a bug or compromise',
    ],
    followUps: ['How would you audit whether a system still follows least privilege over time?', 'What is "privilege creep" and how does it happen?'],
    tags: ['least-privilege', 'security'],
  },
  {
    id: 'sec-006',
    category: 'Security',
    difficulty: 'Beginner',
    question: 'What is encryption?',
    answer:
      "Encryption transforms data into a form that's unreadable without the correct key, protecting it from being understood if intercepted or accessed without authorization. Data can be encrypted at rest (stored on disk) and in transit (moving over a network) — both matter for banking data, since customer information needs protection whether it's sitting in a database or being sent between services.",
    keyPoints: [
      'Transforms data into an unreadable form without the correct key',
      'Applies both at rest (stored) and in transit (moving over a network)',
      'Both matter for protecting sensitive banking data',
    ],
    followUps: ['What is the difference between symmetric and asymmetric encryption?', 'How would you handle encryption keys securely?'],
    tags: ['encryption', 'security'],
  },
  {
    id: 'sec-007',
    category: 'Security',
    difficulty: 'Intermediate',
    question: 'What is SQL injection?',
    answer:
      "SQL injection is an attack where untrusted input is crafted to change the meaning of a SQL query, potentially exposing or modifying data the attacker shouldn't have access to. It's a classic web security vulnerability, and it's relevant to the FNB project in a modern form: since our Code Agent generates SQL from user-controlled natural language, we have to guard against the LLM itself being manipulated into producing harmful SQL, not just guard against raw string concatenation.",
    keyPoints: [
      'Untrusted input crafted to change a SQL query\'s intended meaning',
      'Classic web security vulnerability',
      'Modern relevance: guarding an LLM-based SQL generator against manipulation, not just raw string concatenation',
    ],
    followUps: ['How does the Verifier Agent specifically defend against this?', 'What is the difference between classic SQL injection and this LLM-era version of the risk?'],
    tags: ['sql-injection', 'security'],
  },
  {
    id: 'sec-008',
    category: 'Security',
    difficulty: 'Intermediate',
    question: 'What is prompt injection?',
    answer:
      "Prompt injection is when an attacker crafts input specifically designed to manipulate an LLM into ignoring its original instructions or performing an unintended action — for example, embedding hidden instructions in a user's request that try to trick the Code Agent into generating a write statement instead of a read-only query. It's the LLM-era equivalent of injection attacks, and it's a real risk for any system where an LLM processes untrusted user input.",
    keyPoints: [
      'Crafted input designed to make an LLM ignore its instructions or act unintendedly',
      'Example: hidden instructions trying to make the Code Agent generate a write statement',
      'The LLM-era equivalent of classic injection attacks',
    ],
    followUps: ['How would you specifically test the FNB pipeline against prompt injection attempts?', 'Can prompt injection alone bypass the Verifier Agent? Why or why not?'],
    tags: ['prompt-injection', 'security'],
  },
  {
    id: 'sec-009',
    category: 'Security',
    difficulty: 'Intermediate',
    question: 'How can prompt injection affect an LLM application?',
    answer:
      "If successful, prompt injection could make an LLM ignore safety instructions, leak information it shouldn't, or produce output designed to cause harm downstream — like trying to get the Code Agent to generate a destructive SQL statement. The real danger is that a well-defended pipeline should treat this as expected and dangerous input, which is exactly why we don't rely on the Code Agent's good behaviour alone — the Verifier Agent's independent, non-LLM checks are what actually stop a successful injection from doing damage.",
    keyPoints: [
      'Can make an LLM ignore instructions, leak information, or produce harmful downstream output',
      'Should be treated as expected, dangerous input to defend against, not a rare edge case',
      'Independent, non-LLM verification (like the Verifier Agent) is the real defence, not just trusting the LLM',
    ],
    followUps: ['Why is relying only on "better prompting" not a sufficient defence against this?', 'What would a prompt injection test suite look like for the FNB pipeline?'],
    tags: ['prompt-injection', 'llm'],
  },
  {
    id: 'sec-010',
    category: 'Security',
    difficulty: 'Intermediate',
    question: 'How would you protect an LLM from malicious prompts?',
    answer:
      "I wouldn't rely on the LLM alone to resist malicious input — I'd treat its output as untrusted and verify anything consequential independently, the same way our Verifier Agent checks generated SQL regardless of how it was produced. I'd also constrain what the LLM is capable of doing in the first place, like restricting tool access to only read-only operations, and monitor for unusual patterns in input or output that might indicate an injection attempt.",
    keyPoints: [
      'Treat LLM output as untrusted; verify consequential actions independently',
      'Constrain what the LLM can do (e.g. read-only tool access) as a structural limit',
      'Monitor for unusual input/output patterns suggesting injection attempts',
    ],
    followUps: ['What structural limits does the FNB pipeline already have that help here?', 'How would you monitor for injection attempts in practice?'],
    tags: ['prompt-injection', 'security'],
  },
  {
    id: 'sec-011',
    category: 'Security',
    difficulty: 'Intermediate',
    question: 'How would you protect sensitive banking data?',
    answer:
      "Data minimisation first — only ever exposing what's genuinely needed for a task. Then encryption at rest and in transit, strict access control so only authorised systems and people can reach it, masking sensitive fields in logs, and careful handling of any data shared with third-party services, including LLM providers. For AI systems specifically, I'd also think about whether sensitive data really needs to reach the model at all, or whether it can be referenced indirectly.",
    keyPoints: [
      'Data minimisation as the starting principle',
      'Encryption, strict access control, and log masking for sensitive fields',
      'Careful handling of data sent to third-party services, including LLM providers',
    ],
    followUps: ['How would you decide what "genuinely needed" means for a given task?', 'What would you do if a required feature seemed to need more data than felt comfortable?'],
    tags: ['data-privacy', 'security'],
  },
  {
    id: 'sec-012',
    category: 'Security',
    difficulty: 'Intermediate',
    question: 'How would you secure database credentials?',
    answer:
      "Credentials should never be hard-coded into source code or committed to version control — I'd store them in environment variables or, for a production system, a dedicated secrets manager, with access to that secrets store itself tightly controlled. I'd also rotate credentials periodically and use different, appropriately scoped credentials for different environments — development, testing, production — rather than reusing the same ones everywhere.",
    keyPoints: [
      'Never hard-code credentials or commit them to version control',
      'Use environment variables or a dedicated secrets manager in production',
      'Rotate credentials periodically; use different scoped credentials per environment',
    ],
    followUps: ['How did you handle credentials specifically on the FNB project?', 'What would you do if you discovered a credential had been accidentally committed to git history?'],
    tags: ['credentials', 'security'],
  },
  {
    id: 'sec-013',
    category: 'Security',
    difficulty: 'Intermediate',
    question: 'Why should an AI system not have unrestricted database access?',
    answer:
      "Because an AI system's behaviour, especially one built on an LLM, isn't fully predictable or guaranteed correct — it can hallucinate, be manipulated through prompt injection, or simply make a mistake despite the best prompting and verification. Unrestricted access means any of those failure modes could directly damage or leak real data. Restricting it to read-only, least-privilege access means even a worst-case failure has a bounded, much less severe impact — which is exactly the reasoning behind the FNB project's core design decision.",
    keyPoints: [
      'AI/LLM behaviour is not fully predictable or guaranteed correct',
      'Unrestricted access means any failure mode (hallucination, injection, mistake) could cause direct damage',
      'Restricting access bounds the worst-case impact — the core FNB design rationale',
    ],
    followUps: ['What would change about this if the underlying model became much more reliable over time?', 'How would you extend this reasoning to a system that does need some write capability?'],
    tags: ['least-privilege', 'fnb', 'ai-risk'],
  },
]
